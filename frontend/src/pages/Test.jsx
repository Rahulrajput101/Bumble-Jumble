import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import styles from './Test.module.css'

function QuestionRenderer({ text, styles }) {
  // Questions with code use \n\n to separate text from code.
  // Pattern can be: "question text\n\ncode" or "question text\n\ncode\n\nmore text"
  const parts = text.split('\n\n')

  // No double newline = no code, just plain text question
  if (parts.length <= 1) {
    return <h2 className={styles.questionText}>{text}</h2>
  }

  // First part is always the question text
  const questionText = parts[0].trim()

  // Detect which parts are code vs trailing text
  // Code parts contain characters like {, }, (, ), =, ;, <, >, #, cout, console, def, print, etc.
  const codePattern = /[{}();=<>#]|cout|console\.|def |print\(|class |int |void |char |function |const |var |let |import |return |if |for |while |setTimeout|\.append|\.log/
  const codeLines = []
  const trailingText = []
  let doneWithCode = false

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i].trim()
    if (!doneWithCode && codePattern.test(part)) {
      codeLines.push(part)
    } else {
      doneWithCode = true
      trailingText.push(part)
    }
  }

  // If no code detected, render as plain text with line breaks
  if (codeLines.length === 0) {
    return <h2 className={styles.questionText}>{text}</h2>
  }

  const fullQuestion = trailingText.length > 0
    ? `${questionText} ${trailingText.join(' ')}`
    : questionText

  return (
    <div className={styles.questionWithCode}>
      <h2 className={styles.questionText}>{fullQuestion}</h2>
      <div className={styles.codeBlock}>
        <div className={styles.codeBlockHeader}>
          <span className={styles.codeBlockDot} style={{ background: '#ff5f57' }} />
          <span className={styles.codeBlockDot} style={{ background: '#febc2e' }} />
          <span className={styles.codeBlockDot} style={{ background: '#28c840' }} />
          <span className={styles.codeBlockLang}>Code</span>
        </div>
        <pre className={styles.codeBlockBody}>
          <code>{codeLines.join('\n\n')}</code>
        </pre>
      </div>
    </div>
  )
}

