//importa los datos del formulario
const { body, validationResult } = require("express-validator");
const picocolors = require("picocolors");

module.exports = {
    registro: (req, res) => {
        //renderizar la vista de registro
        res.render("registro", {
            title: "Registro",
            description: "Registro de la aplicación",
            keywords: "Registro, Aplicación, Monolito",
        });
    },
    registrUp: (req, res) => {
        //validar los datos del formulario
        const { nombre, email, password } = req.body;
        console.log(picocolors.yellow(nombre, email, password));
        res.redirect("/registro");
    },
    registrUpdatePass: (req, res) => {
        //actualizar la contraseña
        const { nombre, email, password } = req.body;
        console.log(picocolors.green(nombre, email, password));
        res.redirect("/registro");
    }
    
}