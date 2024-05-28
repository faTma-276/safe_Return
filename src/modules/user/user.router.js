
import express from 'express'
import * as userController from './user.controller.js'
import { changeUserPasswordSchema, updateUserSchema } from './user.validate.js'
import { allowedTo, protectedRouter } from '../auth/auth.controller.js'
import { validate } from '../../middleware/validation.js'
import { fileUpload, fileValidation } from '../../utils/cloudmulter.js'
import cloudnairy from '../../utils/cloudnairy.js'

const userRouter=express.Router()

userRouter.route('/')
    .put(protectedRouter,allowedTo('user'),validate(updateUserSchema), userController.updateUser)
    .delete(protectedRouter,allowedTo('user'), userController.deleteAccount)
    .get(protectedRouter,allowedTo('user','admin'), userController.getUser)
    .patch(protectedRouter, allowedTo('user'),validate(changeUserPasswordSchema), userController.changeUserPassword)
    .post(protectedRouter,userController.logout);

// userRouter.patch("/profilePic",
//             protectedRouter,
//             fileUpload(fileValidation.image).single('image'),
//             userController.profilePic)

userRouter.patch("/profilePic",
            protectedRouter,
            fileUpload().single('image'),
            userController.profilePic)

export default userRouter


