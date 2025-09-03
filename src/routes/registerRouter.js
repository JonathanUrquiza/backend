const express = require("express");
const router = express.Router();
const { registro, registrUp, registrUpdatePass } = require("../controller/registerController");

router.get("/", registro);
router.post("/", registrUp);
router.put("/password", registrUpdatePass);
module.exports = router;