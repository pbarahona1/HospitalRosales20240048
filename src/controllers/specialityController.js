import specialityModel from "../models/speciality.js"

const specialityController = {}

specialityController.getSpeciality = async (req, res) => {
    try {
        const specialities = await specialityModel.find()
        return res.status(200).json(specialities)
    } catch (error) {
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

specialityController.insertSpeciality = async (req, res) => {
    try {
        const { specialityName, description, isAvailable } = req.body
        const newSpeciality = new specialityModel({ specialityName, description, isAvailable })
        await newSpeciality.save()
        return res.status(201).json({ message: "Speciality saved" })
    } catch (error) {
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

specialityController.updateSpeciality = async (req, res) => {
    try {
        const { specialityName, description, isAvailable } = req.body
        const specialityUpdate = await specialityModel.findByIdAndUpdate(
            req.params.id,
            { specialityName, description, isAvailable },
            { new: true }
        )
        if (!specialityUpdate) {
            return res.status(404).json({ message: "Speciality not found" })
        }
        return res.status(200).json({ message: "Speciality updated" })
    } catch (error) {
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

specialityController.deleteSpeciality = async (req, res) => {
    try {
        const deleteSpeciality = await specialityModel.findByIdAndDelete(req.params.id)
        if (!deleteSpeciality) {
            return res.status(404).json({ message: "Speciality not found" })
        }
        return res.status(200).json({ message: "Speciality deleted" })
    } catch (error) {
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export default specialityController