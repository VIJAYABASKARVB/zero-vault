import mongoose from "mongoose";

const userSchema = new  mongoose.Schema({
    clerkId : {
      type:String,
      unique:true,
      required:true
    },
    email: {
      type:String,
      unique:true,
      required:true
    },
    masterPasswordHash:{
      type:String,
      default: null
    },
    salt:{
      type:String,
      default: null
    },
    encryptionSalt:{
      type:String,
      default: null
    },
    verificationToken:{
      type:String,
      default: null
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;

