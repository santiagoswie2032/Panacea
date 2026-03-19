import { useState } from 'react';
import Icon from './Icon';
import './OrderConfirmation.css';

/**
 * OrderConfirmation Component
 * Displays invoice-style receipt after successful order submission
 * Shows order details, timestamp, and action buttons
 */
export default function OrderConfirmation({ isOpen, items, onClose }) {
    const [isPrinting, setIsPrinting] = useState(false);

    if (!isOpen || !items || items.length === 0) return null;

    const timestamp = new Date();
    const orderId = `ORD-${timestamp.getTime().toString().slice(-6)}`;
    const totalUnits = items.reduce((sum, item) => sum + item.restockQty, 0);

    const handlePrint = () => {
        setIsPrinting(true);
        window.print();
        setIsPrinting(false);
    };

    const handleShare = () => {
        const orderText = formatOrderText(items);
        if (navigator.share) {
            navigator.share({
                title: 'Medication Order',
                text: orderText,
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(orderText);
        }
    };

    return (
        <div className="order-confirmation-overlay" onClick={onClose}>
            <div className="order-confirmation-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="confirmation-header">
                    <div className="confirmation-icon-wrapper">
                        <Icon name="checkCircle" size={48} color="var(--color-success)" />
                    </div>
                    <h2 className="confirmation-title">Order Sent Successfully!</h2>
                    <p className="confirmation-subtitle">
                        Your medication restock request has been submitted
                    </p>
                </div>

                {/* Invoice Content */}
                <div className="confirmation-invoice">
                    {/* Order Number & Date */}
                    <div className="invoice-header">
                        <div className="invoice-header-item">
                            <span className="invoice-label">Order ID</span>
                            <span className="invoice-value">{orderId}</span>
                        </div>
                        <div className="invoice-header-item">
                            <span className="invoice-label">Date & Time</span>
                            <span className="invoice-value">
                                {timestamp.toLocaleDateString()} {timestamp.toLocaleTimeString()}
                            </span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="invoice-divider" />

                    {/* Items List */}
                    <div className="invoice-items">
                        <div className="invoice-items-header">
                            <span className="col-name">Medication</span>
                            <span className="col-dosage">Dosage</span>
                            <span className="col-qty">Qty</span>
                        </div>

                        {items.map((item, index) => (
                            <div key={index} className="invoice-item-row">
                                <span className="col-name">{item.name}</span>
                                <span className="col-dosage">{item.dosage}</span>
                                <span className="col-qty">
                                    {item.restockQty} {item.unit}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="invoice-divider" />

                    {/* Summary */}
                    <div className="invoice-summary">
                        <div className="summary-row">
                            <span className="summary-label">Total Items:</span>
                            <span className="summary-value">{items.length}</span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-label">Total Units:</span>
                            <span className="summary-value highlight">{totalUnits}</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="invoice-divider" />

                    {/* Next Steps */}
                    <div className="invoice-info">
                        <p className="info-title">What happens next?</p>
                        <ul className="info-list">
                            <li>Your order has been sent to nearby pharmacies</li>
                            <li>Check your email for pharmacy confirmation</li>
                            <li>You'll receive pickup or delivery information shortly</li>
                        </ul>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="confirmation-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={handlePrint}
                        disabled={isPrinting}
                        aria-label="Print order receipt"
                    >
                        <Icon name="printer" size={18} />
                        Print
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={handleShare}
                        aria-label="Share order details"
                    >
                        <Icon name="share2" size={18} />
                        Share
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={onClose}
                        aria-label="Close confirmation and return"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}

/**
 * Format order as shareable text
 */
function formatOrderText(items) {
    let text = '📋 MEDICATION RESTOCK ORDER\n';
    text += `Sent: ${new Date().toLocaleString()}\n\n`;

    items.forEach((item) => {
        text += `• ${item.name} (${item.dosage})\n`;
        text += `  Qty: ${item.restockQty} ${item.unit}\n\n`;
    });

    text += `Total Items: ${items.length}\n`;
    text += `Total Units: ${items.reduce((sum, i) => sum + i.restockQty, 0)}\n\n`;
    text += 'Panacea Medication Management';

    return text;
}
