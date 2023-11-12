import Joi from "joi";

const signupSchema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required(),
    password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
    emailOrName: Joi.string().min(6).required(),
    password: Joi.string().min(6).required()
});

const signup = (data) => signupSchema.validate(data);

const login = (data) => loginSchema.validate(data);

export { signup, login };