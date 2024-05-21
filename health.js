const { response, request } = require('express');
require('dotenv').config()

const healthGet = async (req = request, res = response) => {
    try {
        return res.status(200).json({
            componente: process.env.npm_package_name,
            health: 'ok',
        });

    } catch (error) {
        return res.status(500).json({
            componente: process.env.npm_package_name,
            health: 'error',
            error
        });
    }

};

module.exports = {
    healthGet,
};