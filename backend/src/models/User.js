import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['employer', 'candidate'], required: true },
    resumePath: { type: String },
    profileDetails: {
      skills: [{ type: String }],
      experience: { type: String },
      location: { type: String }
    }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);


