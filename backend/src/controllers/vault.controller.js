import User from "../models/User.js";
import Vault from "../models/Vault.js";

export const getVault = async (req, res) => {

  // 1. Get userId from Clerk
  const userId = req.auth.userId;

  // 2. Find User by clerkId → get MongoDB _id
  const user = await User.findOne({
    clerkId:userId
  })

  // 3. Find Vault document where userId = user._id
  const vault = await Vault.findOne({
    userId:user._id
  })

  // 4. If no vault found → return 404
  if(!vault){
    return res.status(404).json({error:"Vault not found"})
  }

  // 5. Return vault.Entries array
  res.status(200).json({Entries: vault.Entries})
}


export const addEntry = async (req, res) => {

  // 1. Get userId from Clerk → find User → get _id
  const userId = req.auth.userId;

  // 2. Find User by clerkId → get MongoDB _id
  const user = await User.findOne({
    clerkId:userId
  })

  // 3. Find Vault document where userId = user._id
  let vault = await Vault.findOne({
    userId:user._id
  })

  // 4. If no vault → create one first
  if (!vault) {
      vault = await Vault.create({
        userId: user._id,
        Entries:[]
      })
  }

  // 5. Destructure body: { label, username, password, url, notes, iv }
  const { label, username, password, url, notes, iv } = req.body;

  // 6. Push new entry to vault.Entries array
  vault.Entries.push({
    label,
    username,
    password,
    url,
    notes,
    iv
  })

  // 7. Save vault
  await vault.save()

  // 8. Return the created entry (including its auto-generated _id)
  res.status(201).json({ entry: vault.Entries[vault.Entries.length - 1] })
}


export const updateEntry = async (req, res) => {

  // 1. Get userId from Clerk → find User → get _id
  const userId = req.auth.userId;

  const user = await User.findOne({
    clerkId:userId
  })

  // 2. Find Vault by userId
  const vault = await Vault.findOne({
    userId:user._id
  })

  // 3. Find the entry in vault.Entries using entry _id from params
  const entry = vault.Entries.find((entry) => entry._id.toString() === req.params.entryId);
  
  // 4. If entry not found → return 404
  if (!entry){
    return res.status(404).json({error:"Entry not found"})
  }

  // 5. Update allowed fields: label, username, password, url, notes, iv
  const {label,username,password,url,notes,iv} = req.body;
  
  if(label) entry.label=label;
  if(username) entry.username=username;
  if(password) entry.password=password;
  if(url) entry.url=url;
  if(notes) entry.notes=notes;
  if(iv) entry.iv=iv;
  
  // 6. Save vault
  await vault.save()

  // 7. Return updated entry
  res.status(200).json({ entry });
}


export const deleteEntry = async (req, res) => {

  // 1. Get userId from Clerk → find User → get _id
  const userId = req.auth.userId;

  const user = await User.findOne({
    clerkId:userId
  })

  // 2. Find Vault by userId
  const vault = await Vault.findOne({
    userId:user._id
  })

  // 3. Find entry in vault.Entries using entry _id from params
  const entry = vault.Entries.find((entry) => entry._id.toString() === req.params.entryId);

  // 4. If entry not found → return 404
  if (!entry){
    return res.status(404).json({error:"Entry not found"})
  }

  // 5. Remove entry from array
  vault.Entries.pull({ _id: entry._id });

  // 6. Save vault
  await vault.save();

  // 7. Return success message
  res.status(200).json({message:"Entry deleted successfully"})
}