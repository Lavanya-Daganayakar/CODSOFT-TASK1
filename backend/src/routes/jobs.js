import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Job from '../models/Job.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Create job (employer)
router.post(
  '/',
  requireAuth,
  requireRole('employer'),
  [
    body('title').notEmpty(),
    body('companyName').notEmpty(),
    body('location').notEmpty(),
    body('jobType').notEmpty(),
    body('description').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const job = await Job.create({ ...req.body, postedBy: req.user.id });
    res.status(201).json(job);
  }
);

// Update job
router.put('/:id', requireAuth, requireRole('employer'), async (req, res) => {
  const job = await Job.findOneAndUpdate({ _id: req.params.id, postedBy: req.user.id }, req.body, { new: true });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json(job);
});

// Delete job
router.delete('/:id', requireAuth, requireRole('employer'), async (req, res) => {
  const job = await Job.findOneAndDelete({ _id: req.params.id, postedBy: req.user.id });
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json({ message: 'Deleted' });
});

// List jobs (paginated)
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '10', 10);
  const skip = (page - 1) * limit;
  const [total, jobs] = await Promise.all([
    Job.countDocuments({}),
    Job.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit)
  ]);
  res.json({ total, page, limit, jobs });
});

// Get job detail
router.get('/:id', async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json(job);
});

export default router;


