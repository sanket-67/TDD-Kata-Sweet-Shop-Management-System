import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SweetsList() {
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSweets();
    }, []);

    const fetchSweets = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/sweets', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setSweets(response.data.data);
            setLoading(false);

        } catch (err) {
            console.error("Error fetching sweets:", err);
            setError('Failed to load sweets. Please try again.');

            setLoading(false);

            if (err.response && err.response.status === 401) {
                navigate('/login');
            }
        }
    };

    const handlePurchase = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:5000/api/sweets/${id}/purchase`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

         
            setSweets(sweets.map(sweet =>
                sweet._id === id ? { ...sweet, quantity: response.data.data.quantity } : sweet
            ));

        } catch (err) {
            console.error("Purchase failed:", err);
            alert(err.response?.data?.message || "Purchase failed");
        }
    };

    if (loading) return <div className="loading">Loading sweets...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="sweets-container">
            <h2>Sweets Menu</h2>
            {sweets.length === 0 ? (
                <p>No sweets available at the moment.</p>
            ) : (
                <div className="sweets-grid">
                    {sweets.map((sweet) => (
                        <div key={sweet._id} className="sweet-card">
                            <h3>{sweet.name}</h3>
                            <p className="category">{sweet.category}</p>
                            <p className="price">Rs {sweet.price.toFixed(2)}</p>
                            <p className="stock">Stock: {sweet.quantity}</p>
                            <button
                                className="purchase-btn"
                                disabled={sweet.quantity === 0}
                                onClick={() => handlePurchase(sweet._id)}
                            >
                                {sweet.quantity === 0 ? 'Out of Stock' : 'Purchase'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SweetsList;
