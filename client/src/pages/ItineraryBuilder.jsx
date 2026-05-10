import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

export default function ItineraryBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [stops, setStops] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [newStop, setNewStop] = useState({ city: '', country: '', startDate: '', endDate: '', activities: '' , budget: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    axios.get(`http://localhost:3001/api/trips/${JSON.parse(localStorage.getItem('user')).id}`)
      .then(res => {
        const found = res.data.find(t => t.id === id)
        if (found) { setTrip(found); setStops(found.stops || []) }
      })
  }, [id])

  const addStop = () => {
    if (!newStop.city || !newStop.startDate) return
    const stop = {
      id: Date.now().toString(),
      ...newStop,
      activities: newStop.activities.split(',').map(a => a.trim()).filter(Boolean)
    }
    setStops([...stops, stop])
    setNewStop({ city: '', country: '', startDate: '', endDate: '', activities: '', budget: '' })
    setShowForm(false)
  }

  const removeStop = (stopId) => {
    setStops(stops.filter(s => s.id !== stopId))
  }

  const saveItinerary = async () => {
    await axios.put(`http://localhost:3001/api/trips/${id}`, { ...trip, stops })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.logo} onClick={() => navigate('/')}>✈️ Traveloop</h1>
        <div style={styles.navLinks}>
          <button style={styles.navBtn} onClick={() => navigate('/trips')}>My Trips</button>
          {trip && (
            <button style={styles.navBtn} onClick={() => navigate(`/trips/${id}/view`)}>
              👁️ View Itinerary
            </button>
          )}
        </div>
      </div>

      <div style={styles.content}>
        {/* Trip Header */}
        {trip && (
          <div style={styles.tripHeader}>
            <div>
              <h2 style={styles.tripTitle}>✏️ {trip.name}</h2>
              <p style={styles.tripDates}>📅 {trip.startDate} → {trip.endDate}</p>
            </div>
            <div style={styles.headerActions}>
              <button style={styles.saveBtn} onClick={saveItinerary}>
                {saved ? '✅ Saved!' : '💾 Save Itinerary'}
              </button>
              <button style={styles.viewBtn} onClick={() => navigate(`/trips/${id}/view`)}>
                👁️ View
              </button>
              <button style={styles.budgetBtn} onClick={() => navigate(`/trips/${id}/budget`)}>
                💰 Budget
              </button>
            </div>
          </div>
        )}

        {/* Stops List */}
        <div style={styles.stopsSection}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>📍 Trip Stops ({stops.length})</h3>
            <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
              {showForm ? '✕ Cancel' : '+ Add Stop'}
            </button>
          </div>

          {/* Add Stop Form */}
          {showForm && (
            <div style={styles.formCard}>
              <h4 style={styles.formTitle}>Add New Stop</h4>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>City *</label>
                  <input style={styles.input} placeholder="e.g. Paris"
                    value={newStop.city}
                    onChange={e => setNewStop({ ...newStop, city: e.target.value })} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Country</label>
                  <input style={styles.input} placeholder="e.g. France"
                    value={newStop.country}
                    onChange={e => setNewStop({ ...newStop, country: e.target.value })} />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Start Date *</label>
                  <input style={styles.input} type="date"
                    value={newStop.startDate}
                    onChange={e => setNewStop({ ...newStop, startDate: e.target.value })} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>End Date</label>
                  <input style={styles.input} type="date"
                    value={newStop.endDate}
                    onChange={e => setNewStop({ ...newStop, endDate: e.target.value })} />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Activities (comma separated)</label>
                  <input style={styles.input} placeholder="e.g. Eiffel Tower, Louvre, Seine River"
                    value={newStop.activities}
                    onChange={e => setNewStop({ ...newStop, activities: e.target.value })} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Budget (USD)</label>
                  <input style={styles.input} type="number" placeholder="e.g. 500"
                    value={newStop.budget}
                    onChange={e => setNewStop({ ...newStop, budget: e.target.value })} />
                </div>
              </div>
              <button style={styles.addStopBtn} onClick={addStop}>✅ Add This Stop</button>
            </div>
          )}

          {/* Stops Cards */}
          {stops.length === 0 ? (
            <div style={styles.emptyStops}>
              <p style={styles.emptyIcon}>🗺️</p>
              <p>No stops yet! Click "+ Add Stop" to begin building your itinerary.</p>
            </div>
          ) : (
            <div style={styles.stopsList}>
              {stops.map((stop, index) => (
                <div key={stop.id} style={styles.stopCard}>
                  <div style={styles.stopLeft}>
                    <div style={styles.stopNumber}>{index + 1}</div>
                    <div style={styles.stopLine} />
                  </div>
                  <div style={styles.stopContent}>
                    <div style={styles.stopHeader}>
                      <h4 style={styles.stopCity}>
                        📍 {stop.city}{stop.country ? `, ${stop.country}` : ''}
                      </h4>
                      <div style={styles.stopActions}>
                        {stop.budget && (
                          <span style={styles.budgetBadge}>💰 ${stop.budget}</span>
                        )}
                        <button style={styles.removeBtn} onClick={() => removeStop(stop.id)}>🗑️</button>
                      </div>
                    </div>
                    <p style={styles.stopDates}>📅 {stop.startDate} {stop.endDate ? `→ ${stop.endDate}` : ''}</p>
                    {stop.activities?.length > 0 && (
                      <div style={styles.activitiesRow}>
                        {stop.activities.map((act, i) => (
                          <span key={i} style={styles.activityTag}>{act}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Save */}
        {stops.length > 0 && (
          <div style={styles.bottomBar}>
            <p style={styles.bottomText}>{stops.length} stop{stops.length !== 1 ? 's' : ''} added</p>
            <div style={styles.bottomActions}>
              <button style={styles.saveBtn} onClick={saveItinerary}>
                {saved ? '✅ Saved!' : '💾 Save Itinerary'}
              </button>
              <button style={styles.viewBtn} onClick={() => navigate(`/trips/${id}/view`)}>
                👁️ View Full Itinerary
              </button>
            </div>
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
  content: { padding: '32px', maxWidth: '900px', margin: '0 auto' },
  tripHeader: { background: 'white', padding: '24px', borderRadius: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', flexWrap: 'wrap', gap: '16px' },
  tripTitle: { fontSize: '24px', color: '#333' },
  tripDates: { color: '#888', marginTop: '4px' },
  headerActions: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  saveBtn: { padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  viewBtn: { padding: '10px 20px', background: '#f0f4f8', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
  budgetBtn: { padding: '10px 20px', background: '#2ed573', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
  stopsSection: { background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  sectionTitle: { fontSize: '20px', color: '#333' },
  addBtn: { padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  formCard: { background: '#f8f9ff', padding: '24px', borderRadius: '12px', marginBottom: '24px', border: '2px dashed #667eea' },
  formTitle: { fontSize: '16px', color: '#667eea', marginBottom: '16px', fontWeight: 'bold' },
  formRow: { display: 'flex', gap: '16px', marginBottom: '4px', flexWrap: 'wrap' },
  formGroup: { flex: 1, minWidth: '200px' },
  label: { display: 'block', marginBottom: '6px', color: '#555', fontWeight: '600', fontSize: '13px' },
  input: { width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  addStopBtn: { padding: '12px 24px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '8px' },
  emptyStops: { textAlign: 'center', padding: '40px', color: '#888' },
  emptyIcon: { fontSize: '48px', marginBottom: '16px' },
  stopsList: { display: 'flex', flexDirection: 'column', gap: '0' },
  stopCard: { display: 'flex', gap: '0', marginBottom: '8px' },
  stopLeft: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '16px' },
  stopNumber: { width: '36px', height: '36px', background: '#667eea', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 },
  stopLine: { width: '2px', background: '#e0e0e0', flex: 1, marginTop: '4px' },
  stopContent: { background: '#f8f9ff', padding: '16px', borderRadius: '12px', flex: 1, marginBottom: '8px' },
  stopHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  stopCity: { fontSize: '18px', color: '#333', fontWeight: 'bold' },
  stopActions: { display: 'flex', gap: '8px', alignItems: 'center' },
  budgetBadge: { background: '#2ed573', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  removeBtn: { background: '#ff4757', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: 'white' },
  stopDates: { color: '#888', fontSize: '13px', marginBottom: '8px' },
  activitiesRow: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  activityTag: { background: '#667eea22', color: '#667eea', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
  bottomBar: { background: 'white', padding: '20px 24px', borderRadius: '16px', marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  bottomText: { color: '#888', fontWeight: '500' },
  bottomActions: { display: 'flex', gap: '12px' },
}const suggestStyle = {
  box: { background: '#fff8f0', border: '1px solid #FF6B3540', borderRadius: '10px', padding: '14px', marginBottom: '12px' },
  title: { color: '#FF6B35', fontSize: '13px', fontWeight: 600, marginBottom: '10px' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  tag: { background: 'white', border: '1px solid #FF6B35', color: '#FF6B35', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', fontWeight: 500 }
}