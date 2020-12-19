const models = require('../models');
var bcrypt = require('bcryptjs');
const tokenService = require('../services/token');

module.exports = {
    login: async(req, res, next) => {
        try {
            const user = await models.
                Usuario.findOne({where: {email: req.body.email}});
            if (user) {
                const match = bcrypt.compareSync(req.body.password, 
                                                 user.password);
                if (match) {
                    const token = await tokenService.encode(user);
                    res.status(200).send({
                        auth: true,
                        tokenReturn: token
                    });
                } else {
                    res.status(401).send({
                        message: 'Password Incorrecto'
                    });
                }
            } else {
                res.status(404).send({
                    message: 'No existe el usuario'
                });
            }
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    add: async(req, res, next) => {
        try {
            req.body.password = await bcrypt.hash(req.body.password, 10);
            const reg = await models.Usuario.create(req.body);
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    query: async(req, res, next) => {
        try {
            const reg = await models.Usuario.findOne({ id: req.query.id });
            if (!reg) {
                res.status(404).send({
                    message: 'El registro no existe'
                });
            } else {
                res.status(200).json(reg);
            }
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    list: async(req, res, next) => {
        try {
            let valor = req.query.valor;
            const reg = await models.Usuario.findAll();
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    update: async(req, res, next) => {
        try {
            let pas = req.body.password;
            const reg0 = await models.Usuario.findOne({ where: { id: req.body.id } });
            if (pas != reg0.password) {
                req.body.password = await bcrypt.hash(req.body.password, 10);
            }
            const reg = await models.Usuario.update({ rol: req.body.rol, nombre: req.body.nombre, tipo_documento: req.body.tipo_documento, num_documento: req.body.num_documento, direccion: req.body.direccion, telefono: req.body.telefono, email: req.body.email, password: req.body.password }, { where: { id: req.body.id } });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    remove: async(req, res, next) => {
        try {
            const reg = await models.Usuario.findByIdAndDelete({ id: req.body.id });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    activate: async(req, res, next) => {
        try {
            const reg = await models.Usuario.update({ estado: 1 }, { where: { id: req.body.id } });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
    deactivate: async(req, res, next) => {
        try {
            const reg = await models.Usuario.update({ estado: 0 }, { where: { id: req.body.id } });
            res.status(200).json(reg);
        } catch (e) {
            res.status(500).send({
                message: 'Ocurrió un error'
            });
            next(e);
        }
    },
}