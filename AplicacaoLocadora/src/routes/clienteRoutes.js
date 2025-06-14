const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.get('/', clienteController.getAllClientes);
router.post('/', clienteController.createCliente);
router.put('/:id', clienteController.updateCliente); // Rota de atualização
router.delete('/:id', clienteController.deleteCliente); // Rota de exclusão

module.exports = router;