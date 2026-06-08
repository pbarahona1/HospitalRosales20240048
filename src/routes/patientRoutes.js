import { Router } from "express"
import registerPatientController from "../controllers/registerPatientController.js"
import loginPatientController from "../controllers/loginPatientController.js"
import patientController from "../controllers/patientController.js"
import forgotPasswordController from "../controllers/forgotPasswordController.js"
import upload from "../utils/CloudinaryConfig.js"

const router = Router()

// Register y verificación
router.post("/register", upload.single("profilePhoto"), registerPatientController.register)
router.post("/verify-code", registerPatientController.verifyCode)
router.post("/resend-code", registerPatientController.resendCode)  

// Login
router.post("/login", loginPatientController.login)

// Recuperación de contraseña
router.post("/forgot-password", forgotPasswordController.sendCode)
router.post("/reset-password", forgotPasswordController.resetPassword)

// CRUD
router.get("/", patientController.getPatient)
router.put("/:id", upload.single("profilePhoto"), patientController.updatePatient)
router.delete("/:id", patientController.deletePatient)

export default router