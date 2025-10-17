import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumePath: { type: String },
    coverLetter: { type: String },
    status: { type: String, enum: ['Submitted', 'Viewed', 'Shortlisted', 'Rejected'], default: 'Submitted' }
  },
  { timestamps: true }
);

export default mongoose.model('Application', applicationSchema);


