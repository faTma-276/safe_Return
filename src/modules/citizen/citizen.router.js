import express from 'express'
import { validate } from '../../middleware/validation.js'
import { allowedTo} from '../auth/auth.controller.js'
import * as schema from './citizen.validate.js'
import { fileUpload, fileValidation } from '../../utils/cloudmulter.js'
import { addcizen, deleteCitizen, getAllCitizens, getOneCitizen, updatecitizen } from './citizen.controller.js'
import { protectedAdminRouter } from '../admin/admin.controller.js'

const citizenRouter=express.Router()
citizenRouter.route('/')
   .post(protectedAdminRouter,fileUpload(fileValidation.image).single('image'),allowedTo('admin'),validate(schema.addCitizenSchema),addcizen)
   .get(protectedAdminRouter,allowedTo('admin'),getAllCitizens)
citizenRouter.route('/:id')
   .put(protectedAdminRouter,fileUpload(fileValidation.image).single('image'),allowedTo('admin'),updatecitizen)
   .delete(protectedAdminRouter,allowedTo('admin'),deleteCitizen)
   .get(protectedAdminRouter,allowedTo('admin'),getOneCitizen)

export default citizenRouter

