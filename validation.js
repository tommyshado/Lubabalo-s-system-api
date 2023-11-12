import Joi from "joi";

const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required(),
    password: Joi.string().min(6).required()
});

const signup = (data) => schema.validate(data);

const login = (data) => schema.validate(data);

export { signup, login };
