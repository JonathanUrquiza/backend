const picocolors = require("picocolors");

module.exports = {
    serverError: (res, message = "Error interno del servidor", statusCode = 500) => {
        console.log(picocolors.red(`Error ${statusCode}: ${message}`));
        return res.status(statusCode).json({
            error: true,
            message: message,
            statusCode: statusCode
        });
    }
};
