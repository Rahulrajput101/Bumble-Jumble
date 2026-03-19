import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import axios from 'axios'
import styles from './Landing.module.css'

const timelineData = [
  {
    time: '11:00 AM',
    title: 'Check-In & Seating',
    description: 'All participants must be seated in the ICT Center. Solo or Duo teams will register and decide their team name.',
    icon: '🪑',
    color: '#6c5ce7'
  },
  {
    time: '11:20 AM',
    title: 'Round 1 — MCQ Quiz',
    description: '30 questions in 30 minutes covering C++, JavaScript, Python, HTML & CSS. One point per correct answer, no negative marking.',
    icon: '⚡',
    color: '#00b894'
  },
  {
    time: '11:50 AM',
    title: 'Evaluation & Break',
    description: '10-minute break while scores are evaluated. Ties broken by completion time — faster team wins!',
    icon: '📊',
    color: '#fdcb6e'
  },
  {
    time: '12:00 PM',
    title: 'Results & Top 10 Announced',
    description: 'Winners of Round 1 announced. Top 10 teams advance to the final round!',
    icon: '🏆',
    color: '#e17055'
  },
  {
    time: '12:10 PM',
    title: 'Round 2 — Bumble Jumble',
    description: '1 hour 30 minutes, 3 challenges: Development (HTML/CSS/React), C++ and Python. Rearrange jumbled code, fix logical & syntax errors!',
    icon: '🔥',
    color: '#d63031'
  },
  {
    time: '1:40 PM',
    title: 'Final Evaluation & Winners',
    description: 'Final scores evaluated and winners announced. Certificates & prizes distributed!',
    icon: '🎉',
    color: '#6c5ce7'
  }
]

const rules = [
  'Teams can be Solo or Duo — decide your team name at registration',
  'Each team can attempt the quiz only ONE time using their team name',
  'Quiz contains 30 MCQs — +1 for correct, 0 for wrong (no negative marking)',
  'Quiz duration is 30 minutes — timer starts when you begin',
  'If scores are tied, the team with faster completion time is ranked higher',
  'The test runs in fullscreen mode — switching tabs will auto-submit your test',
  'Any form of cheating will result in immediate disqualification',
  'Top 10 teams from Round 1 qualify for Round 2',
  'Round 2: Rearrange jumbled code, fix errors in C++, Python & Web Dev',
  'For queries, raise your hand or ask a volunteer'
]

const codeSnippets = [
  { lang: 'python', code: 'def solve(n):\n  return n * (n+1) // 2', x: '5%', y: '15%', rotate: -12 },
  { lang: 'cpp', code: '#include<bits/stdc++.h>\nint main() {\n  cout << "Hello";\n}', x: '80%', y: '8%', rotate: 8 },
  { lang: 'javascript', code: 'const arr = [1,2,3];\narr.map(x => x * 2);', x: '85%', y: '55%', rotate: -6 },
  { lang: 'html', code: '<div class="hero">\n  <h1>Code</h1>\n</div>', x: '2%', y: '60%', rotate: 10 },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } }
}

