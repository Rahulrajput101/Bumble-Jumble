const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Result = require('../models/Result');

// POST /api/results/submit - Submit test answers
router.post('/submit', async (req, res) => {
  try {
    const { username, answers, timeTaken, autoSubmitted, autoSubmitReason } = req.body;

    if (!username || !answers || timeTaken === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check if username already took the test
    const existing = await Result.findOne({ username: username.trim() });
    if (existing) {
      return res.status(403).json({ success: false, message: 'You have already taken this test.' });
    }

    // Fetch all questions with correct answers
    const questions = await Question.find({}).sort({ questionNumber: 1 });
    const totalQuestions = questions.length;

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unanswered = 0;
    const detailedAnswers = [];

    questions.forEach((q) => {
      const userAnswer = answers[q.questionNumber];
      const isCorrect = userAnswer === q.correctAnswer;

      if (!userAnswer) {
        unanswered++;
      } else if (isCorrect) {
        correctAnswers++;
      } else {
        wrongAnswers++;
      }

      detailedAnswers.push({
        questionNumber: q.questionNumber,
        selectedAnswer: userAnswer || null,
        correctAnswer: q.correctAnswer,
        isCorrect: userAnswer ? isCorrect : false
      });
    });

    const score = correctAnswers;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    // Format time
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    const formattedTime = `${minutes}m ${seconds}s`;

    const result = new Result({
      username: username.trim(),
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      unanswered,
      score,
      percentage,
      timeTaken,
      formattedTime,
      answers: detailedAnswers,
      autoSubmitted: autoSubmitted || false,
      autoSubmitReason: autoSubmitReason || null
    });

    await result.save();

    res.json({
      success: true,
      result: {
        username: result.username,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        unanswered,
        score,
        percentage,
        timeTaken,
        formattedTime,
        autoSubmitted: result.autoSubmitted,
        autoSubmitReason: result.autoSubmitReason
      }
    });
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit test' });
  }
});

// GET /api/results/check/:username - Check if username already took the test
router.get('/check/:username', async (req, res) => {
  try {
    const existing = await Result.findOne({ username: req.params.username.trim() });
    res.json({ success: true, taken: !!existing });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Check failed' });
  }
});

// GET /api/results - Get all results (for admin API)
router.get('/', async (req, res) => {
  try {
    const results = await Result.find({})
      .select('-answers -__v')
      .sort({ createdAt: -1 });

    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch results' });
  }
});

// GET /api/results/:id - Get detailed result
router.get('/:id', async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }

    const questions = await Question.find({}).sort({ questionNumber: 1 });

    res.json({ success: true, result, questions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch result' });
  }
});

module.exports = router;
