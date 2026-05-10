import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function CreateTrip() {
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '', description: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleSubmit = async () => {
    if (!form.name || !form.startDate || !form.endDate) {
      setError('Please fill in all required fields!')
      return
    }
    try {
      const res = await axios.post('http://localhost:3001/api/trips', {
        ...form,
        userId: user.id
      })
      navigate(`/trips/${res.data.id}/build`)
    } catch (err) {
      setError('Something went wrong. Try again!')
    }
  }

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.logo} onClick={() => navigate('/')}>✈️ Traveloop</h1>
        <button style={styles.backBtn} onClick={() => navigate('/')}>← Back</button>
      </div>

      {/* Form */}
      <div style={styles.formWrapper}>
        <div style={styles.card}>
          <h2 style={styles.title}>🗺️ Plan a New Trip</h2>
          <p style={styles.subtitle}>Fill in the details to start your adventure</p>

          <label style={styles.label}>Trip Name *</label>
          <input
            style={styles.input}
            placeholder="e.g. Europe Summer 2025"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <label style={styles.label}>Start Date *</label>
          <input
            style={styles.input}
            type="date"
            value={form.startDate}
            onChange={e => setForm({ ...form, startDate: e.target.value })}
          />

          <label style={styles.label}>End Date *</label>
          <input
            style={styles.input}
            type="date"
            value={form.endDate}
            onChange={e => setForm({ ...form, endDate: e.target.value })}
          />

          <label style={styles.label}>Description</label>
          <textarea
            style={styles.textarea}
            placeholder="What's this trip about? Any special plans?"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.btn} onClick={handleSubmit}>
            🚀 Create Trip & Add Stops
          </button>

          <button style={styles.cancelBtn} onClick={() => navigate('/')}>
            Cancel
          </button>
        </div>

        {/* Tips Card */}
        <div style={styles.tipsCard}>
          <h3 style={styles.tipsTitle}>💡 Planning Tips</h3>
          <div style={styles.tip}>
            <span style={styles.tipIcon}>📅</span>
            <p>Book flights and hotels at least 2 months in advance for best prices</p>
          </div>
          <div style={styles.tip}>
            <span style={styles.tipIcon}>🌍</span>
            <p>Add multiple city stops to create a multi-city itinerary</p>
          </div>
          <div style={styles.tip}>
            <span style={styles.tipIcon}>💰</span>
            <p>Set a budget for each stop to track your expenses</p>
          </div>
          <div style={styles.tip}>
            <span style={styles.tipIcon}>🎯</span>
            <p>Add activities to each stop to make the most of your trip</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#f0f4f8' },
  navbar: { background: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  logo: { color: '#667eea', fontSize: '24px', cursor: 'pointer' },
  backBtn: { padding: '8px 16px', background: '#f0f4f8', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#333', fontWeight: '500' },
  formWrapper: { display: 'flex', gap: '24px', padding: '40px 32px', maxWidth: '900px', margin: '0 auto', flexWrap: 'wrap' },
  card: { background: 'white', padding: '32px', borderRadius: '16px', flex: 1, minWidth: '300px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  title: { fontSize: '26px', color: '#333', marginBottom: '8px' },
  subtitle: { color: '#888', marginBottom: '24px' },
  label: { display: 'block', marginBottom: '6px', color: '#555', fontWeight: '600', fontSize: '14px' },
  input: { width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '12px', marginBottom: '16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', height: '100px', resize: 'vertical', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '14px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '12px' },
  cancelBtn: { width: '100%', padding: '14px', background: 'white', color: '#667eea', border: '2px solid #667eea', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' },
  error: { color: 'red', fontSize: '13px', marginBottom: '12px', textAlign: 'center' },
  tipsCard: { background: 'white', padding: '32px', borderRadius: '16px', width: '280px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', height: 'fit-content' },
  tipsTitle: { fontSize: '18px', color: '#333', marginBottom: '20px' },
  tip: { display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'flex-start' },
  tipIcon: { fontSize: '20px' },
}