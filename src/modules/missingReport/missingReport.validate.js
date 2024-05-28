import Joi from "joi";
import * as Validation from "../../utils/globalJoiFields.js";

const addMissingReportSchema = Joi.object({
  firstReporterName: Validation.nameValidation.required(),
  lastReporterName: Validation.nameValidation.required(),
  phoneNumber: Validation.phoneNumberValidation.required(),
  nationalID: Validation.nationalIDValidation.required(),
  governorate: Validation.governorateValidation.required(),
  date: Validation.dateValidation.required(),
  email: Validation.emailValidation.required(),
});

const updateMissimgReport = Joi.object({
  firstReporterName: Validation.nameValidation.allow("", null).optional(),
  lastReporterName: Validation.nameValidation.allow("", null).optional(),
  phoneNumber: Validation.phoneNumberValidation.allow("", null).optional(),
  nationalID: Validation.nationalIDValidation.allow("", null).optional(),
  governorate: Validation.governorateValidation.allow("", null).optional(),
  date: Validation.dateValidation.allow("", null).optional(),
  id: Validation.idValidation.allow("", null).optional(),
  email: Validation.emailValidation.allow("", null).optional(),
});

const deleteMissingReport = Joi.object({
  id: Validation.idValidation,
});

const getOneMissingReport = Joi.object({
  id: Validation.idValidation,
});

export {
  addMissingReportSchema,
  updateMissimgReport,
  deleteMissingReport,
  getOneMissingReport,
};
