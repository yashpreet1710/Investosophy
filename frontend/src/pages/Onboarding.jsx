 
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const slides = [
  {
    emoji: '📈',
    title: 'Welcome to InvestIQ',
    desc: 'Your personal investment learning and portfolio tracking app made for Indian investors.',
  },
  {
    emoji: '🇮🇳',
    title: 'NSE & BSE Data',
    desc: 'Track real-time Nifty 50, Sensex, and your favourite Indian stocks — all in one place.',
  },
  {
    emoji: '🎓',
    title: 'Learn as You Invest',
    desc: 'Get personalized learning content based on your experience level. From beginner to expert!',
  },
]

const levels = [
  { key: 'beginner', label: 'Complete Beginner', emoji: '🌱', desc: 'New to stocks and investing' },
  { key: 'intermediate_beginner', label: 'Beginner', emoji: '📚', desc: 'Know the basics' },
  { key: 'intermediate', label: 'Intermediate', emoji: '📊', desc: 'Comfortable with markets' },
  { key: 'experienced', label: 'Experienced', emoji: '🚀', desc: 'Active investor' },
]

export default function Onboarding() {
  const [slide, setSlide] = useState(0)
  const [showLevels, setShowLevels] = useState(false)
  const { saveLevel } = useUser()
  const navigate = useNavigate()

  const handleLevel = (level) => {
    saveLevel(level)
    navigate('/markets')
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {!showLevels ? (
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '80px', marginBottom: '24px' }}>{slides[slide].emoji}</div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
            {slides[slide].title}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '16px', lineHeight: '1.6', marginBottom: '40px' }}>
            {slides[slide].desc}
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '32px' }}>
            {slides.map((_, i) => (
              <div key={i} style={{
                width: i === slide ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: i === slide ? 'var(--green)' : 'var(--muted)',
                transition: 'all 0.3s',
              }} />
            ))}
          </div>
          <button onClick={() => {
            if (slide < slides.length - 1) setSlide(slide + 1)
            else setShowLevels(true)
          }} style={{
            backgroundColor: 'var(--green)',
            color: '#000',
            border: 'none',
            borderRadius: '12px',
            padding: '14px 40px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            width: '100%',
          }}>
            {slide < slides.length - 1 ? 'Next →' : 'Get Started'}
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', maxWidth: '480px', width: '100%' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
            What's your experience level?
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>
            We'll personalize your experience based on this
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {levels.map((level) => (
              <button key={level.key} onClick={() => handleLevel(level.key)} style={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--muted)',
                borderRadius: '12px',
                padding: '16px 20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                textAlign: 'left',
                transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--green)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--muted)'}
              >
                <span style={{ fontSize: '32px' }}>{level.emoji}</span>
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--text)' }}>{level.label}</div>
                  <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{level.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}