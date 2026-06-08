import clinicalRecordModel from "../models/clinicalRecord.js"

const clinicalRecordController = {}

clinicalRecordController.getClinicalRecord = async (req, res) => {
    try {
        const records = await clinicalRecordModel.find()
            .populate("patient_id", "name lastName email")
        return res.status(200).json(records)
    } catch (error) {
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

clinicalRecordController.insertClinicalRecord = async (req, res) => {
    try {
        const { patient_id, diagnosis, medications, medicalNotes } = req.body
        const newRecord = new clinicalRecordModel({
            patient_id, diagnosis, medications, medicalNotes
        }) 
        await newRecord.save()
        return res.status(201).json({ message: "Clinical record saved" })
    } catch (error) {
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

clinicalRecordController.updateClinicalRecord = async (req, res) => {
    try {
        const { patient_id, diagnosis, medications, medicalNotes } = req.body
        const recordUpdate = await clinicalRecordModel.findByIdAndUpdate(
            req.params.id,
            { patient_id, diagnosis, medications, medicalNotes },
            { new: true }
        )
        if (!recordUpdate) {
            return res.status(404).json({ message: "Clinical record not found" })
        }
        return res.status(200).json({ message: "Clinical record updated" })
    } catch (error) {
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

clinicalRecordController.deleteClinicalRecord = async (req, res) => {
    try {
        const deleteRecord = await clinicalRecordModel.findByIdAndDelete(req.params.id)
        if (!deleteRecord) {
            return res.status(404).json({ message: "Clinical record not found" })
        }
        return res.status(200).json({ message: "Clinical record deleted" })
    } catch (error) {
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export default clinicalRecordController