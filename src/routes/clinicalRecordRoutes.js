import { Router } from "express"
import clinicalRecordController from "../controllers/clinicalRecordController.js"

const router = Router()

router.get("/", clinicalRecordController.getClinicalRecord)
router.post("/", clinicalRecordController.insertClinicalRecord)
router.put("/:id", clinicalRecordController.updateClinicalRecord)
router.delete("/:id", clinicalRecordController.deleteClinicalRecord)

export default router