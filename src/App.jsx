import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import FamilyApplication from './pages/FamilyApplication'
import ProviderApplication from './pages/ProviderApplication'
import FamilyDashboard from './pages/FamilyDashboard'
import ProviderDashboard from './pages/ProviderDashboard'
import Support from './pages/Support'
import Admin from './pages/Admin'
import DonorPortal from './pages/DonorPortal'
import SetupWizard from './pages/SetupWizard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply/family" element={<FamilyApplication />} />
        <Route path="/apply/provider" element={<ProviderApplication />} />
        <Route path="/dashboard/family" element={<FamilyDashboard />} />
        <Route path="/dashboard/provider" element={<ProviderDashboard />} />
        <Route path="/support" element={<Support />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/donate" element={<DonorPortal />} />
        <Route path="/setup" element={<SetupWizard />} />
      </Routes>
    </Router>
  )
}

export default App