export default function Landing() {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTimeline, setActiveTimeline] = useState(-1)
  const navigate = useNavigate()
  const { scrollYProgress } = useScroll()
  const pathLength = useTransform(scrollYProgress, [0, 0.6], [0, 1])

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setActiveTimeline(prev => {
          if (prev >= timelineData.length - 1) {
            clearInterval(interval)
            return prev
          }
          return prev + 1
        })
      }, 300)
      return () => clearInterval(interval)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const handleStart = async (e) => {
    e.preventDefault()
    const trimmed = username.trim()
    if (!trimmed) {
      setError('Please enter your team name to begin')
      return
    }
    if (trimmed.length < 2) {
      setError('Team name must be at least 2 characters')
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.get(`/api/results/check/${trimmed}`)
      if (data.taken) {
        setError('This team name has already attempted the quiz.')
        setLoading(false)
        return
      }
    } catch {
      // If check fails, let them proceed — backend submit will still block duplicates
    }
    setLoading(false)

    sessionStorage.setItem('mcq_username', trimmed)
    navigate('/test')
  }

  return (
    <div className={styles.page}>
      {/* Floating code snippets in background */}
      {codeSnippets.map((snippet, i) => (
        <motion.div
          key={i}
          className={styles.floatingCode}
          style={{ left: snippet.x, top: snippet.y, rotate: snippet.rotate }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.06, scale: 1 }}
          transition={{ delay: 1 + i * 0.3, duration: 1 }}
        >
          <pre>{snippet.code}</pre>
        </motion.div>
      ))}

      {/* Animated orbs */}
      <div className={styles.orbContainer}>
        <motion.div
          className={styles.orb1}
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={styles.orb2}
          animate={{ y: [15, -15, 15], x: [10, -10, 10] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={styles.orb3}
          animate={{ y: [-10, 25, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ===== HERO SECTION ===== */}
      <section className={styles.hero}>
        <motion.div
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div className={styles.badge} variants={fadeUp} custom={0}>
            <span className={styles.badgeDot} />
            Coding Event 2026
          </motion.div>

          <motion.h1 className={styles.heroTitle} variants={fadeUp} custom={1}>
            <span className={styles.titleGradient}>Bumble</span>{' '}
            <span className={styles.titleGradient2}>Jumble</span>
          </motion.h1>

          <motion.p className={styles.heroTagline} variants={fadeUp} custom={2}>
            Decode. Debug. Dominate.
          </motion.p>

          <motion.p className={styles.heroDesc} variants={fadeUp} custom={3}>
            The ultimate coding challenge where teams unscramble code, fix bugs,
            and race against the clock. Are you ready to prove your skills?
          </motion.p>

          <motion.div className={styles.heroStats} variants={fadeUp} custom={4}>
            <div className={styles.stat}>
              <span className={styles.statNum}>30</span>
              <span className={styles.statLabel}>Questions</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>2</span>
              <span className={styles.statLabel}>Rounds</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>5</span>
              <span className={styles.statLabel}>Languages</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </span>
              <span className={styles.statLabel}>Timed</span>
            </div>
          </motion.div>

          <motion.div className={styles.scrollHint} variants={fadeUp} custom={5}>
            <span>Scroll to explore</span>
            <motion.div
              className={styles.scrollArrow}
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Hero right side - code visual */}
        <motion.div
          className={styles.heroVisual}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className={styles.codeWindow}>
            <div className={styles.codeWindowBar}>
              <span className={styles.dot} style={{ background: '#ff5f57' }} />
              <span className={styles.dot} style={{ background: '#febc2e' }} />
              <span className={styles.dot} style={{ background: '#28c840' }} />
              <span className={styles.codeWindowTitle}>bumble_jumble.py</span>
            </div>
            <motion.div className={styles.codeBody}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                <span className={styles.codeKeyword}>def</span>{' '}
                <span className={styles.codeFn}>bumble_jumble</span>(code):
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
                {'    '}shuffled = <span className={styles.codeFn}>scramble</span>(code)
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                {'    '}<span className={styles.codeKeyword}>if</span> team.<span className={styles.codeFn}>can_solve</span>(shuffled):
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
                {'        '}<span className={styles.codeKeyword}>return</span>{' '}
                <span className={styles.codeString}>"🏆 Winner!"</span>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
                {'    '}<span className={styles.codeKeyword}>return</span>{' '}
                <span className={styles.codeString}>"Keep trying!"</span>
              </motion.div>
              <motion.div
                className={styles.cursor}
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                █
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ===== TIMELINE SECTION ===== */}
      <section className={styles.timelineSection}>
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>Event Timeline</h2>
          <p className={styles.sectionSub}>Here's how the event unfolds — checkpoint by checkpoint</p>
        </motion.div>

        <div className={styles.timeline}>
          {/* SVG curved path */}
          <svg className={styles.timelineSvg} viewBox="0 0 60 1000" preserveAspectRatio="none">
            <motion.path
              d="M30 0 Q30 80 30 160"
              stroke="rgba(108,92,231,0.15)"
              strokeWidth="2"
              fill="none"
            />
            <motion.path
              d="M30 0 Q30 80 30 160"
              stroke="url(#timelineGrad)"
              strokeWidth="2"
              fill="none"
              style={{ pathLength }}
            />
            <defs>
              <linearGradient id="timelineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6c5ce7" />
                <stop offset="50%" stopColor="#00b894" />
                <stop offset="100%" stopColor="#e17055" />
              </linearGradient>
            </defs>
          </svg>

          {timelineData.map((item, i) => (
            <motion.div
              key={i}
              className={`${styles.timelineItem} ${i % 2 === 0 ? styles.timelineLeft : styles.timelineRight}`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* Connector dot */}
              <motion.div
                className={styles.timelineDot}
                style={{ borderColor: item.color, boxShadow: `0 0 20px ${item.color}40` }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              >
                <span>{item.icon}</span>
              </motion.div>

              <div className={styles.timelineCard} style={{ borderTopColor: item.color }}>
                <span className={styles.timelineTime} style={{ color: item.color }}>{item.time}</span>
                <h3 className={styles.timelineTitle}>{item.title}</h3>
                <p className={styles.timelineDesc}>{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== RULES SECTION ===== */}
      <section className={styles.rulesSection}>
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>Rules & Guidelines</h2>
          <p className={styles.sectionSub}>Read carefully before you begin</p>
        </motion.div>

        <motion.div
          className={styles.rulesGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
        >
          {rules.map((rule, i) => (
            <motion.div
              key={i}
              className={styles.ruleItem}
              variants={fadeUp}
              custom={i}
            >
              <div className={styles.ruleNumber}>{String(i + 1).padStart(2, '0')}</div>
              <p>{rule}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== LANGUAGES SECTION ===== */}
      <section className={styles.langSection}>
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>Languages Covered</h2>
          <p className={styles.sectionSub}>Questions span across these technologies</p>
        </motion.div>

        <motion.div
          className={styles.langGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          {[
            { name: 'C++', color: '#00599C', icon: '⚙️' },
            { name: 'JavaScript', color: '#f7df1e', icon: '🟨' },
            { name: 'Python', color: '#3776AB', icon: '🐍' },
            { name: 'HTML', color: '#e34f26', icon: '🌐' },
            { name: 'CSS', color: '#1572B6', icon: '🎨' },
          ].map((lang, i) => (
            <motion.div
              key={i}
              className={styles.langCard}
              variants={fadeUp}
              custom={i}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <span className={styles.langIcon}>{lang.icon}</span>
              <span className={styles.langName}>{lang.name}</span>
              <div className={styles.langBar} style={{ background: lang.color }} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== ORGANIZERS SECTION ===== */}
      <section className={styles.orgSection}>
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>Event Team</h2>
        </motion.div>

        <motion.div
          className={styles.orgGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          {[
            { role: 'Event Convener', names: ['Dr. Sujata Khatri', 'Dr. Bharti'], gradient: 'var(--gradient-1)' },
            { role: 'Event Heads', names: ['Rohan', 'Dev'], gradient: 'var(--gradient-2)' },
            { role: 'Co-Head', names: ['Mantasha'], gradient: 'var(--gradient-3)' },
          ].map((org, i) => (
            <motion.div key={i} className={styles.orgCard} variants={fadeUp} custom={i}>
              <div className={styles.orgRole} style={{ background: org.gradient }}>{org.role}</div>
              {org.names.map((name, j) => (
                <p key={j} className={styles.orgName}>{name}</p>
              ))}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== START QUIZ SECTION ===== */}
      <section className={styles.startSection} id="start-quiz">
        <motion.div
          className={styles.startLeft}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.startTitle}>Ready to Begin?</h2>
          <p className={styles.startDesc}>
            Enter your team name and start the quiz. Make sure you've read all the rules above.
            The timer starts the moment you hit "Start Quiz"!
          </p>
          <div className={styles.startChecks}>
            <div className={styles.checkItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00b894" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Team name decided</span>
            </div>
            <div className={styles.checkItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00b894" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Rules understood</span>
            </div>
            <div className={styles.checkItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00b894" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Fullscreen mode enabled</span>
            </div>
            <div className={styles.checkItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#feca57" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>Tab switch = auto submit</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.startRight}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.quizCard}>
            <div className={styles.quizCardHeader}>
              <div className={styles.quizIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <h3>Start Quiz</h3>
              <p>Round 1 — MCQ Challenge</p>
            </div>

            <form onSubmit={handleStart} className={styles.quizForm}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Team Name</label>
                <input
                  type="text"
                  placeholder="Enter your team name..."
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError('') }}
                  className={`${styles.input} ${error ? styles.inputError : ''}`}
                  maxLength={30}
                />
                {error && (
                  <motion.p
                    className={styles.error}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <motion.button
                type="submit"
                className={styles.startBtn}
                disabled={loading}
                whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(108, 92, 231, 0.5)" }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className={styles.spinner} />
                ) : (
                  <>
                    Start Quiz
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </motion.button>
            </form>

            <p className={styles.quizWarning}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Each team can attempt only once. No retakes allowed.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>Bumble Jumble 2026 — ICT Center</p>
        <p>Organized by the Department of Computer Science</p>
      </footer>
    </div>
  )
}
