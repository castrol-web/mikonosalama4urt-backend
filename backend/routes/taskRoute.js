import express from "express";
import userDetails from "../UserDetail.js";
import multer from "multer";
import Contact from "../FeedBack.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
import UserDetail from "../UserDetail.js";

//router from express that is going to be used inside the server.js
const router = express.Router()

const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;
const bucketName = process.env.AWS_BUCKET_NAME;

//s3 object
const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: region
});

//storage for the image uploaded in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


//function that generates random image names 
const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

//registration post routes
router.post("/registration", upload.single('profilePicture'), async (req, res) => {
  //what the values for the user entered
  const { firstName, lastName, email, phoneNumber, parentJob, streetName, childFName, childLName, gender, DOB, nationality, Allergy, AllergyDetails } = req.body;
const profilePicture = randomImageName();

if(!req.file){
  return res.status(400).json({message: "No file uploaded"});
}

  //buffer prop that we will send to s3
  const params = {
    Bucket: bucketName,
    Key: profilePicture,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  }


  try {
    const emailExist = await userDetails.findOne({email:email});
    if (emailExist) {
    res.json("exist");
    }
    else{
    //put command to put object in s3
    const command = new PutObjectCommand(params)
    await s3.send(command);
    //creating a user from the data
    const newUserDt = new userDetails({ firstName, lastName, email, phoneNumber, parentJob, streetName, childFName, childLName, gender, DOB, nationality, Allergy, AllergyDetails, profilePicture })
    await newUserDt.save()
    res.status(201).json("User registered successfully.")
  }} catch (err) {
    res.status(500).json("error occured failed to save user");
  }
});


router.post('/contact', async (req, res) => {
  const { userName, feedbackEmail, message } = req.body;
  try {
    // Validate the data against the Mongoose schema before saving
    const newContact = new Contact({ userName, feedbackEmail, message });

    // If validation passes, save the data to the database
    await newContact.save();
    res.status(201).json({ message: 'Message  received successfully' });
  } catch (error) {
    // Handle any other errors that occur during the process
    console.log(error);
    res.status(500).json({ message: "could not receive feedback error occured" });
  }
});




//getting all emails from the DB
// router.get('/registration', async (req, res) => {
//     try {
//       // getting all contacts from the database
//      const details =  await userDetails.find();
//       res.status(201).json(details.map(obj => obj.email));
//     } catch (error) {
//       // Handle any other errors that occur during the process
//       res.status(500).json({ message: `${error}could not find emails` });
//     }
//   });

export default router;