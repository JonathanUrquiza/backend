const {serverError} = require("../utils/serverError");

module.exports = {
    auth: (req, res, next) => {
        const {token} = req.headers;
        if(!token) return serverError(res, "Token no proporcionado", 401);
        next();
    }
}