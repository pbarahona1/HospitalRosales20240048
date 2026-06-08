import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

import patientRoutes from "./src/routes/patientRoutes.js"
import specialityRoutes from "./src/routes/specialityRoutes.js"
import appointmentRoutes from "./src/routes/appointmentRoutes.js"
import clinicalRecordRoutes from "./src/routes/clinicalRecordRoutes.js"
import medicalEquipmentRoutes from "./src/routes/medicalEquipmentRoutes.js"

const app = express()

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
}))

app.use(cookieParser())
app.use(express.json())

app.use("/api/patient", patientRoutes)
app.use("/api/speciality", specialityRoutes)
app.use("/api/appointment", appointmentRoutes)
app.use("/api/clinical-record", clinicalRecordRoutes)
app.use("/api/medical-equipment", medicalEquipmentRoutes)

export default app