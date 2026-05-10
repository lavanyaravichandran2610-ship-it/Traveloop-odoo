import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

export default function ItineraryView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [viewMode, setViewMode] = useState('timeline')

  useEffect(() => {
    axios.get(`http://localhost:3001/api/trips/${JSON.parse(localStorage.getItem('user')).id}`)
      .then(res => {
        const found = res.data.find(t => t.id === id)
        if (found) setTrip(found)
      })
  }, [id])

  const getDays = (start, end) => {
    if (!start || !end) return 0
    const diff = new Date(end) - new Date(start)
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const getTotalBudget = () => {
    if (!trip?.stops) return 0
    return trip.stops.reduce((acc, s) => acc + (parseFloat(s.budget) || 0), 0)
  }

  if (!trip) return (
    <div style={styles.loading}>
      <p>Loading itinerary... ✈️</p>
    </div>
  )

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.logo} onClick={() => navigate('/')}>✈️ Traveloop</h1>
        <div style={styles.navLinks}>
          <button style={styles.navBtn} onClick={() => navigate('/trips')}>My Trips</button>
          <button style={styles.editBtn} onClick={() => navigate(`/trips/${id}/build`)}>✏️ Edit</button>
          <button style={styles.budgetBtn} onClick={() => navigate(`/trips/${id}/budget`)}>💰 Budget</button>
        </div>
      </div>

      {/* Trip Hero */}
      <div style={styles.hero}>
        <h2 style={styles.heroTitle}>{trip.name}</h2>
        <p style={styles.heroSub}>📅 {trip.startDate} → {trip.endDate}</p>
        {trip.description && <p style={styles.heroDesc}>{trip.description}</p>}

        {/* Stats Row */}
        <div style={styles.statsRow}>
          <div style={styles.statBox}>
            <span style={styles.statNum}>{trip.stops?.length || 0}</span>
            <span style={styles.statLabel}>Cities</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statNum}>{getDays(trip.startDate, trip.endDate)}</span>
            <span style={styles.statLabel}>Days</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statNum}>
              {trip.stops?.reduce((acc, s) => acc + (s.activities?.length || 0), 0) || 0}
            </span>
            <span style={styles.statLabel}>Activities</span>
          </div>
          <div style={styles.statBox}>
            <span style={styles.statNum}>${getTotalBudget()}</span>
            <span style={styles.statLabel}>Budget</span>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div style={styles.toggleRow}>
        <button
          style={viewMode === 'timeline' ? styles.activeToggle : styles.toggle}
          onClick={() => setViewMode('timeline')}
        >📅 Timeline View</button>
        <button
          style={viewMode === 'list' ? styles.activeToggle : styles.toggle}
          onClick={() => setViewMode('list')}
        >📋 List View</button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {trip.stops?.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={styles.emptyIcon}>🗺️</p>
            <h3>No stops added yet!</h3>
            <p style={styles.emptyText}>Go to the builder to add cities and activities</p>
            <button style={styles.editBtn} onClick={() => navigate(`/trips/${id}/build`)}>
              ✏️ Build Itinerary
            </button>
          </div>
        ) : viewMode === 'timeline' ? (
          <div style={styles.timeline}>
            {trip.stops?.map((stop, index) => (
              <div key={stop.id} style={styles.timelineItem}>
                {/* Left: Date */}
                <div style={styles.timelineLeft}>
                  <p style={styles.timelineDate}>{stop.startDate}</p>
                  {stop.endDate && <p style={styles.timelineDateEnd}>{stop.endDate}</p>}
                  <p style={styles.timelineDays}>
                    {getDays(stop.startDate, stop.endDate)} days
                  </p>
                </div>

                {/* Center: Line */}
                <div style={styles.timelineCenter}>
                  <div style={styles.timelineDot} />
                  {index < trip.stops.length - 1 && <div style={styles.timelineConnector} />}
                </div>

                {/* Right: Card */}
                <div style={styles.timelineCard}>
                  <div style={styles.cardTop}>
                    <h3 style={styles.cityName}>
                      📍 {stop.city}{stop.country ? `, ${stop.country}` : ''}
                    </h3>
                    {stop.budget && (
                      <span style={styles.budgetBadge}>💰 ${stop.budget}</span>
                    )}
                  </div>

                  {stop.activities?.length > 0 && (
                    <div style={styles.activitiesSection}>
                      <p style={styles.activitiesTitle}>🎯 Activities:</p>
                      <div style={styles.activitiesGrid}>
                        {stop.activities.map((act, i) => (
                          <div key={i} style={styles.activityItem}>
                            <span style={styles.activityDot}>•</span>
                            <span>{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div style={styles.listView}>
            {trip.stops?.map((stop, index) => (
              <div key={stop.id} style={styles.listCard}>
                <div style={styles.listNumber}>{index + 1}</div>
                <div style={styles.listContent}>
                  <div style={styles.listHeader}>
                    <h3 style={styles.listCity}>
                      📍 {stop.city}{stop.country ? `, ${stop.country}` : ''}
                    </h3>
                    {stop.budget && (
                      <span style={styles.budgetBadge}>💰 ${stop.budget}</span>
                    )}
                  </div>
                  <p style={styles.listDates}>
                    📅 {stop.startDate} {stop.endDate ? `→ ${stop.endDate}` : ''}
                    {stop.startDate && stop.endDate && ` (${getDays(stop.startDate, stop.endDate)} days)`}
                  </p>
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

      {/* Bottom Actions */}
      <div style={styles.bottomBar}>
        <button style={styles.editBtn} onClick={() => navigate(`/trips/${id}/build`)}>
          ✏️ Edit Itinerary
        </button>
        <button style={styles.budgetFullBtn} onClick={() => navigate(`/trips/${id}/budget`)}>
          💰 View Budget Breakdown
        </button>
        <button style={styles.shareBtn} onClick={() => {
          navigator.clipboard.writeText(window.location.href)
          alert('Link copied to clipboard!')
        }}>
          🔗 Share Trip
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#f0f4f8' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px' },
  navbar: { background: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  logo: { color: '#667eea', fontSize: '24px', cursor: 'pointer' },
  navLinks: { display: 'flex', gap: '12px' },
  navBtn: { padding: '8px 16px', background: '#f0f4f8', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#333', fontWeight: '500' },
  editBtn: { padding: '8px 16px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
  budgetBtn: { padding: '8px 16px', background: '#2ed573', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
  hero: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '48px 32px', color: 'white', textAlign: 'center' },
  heroTitle: { fontSize: '36px', marginBottom: '8px' },
  heroSub: { fontSize: '16px', opacity: 0.9, marginBottom: '8px' },
  heroDesc: { fontSize: '14px', opacity: 0.8, marginBottom: '24px', fontStyle: 'italic' },
  statsRow: { display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap' },
  statBox: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNum: { fontSize: '28px', fontWeight: 'bold' },
  statLabel: { fontSize: '12px', opacity: 0.8, marginTop: '4px' },
  toggleRow: { display: 'flex', justifyContent: 'center', gap: '12px', padding: '24px 32px 0' },
  toggle: { padding: '10px 24px', background: 'white', border: '2px solid #ddd', borderRadius: '25px', cursor: 'pointer', fontWeight: '500', color: '#666' },
  activeToggle: { padding: '10px 24px', background: '#667eea', border: '2px solid #667eea', borderRadius: '25px', cursor: 'pointer', fontWeight: '500', color: 'white' },
  content: { padding: '24px 32px', maxWidth: '900px', margin: '0 auto' },
  emptyBox: { background: 'white', padding: '60px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  emptyIcon: { fontSize: '48px', marginBottom: '16px' },
  emptyText: { color: '#888', marginBottom: '24px' },
  timeline: { paddingTop: '16px' },
  timelineItem: { display: 'flex', gap: '0', marginBottom: '8px' },
  timelineLeft: { width: '100px', textAlign: 'right', paddingRight: '16px', flexShrink: 0 },
  timelineDate: { color: '#667eea', fontWeight: 'bold', fontSize: '13px' },
  timelineDateEnd: { color: '#999', fontSize: '12px' },
  timelineDays: { color: '#aaa', fontSize: '11px', marginTop: '4px' },
  timelineCenter: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '16px' },
  timelineDot: { width: '16px', height: '16px', background: '#667eea', borderRadius: '50%', flexShrink: 0, marginTop: '4px' },
  timelineConnector: { width: '2px', background: '#667eea44', flex: 1, marginTop: '4px', minHeight: '40px' },
  timelineCard: { background: 'white', padding: '20px', borderRadius: '12px', flex: 1, boxShadow: '0 4px 15px rgba(0,0,0,0.08)', marginBottom: '16px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  cityName: { fontSize: '20px', color: '#333', fontWeight: 'bold' },
  budgetBadge: { background: '#2ed573', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' },
  activitiesSection: { marginTop: '8px' },
  activitiesTitle: { color: '#888', fontSize: '13px', marginBottom: '8px', fontWeight: '600' },
  activitiesGrid: { display: 'flex', flexDirection: 'column', gap: '4px' },
  activityItem: { display: 'flex', gap: '8px', color: '#555', fontSize: '14px' },
  activityDot: { color: '#667eea', fontWeight: 'bold' },
  listView: { display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '16px' },
  listCard: { background: 'white', padding: '20px', borderRadius: '12px', display: 'flex', gap: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  listNumber: { width: '40px', height: '40px', background: '#667eea', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 },
  listContent: { flex: 1 },
  listHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  listCity: { fontSize: '18px', color: '#333', fontWeight: 'bold' },
  listDates: { color: '#888', fontSize: '13px', marginBottom: '10px' },
  activitiesRow: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  activityTag: { background: '#667eea22', color: '#667eea', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
  bottomBar: { display: 'flex', justifyContent: 'center', gap: '16px', padding: '24px 32px', flexWrap: 'wrap' },
  budgetFullBtn: { padding: '12px 24px', background: '#2ed573', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  shareBtn: { padding: '12px 24px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
}