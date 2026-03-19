# Orders (Restock) Feature Documentation

## Overview

The **Orders** feature enables users to request restocks for low-stock medications. Currently implemented as a frontend-only shopping cart with mock data, it's architected to be easily extended with pharmacy APIs, deep-linking services, and other integrations. After successful order submission, users see an **invoice-style confirmation modal** displaying their order details.

---

## File Structure

```
frontend/src/
├── pages/
│   ├── Orders.jsx          # Main page component
│   └── Orders.css          # Page styling
├── components/
│   ├── OrderCart.jsx       # Individual item card component
│   ├── OrderCart.css       # Card styling
│   ├── OrderConfirmation.jsx   # Invoice-style confirmation modal
│   └── OrderConfirmation.css   # Confirmation modal styling
└── services/
    └── orderService.js     # Order business logic & future integrations
```

---

## Order Submission Flow

```
User clicks "Send to Pharmacy"
        ↓
handleOrder() validates & processes
        ↓
Simulate 1-second processing delay
        ↓
Save items to state & open confirmation modal
        ↓
Show invoice with order details
        ↓
User can Print, Share, or Click Done
        ↓
Clear cart & continue shopping
```

---

## Components

### 1. **Orders.jsx** (Main Page)
- **Purpose**: Displays the order cart and handles checkout
- **Key Features**:
  - Mock state management with `useState`
  - Cart initialization from mock data (`MOCK_LOW_STOCK_MEDICATIONS`)
  - Item removal and quantity updates
  - Order submission with `handleOrder()` function
  - Order summary display
  - Toast notifications for user feedback

- **State**:
  ```javascript
  cartItems: [
    {
      id: 'med-1',
      name: 'Lisinopril',
      dosage: '10mg',
      currentQty: 8,              // Current low quantity
      restockQty: 16,             // User-selected restock amount
      unit: 'tablets'
    },
    // ... more items
  ]
  ```

- **Key Functions**:
  - `handleRemoveItem(medId)`: Remove medication from cart
  - `handleUpdateRestockQty(medId, newQty)`: Update quantity user wants to order
  - `handleOrder()`: Submit order (currently mock, ready for API integration)

### 2. **OrderCart.jsx** (Item Card)
- **Purpose**: Displays individual medication in the cart
- **Key Features**:
  - Large, readable text (optimized for older adults)
  - Accessible quantity stepper (increment/decrement buttons + direct input)
  - Current stock display
  - Remove button
  - ARIA labels for screen readers

- **Props**:
  ```javascript
  {
    item: {
      id, name, dosage, currentQty, restockQty, unit
    },
    onRemove: () => {},
    onUpdateQty: (newQty) => {}
  }
  ```

### 3. **OrderConfirmation.jsx** (Confirmation Modal)
- **Purpose**: Displays invoice-style receipt after successful order submission
- **Key Features**:
  - Shows order ID and timestamp
  - Displays itemized list of medications
  - Summary with item count and total units
  - "What happens next?" guidance
  - Print button for receipt
  - Share button for order details
  - Accessible modal with overlay

- **Props**:
  ```javascript
  {
    isOpen: boolean,
    items: Array<orderItem>,
    onClose: () => {}
  }
  ```

- **Key Functions**:
  - `handlePrint()`: Triggers browser print dialog
  - `handleShare()`: Uses native share or clipboard fallback
  - `formatOrderText()`: Converts order to sharable text format

### 4. **orderService.js** (Business Logic)
- **Purpose**: Centralized logic for order operations and future integrations
- **Mock Functions** (ready for implementation):
  - `submitPharmacyOrder()` - Send to pharmacy APIs
  - `deepLinkToPharmacyApp()` - Launch Healthpotli or similar
  - `sendOrderViaMessaging()` - SMS/Email to pharmacy
  - `generateOrderQRCode()` - QR code for in-store use
  - `generateOrderPDF()` - PDF order slip
  - `findNearbyPharmacies()` - Geolocation-based pharmacy lookup

- **Utility Functions** (use anytime):
  - `formatOrderAsText()` - Convert order to readable text
  - `validateOrder()` - Check order validity
  - `filterLowStockMedications()` - Transform API medications to order format

---

## Accessibility Features

Designed for **older adults** with:

✅ **Large Text & Buttons**
- Minimum 44×44px touch targets
- Large font sizes (var(--font-size-lg), var(--font-size-xl))
- High contrast colors

✅ **Simplified Interactions**
- Clear, prominent buttons with obvious actions
- Accessible quantity stepper with keyboard navigation
- Large input field for direct quantity entry

✅ **Visual Feedback**
- Color-coded stock levels (warning orange for low stock)
- Smooth animations for item removal
- Clear loading states

✅ **ARIA Labels**
- All interactive elements have descriptive aria-labels
- Semantic HTML buttons and inputs
- Screen reader support

---

## How to Integrate with Real Data

Currently using mock data. To connect with real medications:

### Step 1: Fetch from API in Orders.jsx

