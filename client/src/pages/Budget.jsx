import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts'

export default function Budget() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [totalBudget, setTotalBudget] = useState(0)
  const [chartType, setChartType] = useState('pie')

  useEffect(() => {
    axios.get(`http://localhost:3001/api/trips/${JSON.parse(localStorage.getItem('user')).id}`)
      .then(res => {
        const found = res.data.find(t => t.id === id)
        if (found) {
          setTrip(found)
          const total = found.stops?.reduce((acc, s) => acc + (parseFloat(s.budget) || 0), 0)
          setTotalBudget(total || 0)
        }
      })
  }, [id])

  const COLORS = ['#667eea', '#2ed573', '#ff6b6b', '#ffa502', '#a29bfe', '#fd79a8', '#00cec9', '#fdcb6e']

  const pieData = trip?.stops
    ?.filter(s => parseFloat(s.budget) > 0)
    ?.map((s, i) => ({
      name: s.city,
      value: parseFloat(s.budget),
      color: COLORS[i % COLORS.length]
    })) || []

  const barData = trip?.stops?.map(s => ({
    city: s.city,
    budget: parseFloat(s.budget) || 0,
    days: s.startDate && s.endDate
      ? Math.ceil((new Date(s.endDate) - new Date(s.startDate)) / (1000 * 60 * 60 * 24))
      : 1
  })) || []

  const avgPerDay = () => {
    const totalDays = barData.reduce((acc, s) => acc + s.days, 0)
    return totalDays > 0 ? (totalBudget / totalDays).toFixed(0) : 0
  }

  if (!trip) return (
    <div style={styles.loading}>Loading budget... 💰</div>
  )

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.logo} onClick={() => navigate('/')}>✈️ Traveloop</h1>
        <div style={styles.navLinks}>
          <button style={styles.navBtn} onClick={() => navigate('/trips')}>My Trips</button>
          <button style={styles.navBtn} onClick={() => navigate(`/trips/${id}/view`)}>👁️ View</button>
          <button style={styles.editBtn} onClick={() => navigate(`/trips/${id}/build`)}>✏️ Edit</button>
        </div>
      </div>

      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>💰 Budget Breakdown</h2>
          <p style={styles.subtitle}>{trip.name}</p>
        </div>

        {/* Summary Cards */}
        <div style={styles.summaryRow}>
          <div style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Total Budget</p>
            <h2 style={styles.summaryAmount}>${totalBudget.toFixed(0)}</h2>
          </div>
          <div style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Avg Per Day</p>
            <h2 style={styles.summaryAmount}>${avgPerDay()}</h2>
          </div>
          <div style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Total Stops</p>
            <h2 style={styles.summaryAmount}>{trip.stops?.length || 0}</h2>
          </div>
          <div style={styles.summaryCard}>
            <p style={styles.summaryLabel}>Activities</p>
            <h2 style={styles.summaryAmount}>
              {trip.stops?.reduce((acc, s) => acc + (s.activities?.length || 0), 0) || 0}
            </h2>
          </div>
        </div>

        {pieData.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={styles.emptyIcon}>💸</p>
            <h3>No budget data yet!</h3>
            <p style={styles.emptyText}>Add budget amounts to your stops in the itinerary builder</p>
            <button style={styles.editBtn} onClick={() => navigate(`/trips/${id}/build`)}>
              ✏️ Add Budget to Stops
            </button>
          </div>
        ) : (
          <>
            {/* Chart Toggle */}
            <div style={styles.toggleRow}>
              <button
                style={chartType === 'pie' ? styles.activeToggle : styles.toggle}
                onClick={() => setChartType('pie')}
              >🥧 Pie Chart</button>
              <button
                style={chartType === 'bar' ? styles.activeToggle : styles.toggle}
                onClick={() => setChartType('bar')}
              >📊 Bar Chart</button>
            </div>

            {/* Charts */}
            <div style={styles.chartCard}>
              {chartType === 'pie' ? (
                <div style={styles.chartWrapper}>
                  <h3 style={styles.chartTitle}>Budget Distribution by City</h3>
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value}`, 'Budget']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={styles.chartWrapper}>
                  <h3 style={styles.chartTitle}>Budget per City</h3>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={barData}>
                      <XAxis dataKey="city" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Budget']} />
                      <Legend />
                      <Bar dataKey="budget" fill="#667eea" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Per Stop Breakdown */}
            <div style={styles.breakdownCard}>
              <h3 style={styles.breakdownTitle}>📋 Per Stop Breakdown</h3>
              {trip.stops?.map((stop, index) => (
                <div key={stop.id} style={styles.breakdownRow}>
                  <div style={styles.breakdownLeft}>
                    <div style={{ ...styles.colorDot, background: COLORS[index % COLORS.length] }} />
                    <div>
                      <p style={styles.breakdownCity}>{stop.city}{stop.country ? `, ${stop.country}` : ''}</p>
                      <p style={styles.breakdownDates}>{stop.startDate} {stop.endDate ? `→ ${stop.endDate}` : ''}</p>
                    </div>
                  </div>
                  <div style={styles.breakdownRight}>
                    <p style={styles.breakdownAmount}>
                      ${parseFloat(stop.budget || 0).toFixed(0)}
                    </p>
                    <p style={styles.breakdownPercent}>
                      {totalBudget > 0 ? ((parseFloat(stop.budget || 0) / totalBudget) * 100).toFixed(0) : 0}%
                    </p>
                  </div>
                  <div style={styles.progressBar}>
                    <div style={{
                      ...styles.progressFill,
                      width: `${totalBudget > 0 ? (parseFloat(stop.budget || 0) / totalBudget) * 100 : 0}%`,
                      background: COLORS[index % COLORS.length]
                    }} />
                  </div>
                </div>
              ))}

              {/* Total Row */}
              <div style={styles.totalRow}>
                <p style={styles.totalLabel}>Total Budget</p>
                <p style={styles.totalAmount}>${totalBudget.toFixed(0)}</p>
              </div>
            </div>
          </>
        )}
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
  content: { padding: '32px', maxWidth: '900px', margin: '0 auto' },
  header: { marginBottom: '24px' },
  title: { fontSize: '28px', color: '#333' },
  subtitle: { color: '#888', marginTop: '4px' },
  summaryRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' },
  summaryCard: { background: 'white', padding: '24px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  summaryLabel: { color: '#888', fontSize: '13px', marginBottom: '8px' },
  summaryAmount: { color: '#667eea', fontSize: '28px', fontWeight: 'bold' },
  emptyBox: { background: 'white', padding: '60px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  emptyIcon: { fontSize: '48px', marginBottom: '16px' },
  emptyText: { color: '#888', marginBottom: '24px' },
  toggleRow: { display: 'flex', gap: '12px', marginBottom: '20px' },
  toggle: { padding: '10px 24px', background: 'white', border: '2px solid #ddd', borderRadius: '25px', cursor: 'pointer', fontWeight: '500', color: '#666' },
  activeToggle: { padding: '10px 24px', background: '#667eea', border: '2px solid #667eea', borderRadius: '25px', cursor: 'pointer', fontWeight: '500', color: 'white' },
  chartCard: { background: 'white', padding: '24px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  chartWrapper: {},
  chartTitle: { fontSize: '18px', color: '#333', marginBottom: '16px' },
  breakdownCard: { background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)' },
  breakdownTitle: { fontSize: '18px', color: '#333', marginBottom: '20px' },
  breakdownRow: { marginBottom: '20px' },
  breakdownLeft: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '6px' },
  colorDot: { width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0 },
  breakdownCity: { fontWeight: '600', color: '#333', fontSize: '15px' },
  breakdownDates: { color: '#888', fontSize: '12px' },
  breakdownRight: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px', paddingLeft: '24px' },
  breakdownAmount: { fontWeight: 'bold', color: '#333' },
  breakdownPercent: { color: '#888', fontSize: '13px' },
  progressBar: { height: '8px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden', marginLeft: '24px' },
  progressFill: { height: '100%', borderRadius: '4px', transition: 'width 0.3s ease' },
  totalRow: { borderTop: '2px solid #f0f4f8', paddingTop: '16px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontWeight: 'bold', fontSize: '16px', color: '#333' },
  totalAmount: { fontWeight: 'bold', fontSize: '24px', color: '#667eea' },
}