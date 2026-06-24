import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const CreateAuctionForm = () => {
    const navigate = useNavigate();
    const [categoria, setCategoria] = useState('Vehicle');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        tipo: 'Tiempo Real',
        precio_base: '',
        precio_reserva: '',
        fecha_fin: '', 
        vin: '',
        km: '',
        transmision: 'Manual',
        procesador: '',
        ram: '',
        bateria: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (files.length < 5) {
            setError('Debes subir un mínimo de 5 imágenes.');
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();
            data.append('categoria', categoria);
            
            ['titulo', 'descripcion', 'tipo', 'precio_base', 'precio_reserva'].forEach(key => {
                data.append(key, formData[key]);
            });

            if (formData.tipo === 'Programada') {
                data.append('fecha_fin', formData.fecha_fin);
            }

            if (categoria === 'Vehicle') {
                ['vin', 'km', 'transmision'].forEach(key => data.append(key, formData[key]));
            } else {
                ['procesador', 'ram', 'bateria'].forEach(key => data.append(key, formData[key]));
            }

            files.forEach(file => {
                data.append('imagenes', file);
            });

            await api.post('/auctions', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate('/dashboard'); 
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear la subasta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel" style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Crear Nueva Subasta</h2>
            {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{display: 'block', marginBottom: '0.5rem'}}>Categoría</label>
                    <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="input-field">
                        <option value="Vehicle">Vehículo</option>
                        <option value="Tech">Tecnología</option>
                    </select>
                </div>

                <input type="text" name="titulo" placeholder="Título" className="input-field" value={formData.titulo} onChange={handleChange} required />
                <textarea name="descripcion" placeholder="Descripción" className="input-field" value={formData.descripcion} onChange={handleChange} required rows={3}></textarea>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input type="number" name="precio_base" placeholder="Precio Base ($)" className="input-field" value={formData.precio_base} onChange={handleChange} required />
                    <input type="number" name="precio_reserva" placeholder="Precio Reserva Oculto ($)" className="input-field" value={formData.precio_reserva} onChange={handleChange} required />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{display: 'block', marginBottom: '0.5rem'}}>Tipo de Subasta</label>
                    <select name="tipo" className="input-field" value={formData.tipo} onChange={handleChange}>
                        <option value="Tiempo Real">En Tiempo Real (En vivo)</option>
                        <option value="Programada">Programada (Fecha de fin)</option>
                    </select>
                </div>

                {formData.tipo === 'Programada' && (
                    <input type="datetime-local" name="fecha_fin" className="input-field" value={formData.fecha_fin} onChange={handleChange} required />
                )}

                <hr style={{ borderColor: 'var(--border)', margin: '1.5rem 0' }} />

                {categoria === 'Vehicle' ? (
                    <>
                        <h4 style={{ marginBottom: '1rem' }}>Detalles del Vehículo</h4>
                        <input type="text" name="vin" placeholder="VIN (Número de chasis)" className="input-field" value={formData.vin} onChange={handleChange} required />
                        <input type="number" name="km" placeholder="Kilometraje" className="input-field" value={formData.km} onChange={handleChange} required />
                        <select name="transmision" className="input-field" value={formData.transmision} onChange={handleChange}>
                            <option value="Manual">Manual</option>
                            <option value="Automática">Automática</option>
                            <option value="Semi-automática">Semi-automática</option>
                        </select>
                    </>
                ) : (
                    <>
                        <h4 style={{ marginBottom: '1rem' }}>Detalles de Tecnología</h4>
                        <input type="text" name="procesador" placeholder="Procesador" className="input-field" value={formData.procesador} onChange={handleChange} required />
                        <input type="text" name="ram" placeholder="Memoria RAM" className="input-field" value={formData.ram} onChange={handleChange} required />
                        <input type="text" name="bateria" placeholder="Batería / Capacidad" className="input-field" value={formData.bateria} onChange={handleChange} required />
                    </>
                )}

                <hr style={{ borderColor: 'var(--border)', margin: '1.5rem 0' }} />

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{display: 'block', marginBottom: '0.5rem'}}>Imágenes (Mínimo 5)</label>
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="input-field" style={{ padding: '0.5rem' }} />
                    <small style={{ color: 'var(--text-muted)' }}>{files.length} archivos seleccionados.</small>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', fontSize: '1.1rem' }} disabled={loading}>
                    {loading ? 'Publicando...' : 'Publicar Subasta'}
                </button>
            </form>
        </div>
    );
};

export default CreateAuctionForm;