export default function Test() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timer, setTimer] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const timerRef = useRef(null)
  const hasSubmitted = useRef(false)
  const username = sessionStorage.getItem('mcq_username')

  // Redirect if no username
  useEffect(() => {
    if (!username) {
      navigate('/', { replace: true })
    }
  }, [username, navigate])

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axios.get('/api/questions')
        if (data.success && data.questions.length > 0) {
          setQuestions(data.questions)
        } else {
          alert('No questions available')
          navigate('/')
        }
      } catch {
        alert('Failed to load questions. Make sure the backend is running.')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetchQuestions()
  }, [navigate])

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer(t => t + 1)
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  // Submit handler
  const handleSubmit = useCallback(async (auto = false, reason = '') => {
    if (hasSubmitted.current || submitting) return
    hasSubmitted.current = true
    setSubmitting(true)
    clearInterval(timerRef.current)

    try {
      const { data } = await axios.post('/api/results/submit', {
        username,
        answers,
        timeTaken: timer,
        autoSubmitted: auto,
        autoSubmitReason: reason
      })

      if (data.success) {
        sessionStorage.setItem('mcq_result', JSON.stringify(data.result))
        // Exit fullscreen before navigating
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {})
        }
        navigate('/result', { replace: true })
      }
    } catch {
      hasSubmitted.current = false
      setSubmitting(false)
      alert('Failed to submit. Please try again.')
    }
  }, [username, answers, timer, navigate, submitting])

  // Fullscreen
  useEffect(() => {
    if (!loading && questions.length > 0) {
      const el = document.documentElement
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {})
      }
    }
  }, [loading, questions.length])

  // Tab switch / visibility detection -> auto submit
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !hasSubmitted.current) {
        handleSubmit(true, 'Tab switch detected')
      }
    }

    const handleBlur = () => {
      if (!hasSubmitted.current) {
        handleSubmit(true, 'Window lost focus')
      }
    }

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !hasSubmitted.current && questions.length > 0) {
        handleSubmit(true, 'Exited fullscreen')
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)
    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [handleSubmit, questions.length])

  // Prevent right-click and keyboard shortcuts
  useEffect(() => {
    const preventDefaults = (e) => {
      if (e.key === 'F11' || (e.ctrlKey && e.key === 'Tab') || e.key === 'Escape') {
        e.preventDefault()
      }
    }
    const preventContextMenu = (e) => e.preventDefault()

    document.addEventListener('keydown', preventDefaults)
    document.addEventListener('contextmenu', preventContextMenu)

    return () => {
      document.removeEventListener('keydown', preventDefaults)
      document.removeEventListener('contextmenu', preventContextMenu)
    }
  }, [])

  const selectAnswer = (questionNum, option) => {
    setAnswers(prev => ({ ...prev, [questionNum]: option }))
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const currentQuestion = questions[currentIndex]
  const answeredCount = Object.keys(answers).length
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <motion.div
          className={styles.spinner}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p>Loading questions...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topLeft}>
          <div className={styles.userBadge}>
            <div className={styles.avatar}>{username?.[0]?.toUpperCase()}</div>
            <span>{username}</span>
          </div>
        </div>
        <div className={styles.topCenter}>
          <span className={styles.questionCount}>
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
        <div className={styles.topRight}>
          <div className={styles.timer}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>{formatTime(timer)}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressTrack}>
        <motion.div
          className={styles.progressFill}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question Area */}
      <div className={styles.mainContent}>
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestion.questionNumber}
              className={styles.questionCard}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.questionHeader}>
                <span className={styles.qBadge}>Question {currentQuestion.questionNumber}</span>
                {currentQuestion.category && (
                  <span className={styles.categoryBadge}>{currentQuestion.category}</span>
                )}
              </div>
              <QuestionRenderer text={currentQuestion.question} styles={styles} />

              <div className={styles.optionsGrid}>
                {['a', 'b', 'c', 'd'].map((opt) => {
                  const isSelected = answers[currentQuestion.questionNumber] === opt
                  return (
                    <motion.button
                      key={opt}
                      className={`${styles.optionBtn} ${isSelected ? styles.optionSelected : ''}`}
                      onClick={() => selectAnswer(currentQuestion.questionNumber, opt)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className={styles.optionLetter}>{opt.toUpperCase()}</span>
                      <span className={styles.optionText}>{currentQuestion.options[opt]}</span>
                      {isSelected && (
                        <motion.div
                          className={styles.checkMark}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className={styles.navigation}>
          <button
            className={styles.navBtn}
            onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Previous
          </button>

          <div className={styles.navInfo}>
            <span className={styles.answeredBadge}>
              {answeredCount} of {questions.length} answered
            </span>
          </div>

          {currentIndex < questions.length - 1 ? (
            <button
              className={`${styles.navBtn} ${styles.navBtnNext}`}
              onClick={() => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))}
            >
              Next
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          ) : (
            <motion.button
              className={`${styles.navBtn} ${styles.submitBtn}`}
              onClick={() => setShowConfirm(true)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Test'}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </motion.button>
          )}
        </div>
      </div>

      {/* Question Navigator Dots */}
      <div className={styles.dotsContainer}>
        {questions.map((q, idx) => (
          <button
            key={q.questionNumber}
            className={`${styles.dot}
              ${idx === currentIndex ? styles.dotActive : ''}
              ${answers[q.questionNumber] ? styles.dotAnswered : ''}`}
            onClick={() => setCurrentIndex(idx)}
            title={`Question ${q.questionNumber}`}
          >
            {q.questionNumber}
          </button>
        ))}
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3>Submit Test?</h3>
              <p>
                You have answered <strong>{answeredCount}</strong> out of <strong>{questions.length}</strong> questions.
                {answeredCount < questions.length && (
                  <span className={styles.modalWarning}>
                    {' '}{questions.length - answeredCount} question(s) are unanswered.
                  </span>
                )}
              </p>
              <p className={styles.modalTime}>Time: {formatTime(timer)}</p>
              <div className={styles.modalActions}>
                <button
                  className={styles.modalCancel}
                  onClick={() => setShowConfirm(false)}
                >
                  Go Back
                </button>
                <button
                  className={styles.modalSubmit}
                  onClick={() => handleSubmit(false)}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Confirm Submit'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
