/**
 * ORDER SERVICE
 * ============
 * Handles order operations and future integrations
 * 
 * FUTURE INTEGRATIONS:
 * - Pharmacy API connections (CVS, Walgreens, local pharmacies)
 * - Deep-linking to Healthpotli or similar apps
 * - SMS/Email pharmacy notifications
 * - QR code or PDF generation for orders
 * - Geolocation-based pharmacy matching
 */

/**
 * Interface: Order Structure
 * Used throughout the order system
 */
export const orderStructure = {
    id: 'order-123',
    userId: 'user-456',
    timestamp: new Date().toISOString(),
    medications: [
        {
            id: 'med-1',
            name: 'Lisinopril',
            dosage: '10mg',
            currentQty: 8,
            restockQty: 16,
            unit: 'tablets',
        },
    ],
    status: 'pending', // pending, sent, confirmed, fulfilled
};

/**
 * Future: Submit order to pharmacy API
 * @param {Array} medications - List of medications to order
 * @param {Object} user - Current user object
 * @returns {Promise<Object>} Order confirmation from pharmacy
 */
export async function submitPharmacyOrder(medications, user) {
    // FUTURE: Replace with actual pharmacy API
    // Example implementation:
    /*
    const response = await api.post('/api/orders/pharmacy', {
        userId: user.id,
        medications: medications.map(m => ({
            medicationId: m.id,
            quantity: m.restockQty,
        })),
        preferences: {
            nearestPharmacy: true,
            preferredPharmacy: user.preferredPharmacy,
        },
    });
    return response.data;
    */
    console.warn('submitPharmacyOrder: Implement pharmacy API integration');
}

/**
 * Future: Deep-link to Healthpotli or similar service
 * @param {Array} medications - List of medications to order
 * @param {Object} user - Current user object
 */
export function deepLinkToPharmacyApp(medications, user) {
    // FUTURE: Implement deep-linking logic
    /*
    const params = new URLSearchParams({
        medications: JSON.stringify(medList),
        userId: user.id,
        userName: user.fullName,
        userPhone: user.phone,
    });
    window.location.href = `healthpotli://order?${params}`;
    */
    console.warn('deepLinkToPharmacyApp: Implement app deep-linking');
}

/**
 * Future: Send order via SMS or Email
 * @param {Array} medications - List of medications
 * @param {String} method - 'sms' or 'email'
 * @param {Object} destination - Phone or email details
 */
export async function sendOrderViaMessaging(medications, method = 'email', destination) {
    // FUTURE: Implement messaging integration
    /*
    const response = await api.post('/api/orders/send', {
        method,
        destination,
        medications: medications.map(m => `${m.name} (${m.dosage}): ${m.restockQty} ${m.unit}`),
        timestamp: new Date().toISOString(),
    });
    return response.data;
    */
    console.warn('sendOrderViaMessaging: Implement SMS/Email integration');
}

/**
 * Future: Generate QR code for order
 * @param {Array} medications - List of medications
 * @returns {String} QR code data URL or SVG
 */
export function generateOrderQRCode(medications) {
    // FUTURE: Use qrcode.react or similar library
    /*
    const qrValue = JSON.stringify({
        medications: medications.map(m => ({
            name: m.name,
            dosage: m.dosage,
            qty: m.restockQty,
        })),
    });
    return <QRCode value={qrValue} />;
    */
    console.warn('generateOrderQRCode: Implement QR code generation');
}

/**
 * Future: Generate PDF order slip
 * @param {Array} medications - List of medications
 * @param {Object} user - User details
 * @returns {Blob} PDF file
 */
export async function generateOrderPDF(medications, user) {
    // FUTURE: Use pdfkit or similar library
    /*
    const doc = new jsPDF();
    doc.text('Medication Reorder Request', 10, 10);
    doc.text(`Patient: ${user.fullName}`, 10, 20);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 30);
    
    let yPos = 40;
    medications.forEach(med => {
        doc.text(`${med.name} (${med.dosage}): ${med.restockQty} ${med.unit}`, 10, yPos);
        yPos += 10;
    });
    
    return doc.output('blob');
    */
    console.warn('generateOrderPDF: Implement PDF generation');
}

/**
 * Future: Find nearby pharmacies based on geolocation
 * @param {Object} userLocation - { latitude, longitude }
 * @param {Number} radiusMiles - Search radius
 * @returns {Promise<Array>} List of nearby pharmacies
 */
export async function findNearbyPharmacies(userLocation, radiusMiles = 5) {
    // FUTURE: Integrate with pharmacy directory services
    /*
    const response = await api.post('/api/pharmacies/nearby', {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        radiusMiles,
    });
    return response.data.pharmacies;
    */
    console.warn('findNearbyPharmacies: Implement geolocation pharmacy lookup');
}

/**
 * Mock: Convert order to human-readable format
 * Useful for displaying in messages, emails, or printouts
 * @param {Array} medications - List of medications
 * @returns {String} Formatted order text
 */
export function formatOrderAsText(medications) {
    let text = 'Medication Reorder:\n\n';
    medications.forEach((med, index) => {
        text += `${index + 1}. ${med.name} (${med.dosage})\n`;
        text += `   Quantity: ${med.restockQty} ${med.unit}\n`;
        text += `   Current Stock: ${med.currentQty} ${med.unit}\n\n`;
    });
    return text;
}

/**
 * Mock: Validate order before submission
 * @param {Array} medications - List of medications
 * @returns {Object} { isValid: boolean, errors: Array<string> }
 */
export function validateOrder(medications) {
    const errors = [];

    if (!medications || medications.length === 0) {
        errors.push('Order must contain at least one medication');
    }

    medications.forEach((med) => {
        if (!med.name || med.name.trim() === '') {
            errors.push(`Medication name is required`);
        }
        if (!med.restockQty || med.restockQty < 1) {
            errors.push(`${med.name}: Restock quantity must be at least 1`);
        }
        if (med.restockQty > 999) {
            errors.push(`${med.name}: Restock quantity exceeds maximum (999)`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Mock: Transform API medications to order format
 * Call this when integrating with real medications list
 * @param {Array} apiMedications - Medications from API
 * @returns {Array} Medications ready for ordering
 */
export function filterLowStockMedications(apiMedications) {
    const LOW_STOCK_THRESHOLD = 20; // Percentage

    return apiMedications
        .map((med) => {
            const stockPercent = med.totalStock > 0
                ? Math.round((med.remainingStock / med.totalStock) * 100)
                : 0;

            if (stockPercent <= LOW_STOCK_THRESHOLD) {
                return {
                    id: med._id,
                    name: med.name,
                    dosage: med.dosage,
                    currentQty: med.remainingStock,
                    unit: 'tablets', // or derive from med.unit
                    restockQty: Math.ceil(med.remainingStock * 2),
                };
            }
            return null;
        })
        .filter((med) => med !== null);
}

export default {
    submitPharmacyOrder,
    deepLinkToPharmacyApp,
    sendOrderViaMessaging,
    generateOrderQRCode,
    generateOrderPDF,
    findNearbyPharmacies,
    formatOrderAsText,
    validateOrder,
    filterLowStockMedications,
};
