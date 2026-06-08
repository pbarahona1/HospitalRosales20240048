import crypto from "crypto"
import jsonwebtoken from "jsonwebtoken"
import bcryptjs from "bcryptjs"

import patientModel from "../models/pacient.js"
import { config } from "../../config.js"
import { sendVerificationCode } from "../utils/email.js"

const registerPatientController = {}

registerPatientController.register = async (req, res) => {
    const {
        name, lastName, email, password, birthdate,
        phone, address, bloodType, phoneEmergencyContacts
    } = req.body

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: "Correo inválido" })
    }

    if (!name || !lastName || !password) {
        return res.status(400).json({ message: "Faltan campos requeridos" })
    }

    try {
        const existingPatient = await patientModel.findOne({ email })
        if (existingPatient) {
            return res.status(400).json({ message: "El correo ya está registrado" })
        }

        const passwordHashed = await bcryptjs.hash(password, 10)
        const verificationCode = crypto.randomBytes(3).toString("hex")

        const token = jsonwebtoken.sign(
            {
                verificationCode,
                name,
                lastName,
                email,
                password: passwordHashed,
                birthdate,
                phone,
                address,
                bloodType,
                phoneEmergencyContacts,
                profilePhoto: req.file?.path ?? null,
                public_id: req.file?.public_id ?? req.file?.filename ?? null,
            },
            config.JWT.secret,
            { expiresIn: "15m" }
        )

        res.cookie("registrationCookie", token, {
            maxAge: 15 * 60 * 1000,
            httpOnly: true
        })

        await sendVerificationCode(email, verificationCode)

        return res.status(200).json({ message: "Correo enviado, revisa tu bandeja" })

    } catch (error) {
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

registerPatientController.verifyCode = async (req, res) => {
    try {
        const { verificationCodeRequest } = req.body

        const token = req.cookies.registrationCookie
        if (!token) {
            return res.status(400).json({ message: "No hay sesión de registro activa" })
        }

        const decoded = jsonwebtoken.verify(token, config.JWT.secret)
        const {
            verificationCode: storedCode,
            name, lastName, email, password,
            birthdate, phone, address, bloodType,
            phoneEmergencyContacts, profilePhoto, public_id
        } = decoded

        if (verificationCodeRequest !== storedCode) {
            return res.status(400).json({ message: "Código incorrecto" })
        }

        const newPatient = new patientModel({
            name, lastName, email, password,
            birthdate, phone, address, bloodType,
            phoneEmergencyContacts, profilePhoto, public_id,
            isVerified: true,
            loginAttempts: 0,
            timeOut: null,
        })

        await newPatient.save()
        res.clearCookie("registrationCookie")

        return res.status(200).json({ message: "Paciente registrado exitosamente" })

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            res.clearCookie("registrationCookie")
            return res.status(400).json({ message: "El código expiró, volvé a registrarte" })
        }
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

// Reenviar código generando un nuevo token+cookie
registerPatientController.resendCode = async (req, res) => {
    try {
        const token = req.cookies.registrationCookie
        if (!token) {
            return res.status(400).json({ message: "No hay sesión de registro activa" })
        }

        // Ignoramos si expiró, igual extraemos el payload
        const decoded = jsonwebtoken.verify(token, config.JWT.secret, {
            ignoreExpiration: true
        })

        const newCode = crypto.randomBytes(3).toString("hex")

        const newToken = jsonwebtoken.sign(
            { ...decoded, verificationCode: newCode },
            config.JWT.secret,
            { expiresIn: "15m" }
        )

        res.cookie("registrationCookie", token, {
            maxAge: 15 * 60 * 1000,
            httpOnly: true
        })

        await sendVerificationCode(decoded.email, newCode)

        return res.status(200).json({ message: "Nuevo código enviado" })

    } catch (error) {
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export default registerPatientController