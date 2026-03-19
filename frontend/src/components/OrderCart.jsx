import { useState } from 'react';
import Icon from './Icon';
import './OrderCart.css';

/**
 * OrderCart Component
 * Displays a single medication item in the order cart
 * Features:
 *   - Shows current low quantity
 *   - Stepper for restock quantity (increment/decrement)
 *   - Large, readable buttons for older adults
 *   - Remove button
 *   - Accessible keyboard navigation
 */
export default function OrderCart({ item, onRemove, onUpdateQty }) {
    const [isRemoving, setIsRemoving] = useState(false);

    const handleDecrement = () => {
        if (item.restockQty > 1) {
            onUpdateQty(item.restockQty - 1);
        }
    };

    const handleIncrement = () => {
        onUpdateQty(item.restockQty + 1);
    };

    const handleInputChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value > 0) {
            onUpdateQty(value);
        }
    };

    const handleRemove = async () => {
        setIsRemoving(true);
        // Small delay for visual feedback
        await new Promise((resolve) => setTimeout(resolve, 300));
        onRemove();
    };

    return (
        <div className={`order-cart-item ${isRemoving ? 'order-cart-item--removing' : ''}`}>
            <div className="order-cart-item__header">
                <div className="order-cart-item__info">
                    <h3 className="order-cart-item__name">{item.name}</h3>
                    <p className="order-cart-item__dosage">{item.dosage}</p>
                </div>
                <button
                    className="order-cart-item__remove-btn"
                    onClick={handleRemove}
                    aria-label={`Remove ${item.name} from order`}
                    title="Remove from order"
                >
                    <Icon name="x" size={20} />
                </button>
            </div>

            {/* Current Stock Info */}
            <div className="order-cart-item__stock-info">
                <div className="order-cart-item__current-qty">
                    <span className="order-cart-item__label">Current stock:</span>
                    <span className="order-cart-item__value order-cart-item__value--warning">
                        {item.currentQty}
                    </span>
                    <span className="order-cart-item__unit">{item.unit}</span>
                </div>
            </div>

            {/* Restock Quantity Stepper */}
            <div className="order-cart-item__stepper-section">
                <label htmlFor={`qty-${item.id}`} className="order-cart-item__label">
                    Order quantity:
                </label>
                <div className="order-cart-item__stepper">
                    <button
                        className="stepper__btn stepper__btn--minus"
                        onClick={handleDecrement}
                        disabled={item.restockQty <= 1}
                        aria-label={`Decrease quantity for ${item.name}`}
                        title="Decrease quantity"
                    >
                        <Icon name="minus" size={20} />
                    </button>

                    <input
                        id={`qty-${item.id}`}
                        type="number"
                        min="1"
                        max="999"
                        value={item.restockQty}
                        onChange={handleInputChange}
                        className="stepper__input"
                        aria-label={`Restock quantity for ${item.name}`}
                    />

                    <button
                        className="stepper__btn stepper__btn--plus"
                        onClick={handleIncrement}
                        aria-label={`Increase quantity for ${item.name}`}
                        title="Increase quantity"
                    >
                        <Icon name="plus" size={20} />
                    </button>
                </div>
                <span className="order-cart-item__hint">
                    {item.unit}
                </span>
            </div>
        </div>
    );
}
