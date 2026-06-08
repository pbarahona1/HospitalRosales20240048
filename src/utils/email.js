import nodemailer from "nodemailer"
import { config } from "../../config.js"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.email.user_email,
        pass: config.email.user_password
    }
})

export const sendVerificationCode = async (email, code) => {
    await transporter.sendMail({
        from: config.email.user_email,
        to: email,
        subject: "Código de verificación",
        html: `
            <h2>Bienvenido al Hospital Rosales</h2>
            <p>Tu código de verificación es:</p>
            <h1 style="color: #2d6a4f">${code}</h1>
            <p>Este código expira en 10 minutos.</p>
        `
    })
}

export const sendPasswordResetCode = async (email, code) => {
    await transporter.sendMail({
        from: config.email.user_email,
        to: email,
        subject: "Recuperación de contraseña",
        html: `
            <h2>Hospital Rosales</h2>
            <p>Tu código para restablecer tu contraseña es:</p>
            <h1 style="color: #2d6a4f">${code}</h1>
            <p>Este código expira en 10 minutos.</p>
        `
    })
}