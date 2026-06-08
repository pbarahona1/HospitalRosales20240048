import { Schema, model } from "mongoose";

const appointmentSchema = new Schema({
    patient_id: { type: Schema.Types.ObjectId, ref: "patient" },
    specialty_id: { type: Schema.Types.ObjectId, ref: "speciality" },
    appointmentDate: { type: Date },
    reason: { type: String },
    status: { type: String },
    observations: { type: String }
}, {
    timestamps: true,
    strict: false,
});

export default model("appointment", appointmentSchema)