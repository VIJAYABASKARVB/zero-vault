import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./src/config/db.js"
import { clerkMiddleware,clerkClient,getAuth} from '@clerk/express'
import { inngest } from "./src/config/inngest.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({origin:"http://localhost:5173"}));
app.use(clerkMiddleware());

app.use("api/inngest",serve({client:inngest,functions}))

connectDB();

app.get('/protected',async (req,res) => {
  const auth = getAuth(req);

  if (!auth.isAuthenticated) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  res.json({
    message: "Protected Route",
    userId: auth.userId,
  });
})


app.get('/',(req,res)=>{
  res.send("Hello World");
});


app.listen(3000,() => {
  console.log(`Server is running on port : http://localhost:3000`);
});

export default app