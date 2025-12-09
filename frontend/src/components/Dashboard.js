import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PaintList from './PaintList';
import AddPaintForm from './AddPaintForm';
import TransactionForm from './TransactionForm';
import StockCharts from './StockCharts';
import './Dashboard.css';

const API_BASE = '/api';

function Dashboard() {
    const [paints, setPaints] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [paintsResponse, transactionsResponse] = await Promise.all([
                axios.get(`${API_BASE}/paints`),
                axios.get(`${API_BASE}/transactions`)
            ]);

            setPaints(paintsResponse.data || []);
            setTransactions(transactionsResponse.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            // Set empty arrays if there's an error
            setPaints([]);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchPaints = async () => {
        const response = await axios.get(`${API_BASE}/paints`);
        setPaints(response.data || []);
    };

    const fetchTransactions = async () => {
        const response = await axios.get(`${API_BASE}/transactions`);
        setTransactions(response.data || []);
    };

    const totalStockValue = paints.reduce((sum, paint) => sum + (paint.quantity * paint.unit_price), 0);
    const totalItems = paints.reduce((sum, paint) => sum + paint.quantity, 0);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="dashboard">
            <nav className="tabs">
                <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
                    Dashboard
                </button>
                <button className={activeTab === 'paints' ? 'active' : ''} onClick={() => setActiveTab('paints')}>
                    Manage Paints
                </button>
                <button className={activeTab === 'transactions' ? 'active' : ''} onClick={() => setActiveTab('transactions')}>
                    Transactions
                </button>
            </nav>

            <div className="tab-content">
                {activeTab === 'dashboard' && (
                    <div>
                        <div className="stats">
                            <div className="stat-card">
                                <h3>Total Paints</h3>
                                <p>{paints.length}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Total Items</h3>
                                <p>{totalItems}</p>
                            </div>
                            <div className="stat-card">
                                <h3>Stock Value</h3>
                                <p>${totalStockValue.toFixed(2)}</p>
                            </div>
                        </div>
                        <StockCharts paints={paints} />
                    </div>
                )}

                {activeTab === 'paints' && (
                    <div>
                        <AddPaintForm onPaintAdded={fetchPaints} />
                        <PaintList paints={paints} onUpdate={fetchPaints} />
                    </div>
                )}

                {activeTab === 'transactions' && (
                    <div>
                        <TransactionForm paints={paints} onTransactionAdded={fetchData} />
                        <div className="transactions-list">
                            <h3>Recent Transactions</h3>
                            {transactions.map(transaction => (
                                <div key={transaction.id} className="transaction-item">
                                    <span>Paint ID: {transaction.paint_id}</span>
                                    <span className={transaction.change < 0 ? 'withdrawal' : 'restock'}>
                                        {transaction.change > 0 ? '+' : ''}{transaction.change}
                                    </span>
                                    <span>{transaction.note}</span>
                                    <span>{new Date(transaction.timestamp).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;