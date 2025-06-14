const express = require('express');
const router = express.Router();
const locacaoController = require('../controllers/locacaoController');

router.get('/', locacaoController.getAllLocacoes);
router.post('/', locacaoController.createLocacao);
router.put('/:id/finalizar', locacaoController.finalizarLocacao); // Finalizar é um tipo de update
router.put('/:id', locacaoController.updateLocacao); // Rota de atualização geral
router.delete('/:id', locacaoController.deleteLocacao); // Rota de exclusão

module.exports = router;