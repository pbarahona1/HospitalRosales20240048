import { Schema, model } from "mongoose";

const clinicalRecordSchema = new Schema({
    patient_id: { type: Schema.Types.ObjectId, ref: "patient" },
    diagnosis: { type: String },
    medications: [{
        medicineName: { type: String }
    }],
    medicalNotes: { type: String }
}, {
    timestamps: true,
    strict: false,
});

export default model("clinicalRecord", clinicalRecordSchema)