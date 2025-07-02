const { Cliente, Locacao } = require('../models');
const yup = require('yup');

const clienteSchema = yup.object().shape({
  nome: yup.string().required(),
  cpf: yup.string().required(),
  email: yup.string().email().required(),
  telefone: yup.string().optional()
});

exports.getAllClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCliente = async (req, res) => {
  try {
    await clienteSchema.validate(req.body);
    const novoCliente = await Cliente.create(req.body);
    res.status(201).json(novoCliente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    await clienteSchema.validate(req.body);
    
    const [updated] = await Cliente.update(req.body, { where: { id: id } });
    if (updated) {
      const updatedCliente = await Cliente.findByPk(id);
      res.json(updatedCliente);
    } else {
      res.status(404).json({ message: 'Cliente não encontrado.' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    
 
    const locacoesAtivas = await Locacao.count({ where: { cliente_id: id, finalizada: false } });
    if (locacoesAtivas > 0) {
      return res.status(400).json({ message: 'Não é possível excluir um cliente com locações ativas.' });
    }

    const deleted = await Cliente.destroy({ where: { id: id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Cliente não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};