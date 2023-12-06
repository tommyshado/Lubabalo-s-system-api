import Joi from "joi";

const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required(),
    password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
    usernameOrEmail: Joi.string().min(6),
    password: Joi.string().min(6).required()
});

const signup = (data) => schema.validate(data);

const login = (data) => loginSchema.validate(data);

export { signup, login };