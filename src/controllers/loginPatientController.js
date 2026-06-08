import patientModel from "../models/pacient.js"
import bcrypt from "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import { config } from "../../config.js"

const loginPatientController = {}

loginPatientController.login = async (req, res) => {
    const { email, password } = req.body
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: "Correo inválido" })
    }

    try {
        const patientFound = await patientModel.findOne({ email })
        if (!patientFound) {
            return res.status(400).json({ message: "Patient not found" })
        }

        if (!patientFound.isVerified) {
            return res.status(403).json({ message: "Debes verificar tu correo primero" })
        }

        if (patientFound.timeOut && patientFound.timeOut > Date.now()) {
            return res.status(403).json({ message: "Cuenta bloqueada" })
        }

        const isMatch = await bcrypt.compare(password, patientFound.password)
        if (!isMatch) {
            patientFound.loginAttempts = (patientFound.loginAttempts || 0) + 1
            if (patientFound.loginAttempts >= 5) {
                patientFound.timeOut = Date.now() + 5 * 60 * 1000
                patientFound.loginAttempts = 0
                await patientFound.save()
                return res.status(403).json({ message: "Cuenta bloqueada por 5 minutos" })
            }
            await patientFound.save()
            return res.status(400).json({ message: "Contraseña incorrecta" })
        }

        patientFound.loginAttempts = 0
        patientFound.timeOut = null
        await patientFound.save()

        const token = jsonwebtoken.sign(
            { id: patientFound._id, userType: "patient" },
            config.JWT.secret,
            { expiresIn: "30d" }
        )

        res.cookie("authCookie", token)
        return res.status(200).json({ message: "Login exitoso" })

    } catch (error) {
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

loginPatientController.logout = async (req, res) => {
    res.clearCookie("authCookie")
    return res.status(200).json({ message: "Sesión cerrada" })
}

export default loginPatientController