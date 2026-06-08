import mongoose from "mongoose";
import { config } from "./config.js";

mongoose.connect("mongodb://localhost:27017/hospitalRosalesDB1B")

//Comprobar que todo funcione
const connection = mongoose.connection;

connection.once("open", ()=>{
    console.log("DB is connected")
})

connection.on("disconnected", (error)=>{
    console.log("DB is disconnected " + error)
})