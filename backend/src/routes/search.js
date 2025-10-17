import { Router } from 'express';
import Job from '../models/Job.js';

const router = Router();

// /api/search/jobs?keywords=react&location=NY&category=Engineering&jobType=Full-Time&minSalary=50000
router.get('/jobs', async (req, res) => {
  const { keywords, location, category, jobType, minSalary, maxSalary } = req.query;
  const filter = {};
  if (location) filter.location = new RegExp(location, 'i');
  if (category) filter.category = new RegExp(category, 'i');
  if (jobType) filter.jobType = jobType;
  if (minSalary || maxSalary) filter.salary = {};
  if (minSalary) filter.salary.$gte = Number(minSalary);
  if (maxSalary) filter.salary.$lte = Number(maxSalary);
  if (keywords) {
    filter.$or = [
      { title: new RegExp(keywords, 'i') },
      { companyName: new RegExp(keywords, 'i') },
      { description: new RegExp(keywords, 'i') }
    ];
  }
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '10', 10);
  const skip = (page - 1) * limit;
  const [total, jobs] = await Promise.all([
    Job.countDocuments(filter),
    Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
  ]);
  res.json({ total, page, limit, jobs });
});

export default router;


