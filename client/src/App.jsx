import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CreateTrip from './pages/CreateTrip'
import MyTrips from './pages/MyTrips'
import ItineraryBuilder from './pages/ItineraryBuilder'
import ItineraryView from './pages/ItineraryView'
import Budget from './pages/Budget'

const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem('user')
  return user ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/trips" element={<PrivateRoute><MyTrips /></PrivateRoute>} />
        <Route path="/trips/new" element={<PrivateRoute><CreateTrip /></PrivateRoute>} />
        <Route path="/trips/:id/build" element={<PrivateRoute><ItineraryBuilder /></PrivateRoute>} />
        <Route path="/trips/:id/view" element={<PrivateRoute><ItineraryView /></PrivateRoute>} />
        <Route path="/trips/:id/budget" element={<PrivateRoute><Budget /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}