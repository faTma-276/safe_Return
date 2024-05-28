import express from 'express'
import * as missingReport from './missingReport.controller.js'
import { validate } from '../../middleware/validation.js'
import * as schema from './missingReport.validate.js'
import { allowedTo, protectedRouter } from '../auth/auth.controller.js'

const missingReportRouter=express.Router()
missingReportRouter.route('/')
   .post(protectedRouter,allowedTo('user'),validate(schema.addMissingReportSchema), missingReport.addMissingReport)
   .get(protectedRouter,allowedTo('user','admin'),missingReport.getAllMissimgReports)
missingReportRouter.route('/:id')
   .put(protectedRouter,allowedTo('user'),validate(schema.updateMissimgReport),missingReport.updateMissimgReport)
   .delete(protectedRouter,allowedTo('user'),validate(schema.deleteMissingReport),missingReport.deleteMissingReport)
   .get(protectedRouter,allowedTo('user','admin'),validate(schema.getOneMissingReport),missingReport.getOneMissingReport)

export default missingReportRouter

