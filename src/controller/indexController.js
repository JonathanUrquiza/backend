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
                    title: "Contacto",
                    description: "Contacto de la aplicación",
                    keywords: "Contacto, Aplicación, Monolito",
                }
            }
        );
    }
};