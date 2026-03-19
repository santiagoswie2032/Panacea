import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import Icon from '../components/Icon';
import OrderCart from '../components/OrderCart';
import OrderConfirmation from '../components/OrderConfirmation';
import './Orders.css';

/**
 * Mock data for low-stock medications
 * In a real app, this would be fetched from the API or derived from the medications list
 */
const MOCK_LOW_STOCK_MEDICATIONS = [
    {
        id: 'med-1',
        name: 'Lisinopril',
        currentQty: 8,
        unit: 'tablets',
        dosage: '10mg',
    },
    {
        id: 'med-2',
        name: 'Metformin',
        currentQty: 5,
        unit: 'tablets',
        dosage: '500mg',
    },
    {
        id: 'med-3',
        name: 'Atorvastatin',
        currentQty: 10,
        unit: 'tablets',
        dosage: '20mg',
    },
];

export default function Orders() {
    const toast = useToast();
    const [cartItems, setCartItems] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmedItems, setConfirmedItems] = useState([]);

    /**
     * Initialize cart with mock data on component mount
     * In production, you would fetch actual low-stock medications from the API
     */
    useEffect(() => {
        // Initialize cart items with default restock quantities
        const initialCart = MOCK_LOW_STOCK_MEDICATIONS.map((med) => ({
            ...med,
            restockQty: Math.ceil(med.currentQty * 2), // Default: restock to 2x current amount
        }));
        setCartItems(initialCart);
    }, []);

    /**
     * Remove an item from the cart
     */
    const handleRemoveItem = (medId) => {
        setCartItems((prev) => prev.filter((item) => item.id !== medId));
        toast.success('Item removed from order');
    };

    /**
     * Update the restock quantity for a specific medication
     */
    const handleUpdateRestockQty = (medId, newQty) => {
        // Ensure quantity is at least 1
        const qty = Math.max(1, newQty);
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === medId ? { ...item, restockQty: qty } : item
            )
        );
    };

    /**
     * Handle the order submission
     * FUTURE: This is where you'll integrate with:
     *   - Pharmacy APIs (e.g., CVS, Walgreens)
     *   - External services (e.g., Healthpotli)
     *   - Deep-linking to mobile apps
     *   - Backend API for pharmacy coordination
     */
    const handleOrder = async () => {
        if (cartItems.length === 0) {
            toast.error('Your order is empty');
            return;
        }

        setIsProcessing(true);

        try {
            // ========================================
            // FUTURE INTEGRATION POINTS:
            // ========================================
            // 1. Pharmacy API Integration:
            //    const response = await api.submitPharmacyOrder({
            //        userId: user.id,
            //        medications: cartItems
            //    });
            //
            // 2. Deep-linking to Healthpotli or similar:
            //    const params = new URLSearchParams({
            //        medications: JSON.stringify(cartItems),
            //        userId: user.id
            //    });
            //    window.location.href = `healthpotli://order?${params}`;
            //
            // 3. SMS/Email to pharmacy:
            //    await api.sendPharmacyOrder({
            //        method: 'email', // or 'sms'
            //        medications: cartItems
            //    });
            //
            // 4. Generate shareable order list (QR code, PDF):
            //    const pdf = generateOrderPDF(cartItems);
            //    downloadPDF(pdf);
            // ========================================

            // Mock implementation for now
            console.log('Order submitted:', cartItems);

            // Simulate API call delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Save items to confirmation and show modal
            setConfirmedItems([...cartItems]);
            setShowConfirmation(true);

            // Clear cart
            setCartItems([]);

            // Optional: Log order for analytics
            console.log('📦 Order Summary:', {
                timestamp: new Date().toISOString(),
                itemCount: cartItems.length,
                medications: cartItems.map((m) => ({
                    name: m.name,
                    requestedQty: m.restockQty,
                })),
            });
        } catch (error) {
            toast.error(error.message || 'Failed to submit order');
            console.error('Order submission error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCloseConfirmation = () => {
        setShowConfirmation(false);
        setConfirmedItems([]);
    };

    return (
        <div className="orders-page">
            <div className="orders-header">
                <h1 className="orders-title">
                    <Icon name="shoppingCart" size={28} color="var(--color-primary)" />
                    Order Medications
                </h1>
                <p className="orders-subtitle">
                    Request restocks for your low-stock medications
                </p>
            </div>

            {cartItems.length === 0 ? (
                <div className="orders-empty">
                    <Icon name="inbox" size={48} color="var(--color-text-muted)" />
                    <p className="orders-empty-title">No low-stock items</p>
                    <p className="orders-empty-message">
                        All your medications are well-stocked. Check back when you need restocks.
                    </p>
                </div>
            ) : (
                <>
                    <div className="orders-cart">
                        {cartItems.map((item) => (
                            <OrderCart
                                key={item.id}
                                item={item}
                                onRemove={() => handleRemoveItem(item.id)}
                                onUpdateQty={(qty) => handleUpdateRestockQty(item.id, qty)}
                            />
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="orders-summary">
                        <div className="orders-summary-row">
                            <span className="orders-summary-label">Items in order:</span>
                            <span className="orders-summary-value">{cartItems.length}</span>
                        </div>
                        <div className="orders-summary-row">
                            <span className="orders-summary-label">Total units:</span>
                            <span className="orders-summary-value">
                                {cartItems.reduce((sum, item) => sum + item.restockQty, 0)}
                            </span>
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <div className="orders-actions">
                        <button
                            className="btn btn-primary orders-submit-btn"
                            onClick={handleOrder}
                            disabled={isProcessing || cartItems.length === 0}
                            aria-label="Send medications list to pharmacy"
                        >
                            {isProcessing ? (
                                <>
                                    <span className="spinner-small" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Icon name="send" size={18} />
                                    Send to Pharmacy
                                </>
                            )}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setCartItems(MOCK_LOW_STOCK_MEDICATIONS.map((m) => ({
                                ...m,
                                restockQty: Math.ceil(m.currentQty * 2),
                            })))}
                            aria-label="Clear all items and reset"
                        >
                            <Icon name="rotateCcw" size={16} />
                            Reset
                        </button>
                    </div>

                    {/* Helpful Info */}
                    <div className="orders-info">
                        <div className="orders-info-card">
                            <Icon name="info" size={20} color="var(--color-info)" />
                            <div>
                                <p className="orders-info-title">How it works</p>
                                <p className="orders-info-text">
                                    Select the quantity you'd like to restock for each medication. 
                                    When you submit, we'll send your request to nearby pharmacies or 
                                    your preferred pharmacy partner.
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Order Confirmation Modal */}
            <OrderConfirmation
                isOpen={showConfirmation}
                items={confirmedItems}
                onClose={handleCloseConfirmation}
            />
        </div>
    );
}
