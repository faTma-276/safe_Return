import Joi from "joi";
import * as Validation from "../../utils/globalJoiFields.js";

const signUpSchema = Joi.object({
  Fname: Joi.string().min(2).max(20).required(),
  Lname: Joi.string().min(2).max(20).required(),
  email: Validation.emailValidation.required(),
  password: Validation.passwordValidation,
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.only": "Passwords must match",
  }),
  DOB: Joi.date().allow("", null).optional(),
  gender: Joi.string().allow("", null).optional(),
});

const signInSchema = Joi.object({
  email: Validation.emailValidation.required(),
  password: Validation.passwordValidation,
});

const resetPasswordSchema = Joi.object({
  password: Validation.passwordValidation,
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.only": "Passwords must match",
  }),
});

const forgetPasswordSchema = Joi.object({
  email: Validation.emailValidation.required(),
});

const checkResetCodeSchema = Joi.object({
  resetCode: Joi.string().required(),
});

const loginWithGmailSchema = Joi.object({
  email: Validation.emailValidation.required(),
  userName: Joi.string().required(),
});

export {
  signUpSchema,
  signInSchema,
  resetPasswordSchema,
  forgetPasswordSchema,
  loginWithGmailSchema,
  checkResetCodeSchema,
};
