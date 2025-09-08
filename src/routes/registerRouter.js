const { routerModule } = require("../modules/routerModule");
const { registro, registrUp, registrUpdatePass } = require("../controller/registerController");
const { requireAuth } = require("../controller/authController");

// Todas las rutas de registro requieren autenticación (es un área administrativa)
routerModule.get("/", requireAuth, registro);
routerModule.post("/", requireAuth, registrUp);
routerModule.put("/password", requireAuth, registrUpdatePass);

module.exports = routerModule;

