module.exports = {
    index: (req, res) => {
       // Si el usuario NO está autenticado, mostrar página de bienvenida
       if (!req.fiscal) {
           return res.render("welcome", {
               view: {
                   title: "Bienvenido - Sistema de Fiscalización Electoral",
                   description: "Sistema digital para fiscales electorales - Registro fotográfico y gestión de actas",
                   keywords: "fiscalización, electoral, fiscales, actas, transparencia, elecciones",
                   author: "Sistema Monolito",
                   year: new Date().getFullYear()
               }
           });
       }
        
        // Si el usuario SÍ está autenticado, mostrar dashboard
        res.render("index", 
            {
                view: {
                    title: "Dashboard - Sistema de Fiscalización",
                    description: "Panel principal del sistema de fiscalización",
                    keywords: "dashboard, fiscalización, panel, monolito",
                    author: "Sistema Monolito",
                    year: new Date().getFullYear()
                },
                fiscal: req.fiscal
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