import {Inngest} from "inngest"
import { connectDB } from "./db.js"
import User from "../models/User.js"
import { clerkClient } from "@clerk/express"

export const inngest = new Inngest({
  id: "Zero Vault"
})

//creating in the database
const syncUser = inngest.createFunction(
  {id:"sync-user"},  // Function config (first argument)
  {event:"clerk/user.created"},  // Event trigger (second argument)
  async({event})=>{  // Handler function (third argument)
    await connectDB()
    const {id,email_addresses} = event.data;

    const newUser = {
      clerkId:id,
      email:email_addresses[0]?.email_address,
    }

    await User.create(newUser);
  }
)

//Deletion in the DataBase
const deleteUser = inngest.createFunction(
  {id:"delete-user-from-DB"},  // Function config (first argument)
  {event:"clerk/user.deleted"},  // Event trigger (second argument)
  async({event})=>{  // Handler function (third argument)
    await connectDB()
    const {id} = event.data;
    await User.findOneAndDelete({
      clerkId:id
    })
  }
)

export const functions = [syncUser, deleteUser]