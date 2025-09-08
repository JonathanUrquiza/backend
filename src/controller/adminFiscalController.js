// Controlador administrativo para gestión de fiscales
const { Fiscal } = require('../model/index');
const bcrypt = require('bcrypt');

// Mostrar lista de todos los fiscales para administrar
const showFiscalManagement = async (req, res) => {
    try {
        // Obtener todos los fiscales con paginación
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;
        
        const { count, rows: fiscales } = await Fiscal.findAndCountAll({
            order: [['tipo', 'DESC'], ['nombre', 'ASC']],
            limit,
            offset,
            attributes: ['id', 'nombre', 'email', 'cel_num', 'direccion', 'zona', 'institucion', 'tipo']
        });
        
        const totalPages = Math.ceil(count / limit);
        
        // Contar por tipo
        const stats = {
            total: count,
            fiscales: await Fiscal.count({ where: { tipo: 'fiscal' } }),
            fiscalesGenerales: await Fiscal.count({ where: { tipo: 'fiscal_general' } }),
            fiscalesZona: await Fiscal.count({ where: { tipo: 'fiscal_zona' } })
        };
        
        res.render('admin/fiscales', {
            view: {
                title: "Gestión de Fiscales - Panel Admin",
                description: "Administrar fiscales, fiscales generales y fiscales de zona",
                keywords: "admin, fiscales, gestión, roles",
                author: "Sistema Monolito",
                year: new Date().getFullYear()
            },
            admin: {
                nombre: req.session.adminNombre,
                rol: req.session.adminRol
            },
            fiscales,
            stats,
            pagination: {
                currentPage: page,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
                nextPage: page + 1,
                prevPage: page - 1
            }
        });
    } catch (error) {
        console.error('Error en gestión de fiscales:', error);
        res.status(500).render('error', {
            view: {
                title: "Error",
                description: "Error interno",
                keywords: "error",
                author: "Sistema Monolito",
                year: new Date().getFullYear()
            },
            error: "Error al cargar la gestión de fiscales"
        });
    }
};

// Asignar rol (fiscal_general o fiscal_zona)
const assignRole = async (req, res) => {
    try {
        const { fiscalId, nuevoTipo } = req.body;
        
        if (!fiscalId || !nuevoTipo) {
            return res.status(400).json({
                success: false,
                message: 'Faltan parámetros requeridos'
            });
        }
        
        if (!['fiscal', 'fiscal_general', 'fiscal_zona'].includes(nuevoTipo)) {
            return res.status(400).json({
                success: false,
                message: 'Tipo de fiscal inválido'
            });
        }
        
        const fiscal = await Fiscal.findByPk(fiscalId);
        
        if (!fiscal) {
            return res.status(404).json({
                success: false,
                message: 'Fiscal no encontrado'
            });
        }
        
        const tipoAnterior = fiscal.tipo;
        await fiscal.update({ tipo: nuevoTipo });
        
        console.log(`🔄 Admin ${req.session.adminNombre} cambió el rol de ${fiscal.nombre} de ${tipoAnterior} a ${nuevoTipo}`);
        
        res.json({
            success: true,
            message: `Rol actualizado exitosamente: ${fiscal.nombre} ahora es ${nuevoTipo.replace('_', ' ')}`
        });
        
    } catch (error) {
        console.error('Error asignando rol:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Cambiar institución de un fiscal
const changeInstitution = async (req, res) => {
    try {
        const { fiscalId, nuevaInstitucion } = req.body;
        
        if (!fiscalId || !nuevaInstitucion) {
            return res.status(400).json({
                success: false,
                message: 'Faltan parámetros requeridos'
            });
        }
        
        const fiscal = await Fiscal.findByPk(fiscalId);
        
        if (!fiscal) {
            return res.status(404).json({
                success: false,
                message: 'Fiscal no encontrado'
            });
        }
        
        const institucionAnterior = fiscal.institucion;
        await fiscal.update({ institucion: nuevaInstitucion });
        
        console.log(`🏢 Admin ${req.session.adminNombre} cambió la institución de ${fiscal.nombre} de "${institucionAnterior}" a "${nuevaInstitucion}"`);
        
        res.json({
            success: true,
            message: `Institución actualizada: ${fiscal.nombre} ahora está asignado a "${nuevaInstitucion}"`
        });
        
    } catch (error) {
        console.error('Error cambiando institución:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Cambiar contraseña de un fiscal
const changePassword = async (req, res) => {
    try {
        const { fiscalId, nuevaPassword } = req.body;
        
        if (!fiscalId || !nuevaPassword) {
            return res.status(400).json({
                success: false,
                message: 'Faltan parámetros requeridos'
            });
        }
        
        if (nuevaPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 6 caracteres'
            });
        }
        
        const fiscal = await Fiscal.findByPk(fiscalId);
        
        if (!fiscal) {
            return res.status(404).json({
                success: false,
                message: 'Fiscal no encontrado'
            });
        }
        
        // Hashear nueva contraseña
        const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
        await fiscal.update({ 
            password: hashedPassword,
            re_password: hashedPassword 
        });
        
        console.log(`🔐 Admin ${req.session.adminNombre} cambió la contraseña de ${fiscal.nombre} (${fiscal.email})`);
        
        res.json({
            success: true,
            message: `Contraseña actualizada exitosamente para ${fiscal.nombre}`
        });
        
    } catch (error) {
        console.error('Error cambiando contraseña:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Eliminar un fiscal
const deleteFiscal = async (req, res) => {
    try {
        const { fiscalId } = req.body;
        
        if (!fiscalId) {
            return res.status(400).json({
                success: false,
                message: 'ID de fiscal requerido'
            });
        }
        
        const fiscal = await Fiscal.findByPk(fiscalId);
        
        if (!fiscal) {
            return res.status(404).json({
                success: false,
                message: 'Fiscal no encontrado'
            });
        }
        
        const nombreFiscal = fiscal.nombre;
        const emailFiscal = fiscal.email;
        const tipoFiscal = fiscal.tipo;
        
        await fiscal.destroy();
        
        console.log(`🗑️ Admin ${req.session.adminNombre} eliminó al ${tipoFiscal}: ${nombreFiscal} (${emailFiscal})`);
        
        res.json({
            success: true,
            message: `${tipoFiscal.replace('_', ' ')} ${nombreFiscal} eliminado exitosamente`
        });
        
    } catch (error) {
        console.error('Error eliminando fiscal:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener detalles de un fiscal específico
const getFiscalDetails = async (req, res) => {
    try {
        const { id } = req.params;
        
        const fiscal = await Fiscal.findByPk(id, {
            attributes: ['id', 'nombre', 'email', 'cel_num', 'direccion', 'zona', 'institucion', 'tipo']
        });
        
        if (!fiscal) {
            return res.status(404).json({
                success: false,
                message: 'Fiscal no encontrado'
            });
        }
        
        res.json({
            success: true,
            fiscal: fiscal
        });
        
    } catch (error) {
        console.error('Error obteniendo detalles del fiscal:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

module.exports = {
    showFiscalManagement,
    assignRole,
    changeInstitution,
    changePassword,
    deleteFiscal,
    getFiscalDetails
};
