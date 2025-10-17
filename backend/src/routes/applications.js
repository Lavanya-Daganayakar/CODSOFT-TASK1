import { Router } from 'express';
import multer from 'multer';
import { body, validationResult } from 'express-validator';
import { requireAuth, requireRole } from '../middleware/auth.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import nodemailer from 'nodemailer';

const router = Router();
const upload = multer({ dest: 'uploads/applications/' });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Apply to a job (candidate)
router.post(
  '/',
  requireAuth,
  requireRole('candidate'),
  upload.single('resume'),
  [body('jobId').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { jobId, coverLetter } = req.body;
    const job = await Job.findById(jobId).populate('postedBy');
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const application = await Application.create({
      jobId,
      candidateId: req.user.id,
      resumePath: req.file ? req.file.path : undefined,
      coverLetter
    });

    // Emails
    try {
      if (process.env.SMTP_USER) {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: req.user.email || process.env.TEST_APPLICANT_TO || process.env.SMTP_USER,
          subject: 'Application received',
          text: `Your application to ${job.title} at ${job.companyName} was received.`
        });
        if (job.postedBy?.email) {
          await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: job.postedBy.email,
            subject: 'New applicant',
            text: `A candidate applied to your job ${job.title}.`
          });
        }
      }
    } catch (e) {
      // non-blocking
      console.error('Email failed', e.message);
    }

    res.status(201).json(application);
  }
);

// List applications by candidate
router.get('/me', requireAuth, requireRole('candidate'), async (req, res) => {
  const apps = await Application.find({ candidateId: req.user.id }).sort({ createdAt: -1 }).populate('jobId');
  res.json(apps);
});

// List applicants for a job (employer)
router.get('/job/:jobId', requireAuth, requireRole('employer'), async (req, res) => {
  const job = await Job.findOne({ _id: req.params.jobId, postedBy: req.user.id });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  const apps = await Application.find({ jobId: job._id }).sort({ createdAt: -1 }).populate('candidateId');
  res.json(apps);
});

// Update application status (employer)
router.patch('/:id/status', requireAuth, requireRole('employer'), async (req, res) => {
  const { status } = req.body;
  if (!['Submitted', 'Viewed', 'Shortlisted', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  const app = await Application.findById(req.params.id).populate('jobId');
  if (!app) return res.status(404).json({ message: 'Not found' });
  if (String(app.jobId.postedBy) !== String(req.user.id)) return res.status(403).json({ message: 'Forbidden' });
  app.status = status;
  await app.save();
  res.json(app);
});

export default router;


