import mongoose from "mongoose"

const vaultEntrySchema = new mongoose.Schema({
  label:{
    type:String,
    required:true,
    trim:true
  },

  usename:{
    type:String,
    required:true
  },

  password:{
    type:String,
    required:true
  },

  url:{
    type:String,
    default:"",
  },

  notes:{
    type:String,
    default:""
  },

  iv:{
    type:String,
    required:true
  }

},{
  timestamps:true
})

const vaultSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
    unique:true
  },

  Entries:[vaultEntrySchema]
},{timestamps:true})


const Vault = mongoose.model("Vault", vaultSchema)

export default Vault
