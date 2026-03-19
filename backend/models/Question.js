const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true,
    unique: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    a: { type: String, required: true },
    b: { type: String, required: true },
    c: { type: String, required: true },
    d: { type: String, required: true }
  },
  correctAnswer: {
    type: String,
    required: true,
    enum: ['a', 'b', 'c', 'd']
  },
  category: {
    type: String,
    default: 'General Knowledge'
  }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
