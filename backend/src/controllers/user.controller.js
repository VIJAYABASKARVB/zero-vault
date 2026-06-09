import User from "../models/User.js";
import Vault from "../models/Vault.js";

export const getEncryptionConfig = async (req, res) => {
  const userId = req.auth.userId;
  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({
    encryptionSalt: user.encryptionSalt || null,
    verificationToken: user.verificationToken || null
  });
}


export const setupEncryption = async (req, res) => {
  const userId = req.auth.userId;
  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const { encryptionSalt, verificationToken } = req.body;

  if (!encryptionSalt || !verificationToken) {
    return res.status(400).json({ error: "encryptionSalt and verificationToken are required" });
  }

  user.encryptionSalt = encryptionSalt;
  user.verificationToken = verificationToken;
  await user.save();

  // Check if Vault exists, if not create one
  const existingVault = await Vault.findOne({ userId: user._id });
  if (!existingVault) {
    await Vault.create({ userId: user._id, Entries: [] });
  }

  res.status(200).json({ success: true });
}
