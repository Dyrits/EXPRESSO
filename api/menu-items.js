const express = require("express");
const sqlite3 = require("sqlite3");

const router = express.Router({mergeParams: true});
const database = new sqlite3.Database(process.env.TEST_DATABASE || "./database.sqlite");

router.param("menuItemId", (request, response, next, menuItemId) => {
    const query = `SELECT * FROM MenuItem WHERE MenuItem.id = $id`;
    const values = { $id: menuItemId };
    database.get(query, values, (error, menuItem) => {
        if (error) { next(error); }
        else if (menuItem) {
            request.menuItem = menuItem;
            next();
        } else { response.sendStatus(404); }
    });
});

router.get("/", ({ params }, res, next) => {
    const { menuId } = params;
    const query = `SELECT * FROM MenuItem WHERE MenuItem.menu_id = $id`;
    const values = { $id: menuId};
    database.all(query, values, (error, menuItems) => { error ? next(error) : res.status(200).json({ menuItems }); });
});

router.post("/", ({ body, params }, response, next) => {
    const { name, description, inventory, price } = body.menuItem;
    if (!name || !inventory || !price) { return response.sendStatus(400);}
    const { menuId } = params;
    let query = `SELECT * FROM Menu WHERE Menu.id = $id`;
    let values = { $id: menuId };
    database.get(query, values, (error, menu) => {
        if (error) { next(error); }
        else if (!menu) { return response.sendStatus(404); }
        else {
            query = `INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ($name, $description, $inventory, $price, $id)`;
            values = { ...values, $name: name, $description: description, $inventory: inventory, $price: price };
            database.run(query, values, function(error) {
                error ? next(error) : database.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${this.lastID}`,
                    (error, menuItem) => { error ? next(error) : response.status(201).json({ menuItem }); });
            });
        }
    });
});

router.put("/:menuItemId", ({ body, params }, response, next) => {
    const { name, description, inventory, price } = body.menuItem;
    if (!name || !inventory || !price) { return response.sendStatus(400);}
    const { menuId, menuItemId } = params;
    let query = `SELECT * FROM Menu WHERE Menu.id = $id`;
    let values = { $id: menuId };
    database.get(query, values, (error, menu) => {
        if (error) { next(error); }
        else if (!menu) { return response.sendStatus(404); }
        else {
            query = `
                UPDATE MenuItem 
                SET name = $name, description = $description,inventory = $inventory, price = $price 
                WHERE MenuItem.id = $id
            `;
            values = { $name: name, $description: description, $inventory: inventory, $price: price, $id: menuItemId };
            database.run(query, values, function (error) {
                error ? next(error) : database.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${ menuItemId }`,
                    (error, menuItem) => { error ? next(error) : response.status(200).json({ menuItem }); });
            });
        }
    });
});

router.delete("/:menuItemId", ({ params }, response, next) => {
    const { menuItemId } = params;
    const query = 'DELETE FROM MenuItem WHERE MenuItem.id = $id';
    const values = { $id: menuItemId };
    database.run(query, values, (error) => { error ? next(error) : response.sendStatus(204); });
});

module.exports = router;
