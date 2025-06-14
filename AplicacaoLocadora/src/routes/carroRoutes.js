const express = require('express');
const router = express.Router();
const carroController = require('../controllers/carroController');

router.get('/', carroController.getAllCarros);
router.post('/', carroController.createCarro);
router.put('/:id', carroController.updateCarro); // Rota de atualização
router.delete('/:id', carroController.deleteCarro); // Rota de exclusão

module.exports = router;