```javascript
// Replace the useEffect initialization
useEffect(() => {
  fetchLowStockMeds();
}, []);

const fetchLowStockMeds = async () => {
  try {
    const { data } = await api.getMedications();
    // Filter and transform using orderService
    const lowStockMeds = filterLowStockMedications(data);
    setCartItems(lowStockMeds);
  } catch (error) {
    toast.error('Failed to load medications');
  }
};
```

### Step 2: Use filterLowStockMedications() from orderService

```javascript
import { filterLowStockMedications } from '../services/orderService';

// Automatically filters medications with <= 20% stock
const lowStockMeds = filterLowStockMedications(apiMedications);
```

---

## Future Integrations

### 1. **Pharmacy API (CVS, Walgreens, etc.)**

In `handleOrder()`:
```javascript
const response = await submitPharmacyOrder(cartItems, user);
// Response: { orderId, pharmacy, estimatedPickup, confirmation }
toast.success(`Order confirmed! Pickup at ${response.pharmacy}`);
```

### 2. **Deep-Link to Healthpotli**

```javascript
deepLinkToPharmacyApp(cartItems, user);
// Launches: healthpotli://order?medications=...&userId=...
```

### 3. **Email/SMS to Pharmacy**

```javascript
await sendOrderViaMessaging(cartItems, 'email', {
  recipientEmail: 'mypharmacy@example.com'
});
```

### 4. **Geolocation-Based Pharmacy Matching**

```javascript
const nearbyPharmacies = await findNearbyPharmacies(
  userLocation,
  radiusMiles = 5
);
// Returns: [{ name, address, distance, hours }, ...]
```

### 5. **QR Code Order (for in-store scanning)**

```javascript
const qrCode = generateOrderQRCode(cartItems);
// Display in modal for user to screenshot or print
```

---

## Styling System

All styles use **CSS custom properties** (design tokens) from `index.css`:

- **Colors**: `--color-primary`, `--color-warning`, `--color-text-primary`, etc.
- **Spacing**: `--space-3`, `--space-4`, `--space-6`, etc.
- **Typography**: `--font-size-lg`, `--font-weight-semibold`, etc.
- **Shadows**: `--shadow-md`, `--shadow-glow-primary`, etc.

Consistent with your existing Medications and Boxes pages.

---

## Mock Data Reference

```javascript
const MOCK_LOW_STOCK_MEDICATIONS = [
  {
    id: 'med-1',
    name: 'Lisinopril',
    currentQty: 8,
    unit: 'tablets',
    dosage: '10mg',
  },
  // Add more as needed
];
```

**To modify mock data**: Edit `MOCK_LOW_STOCK_MEDICATIONS` in [Orders.jsx](../pages/Orders.jsx)

---

## Routing

Orders page is accessible at `/orders`.

**Navigation**: Added to bottom navbar as "Order" tab with shopping cart icon.

**Routes Configuration**:
- [App.jsx](../App.jsx) - Route definition
- [Navbar.jsx](../components/Navbar.jsx) - Navigation item

---

## Best Practices for Extensions

When implementing future integrations:

1. **Use orderService.js**: Keep all order logic centralized
2. **Maintain State**: Cart state in Orders.jsx only
3. **Error Handling**: Always wrap API calls in try-catch, use toast notifications
4. **Validation**: Use `validateOrder()` before submission
5. **Formatting**: Use `formatOrderAsText()` for any text output
6. **Accessibility**: Maintain ARIA labels and keyboard navigation

---

## Testing Checklist

- [ ] Mock data displays correctly
- [ ] Increment/decrement buttons work
- [ ] Direct quantity input works (min 1, max 999)
- [ ] Remove button removes item
- [ ] Empty state displays when no items
- [ ] Order summary totals correctly
- [ ] "Send to Pharmacy" button triggers handleOrder()
- [ ] Toast messages appear on actions
- [ ] Tab navigation works (keyboard accessibility)
- [ ] Responsive on mobile (cart items stack)

---

## Common Customizations

### Change Low-Stock Threshold
In [orderService.js](../services/orderService.js), `filterLowStockMedications()`:
```javascript
const LOW_STOCK_THRESHOLD = 20; // Change this number (percentage)
```

### Change Quantity Stepper Defaults
In [Orders.jsx](../pages/Orders.jsx), initialization:
```javascript
restockQty: Math.ceil(med.currentQty * 2), // Currently 2x, adjust multiplier
```

### Adjust Button Colors
In [Orders.css](../Orders.css):
```css
.orders-submit-btn {
  background: var(--color-primary); /* Change to any --color-* token */
}
```

---

## Related Files

- API Service: [frontend/src/services/api.js](../services/api.js)
- Toast Context: [frontend/src/context/ToastContext.jsx](../context/ToastContext.jsx)
- Icons: [frontend/src/components/Icon.jsx](../components/Icon.jsx)
- Design Tokens: [frontend/src/index.css](../index.css)

---

## Questions & Support

- **Dark mode**: Handled by CSS media queries in `Orders.css`
- **Language**: Currently English; i18n-ready (strings can be extracted to constants)
- **Analytics**: Console logs ready; replace with your analytics service
- **Offline**: No offline support yet; can be added with localStorage + service workers

