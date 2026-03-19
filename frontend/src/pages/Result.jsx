import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './Result.module.css'

export default function Result() {
  const navigate = useNavigate()
  const [result, setResult] = useState(null)

  useEffect(() => {
    const data = sessionStorage.getItem('mcq_result')
    if (!data) {
      navigate('/', { replace: true })
      return
    }
    setResult(JSON.parse(data))
  }, [navigate])

  const handleHome = () => {
    sessionStorage.removeItem('mcq_result')
    sessionStorage.removeItem('mcq_username')
    navigate('/')
  }

  if (!result) return null

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Auto-submit alert */}
        {result.autoSubmitted && (
          <motion.div
            className={styles.autoAlert}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.3 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span>Test was auto-submitted: {result.autoSubmitReason}</span>
          </motion.div>
        )}

        {/* Icon */}
        <motion.div
          className={styles.iconWrapper}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <div className={styles.icon}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1>Test Submitted!</h1>
          <p className={styles.username}>{result.username}</p>
        </motion.div>

        <motion.p
          className={styles.message}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Your responses have been recorded successfully. Thank you for completing the test.
        </motion.p>

        {/* Time */}
        <motion.div
          className={styles.timeCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>Time Taken: <strong>{result.formattedTime}</strong></span>
        </motion.div>

        {/* Actions */}
        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <motion.button
            className={styles.homeBtn}
            onClick={handleHome}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Home
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
