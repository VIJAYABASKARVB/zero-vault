import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./src/config/db.js"
import { clerkMiddleware,requireAuth,getAuth} from '@clerk/express'
import cors from "cors";
import { serve } from "inngest/express";  
import { inngest, functions } from "./src/config/inngest.js"; 

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.endsWith('.vercel.app') || origin === process.env.FRONTEND_URL) {
      return callback(null, true)
    }
    callback(null, false)
  }
}));
app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));

connectDB();


app.get('/',(req,res)=>{
  res.send("Hello World");
});

// Apply middleware to a specific route
// Redirects to the homepage if the user is not authenticated
app.get('/protected', requireAuth(), (req, res) => {
  res.send('This is a protected route.')
})

app.listen(3000,() => {
  console.log(`Server is running on port : http://localhost:3000`);
});

export default app