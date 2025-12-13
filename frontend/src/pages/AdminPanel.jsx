import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../api/config';

function AdminPanel() {
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingSweet, setEditingSweet] = useState(null);
    const [restockingSweet, setRestockingSweet] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        quantity: ''
    });
    const [restockQuantity, setRestockQuantity] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is admin
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            navigate('/sweets');
            return;
        }
        fetchSweets();
    }, [navigate]);

    const fetchSweets = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/sweets`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSweets(response.data.data);
            setLoading(false);
        } catch (err) {
            console.error("Error:", err);
            setError('Failed to load sweets');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddSweet = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/sweets`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setFormData({ name: '', category: '', price: '', quantity: '' });
            setShowAddForm(false);
            fetchSweets();
            alert('Sweet added successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add sweet');
        }
    };

    const handleUpdateSweet = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/api/sweets/${editingSweet._id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setFormData({ name: '', category: '', price: '', quantity: '' });
            setEditingSweet(null);
            fetchSweets();
            alert('Sweet updated successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update sweet');
        }
    };

    const handleDeleteSweet = async (id) => {
        if (!window.confirm('Are you sure you want to delete this sweet?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/api/sweets/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            fetchSweets();
            alert('Sweet deleted successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete sweet');
        }
    };

    const handleRestock = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/sweets/${restockingSweet._id}/restock`, 
                { quantity: parseInt(restockQuantity) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setRestockQuantity('');
            setRestockingSweet(null);
            fetchSweets();
            alert('Sweet restocked successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to restock sweet');
        }
    };

    const startEdit = (sweet) => {
        setEditingSweet(sweet);
        setFormData({
            name: sweet.name,
            category: sweet.category,
            price: sweet.price,
            quantity: sweet.quantity
        });
        setShowAddForm(false);
        setRestockingSweet(null);
    };

    const startRestock = (sweet) => {
        setRestockingSweet(sweet);
        setRestockQuantity('');
        setShowAddForm(false);
        setEditingSweet(null);
    };

    const cancelForms = () => {
        setShowAddForm(false);
        setEditingSweet(null);
        setRestockingSweet(null);
        setFormData({ name: '', category: '', price: '', quantity: '' });
        setRestockQuantity('');
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <h2>Admin Panel - Sweet Management</h2>
                <div className="header-buttons">
                    <button onClick={() => navigate('/sweets')} className="view-shop-btn">
                        View Shop
                    </button>
                    <button onClick={() => {
                        localStorage.clear();
                        navigate('/login');
                    }} className="logout-btn">
                        Logout
                    </button>
                </div>
            </div>

            {/* Add Sweet Button */}
            {!showAddForm && !editingSweet && !restockingSweet && (
                <button onClick={() => setShowAddForm(true)} className="add-sweet-btn">
                    + Add New Sweet
                </button>
            )}

            {/* Add Sweet Form */}
            {showAddForm && (
                <div className="form-container">
                    <h3>Add New Sweet</h3>
                    <form onSubmit={handleAddSweet} className="sweet-form">
                        <input
                            type="text"
                            name="name"
                            placeholder="Sweet Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="category"
                            placeholder="Category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={formData.price}
                            onChange={handleInputChange}
                            step="0.01"
                            min="0"
                            required
                        />
                        <input
                            type="number"
                            name="quantity"
                            placeholder="Quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            min="0"
                            required
                        />
                        <div className="form-buttons">
                            <button type="submit">Add Sweet</button>
                            <button type="button" onClick={cancelForms} className="cancel-btn">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Update Sweet Form */}
            {editingSweet && (
                <div className="form-container">
                    <h3>Update Sweet</h3>
                    <form onSubmit={handleUpdateSweet} className="sweet-form">
                        <input
                            type="text"
                            name="name"
                            placeholder="Sweet Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="category"
                            placeholder="Category"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={formData.price}
                            onChange={handleInputChange}
                            step="0.01"
                            min="0"
                            required
                        />
                        <input
                            type="number"
                            name="quantity"
                            placeholder="Quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            min="0"
                            required
                        />
                        <div className="form-buttons">
                            <button type="submit">Update Sweet</button>
                            <button type="button" onClick={cancelForms} className="cancel-btn">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Restock Form */}
            {restockingSweet && (
                <div className="form-container">
                    <h3>Restock: {restockingSweet.name}</h3>
                    <p>Current Stock: {restockingSweet.quantity}</p>
                    <form onSubmit={handleRestock} className="sweet-form">
                        <input
                            type="number"
                            placeholder="Quantity to Add"
                            value={restockQuantity}
                            onChange={(e) => setRestockQuantity(e.target.value)}
                            min="1"
                            required
                        />
                        <div className="form-buttons">
                            <button type="submit">Restock</button>
                            <button type="button" onClick={cancelForms} className="cancel-btn">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Sweets List */}
            <div className="admin-sweets-list">
                <h3>All Sweets</h3>
                {sweets.length === 0 ? (
                    <p>No sweets available. Add your first sweet!</p>
                ) : (
                    <div className="sweets-grid">
                        {sweets.map((sweet) => (
                            <div key={sweet._id} className="admin-sweet-card">
                                <h4>{sweet.name}</h4>
                                <p className="category">{sweet.category}</p>
                                <p className="price">Rs {sweet.price.toFixed(2)}</p>
                                <p className="stock">Stock: {sweet.quantity}</p>
                                <div className="admin-actions">
                                    <button onClick={() => startEdit(sweet)} className="edit-btn">
                                        Edit
                                    </button>
                                    <button onClick={() => startRestock(sweet)} className="restock-btn">
                                        Restock
                                    </button>
                                    <button onClick={() => handleDeleteSweet(sweet._id)} className="delete-btn">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminPanel;
