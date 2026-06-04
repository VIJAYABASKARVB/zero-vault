import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./src/config/db.js"

dotenv.config();

const app = express();

connectDB();

app.get('/',(req,res)=>{
  res.send("Hello World");
});


app.listen(3000,() => {
  console.log(`Server is running on port : http://localhost:3000`);
});

export default app