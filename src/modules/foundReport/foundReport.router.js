import express from 'express'
import { validate } from '../../middleware/validation.js'
import { allowedTo, protectedRouter } from '../auth/auth.controller.js'
import  * as foundReport from './foundReport.controller.js'
import * as schema from './foundReport.validate.js'
import { fileUpload, fileValidation } from '../../utils/cloudmulter.js'

const foundReportRouter=express.Router()
foundReportRouter.route('/')
   .post(protectedRouter,fileUpload().single('image'),allowedTo('user'),validate(schema.addFoundReportSchema),foundReport.addFoundReport)
   .get(protectedRouter,allowedTo('user','admin'),foundReport.getAllFoundReports)
foundReportRouter.route('/:id')
   .put(protectedRouter,fileUpload().single('image'),allowedTo('user'),validate(schema.updateFoundReport),foundReport.updateFoundReport)
   .delete(protectedRouter,allowedTo('user'),validate(schema.deleteFoundReport),foundReport.deleteFoundReport)
   .get(protectedRouter,allowedTo('user','admin'),validate(schema.getOneFoundReport),foundReport.getOneFoundReport)

export default foundReportRouter

