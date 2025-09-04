module.exports = {
     index: (req, res) => {
        res.render("index", 
            {
                view: {
                    title: "Inicio",
                    description: "Inicio de la aplicación",
                    keywords: "Inicio, Aplicación, Monolito",
                    author: "Jonathan Javier Urquiza",
                    year: new Date().getFullYear()
                }
            }
        );
    },
    contacto: (req, res) => {
        res.render("contacto", 
            {
                view: {
                    title: "Contacto - Monolito Fiscalización",
                    description: "Información de contacto del sistema de fiscalización",
                    keywords: "Contacto, Desarrollador, Sistema, Fiscalización, Monolito",
                    author: "Jonathan Javier Urquiza",
                    year: new Date().getFullYear()
                }
            }
        );
    }
};