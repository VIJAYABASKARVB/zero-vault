import User from "../models/User.js";
import Vault from "../models/Vault.js";
import crypto from "crypto";
import argon2 from "argon2";

export const setupUser = async (req, res) => {

  // 1. Get userId from Clerk
  const userId = req.auth.userId;

  // 2. Find User by clerkId
  const user = await User.findOne({
        clerkId: userId
  })

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  
  // 3. Check if masterPasswordHash already exists → return 400 if yes
  if(user.masterPasswordHash){
    return res.status(400).json({error : "Master Passwod is already set"});
  }

  // 4. Generate salt
  const salt = crypto.randomBytes(16).toString("hex");

  // 5. Hash password with argon2
  const hash = await argon2.hash(req.body.masterPassword, { salt: Buffer.from(salt, "hex") })

  // 6. Save hash + salt
  user.masterPasswordHash = hash;
  user.salt = salt;
  await user.save()

  // 7. Create empty Vault
  await Vault.create({
    userId:user._id,
    Entries: []
  })

  // 8. Return { salt }
  res.status(200).json({ salt, message: "Master password setup complete" });
}