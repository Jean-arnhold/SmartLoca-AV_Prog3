const express = require('express');
const router = express.Router();
const locacaoController = require('../controllers/locacaoController');

router.get('/', locacaoController.getAllLocacoes);
router.post('/', locacaoController.createLocacao);
router.put('/:id/finalizar', locacaoController.finalizarLocacao); 
router.put('/:id', locacaoController.updateLocacao); 
router.delete('/:id', locacaoController.deleteLocacao); 

module.exports = router;