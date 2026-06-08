import patientModel from "../models/pacient.js"
import bcrypt from "bcryptjs"
import { sendPasswordResetCode } from "../utils/email.js"

const forgotPasswordController = {}

forgotPasswordController.sendCode = async (req, res) => {
    const { email } = req.body

    try {
        const patient = await patientModel.findOne({ email })
        if (!patient) {
            return res.status(404).json({ message: "Paciente no encontrado" })
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
        const codeExpires = new Date(Date.now() + 10 * 60 * 1000)

        patient.verificationCode = resetCode
        patient.codeExpires = codeExpires
        await patient.save()

        await sendPasswordResetCode(email, resetCode)

        return res.status(200).json({ message: "Código enviado al correo" })

    } catch (error) {
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

forgotPasswordController.resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body

    try {
        const patient = await patientModel.findOne({ email })
        if (!patient) {
            return res.status(404).json({ message: "Paciente no encontrado" })
        }

        if (patient.verificationCode !== code) {
            return res.status(400).json({ message: "Código incorrecto" })
        }

        if (patient.codeExpires < Date.now()) {
            return res.status(400).json({ message: "El código ha expirado" })
        }

        patient.password = await bcrypt.hash(newPassword, 10)
        patient.verificationCode = null
        patient.codeExpires = null
        await patient.save()

        return res.status(200).json({ message: "Contraseña actualizada exitosamente" })

    } catch (error) {
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export default forgotPasswordController