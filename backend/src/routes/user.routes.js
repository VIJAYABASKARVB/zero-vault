import { Router } from "express" 
import { setupUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/setup",setupUser)

export default userRouter;