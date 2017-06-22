'use strict';

const Joi = require('joi');

module.exports.post = {
    body:{
        title: Joi.string().required().max(255),
        genre: Joi.string().required().max(255),
        description: Joi.string().required(),
        cover_url: Joi.string()
    }
};

module.exports.put = {
    body:{
        title: Joi.string().required().max(255),
        genre: Joi.string().required().max(255),
        description: Joi.string().required(),
        cover_url: Joi.string()
    }
};
