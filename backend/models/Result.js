const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  wrongAnswers: {
    type: Number,
    required: true
  },
  unanswered: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number, // in seconds
    required: true
  },
  formattedTime: {
    type: String,
    required: true
  },
  answers: [{
    questionNumber: Number,
    selectedAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean
  }],
  autoSubmitted: {
    type: Boolean,
    default: false
  },
  autoSubmitReason: {
    type: String,
    default: null
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
