import React from 'react';
import CreateAuctionForm from '../components/auction/CreateAuctionForm';
import { useRole } from '../context/RoleContext';

const CreateAuction = () => {
    const { currentView } = useRole();

    if (currentView !== 'Subastador') {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Acceso Denegado</h2>
                <p style={{ color: 'var(--text-muted)' }}>Debes cambiar tu vista a Subastador para crear subastas.</p>
            </div>
        );
    }

    return (
        <div>
            <CreateAuctionForm />
        </div>
    );
};

export default CreateAuction;
