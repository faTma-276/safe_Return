import Joi from "joi";
import * as Validation from '../../utils/globalJoiFields.js';

export const signUpAdminSchema =Joi.object({
    userName:Joi.string().min(2).max(20).required(),
    email:Validation.emailValidation,
    password:Validation.passwordValidation,
    confirmPassword:Joi.string().required().valid(Joi.ref('password')).messages({
        'any.only': 'Passwords must match',}),
})


export const signInAdminSchema =Joi.object({
    email:Validation.emailValidation,
    password:Validation.passwordValidation,
})

