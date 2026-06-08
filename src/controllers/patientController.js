import patientModel from "../models/pacient.js"
import { v2 as cloudinary } from "cloudinary"

const patientController = {}

patientController.getPatient = async (req, res) => {
    try {
        const patients = await patientModel.find()
        return res.status(200).json(patients)
    } catch (error) {
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

patientController.updatePatient = async (req, res) => {
    try {
        const { name, lastName, email, password, birthdate, phone, address, bloodType, phoneEmergencyContacts } = req.body

        const patientFound = await patientModel.findById(req.params.id)
        if (!patientFound) {
            return res.status(404).json({ message: "Paciente no encontrado" })
        }

        let updateData = { name, lastName, email, birthdate, phone, address, bloodType, phoneEmergencyContacts }

        if (req.file) {
            if (patientFound.public_id) {
                await cloudinary.uploader.destroy(patientFound.public_id)
            }
            updateData.profilePhoto = req.file.path
            updateData.public_id = req.file.filename
        }

        await patientModel.findByIdAndUpdate(req.params.id, updateData, { new: true })
        return res.status(200).json({ message: "Paciente actualizado" })

    } catch (error) {
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

patientController.deletePatient = async (req, res) => {
    try {
        const patientFound = await patientModel.findById(req.params.id)
        if (!patientFound) {
            return res.status(404).json({ message: "Paciente no encontrado" })
        }

        if (patientFound.public_id) {
            await cloudinary.uploader.destroy(patientFound.public_id)
        }

        await patientModel.findByIdAndDelete(req.params.id)
        return res.status(200).json({ message: "Paciente eliminado" })

    } catch (error) {
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export default patientController