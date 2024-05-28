import Joi from "joi"
import * as Validation from "../../utils/globalJoiFields.js"

const updateUserSchema = Joi.object({
    Fname:Validation.nameValidation.allow('',null).optional(),
    Lname:Validation.nameValidation.allow('',null).optional(),
    phoneNumber:Validation.phoneNumberValidation.allow('',null).optional(),
    governorate:Validation.governorateValidation.allow('',null).optional(),
    DOB:Validation.dateValidation.allow('',null).optional(),
    userName:Joi.string().min(2).max(30).allow('',null).optional(),
    gender:Joi.string().allow('',null).optional()
})


const changeUserPasswordSchema = Joi.object({
    oldPassword:Joi.string().min(5).max(35).required(),
    newPassword:Joi.string().min(5).max(35).required(),
    confirmPassword:Joi.string().required().valid(Joi.ref('newPassword')).messages({
        'any.only': 'Passwords must match',}),
})




export {
    changeUserPasswordSchema,
    updateUserSchema
}
