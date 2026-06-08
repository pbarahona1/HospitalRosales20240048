import medicalEquipmentModel from "../models/medicalEquipment.js"
import { v2 as cloudinary } from "cloudinary"

const medicalEquipmentController = {}

medicalEquipmentController.getEquipment = async (req, res) => {
    try {
        const equipment = await medicalEquipmentModel.find()
        return res.status(200).json(equipment)
    } catch (error) {
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

medicalEquipmentController.insertEquipment = async (req, res) => {
    try {
        const { equipmentName, description, brand, model, purchaseDate, maintenanceDate, location, status, isAvailable } = req.body
        const newEquipment = new medicalEquipmentModel({
            equipmentName, description, brand, model,
            purchaseDate, maintenanceDate, location, status, isAvailable,
            image: req.file ? req.file.path : null,
            public_id: req.file ? req.file.filename : null
        })
        await newEquipment.save()
        return res.status(201).json({ message: "Equipment saved" })
    } catch (error) {
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

medicalEquipmentController.updateEquipment = async (req, res) => {
    try {
        const { equipmentName, description, brand, model, purchaseDate, maintenanceDate, location, status, isAvailable } = req.body

        const equipmentFound = await medicalEquipmentModel.findById(req.params.id)
        if (!equipmentFound) {
            return res.status(404).json({ message: "Equipment not found" })
        }

        let updateData = { equipmentName, description, brand, model, purchaseDate, maintenanceDate, location, status, isAvailable }

        if (req.file) {
            if (equipmentFound.public_id) {
                await cloudinary.uploader.destroy(equipmentFound.public_id)
            }
            updateData.image = req.file.path
            updateData.public_id = req.file.filename
        }

        await medicalEquipmentModel.findByIdAndUpdate(req.params.id, updateData, { new: true })
        return res.status(200).json({ message: "Equipment updated" })
    } catch (error) {
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

medicalEquipmentController.deleteEquipment = async (req, res) => {
    try {
        const equipmentFound = await medicalEquipmentModel.findById(req.params.id)
        if (!equipmentFound) {
            return res.status(404).json({ message: "Equipment not found" })
        }

        if (equipmentFound.public_id) {
            await cloudinary.uploader.destroy(equipmentFound.public_id)
        }

        await medicalEquipmentModel.findByIdAndDelete(req.params.id)
        return res.status(200).json({ message: "Equipment deleted" })
    } catch (error) {
        console.log("error " + error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export default medicalEquipmentController