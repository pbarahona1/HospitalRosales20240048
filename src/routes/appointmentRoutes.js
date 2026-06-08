import { Router } from "express"
import appointmentController from "../controllers/appointmentController.js"

const router = Router()

router.get("/", appointmentController.getAppointment)
router.post("/", appointmentController.insertAppointment)
router.put("/:id", appointmentController.updateAppointment)
router.delete("/:id", appointmentController.deleteAppointment)

export default router