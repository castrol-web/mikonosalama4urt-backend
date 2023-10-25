import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();
import router from "./routes/taskRoute.js";
import path from "path";
import { fileURLToPath } from "url";

//app config
const app = express();

//middlewares(is function that does som ething)
// const logger = (req,res,next)=>{
// console.log("middleware ran");
// next()
// }
app.use(express.json());
app.use(express.urlencoded({extended:false})); //middle enable capturing user inputs
app.use(cors({
  origin:["http://localhost:3001","https://mikonosalama4urt.onrender.com"]
}));
app.use("/api/",router);

//bodyparser to get user inputs
app.use(bodyParser.json());
// Serve static files from the "public" directory
app.use(express.static('/opt/render/project/src/backend/frontend/build'));

app.get('*',function(req,res){
  res.sendFile(path.join('/opt/render/project/src/backend/frontend/build','index.html'));
})

//setting ejs as the view engine
app.set('view engine', 'ejs');


//port to listen to 
const PORT = process.env.PORT ||8050; 


//Database configurations
const connection_url = process.env.MONGOOSE_CONNECTION;
try{
await mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  console.log("DB connection successful");
}catch (error){
console.log(error)
process.exit(1);
}

 


//listening port
app.listen(PORT,'0.0.0.0', function (err) {
  if(err){
    console.log(err);
  }
  console.log(`listening on localhost:${PORT}`);
});