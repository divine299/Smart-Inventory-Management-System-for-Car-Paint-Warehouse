import React from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:5000/api';

function PaintList({ paints, onUpdate }) {
    const handleUpdateStock = async (paintId, newQuantity) => {
        try {
            await axios.put(`${API_BASE}/paints/${paintId}`, {
                quantity: newQuantity
            });
            onUpdate();
        } catch (error) {
            console.error('Error updating paint:', error);
        }
    };

    return (
        <div className="paint-list">
            <h3>Current Paints</h3>
            <div className="paints-grid">
                {paints.map(paint => (
                    <div key={paint.id} className="paint-card">
                        <h4>{paint.name}</h4>
                        <p>Code: {paint.color_code}</p>
                        <p>Stock: {paint.quantity} units</p>
                        <p>Price: ${paint.unit_price}</p>
                        <div className="paint-actions">
                            <button
                                onClick={() => handleUpdateStock(paint.id, paint.quantity + 1)}
                                className="btn-stock"
                            >
                                +1
                            </button>
                            <button
                                onClick={() => handleUpdateStock(paint.id, paint.quantity - 1)}
                                className="btn-stock"
                                disabled={paint.quantity <= 0}
                            >
                                -1
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PaintList;