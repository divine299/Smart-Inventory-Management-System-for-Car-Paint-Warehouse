import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:5000/api';

function TransactionForm({ paints, onTransactionAdded }) {
    const [formData, setFormData] = useState({
        paint_id: '',
        change: 0,
        note: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/transactions`, {
                ...formData,
                paint_id: parseInt(formData.paint_id),
                change: parseInt(formData.change)
            });
            setFormData({ paint_id: '', change: 0, note: '' });
            onTransactionAdded();
        } catch (error) {
            console.error('Error creating transaction:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <form onSubmit={handleSubmit} className="transaction-form">
            <h3>Create Transaction</h3>
            <select
                name="paint_id"
                value={formData.paint_id}
                onChange={handleChange}
                required
            >
                <option value="">Select Paint</option>
                {paints.map(paint => (
                    <option key={paint.id} value={paint.id}>
                        {paint.name} (Stock: {paint.quantity})
                    </option>
                ))}
            </select>

            <input
                type="number"
                name="change"
                placeholder="Quantity Change (negative for withdrawal)"
                value={formData.change}
                onChange={handleChange}
                required
            />

            <input
                type="text"
                name="note"
                placeholder="Note/Reason"
                value={formData.note}
                onChange={handleChange}
                required
            />

            <button type="submit">Submit Transaction</button>
        </form>
    );
}

export default TransactionForm;