const { Carro, Locacao } = require('../models');
const yup = require('yup');

// *** MUDANÇA AQUI: Validando o novo campo 'status' ***
const carroSchema = yup.object().shape({
    marca: yup.string().required(),
    modelo: yup.string().required(),
    ano: yup.number().integer().required(),
    placa: yup.string().required(),
    status: yup.string().oneOf(['Disponível', 'Alugado', 'Manutenção']).optional()
});

exports.getAllCarros = async (req, res) => {
  try {
    const carros = await Carro.findAll();
    res.json(carros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCarro = async (req, res) => {
  try {
    await carroSchema.validate(req.body);
    const novoCarro = await Carro.create(req.body);
    res.status(201).json(novoCarro);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCarro = async (req, res) => {
  try {
    const { id } = req.params;
    await carroSchema.validate(req.body);
    
    const [updated] = await Carro.update(req.body, { where: { id: id } });
    if (updated) {
      const updatedCarro = await Carro.findByPk(id);
      res.json(updatedCarro);
    } else {
      res.status(404).json({ message: 'Carro não encontrado.' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCarro = async (req, res) => {
  try {
    const { id } = req.params;

    const locacoesAtivas = await Locacao.count({ where: { carro_id: id, finalizada: false } });
    if (locacoesAtivas > 0) {
      return res.status(400).json({ message: 'Não é possível excluir um carro que está em uma locação ativa.' });
    }

    const deleted = await Carro.destroy({ where: { id: id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Carro não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};