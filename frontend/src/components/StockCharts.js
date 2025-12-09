import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function StockCharts({ paints }) {
    // Prepare data for charts
    const stockData = paints.map(paint => ({
        name: paint.name,
        stock: paint.quantity,
        value: paint.quantity * paint.unit_price
    }));

    return (
        <div className="charts">
            <h3>Stock Overview</h3>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stockData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="stock" fill="#8884d8" name="Quantity in Stock" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default StockCharts;