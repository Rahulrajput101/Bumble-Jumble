const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// GET /api/questions - Fetch all questions (without correct answers)
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find({})
      .select('-correctAnswer -__v')
      .sort({ questionNumber: 1 });

    res.json({
      success: true,
      totalQuestions: questions.length,
      questions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch questions' });
  }
});

// GET /api/questions/count - Get total question count
router.get('/count', async (req, res) => {
  try {
    const count = await Question.countDocuments();
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get count' });
  }
});

module.exports = router;
