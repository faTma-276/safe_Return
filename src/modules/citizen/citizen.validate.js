import Joi from'joi';
import * as Validation from '../../utils/globalJoiFields.js';



export const addCitizenSchema = Joi.object({
    name:Validation.nameValidation.required(),
    DOB:Validation.dateValidation.required(),
    nationalID:Validation.nationalIDValidation.required(),
    relativePhone:Validation.phoneNumberValidation.required(),
    relativeName:Validation.nameValidation.required(),
    relativeNationalID:Validation.nationalIDValidation.required(),
    relationship:Joi.string().required(),
    country:Validation.governorateValidation.required(),
    city:Validation.governorateValidation.required(),
    street:Validation.governorateValidation.required(),

})

