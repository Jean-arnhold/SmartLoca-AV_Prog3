const { Locacao, Carro, Cliente, sequelize } = require('../models');
const { Op } = require("sequelize");
const yup = require('yup');

const locacaoSchema = yup.object().shape({
    cliente_id: yup.number().integer().required("O cliente é obrigatório."),
    carro_id: yup.number().integer().required("O carro é obrigatório."),
    data_inicio: yup.date().required("A data de início é obrigatória.").min(new Date(), "A data de início não pode ser no passado."),
    data_fim: yup.date().required("A data de fim é obrigatória.").min(yup.ref('data_inicio'), "A data de fim deve ser após a data de início."),
    valor_total: yup.number().required("O valor total é obrigatório.").positive("O valor total deve ser um número positivo.")
});

exports.getAllLocacoes = async (req, res) => {
    try {
        const locacoes = await Locacao.findAll({
            include: [{ model: Cliente }, { model: Carro }],
            where: { finalizada: false }
        });
        res.json(locacoes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createLocacao = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        await locacaoSchema.validate(req.body);
        const { carro_id, data_inicio, data_fim } = req.body;

        const locacaoExistente = await Locacao.findOne({
            where: {
                carro_id: carro_id,
                finalizada: false,
                [Op.or]: [
                    { data_inicio: { [Op.between]: [data_inicio, data_fim] } },
                    { data_fim: { [Op.between]: [data_inicio, data_fim] } },
                    {
                        [Op.and]: [
                            { data_inicio: { [Op.lte]: data_inicio } },
                            { data_fim: { [Op.gte]: data_fim } }
                        ]
                    }
                ]
            },
            transaction: t
        });

        if (locacaoExistente) {
            await t.rollback();
            return res.status(400).json({ message: 'O veículo já está reservado para este período.' });
        }

        const carro = await Carro.findByPk(carro_id, { transaction: t });

        if (!carro || carro.status !== 'Disponível') {
            await t.rollback();
            return res.status(400).json({ message: 'Carro não encontrado ou indisponível.' });
        }

        const novaLocacao = await Locacao.create(req.body, { transaction: t });
        await carro.update({ status: 'Alugado' }, { transaction: t });

        await t.commit();
        res.status(201).json(novaLocacao);
    } catch (error) {
        await t.rollback();
        res.status(400).json({ error: error.message });
    }
};

exports.updateLocacao = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        await locacaoSchema.validate(req.body);

        const locacao = await Locacao.findByPk(id, { transaction: t });
        if (!locacao) {
            await t.rollback();
            return res.status(404).json({ message: "Locação não encontrada." });
        }

        const carroAntigoId = locacao.carro_id;
        const carroNovoId = req.body.carro_id;

        if (carroAntigoId !== carroNovoId) {
            await Carro.update({ status: 'Disponível' }, { where: { id: carroAntigoId }, transaction: t });
            await Carro.update({ status: 'Alugado' }, { where: { id: carroNovoId }, transaction: t });
        }

        const [updated] = await Locacao.update(req.body, { where: { id: id }, transaction: t });

        await t.commit();

        if (updated) {
            const updatedLocacao = await Locacao.findByPk(id);
            res.json(updatedLocacao);
        } else {
            res.status(404).json({ message: 'Locação não encontrada.' });
        }

    } catch (error) {
        await t.rollback();
        res.status(400).json({ error: error.message });
    }
};

exports.deleteLocacao = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const locacao = await Locacao.findByPk(id, { transaction: t });
        if (!locacao) {
            await t.rollback();
            return res.status(404).json({ message: 'Locação não encontrada.' });
        }

        await Carro.update({ status: 'Disponível' }, { where: { id: locacao.carro_id }, transaction: t });

        await locacao.destroy({ transaction: t });

        await t.commit();
        res.status(204).send();
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
};

exports.finalizarLocacao = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const locacao = await Locacao.findByPk(id, { transaction: t });

        if (!locacao) {
            await t.rollback();
            return res.status(404).json({ message: 'Locação não encontrada.' });
        }

        if (locacao.finalizada) {
            await t.rollback();
            return res.status(400).json({ message: 'Locação já está finalizada.' });
        }

        await locacao.update({ finalizada: true }, { transaction: t });
        await Carro.update({ status: 'Disponível' }, {
            where: { id: locacao.carro_id },
            transaction: t
        });

        await t.commit();
        res.json({
            message: "Locação finalizada com sucesso.",
            locacao: await Locacao.findByPk(id, {
                include: [{ model: Cliente }, { model: Carro }]
            })
        });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
};
