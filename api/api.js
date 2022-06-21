const express = require("express");
const router = express.Router();

const routers = {
    menus: require("./menus.js"),
    employees: require("./employees.js"),
};

router.use("/menus", routers.menus);
router.use("/employees", routers.employees);

module.exports = router;