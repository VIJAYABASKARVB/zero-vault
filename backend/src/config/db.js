import mongoose from "mongoose";

export const connectDB = async()=>{
  try{
    await mongoose.connect(process.env.MONGO_URI_URL)
    console.log(`Database connected to: ${mongoose.connection.host}`);
  }catch(err){
    console.error(`Error in connecting to DataBase : ${err}`);
  }
}