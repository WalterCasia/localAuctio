import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginRegister = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        rol_preferido: 'Comprador'
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (isLogin) {
            const res = await login(formData.email, formData.password);
            if (res.success) {
                navigate('/dashboard');
            } else {
                setError(res.message);
            }
        } else {
            const res = await register(formData);
            if (res.success) {
                navigate('/dashboard');
            } else {
                setError(res.message);
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="glass-panel auth-box">
                <h2>{isLogin ? 'Bienvenido de vuelta' : 'Únete a Auctio'}</h2>
                <p>{isLogin ? 'Ingresa a la plataforma líder de subastas' : 'Crea tu cuenta y comienza a pujar o subastar'}</p>
                
                {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre completo"
                            className="input-field"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                    )}
                    
                    <input
                        type="email"
                        name="email"
                        placeholder="Correo electrónico"
                        className="input-field"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        className="input-field"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    {!isLogin && (
                        <select 
                            name="rol_preferido" 
                            className="input-field"
                            value={formData.rol_preferido}
                            onChange={handleChange}
                        >
                            <option value="Comprador">Quiero Comprar (Comprador)</option>
                            <option value="Subastador">Quiero Vender (Subastador)</option>
                        </select>
                    )}

                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                        {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                    </button>
                </form>

                <div className="switch-mode">
                    {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                    <span onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Regístrate aquí' : 'Inicia Sesión'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LoginRegister;
