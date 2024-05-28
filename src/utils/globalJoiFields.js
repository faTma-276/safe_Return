import Joi from "joi";

let idValidation = Joi.string().alphanum().length(24).required();
let nameValidation = Joi.string().min(2).max(20);
let phoneNumberValidation = Joi.string().pattern(/^(?:\+20|0)?1[0125]\d{8}$/);
let nationalIDValidation = Joi.string().pattern(/^\d{14}$/);
let governorateValidation = Joi.string();
let dateValidation = Joi.date();
let emailValidation = Joi.string().email();
let passwordValidation = Joi.string().min(5).max(35).required();

export {
  idValidation,
  nameValidation,
  phoneNumberValidation,
  nationalIDValidation,
  governorateValidation,
  dateValidation,
  emailValidation,
  passwordValidation,
};
