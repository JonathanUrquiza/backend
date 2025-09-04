const { routerModule } = require("../modules/routerModule");
const { registro, registrUp, registrUpdatePass } = require("../controller/registerController");

routerModule.get("/", registro);
routerModule.post("/", registrUp);
routerModule.put("/password", registrUpdatePass);

module.exports = routerModule;

