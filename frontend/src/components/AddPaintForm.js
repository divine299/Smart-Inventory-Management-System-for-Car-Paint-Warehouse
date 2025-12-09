import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:5000/api';

function AddPaintForm({ onPaintAdded }) {
    const [formData, setFormData] = useState({
        name: '',
        color_code: '',
        quantity: 0,
        unit_price: 0
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/paints`, formData);
            setFormData({ name: '', color_code: '', quantity: 0, unit_price: 0 });
            onPaintAdded();
        } catch (error) {
            console.error('Error adding paint:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value
        });
    };

    return (
        <form onSubmit={handleSubmit} className="add-paint-form">
            <h3>Add New Paint</h3>
            <input
                type="text"
                name="name"
                placeholder="Paint Name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="color_code"
                placeholder="Color Code"
                value={formData.color_code}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
            />
            <input
                type="number"
                name="unit_price"
                placeholder="Unit Price"
                value={formData.unit_price}
                onChange={handleChange}
                step="0.01"
                min="0"
            />
            <button type="submit">Add Paint</button>
        </form>
    );
}

export default AddPaintForm;