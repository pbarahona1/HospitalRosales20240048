import { Router } from "express"
import medicalEquipmentController from "../controllers/medicalEquipmentController.js"
import upload from "../utils/CloudinaryConfig.js"

const router = Router()

router.get("/", medicalEquipmentController.getEquipment)
router.post("/", upload.single("image"), medicalEquipmentController.insertEquipment)
router.put("/:id", upload.single("image"), medicalEquipmentController.updateEquipment)
router.delete("/:id", medicalEquipmentController.deleteEquipment)

export default router