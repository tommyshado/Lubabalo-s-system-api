// Validation
import joi from "joi";

// Schema
const schema = {
    name: joi.string().min(6).required(),
    email: joi.string().min(6).required(),
    password: joi.string(6).required()
};

const registerValidation = (data) => {
    return joi.validate(data, schema);
};

const loginValidation = (data) => {
    return joi.validate(data, schema);
};

export {registerValidation};
export {loginValidation};