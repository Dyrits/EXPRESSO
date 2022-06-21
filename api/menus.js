const express = require("express");
const sqlite3 = require("sqlite3");

const router = express.Router();
const database = new sqlite3.Database(process.env.TEST_DATABASE || "./database.sqlite");

const routers = {
    menuItems: require("./menu-items.js")
}

router.param("menuId", (request, response, next, menuId) => {
    const query = `SELECT * FROM Menu WHERE Menu.id = $id`;
    const values = { $id: menuId };
    database.get(query, values, (error, menu) => {
        if (error) { next(error); }
        else if (menu) {
            request.menu = menu;
            next();
        } else { response.sendStatus(404); }
    });
});

router.use("/:menuId/menu-items", routers.menuItems);

router.get("/", (req, res, next) => {
    database.all(`SELECT * FROM Menu`, (error, menus) => { error ? next(error) : res.status(200).json({ menus }); });
});

router.get("/:menuId", ({ menu }, response, next) => { response.status(200).json({ menu }); });

router.post("/", ({ body }, response, next) => {
    const { title } = body.menu;
    if (!title) { return response.sendStatus(400); }
    const query = `INSERT INTO Menu (title) VALUES ($title)`;
    const values = { $title: title };
    database.run(query, values, function(error) {
        error ? next(error) : database.get(`SELECT * FROM Menu WHERE Menu.id = ${this.lastID}`,
            (error, menu) => { error ? next(error) : response.status(201).json({ menu }); });
    });
});

router.put("/:menuId", ({ body, params }, response, next) => {
    const { title } = body.menu;
    if (!title) { return response.sendStatus(400); }
    const { menuId }  = params;
    const query = `UPDATE Menu SET title = $title WHERE Menu.id = $id`;
    const values = { $title: title,  $id: menuId };
    database.run(query, values, (error) => {
        error ? next(error) : database.get(`SELECT * FROM Menu WHERE Menu.id = ${menuId}`,
            (error, menu) => { error ? next(error) : response.status(200).json({ menu }); });
    });
});

router.delete("/:menuId", ({ params }, response, next) => {
    const { menuId }  = params;
    let query = `SELECT * FROM MenuItem WHERE MenuItem.menu_id = $id`;
    const values = { $id: menuId };
    database.get(query, values, (error, menuItems) => {
        if (error) { next(error); }
        else if (menuItems) { return response.sendStatus(400); }
        else {
            query = 'DELETE FROM Menu WHERE Menu.id = $id';
            database.run(query, values, (error) => { error ? next(error) : response.sendStatus(204); });
        }
    });
});

module.exports = router;
