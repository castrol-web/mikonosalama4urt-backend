import mongoose from "mongoose";
const feedbackSchema = new mongoose.Schema({
    userName: String,
      feedbackEmail: {
        type: String,
        required: true,
        // email validator to ensure valid email format
        validate: {
          validator: function (feedbackEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(feedbackEmail);
          },
          message: 'Invalid email format',
        },
      },
      message: String
},
{
  timestamps:{
    createdAt:'created_at',
    updatedAt: 'updated_at'
  }
}
);



export default  mongoose.model("Contact",feedbackSchema);