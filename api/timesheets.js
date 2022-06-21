const express = require("express");
const sqlite3 = require("sqlite3");

const router = express.Router({ mergeParams: true });
const database = new sqlite3.Database(process.env.TEST_DATABASE || "./database.sqlite");

router.param("timesheetId", (request, response, next, timesheetId) => {
    const query = `SELECT * FROM Timesheet WHERE Timesheet.id = $id`;
    const values = { $id: timesheetId };
    database.get(query, values, (error, timesheet) => {
        if (error) { next(error); }
        else if (timesheet) {
            request.timesheet = timesheet;
            next();
        } else { response.sendStatus(404); }
    });
});

router.get("/", ({ params }, response, next) => {
    const { employeeId } = params;
    const query = `SELECT * FROM Timesheet WHERE Timesheet.employee_id = $id`;
    const values = { $id: employeeId };
    database.all(query, values, (error, timesheets) => { error ? next(error) : response.status(200).json({ timesheets }); });
});

router.get("/:timesheetId", ({ timesheet }, response, next) => { response.status(200).json({ timesheet }); });

router.post("/", ({ body, params }, response, next) => {
    const { hours, rate, date } = body.timesheet;
    if (!hours || !rate || !date) { return response.sendStatus(400); }
    const { employeeId } = params;
    const query = `INSERT INTO Timesheet (hours, rate, date, employee_id) VALUES ($hours, $rate, $date, $id)`;
    const values = { $hours: hours,  $rate: rate,  $date: date,  $id: employeeId };
    database.run(query, values, function(error) {
        error ? next(error) : database.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${this.lastID}`,
            (error, timesheet) => { error ? next(error) : response.status(201).json({ timesheet }); });
    });
});

router.put("/:timesheetId", ({ body, params }, response, next) => {
    const { hours, rate, date } = body.timesheet;
    if (!hours || !rate || !date) { return response.sendStatus(400); }
    const { timesheetId } = params;
    const query = `UPDATE Timesheet SET hours = $hours, rate = $rate, date = $date WHERE Timesheet.id = $id`;
    const values = { $hours: hours,  $rate: rate,  $date: date, $id: timesheetId };
    database.run(query, values, function (error) {
        error ? next(error) : database.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${timesheetId}`,
            (error, timesheet) => { error ? next(error) : response.status(200).json({ timesheet }); });
    });
});

router.delete('/:timesheetId', ({ params }, response, next) => {
    const { timesheetId } = params;
    const query = `DELETE FROM Timesheet WHERE Timesheet.id = $id`;
    const values = { $id: timesheetId };
    database.run(query, values, (error) => { error ? next(error) : response.sendStatus(204); });
});

module.exports = router;
