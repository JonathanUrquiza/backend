const express = require('express');
const router = express.Router();

// Importar controlador básico
const { 
    showLogin, 
    showRegister, 
    processLogin, 
    processRegister, 
    logout
} = require('../controller/authController');

// Rutas básicas de autenticación
router.get('/login', showLogin);
router.post('/login', processLogin);
router.get('/register', showRegister);
router.post('/register', processRegister);
router.get('/logout', logout);
router.post('/logout', logout);

module.exports = router;