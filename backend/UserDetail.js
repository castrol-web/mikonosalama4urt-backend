import mongoose from "mongoose";
//creating a schema  4 form creations
const user = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: [true,"Please enter your Email"],
        unique: [true,"email already exists"]
    },
    phoneNumber: {
        type: Number,
        required: [true,"Phone number cannot be null"],
        match: /^[+]?[(]?[0-9]{3}[)]?[-\s]?[0-9]{3}[-\s]?[0-9]{4,6}$/im,
    },
    parentJob: String,
    streetName: String,
    childFName: String,
    childLName: String,
    gender: String,
    DOB: Date,
    nationality: String,
    Allergy: String,
    AllergyDetails: String,
    profilePicture: {
        required:true,
        type:String}, //field to store profile picture
},
{
    timestamps:{
        createdAt:'created_at',
        updatedAt:'updated_at'
    }
}
);


//having userDetails model(table)
export default mongoose.model('userDetails', user);

