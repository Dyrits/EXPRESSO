const express = require("express");
const sqlite3 = require("sqlite3");

const routers = {
    timesheets: require("./timesheets.js")
}

const router = express.Router();
const database = new sqlite3.Database(process.env.TEST_DATABASE || "./database.sqlite");

router.param("employeeId", (request, response, next, employeeId) => {
    const query = `SELECT * FROM Employee WHERE Employee.id = $id`;
    const values = { $id: employeeId };
    database.get(query, values, (error, employee) => {
        if (error) { next(error); }
        else if (employee) {
            request.employee = employee;
            next();
        } else { response.sendStatus(404); }
    });
});

router.use("/:employeeId/timesheets", routers.timesheets);

router.get("/", (request, response, next) => {
    database.all('SELECT * FROM Employee WHERE Employee.is_current_employee = 1', (error, employees) => {
        error ? next(error) : response.status(200).json({employees});
    });
});

router.get("/:employeeId", ({ employee }, response, next) => {
    response.status(200).json({ employee });
});

router.post("/", ({ body }, response, next) => {
    const { name, position, wage } = body.employee;
    if (!name || !position || !wage) { return response.sendStatus(400); }
    const isCurrentEmployee = body.employee.isCurrentEmployee === 0 ? 0 : 1;
    const query = `INSERT INTO Employee (name, position, wage, is_current_employee) VALUES ($name, $position, $wage, $isCurrentEmployee)`;
    const values = { $name: name,  $position: position,  $wage: wage,  $isCurrentEmployee: isCurrentEmployee };
    database.run(query, values, function (error) {
        error ? next(error) : database.get(`SELECT * FROM Employee WHERE Employee.id = ${this.lastID}`,
            (error, employee) => { error ? next(error) : response.status(201).json({ employee }); });
    });
});

router.put("/:employeeId", ({ body, params }, response, next) => {
    const { name, position, wage } = body.employee;
    if (!name || !position || !wage) { return response.sendStatus(400); }
    const isCurrentEmployee = body.employee.isCurrentEmployee === 0 ? 0 : 1;
    const { employeeId } = params;
    const query = `
        UPDATE Employee 
        SET name = $name, position = $position, wage = $wage, is_current_employee = $isCurrentEmployee 
        WHERE Employee.id = $id
    `;
    const values = { $name: name,  $position: position,  $wage: wage,  $isCurrentEmployee: isCurrentEmployee,  $id: employeeId };
    database.run(query, values, (error) => {
        error ? next(error) : database.get(`SELECT * FROM Employee WHERE Employee.id = ${employeeId}`,
            (error, employee) => { error ? next(error) : response.status(200).json({ employee }); });
    });
});

router.delete("/:employeeId", ({ params }, response, next) => {
    const { employeeId } = params;
    const query = `UPDATE Employee SET is_current_employee = 0 WHERE Employee.id = $id`;
    const values = { $id: employeeId };
    database.run(query, values, (error) => {
        error ? next(error) : database.get(`SELECT * FROM Employee WHERE Employee.id = ${ employeeId }`,
            (error, employee) => { error ? next(error) : response.status(200).json({ employee }); });
    });
});

module.exports = router;
