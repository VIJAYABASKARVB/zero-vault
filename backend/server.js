import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./src/config/db.js"
import { clerkMiddleware,getAuth} from '@clerk/express'
import cors from "cors";
import { serve } from "inngest/express";  
import { inngest, functions } from "./src/config/inngest.js"; 
import { requireAuth } from './src/middleware/auth.middleware.js'
import userRouter from "./src/routes/user.routes.js";
import vaultRouter from "./src/routes/vault.routes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    if (origin.endsWith('.vercel.app')) return callback(null, true)
    if (origin === 'http://localhost:5173') return callback(null, true)
    if (origin === process.env.FRONTEND_URL) return callback(null, true)
    callback(null, false)
  }
}));

app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));

connectDB();


app.get('/',(req,res)=>{
  res.send("Hello World");
});


app.use("/api/user", requireAuth, userRouter);
app.use("/api/vault", requireAuth, vaultRouter);

app.listen(3000,() => {
  console.log(`Server is running on port : http://localhost:3000`);
});

export default app