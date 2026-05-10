import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const INDIA_DESTINATIONS = [
  { name: 'Rajasthan', emoji: '🏰', desc: 'Land of Kings', color: '#FF6B35', places: ['Jaipur', 'Udaipur', 'Jodhpur'] },
  { name: 'Kerala', emoji: '🌴', desc: 'God\'s Own Country', color: '#2ecc71', places: ['Munnar', 'Alleppey', 'Kovalam'] },
  { name: 'Goa', emoji: '🏖️', desc: 'Beach Paradise', color: '#3498db', places: ['Baga', 'Anjuna', 'Palolem'] },
  { name: 'Himachal', emoji: '🏔️', desc: 'Land of Snow', color: '#9b59b6', places: ['Manali', 'Shimla', 'Dharamshala'] },
  { name: 'Varanasi', emoji: '🛕', desc: 'Spiritual Capital', color: '#e67e22', places: ['Ghats', 'Kashi', 'Sarnath'] },
  { name: 'Agra', emoji: '🕌', desc: 'City of Taj', color: '#e74c3c', places: ['Taj Mahal', 'Agra Fort', 'Fatehpur'] },
]

export default function Dashboard() {
  const [trips, setTrips] = useState([])
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    axios.get(`http://localhost:3001/api/trips/${user.id}`)
      .then(res => setTrips(res.data))
  }, [])

  const logout = () => { localStorage.removeItem('user'); navigate('/login') }

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        .dest-card:hover { transform: translateY(-6px) scale(1.02) !important; box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important; }
        .trip-card:hover { transform: translateY(-4px) !important; box-shadow: 0 16px 35px rgba(0,0,0,0.12) !important; }
        .nav-btn:hover { background: rgba(255,107,53,0.1) !important; color: #FF6B35 !important; }
        .plan-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(255,107,53,0.4) !important; }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
      `}</style>

      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.navLogo}>
          <span style={{ fontSize: '24px' }}>🇮🇳</span>
          <h1 style={styles.logo}>Traveloop</h1>
        </div>
        <div style={styles.navLinks}>
          <button className="nav-btn" style={styles.navBtn} onClick={() => navigate('/trips')}>My Trips</button>
          <button className="nav-btn" style={styles.navBtn} onClick={() => navigate('/trips/new')}>+ New Trip</button>
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent} className="fade-up">
          <p style={styles.heroTag}>🇮🇳 Incredible India Awaits</p>
          <h2 style={styles.heroTitle}>Namaste, {user?.name}! 🙏</h2>
          <p style={styles.heroSub}>From the snow-capped Himalayas to the sun-kissed beaches of Goa</p>
          <button className="plan-btn" style={styles.heroBtn} onClick={() => navigate('/trips/new')}>
            🗺️ Plan Your Indian Adventure
          </button>
        </div>
        {/* Decorative elements */}
        <div style={styles.heroDeco1}>✦</div>
        <div style={styles.heroDeco2}>🕌</div>
        <div style={styles.heroDeco3}>🌸</div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        {[
          { num: trips.length, label: 'Trips Planned', icon: '✈️' },
          { num: trips.filter(t => new Date(t.startDate) > new Date()).length, label: 'Upcoming', icon: '📅' },
          { num: trips.reduce((a, t) => a + (t.stops?.length || 0), 0), label: 'Cities Visited', icon: '📍' },
          { num: '29', label: 'States to Explore', icon: '🗺️' },
        ].map((s, i) => (
          <div key={i} style={{ ...styles.statCard, animationDelay: `${i * 0.1}s` }} className="fade-up">
            <span style={styles.statIcon}>{s.icon}</span>
            <h2 style={styles.statNum}>{s.num}</h2>
            <p style={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Trips */}
      {trips.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🧳 Recent Trips</h3>
          <div style={styles.tripGrid}>
            {trips.slice(0, 3).map(trip => (
              <div key={trip.id} className="trip-card" style={styles.tripCard}
                onClick={() => navigate(`/trips/${trip.id}/view`)}>
                <div style={styles.tripCardTop}>
                  <h4 style={styles.tripName}>{trip.name}</h4>
                  <span style={styles.tripBadge}>{trip.stops?.length || 0} stops</span>
                </div>
                <p style={styles.tripDate}>📅 {trip.startDate} → {trip.endDate}</p>
                <p style={styles.tripDesc}>{trip.description || 'Tap to view itinerary'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Destinations */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🌟 Popular Indian Destinations</h3>
        <div style={styles.destGrid}>
          {INDIA_DESTINATIONS.map((dest, i) => (
            <div key={dest.name} className="dest-card" style={{ ...styles.destCard, animationDelay: `${i * 0.1}s` }}
              onClick={() => navigate('/trips/new')}>
              <div style={{ ...styles.destEmoji, background: dest.color + '22' }}>{dest.emoji}</div>
              <h4 style={styles.destName}>{dest.name}</h4>
              <p style={styles.destDesc}>{dest.desc}</p>
              <div style={styles.destPlaces}>
                {dest.places.map(p => (
                  <span key={p} style={{ ...styles.placeTag, borderColor: dest.color, color: dest.color }}>{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      {trips.length === 0 && (
        <div style={styles.ctaBanner}>
          <h3 style={styles.ctaTitle}>Ready to explore India? 🚀</h3>
          <p style={styles.ctaSub}>Create your first trip and discover the magic of Incredible India</p>
          <button style={styles.ctaBtn} onClick={() => navigate('/trips/new')}>Start Planning Now</button>
        </div>
      )}

      <div style={styles.footer}>
        <p>Made with ❤️ for Indian travelers • Traveloop 2025</p>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#faf8f5', fontFamily: 'Poppins, sans-serif' },
  navbar: { background: 'white', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 15px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 },
  navLogo: { display: 'flex', alignItems: 'center', gap: '10px' },
  logo: { fontFamily: 'Playfair Display, serif', color: '#1a0533', fontSize: '22px', margin: 0 },
  navLinks: { display: 'flex', gap: '10px', alignItems: 'center' },
  navBtn: { padding: '8px 18px', background: 'transparent', border: '1px solid #eee', borderRadius: '8px', cursor: 'pointer', color: '#555', fontWeight: 500, fontFamily: 'Poppins', transition: 'all 0.2s' },
  logoutBtn: { padding: '8px 18px', background: '#1a0533', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'white', fontWeight: 500, fontFamily: 'Poppins' },
  hero: { position: 'relative', background: 'linear-gradient(135deg, #1a0533 0%, #6B1E3E 50%, #FF6B35 100%)', padding: '80px 32px', overflow: 'hidden', textAlign: 'center' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'url("https://www.transparenttextures.com/patterns/batik.png")', opacity: 0.06 },
  heroContent: { position: 'relative', zIndex: 1 },
  heroTag: { display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: 'white', padding: '6px 18px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, marginBottom: '16px', letterSpacing: '1px' },
  heroTitle: { fontFamily: 'Playfair Display, serif', fontSize: '44px', color: 'white', margin: '0 0 12px', lineHeight: 1.2 },
  heroSub: { color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' },
  heroBtn: { padding: '16px 36px', background: 'white', color: '#FF6B35', border: 'none', borderRadius: '30px', fontSize: '16px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Poppins', transition: 'all 0.3s' },
  heroDeco1: { position: 'absolute', top: '20px', left: '5%', color: 'rgba(255,255,255,0.2)', fontSize: '60px' },
  heroDeco2: { position: 'absolute', bottom: '20px', right: '8%', fontSize: '50px', opacity: 0.3 },
  heroDeco3: { position: 'absolute', top: '30px', right: '15%', fontSize: '40px', opacity: 0.4 },
  statsRow: { display: 'flex', gap: '16px', padding: '24px 32px', justifyContent: 'center', flexWrap: 'wrap' },
  statCard: { background: 'white', padding: '24px 32px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', minWidth: '140px' },
  statIcon: { fontSize: '28px', display: 'block', marginBottom: '8px' },
  statNum: { fontSize: '32px', color: '#FF6B35', fontWeight: 700, margin: 0 },
  statLabel: { color: '#888', marginTop: '4px', fontSize: '13px' },
  section: { padding: '0 32px 40px' },
  sectionTitle: { fontSize: '22px', fontFamily: 'Playfair Display, serif', color: '#1a0533', marginBottom: '20px' },
  tripGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  tripCard: { background: 'white', padding: '22px', borderRadius: '16px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', transition: 'all 0.3s' },
  tripCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  tripName: { fontSize: '18px', color: '#1a0533', fontWeight: 600, margin: 0 },
  tripBadge: { background: '#FF6B3520', color: '#FF6B35', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 },
  tripDate: { color: '#888', fontSize: '13px', marginBottom: '6px' },
  tripDesc: { color: '#aaa', fontSize: '13px', fontStyle: 'italic' },
  destGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' },
  destCard: { background: 'white', padding: '22px', borderRadius: '16px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', transition: 'all 0.3s', textAlign: 'center' },
  destEmoji: { width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', margin: '0 auto 14px' },
  destName: { fontFamily: 'Playfair Display, serif', fontSize: '18px', color: '#1a0533', margin: '0 0 4px' },
  destDesc: { color: '#888', fontSize: '12px', marginBottom: '12px' },
  destPlaces: { display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' },
  placeTag: { border: '1px solid', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 500 },
  ctaBanner: { margin: '0 32px 40px', background: 'linear-gradient(135deg, #1a0533, #6B1E3E)', padding: '48px', borderRadius: '20px', textAlign: 'center', color: 'white' },
  ctaTitle: { fontFamily: 'Playfair Display, serif', fontSize: '28px', marginBottom: '12px' },
  ctaSub: { color: 'rgba(255,255,255,0.7)', marginBottom: '28px' },
  ctaBtn: { padding: '14px 36px', background: '#FF6B35', color: 'white', border: 'none', borderRadius: '30px', fontSize: '16px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Poppins' },
  footer: { textAlign: 'center', padding: '24px', color: '#aaa', fontSize: '13px', borderTop: '1px solid #eee' }
}