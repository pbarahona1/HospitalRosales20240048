import { Router } from "express"
import specialityController from "../controllers/specialityController.js"

const router = Router()

router.get("/", specialityController.getSpeciality)
router.post("/", specialityController.insertSpeciality)
router.put("/:id", specialityController.updateSpeciality)
router.delete("/:id", specialityController.deleteSpeciality)

export default router