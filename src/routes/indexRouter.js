const express = require("express");
const router = express.Router();
const { index, contacto } = require("../controller/indexController");

router.get("/", index);
router.get("/contacto", contacto);

module.exports = router;