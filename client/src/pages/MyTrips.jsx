import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function MyTrips() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    axios.get(`http://localhost:3001/api/trips/${user.id}`)
      .then(res => { setTrips(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const deleteTrip = async (id) => {
    if (!window.confirm('Delete this trip?')) return
    await axios.delete(`http://localhost:3001/api/trips/${id}`)
    setTrips(trips.filter(t => t.id !== id))
  }

  const getDays = (start, end) => {
    const diff = new Date(end) - new Date(start)
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.logo} onClick={() => navigate('/')}>✈️ Traveloop</h1>
        <div style={styles.navLinks}>
          <button style={styles.navBtn} onClick={() => navigate('/')}>Dashboard</button>
          <button style={styles.createBtn} onClick={() => navigate('/trips/new')}>+ New Trip</button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.header}>
          <h2 style={styles.title}>🧳 My Trips</h2>
          <p style={styles.subtitle}>{trips.length} trip{trips.length !== 1 ? 's' : ''} planned</p>
        </div>

        {loading ? (
          <p style={styles.loading}>Loading trips...</p>
        ) : trips.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={styles.emptyIcon}>🌍</p>
            <h3>No trips yet!</h3>
            <p style={styles.emptyText}>Start planning your first adventure</p>
            <button style={styles.createBtn} onClick={() => navigate('/trips/new')}>
              + Create First Trip
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {trips.map(trip => (
              <div key={trip.id} style={styles.card}>
                {/* Card Header */}
                <div style={styles.cardHeader}>
                  <h3 style={styles.tripName}>{trip.name}</h3>
                  <span style={styles.daysBadge}>
                    {getDays(trip.startDate, trip.endDate)} days
                  </span>
                </div>

                {/* Card Info */}
                <p style={styles.tripDate}>📅 {trip.startDate} → {trip.endDate}</p>
                <p style={styles.tripStops}>📍 {trip.stops?.length || 0} stops added</p>
                {trip.description && (
                  <p style={styles.tripDesc}>{trip.description}</p>
                )}

                {/* Card Actions */}
                <div style={styles.actions}>
                  <button
                    style={styles.viewBtn}
                    onClick={() => navigate(`/trips/${trip.id}/view`)}
                  >
                    👁️ View
                  </button>
                  <button
                    style={styles.buildBtn}
                    onClick={() => navigate(`/trips/${trip.id}/build`)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    style={styles.budgetBtn}
                    onClick={() => navigate(`/trips/${trip.id}/budget`)}
                  >
                    💰 Budget
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteTrip(trip.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#f0f4f8' },
  navbar: { background: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  logo: { color: '#667eea', fontSize: '24px', cursor: 'pointer' },
  navLinks: { display: 'flex', gap: '12px' },
  navBtn: { padding: '8px 16px', background: '#f0f4f8', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#333', fontWeight: '500' },
  createBtn: { padding: '8px 16px', background: '#667eea', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'white', fontWeight: '500' },
  content: { padding: '32px' },
  header: { marginBottom: '24px' },
  title: { fontSize: '28px', color: '#333' },
  subtitle: { color: '#888', marginTop: '4px' },
  loading: { textAlign: 'center', color: '#888', padding: '40px' },
  emptyBox: { background: 'white', padding: '60px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  emptyIcon: { fontSize: '48px', marginBottom: '16px' },
  emptyText: { color: '#888', marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  card: { background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  tripName: { fontSize: '20px', color: '#333', fontWeight: 'bold' },
  daysBadge: { background: '#667eea', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  tripDate: { color: '#888', fontSize: '14px', marginBottom: '6px' },
  tripStops: { color: '#667eea', fontSize: '14px', marginBottom: '8px' },
  tripDesc: { color: '#666', fontSize: '13px', marginBottom: '16px', fontStyle: 'italic' },
  actions: { display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' },
  viewBtn: { padding: '8px 12px', background: '#f0f4f8', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
  buildBtn: { padding: '8px 12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
  budgetBtn: { padding: '8px 12px', background: '#2ed573', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
  deleteBtn: { padding: '8px 12px', background: '#ff4757', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
}