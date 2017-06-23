'use strict';

const Joi = require('joi');

module.exports.post = {
    body: {
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        bio: Joi.string().required(),
        portrait_url: Joi.string().required()
    }
}

module.exports.put = {
    body: {
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        bio: Joi.string().required(),
        portrait_url: Joi.string().required()
    }
}
