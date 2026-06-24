import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useRole } from './context/RoleContext';
import LoginRegister from './pages/LoginRegister';
import CreateAuction from './pages/CreateAuction';
import LiveAuction from './pages/LiveAuction';

// Placeholders temporales
const Dashboard = () => {
    const { logout } = useAuth();
    const { currentView, toggleView } = useRole();
    return (
        <div style={{padding:'2rem'}}>
            <nav style={{display:'flex', justifyContent:'space-between', marginBottom:'2rem', borderBottom:'1px solid var(--border)', paddingBottom:'1rem'}}>
                <h2 style={{color:'var(--primary)'}}>Auctio Dashboard</h2>
                <div style={{display:'flex', gap:'1rem'}}>
                    <span style={{cursor:'pointer', color:'var(--accent)'}} onClick={toggleView}>
                        Modo: {currentView} (Cambiar)
                    </span>
                    <button onClick={logout} className="btn-primary" style={{padding:'0.5rem 1rem'}}>Salir</button>
                </div>
            </nav>
            <div style={{display:'flex', gap:'1rem'}}>
                <Link to="/live" className="btn-primary" style={{textDecoration:'none'}}>Ver Subastas en Vivo</Link>
                {currentView === 'Subastador' && (
                    <Link to="/create-auction" className="btn-primary" style={{textDecoration:'none', background:'linear-gradient(135deg, #10b981, #059669)'}}>
                        Crear Nueva Subasta
                    </Link>
                )}
            </div>
        </div>
    );
};

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div style={{color:'white', padding:'2rem'}}>Cargando Auctio...</div>;

  return (
    <Routes>
      <Route path="/" element={!user ? <LoginRegister /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/create-auction" element={user ? <CreateAuction /> : <Navigate to="/" />} />
      <Route path="/live" element={user ? <LiveAuction /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default App;
