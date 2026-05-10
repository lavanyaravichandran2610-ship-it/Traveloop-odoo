import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const landmarks = ['🕌', '🏯', '⛩️', '🕍', '🛕']
const floatingCities = ['Mumbai', 'Delhi', 'Jaipur', 'Kerala', 'Goa', 'Varanasi', 'Agra', 'Udaipur']

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const url = isLogin ? 'http://localhost:3001/api/login' : 'http://localhost:3001/api/signup'
      const res = await axios.post(url, form)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;500;600&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes drift { 0%{transform:translateX(0) translateY(0)} 25%{transform:translateX(30px) translateY(-20px)} 50%{transform:translateX(60px) translateY(10px)} 75%{transform:translateX(20px) translateY(30px)} 100%{transform:translateX(0) translateY(0)} }
        .city-pill { animation: drift linear infinite; opacity: 0.18; }
        .card-in { animation: fadeIn 0.7s ease forwards; }
        input:focus { border-color: #FF6B35 !important; box-shadow: 0 0 0 3px rgba(255,107,53,0.15) !important; outline: none; }
        .login-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(255,107,53,0.4) !important; }
        .tab-btn:hover { background: rgba(255,107,53,0.1) !important; }
      `}</style>

      {/* Floating city pills */}
      {floatingCities.map((city, i) => (
        <div key={city} className="city-pill" style={{
          position: 'fixed', color: 'white', fontFamily: 'Poppins', fontWeight: 600,
          fontSize: '13px', padding: '6px 14px', borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.3)',
          left: `${(i * 13) % 90}%`, top: `${(i * 17 + 5) % 85}%`,
          animationDuration: `${8 + i * 2}s`, animationDelay: `${i * 0.8}s`,
          pointerEvents: 'none', zIndex: 0
        }}>{city}</div>
      ))}

      {/* Background */}
      <div style={styles.bg} />

      {/* Card */}
      <div className="card-in" style={styles.card}>
        {/* Logo */}
        <div style={styles.logoRow}>
          <span style={styles.logoIcon}>🇮🇳</span>
          <div>
            <h1 style={styles.logo}>Traveloop</h1>
            <p style={styles.logoSub}>Explore Incredible India</p>
          </div>
        </div>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>✦ ✦ ✦</span>
          <div style={styles.dividerLine} />
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button className="tab-btn" style={isLogin ? styles.activeTab : styles.tab} onClick={() => { setIsLogin(true); setError('') }}>Login</button>
          <button className="tab-btn" style={!isLogin ? styles.activeTab : styles.tab} onClick={() => { setIsLogin(false); setError('') }}>Sign Up</button>
        </div>

        {!isLogin && (
          <input style={styles.input} placeholder="Full Name" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} />
        )}
        <input style={styles.input} placeholder="Email address" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <input style={styles.input} placeholder="Password" type="password" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} />

        {error && <p style={styles.error}>⚠️ {error}</p>}

        <button className="login-btn" style={styles.btn} onClick={handleSubmit}>
          {loading ? '...' : isLogin ? '🚀 Login & Explore' : '🎉 Create Account'}
        </button>

        <p style={styles.footerText}>
          Discover the beauty of India — from the Himalayas to Kanyakumari 🌄
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', fontFamily: 'Poppins, sans-serif' },
  bg: { position: 'fixed', inset: 0, background: 'linear-gradient(135deg, #1a0533 0%, #6B1E3E 40%, #FF6B35 100%)', zIndex: -1 },
  card: { background: 'rgba(255,255,255,0.97)', padding: '40px 36px', borderRadius: '24px', width: '100%', maxWidth: '420px', boxShadow: '0 30px 80px rgba(0,0,0,0.35)', zIndex: 1, position: 'relative' },
  logoRow: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', justifyContent: 'center' },
  logoIcon: { fontSize: '44px' },
  logo: { fontFamily: 'Playfair Display, serif', fontSize: '30px', color: '#1a0533', margin: 0, lineHeight: 1 },
  logoSub: { fontSize: '12px', color: '#FF6B35', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' },
  divider: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' },
  dividerLine: { flex: 1, height: '1px', background: '#eee' },
  dividerText: { color: '#FF6B35', fontSize: '12px' },
  tabs: { display: 'flex', marginBottom: '20px', borderRadius: '10px', overflow: 'hidden', border: '2px solid #f0f0f0' },
  tab: { flex: 1, padding: '11px', border: 'none', background: 'white', color: '#888', cursor: 'pointer', fontSize: '14px', fontWeight: 500, fontFamily: 'Poppins', transition: 'all 0.2s' },
  activeTab: { flex: 1, padding: '11px', border: 'none', background: 'linear-gradient(135deg, #FF6B35, #6B1E3E)', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'Poppins' },
  input: { width: '100%', padding: '13px 16px', marginBottom: '14px', border: '2px solid #f0f0f0', borderRadius: '10px', fontSize: '14px', fontFamily: 'Poppins', boxSizing: 'border-box', transition: 'all 0.2s', display: 'block' },
  btn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #FF6B35, #6B1E3E)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Poppins', transition: 'all 0.3s', marginBottom: '16px' },
  error: { color: '#e74c3c', fontSize: '13px', marginBottom: '12px', textAlign: 'center', background: '#fff5f5', padding: '8px', borderRadius: '8px' },
  footerText: { textAlign: 'center', color: '#aaa', fontSize: '12px', lineHeight: 1.6 }
}