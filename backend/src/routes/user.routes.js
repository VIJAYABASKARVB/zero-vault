import { Router } from "express" 
import { getEncryptionConfig, setupEncryption } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/encryption", getEncryptionConfig)
userRouter.put("/encryption", setupEncryption)

export default userRouter;