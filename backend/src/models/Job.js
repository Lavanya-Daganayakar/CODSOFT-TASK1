import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    companyName: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: Number },
    jobType: { type: String, enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote'], required: true },
    category: { type: String },
    description: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Job', jobSchema);


