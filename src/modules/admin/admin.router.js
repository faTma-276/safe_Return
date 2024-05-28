import  express  from "express";
const adminRouter =express.Router()
import { modelhandel, signInAdmin, signUpAdmin } from "./admin.controller.js"
import { validate } from "../../middleware/validation.js";
import { signInAdminSchema, signUpAdminSchema } from "./admin.validate.js";

//signUp
adminRouter.post('/SignUpAdmin',validate(signUpAdminSchema),signUpAdmin)

//signIn
adminRouter.post('/signInAdmin',validate(signInAdminSchema),signInAdmin)

//model
adminRouter.get('/upload/:id',modelhandel)

export default adminRouter