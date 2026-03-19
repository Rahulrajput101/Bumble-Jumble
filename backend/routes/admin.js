const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const Question = require('../models/Question');

// GET /admin - Admin dashboard
router.get('/', async (req, res) => {
  try {
    const results = await Result.find({})
      .select('-__v')
      .sort({ createdAt: -1 });

    const totalTests = results.length;
    const avgScore = totalTests > 0
      ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / totalTests)
      : 0;
    const avgTime = totalTests > 0
      ? Math.round(results.reduce((sum, r) => sum + r.timeTaken, 0) / totalTests)
      : 0;
    const topScore = totalTests > 0
      ? Math.max(...results.map(r => r.percentage))
      : 0;

    const avgMinutes = Math.floor(avgTime / 60);
    const avgSeconds = avgTime % 60;

    res.render('dashboard', {
      results,
      stats: {
        totalTests,
        avgScore,
        avgTime: `${avgMinutes}m ${avgSeconds}s`,
        topScore
      }
    });
  } catch (error) {
    console.error('Admin error:', error);
    res.status(500).send('Server error');
  }
});

// GET /admin/result/:id - Detailed result view
router.get('/result/:id', async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) {
      return res.status(404).send('Result not found');
    }

    const questions = await Question.find({}).sort({ questionNumber: 1 });

    res.render('result-detail', { result, questions });
  } catch (error) {
    console.error('Admin detail error:', error);
    res.status(500).send('Server error');
  }
});

// DELETE /admin/result/:id - Delete a result
router.delete('/result/:id', async (req, res) => {
  try {
    await Result.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// DELETE /admin/results/clear - Clear all results
router.delete('/results/clear', async (req, res) => {
  try {
    await Result.deleteMany({});
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
