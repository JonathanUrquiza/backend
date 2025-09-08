const { Fiscal, Sesion } = require('../model/index');
const jwt = require('jsonwebtoken');

// Servicio para autenticar fiscal
const authenticateFiscal = async (email, password) => {
    try {
        // Buscar fiscal por email
        const fiscal = await Fiscal.findOne({
            where: { 
                email: email.toLowerCase().trim()
            }
        });
        
        if (!fiscal) {
            throw new Error('Credenciales incorrectas');
        }

        // Verificar contraseña (en el futuro implementaremos bcrypt)
        if (fiscal.password !== password) {
            throw new Error('Credenciales incorrectas');
        }

        return fiscal;

    } catch (error) {
        throw new Error(error.message || 'Error en autenticación');
    }
};

// Servicio para crear sesión
const createSession = async (fiscalId) => {
    try {
        // Generar token JWT
        const token = jwt.sign(
            { fiscalId },
            process.env.JWT_SECRET || 'monolito-secret-key-2025',
            { expiresIn: '8h' }
        );

        // Crear sesión en BD (los triggers desactivan sesiones anteriores automáticamente)
        const sesion = await Sesion.create({
            fiscal_id: fiscalId,
            token: token,
            expira_en: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 horas
            activa: 1
        });

        return { sesion, token };

    } catch (error) {
        throw new Error('Error creando sesión');
    }
};

// Servicio para validar token
const validateToken = async (token) => {
    try {
        // Verificar JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'monolito-secret-key-2025');
        
        // Buscar sesión en BD
        const sesion = await Sesion.findOne({
            where: {
                token: token,
                fiscal_id: decoded.fiscalId,
                activa: 1
            },
            include: [{
                model: Fiscal,
                as: 'fiscal'
            }]
        });

        if (!sesion || !sesion.esValida()) {
            throw new Error('Token inválido o expirado');
        }

        return {
            fiscal: sesion.fiscal,
            sesion: sesion
        };

    } catch (error) {
        throw new Error('Token inválido');
    }
};

// Servicio para cerrar sesión
const closeSession = async (sessionId) => {
    try {
        await Sesion.update(
            { activa: 0 },
            { where: { id: sessionId } }
        );

        return true;
    } catch (error) {
        throw new Error('Error cerrando sesión');
    }
};

// Servicio para limpiar sesiones expiradas (tarea de mantenimiento)
const cleanExpiredSessions = async () => {
    try {
        const result = await Sesion.limpiarExpiradas();
        console.log(`🧹 Sesiones expiradas limpiadas: ${result}`);
        return result;
    } catch (error) {
        console.error('Error limpiando sesiones:', error);
        throw error;
    }
};

module.exports = {
    authenticateFiscal,
    createSession,
    validateToken,
    closeSession,
    cleanExpiredSessions
};
