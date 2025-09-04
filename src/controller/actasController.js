module.exports = {
    actas: (req, res) => {
        res.render("actas", {
            view: {
                title: "Cargar Nuevas Imágenes de Actas"
            }
        });
    }
}