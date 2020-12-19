var jwt = require('jsonwebtoken');
const models = require('../models');

const checkToken = async (token) => {
    let localId = null;
    try {
        const { id } = await token.decode(token);
        localId = id;
    } catch (e) {
        return false;
    }
    const user = await models.Usuario.
        findOne({where: {id: localId, estado: 1}});
    if (user) {
        const token = encode(user);
        return token;
    } else {
        return false;
    }
}

module.exports = {

    /* Generar el token */
    encode: async(user) => {
        const token = jwt.sign({id: user.id, 
                                nombre: user.nombre,
                                email: user.email,
                                rol: user.rol }, 
                                'claveSecretaParaGenerarToken', 
                                {expiresIn: '1d'});
        return token;
    },
    /* Permite decodificar el token */
    decode: async(token) => {
        try {
            const { id } = 
                await jwt.verify(token, 'claveSecretaParaGenerarToken');
            const user = await models.Usuario.findOne({where: {id: id,
                                                               estado: 1}});
            if (user) {
                return user;
            } else {
                return false;
            }
        } catch (e) {
            const newToken = await checkToken(token);
            return newToken;
        }

    }
}