import { Schema, model } from "mongoose";

const medicalAppointment = new Schema({
    specialityName: {type: String},
    description: {type: String},
    isAvailable: {type: Boolean}
}, {
    timestamps: true,
    strict: false,
},
);
export default model("speciality", specialitySchema)