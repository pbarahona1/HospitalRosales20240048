import appointmentModel from "../models/appointment.js"

const appointmentController = {}

appointmentController.getAppointment = async (req, res) => {
    try {
        const appointments = await appointmentModel.find()
            .populate("patient_id", "name lastName email")
            .populate("specialty_id", "specialityName")
        return res.status(200).json(appointments)
    } catch (error) {
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

appointmentController.insertAppointment = async (req, res) => {
    try {
        const { patient_id, specialty_id, appointmentDate, reason, status, observations } = req.body
        const newAppointment = new appointmentModel({
            patient_id, specialty_id, appointmentDate, reason, status, observations
        })
        await newAppointment.save()
        return res.status(201).json({ message: "Appointment saved" })
    } catch (error) {
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

appointmentController.updateAppointment = async (req, res) => {
    try {
        const { patient_id, specialty_id, appointmentDate, reason, status, observations } = req.body
        const appointmentUpdate = await appointmentModel.findByIdAndUpdate(
            req.params.id,
            { patient_id, specialty_id, appointmentDate, reason, status, observations },
            { new: true }
        )
        if (!appointmentUpdate) {
            return res.status(404).json({ message: "Appointment not found" })
        }
        return res.status(200).json({ message: "Appointment updated" })
    } catch (error) {
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

appointmentController.deleteAppointment = async (req, res) => {
    try {
        const deleteAppointment = await appointmentModel.findByIdAndDelete(req.params.id)
        if (!deleteAppointment) {
            return res.status(404).json({ message: "Appointment not found" })
        }
        return res.status(200).json({ message: "Appointment deleted" })
    } catch (error) {
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export default appointmentController