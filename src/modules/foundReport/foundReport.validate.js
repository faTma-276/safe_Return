import Joi from'joi';
import * as Validation from '../../utils/globalJoiFields.js';



const addFoundReportSchema = Joi.object({
    firstReporterName:Validation.nameValidation.required(),
    lastReporterName:Validation.nameValidation.required(),
    phoneNumber:Validation.phoneNumberValidation.required(),
    governorate:Validation.governorateValidation.required(),
    date:Validation.dateValidation.required(),
    childName:Joi.string().min(2).max(40).allow('',null).optional(),
    description:Joi.string().min(2).max(200).allow('',null).optional(),
    age:Joi.number().allow('',null).optional(),
})

const updateFoundReport = Joi.object({
    id:Validation.idValidation,
    firstReporterName:Validation.nameValidation.allow('',null).optional(),
    lastReporterName:Validation.nameValidation.allow('',null).optional(),
    phoneNumber:Validation.phoneNumberValidation.allow('',null).optional(),
    governorate:Validation.governorateValidation.allow('',null).optional(),
    date:Validation.dateValidation.allow('',null).optional(),
    childName:Joi.string().min(2).max(40).allow('',null).optional(),
    description:Joi.string().min(2).max(200).allow('',null).optional(),
    age:Joi.number().allow('',null).optional(),
})



const deleteFoundReport = Joi.object({

    id:Validation.idValidation
})

const getOneFoundReport = Joi.object({

    id:Validation.idValidation
})



export {addFoundReportSchema,
        updateFoundReport,
        deleteFoundReport,
        getOneFoundReport,
}


