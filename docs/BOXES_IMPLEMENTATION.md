# Boxes Tab — Implementation Guide

This document covers the implementation of the "Boxes" feature, a digitized medication storage tracking system for older adults.

## Overview

The Boxes tab allows users to organize their medications by physical storage locations (e.g., "Bathroom Cabinet", "Nightstand Drawer"). This feature solves a key problem for older adults: tracking what medications are stored in different physical boxes without relying on easily-lost pieces of paper.

**UI Structure**: Tree-like folder/file view where:
- **Boxes** = Parent nodes (folders) that can be expanded/collapsed
- **Medications** = Child nodes (files) within boxes

## Architecture

### Component Structure

```
Boxes.jsx (Page)
├── BoxItem.jsx (Expandable box)
│   ├── MedicationListItem (child component)
├── BoxForm.jsx (Modal for creating/editing boxes)
├── MedicationBoxForm.jsx (Modal for adding medications to boxes)
```

### State Management

The main state is managed in `Boxes.jsx` using React hooks:

```javascript
const [boxes, setBoxes] = useState([]);           // Array of box objects
const [showBoxForm, setShowBoxForm] = useState(false);     // Box form modal visibility
const [editingBox, setEditingBox] = useState(null);        // Currently editing box
const [showMedicationForm, setShowMedicationForm] = useState(false); // Med form modal visibility
const [selectedBoxForMed, setSelectedBoxForMed] = useState(null);    // Box ID for adding medication
const [editingMedication, setEditingMedication] = useState(null);    // Currently editing medication
```

### Data Structure

Expected data structure from the backend:

```javascript
{
    id: "box123",                    // Unique box ID
    name: "Bathroom Cabinet",        // Box display name
    medications: [
        {
            id: "med456",            // Unique medication ID within box
            name: "Aspirin"          // Medication name
        },
        {
            id: "med789",
            name: "Vitamin D"
        }
    ]
}
```

## API Endpoints

The feature relies on the following backend endpoints (defined in `frontend/src/services/api.js`):

### Box Operations

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/boxes` | Get all boxes with medications |
| GET | `/boxes/:id` | Get a single box by ID |
| POST | `/boxes` | Create a new box |
| PUT | `/boxes/:id` | Update a box (e.g., rename) |
| DELETE | `/boxes/:id` | Delete a box and all its medications |

### Medication Operations (per box)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/boxes/:boxId/medications` | Add medication to a box |
| PUT | `/boxes/:boxId/medications/:medId` | Update medication in a box |
| DELETE | `/boxes/:boxId/medications/:medId` | Remove medication from a box |

### Request/Response Format

**Create Box Request:**
```json
POST /boxes
{
    "name": "Bathroom Cabinet"
}
```

**Create Box Response:**
```json
{
    "id": "box123",
    "name": "Bathroom Cabinet",
    "medications": []
}
```

**Add Medication to Box Request:**
```json
POST /boxes/box123/medications
{
    "name": "Aspirin"
}
```

**Add Medication Response:**
```json
{
    "id": "med456",
    "name": "Aspirin"
}
```

## Frontend Implementation Details

### Boxes.jsx (Main Page)

**Responsibility**: 
- Fetch and display all boxes
- Manage form modals for creating/editing boxes and medications
- Handle all CRUD operations and user interactions

**Key Methods**:

```javascript
// Fetch all boxes from API
fetchBoxes();

// Box operations
handleCreateBox(boxData);      // Create new box
handleEditBox(boxData);        // Update existing box
handleDeleteBox(boxId);        // Delete box with confirmation

// Medication operations
handleAddMedicationToBox(boxId);              // Show form to add medication
handleSaveMedication(medicationData);         // Save new or edited medication
handleEditMedication(boxId, medication);      // Show form to edit medication
handleDeleteMedication(boxId, medicationId);  // Delete medication with confirmation
```

**Accessibility Features**:
- Large font sizes for readability
- 48px+ minimum touch targets
- ARIA labels on all interactive elements
- Focus management and keyboard support
- Confirmation dialogs for destructive actions

### BoxItem.jsx (Expandable Box Component)

**Props**:
- `box` — The box to display
- `onEdit` — Callback when edit button clicked
- `onDelete` — Callback when delete button clicked
- `onAddMedication` — Callback when "Add" button clicked
- `onEditMedication` — Callback when medication edit clicked
- `onDeleteMedication` — Callback when medication delete clicked

**Features**:
- Expandable/collapsible to show/hide medications
- Displays box name and medication count
- Shows empty state when no medications
- Smooth animations on expand/collapse
- Action buttons with hover states

### BoxForm.jsx (Create/Edit Box Modal)

**Props**:
- `box` — Box object (null if creating new)
- `onSave` — Callback with form data
- `onClose` — Callback to close modal

**Features**:
- Simple one-field form (just the box name)
- Validation (required field)
- Large input field (font-size: 1.125rem)
- Save and Cancel buttons
- Auto-focuses the input field

### MedicationBoxForm.jsx (Add/Edit Medication Modal)

**Props**:
- `medication` — Medication object (null if creating new)
- `onSave` — Callback with form data
- `onClose` — Callback to close modal

**Features**:
- Simple one-field form (just the medication name)
- Validation (required field)
- Helpful hint text
- Large input field
- Save and Cancel buttons

## Styling & Design System

All components use the existing Panacea design system defined in `index.css`:

### Key CSS Variables Used
- `--color-primary: #22C55E;` — Green accent
- `--color-text-primary: #1F2937;` — Dark text
- `--color-bg-card: rgba(255, 255, 255, 0.9);` — Card background
- `--font-size-lg: 1.125rem;` — Large text for readability
- `--space-4: 1rem;` — Standard spacing
- `--radius-lg: 1rem;` — Rounded corners

### Accessibility Features
- Minimum 48px touch targets (buttons, interactive elements)
- High contrast colors (WCAG AA compliant)
- Large, readable fonts
- Clear focus indicators (2px primary color outline)
- Smooth transitions for visual feedback

## Integration Steps for Backend

### 1. Create Box Model

```javascript
// models/Box.js
{
    id: ObjectId,
    userId: ObjectId (reference to User),
    name: String (required, max 100 chars),
    medications: [
        {
            id: ObjectId,
            name: String (required)
        }
    ],
    createdAt: Date,
    updatedAt: Date
}
```

### 2. Implement Routes

Create `backend/src/routes/boxes.js`:

```javascript
const router = require('express').Router();
const boxController = require('../controllers/boxController');
const auth = require('../middlewares/auth');

// All routes require authentication
router.use(auth);

// Box endpoints
router.get('/', boxController.getBoxes);              // Get all boxes
router.post('/', boxController.createBox);            // Create new box
router.get('/:id', boxController.getBox);             // Get single box
router.put('/:id', boxController.updateBox);          // Update box
router.delete('/:id', boxController.deleteBox);       // Delete box

// Medication endpoints per box
router.post('/:boxId/medications', boxController.addMedicationToBox);
router.put('/:boxId/medications/:medId', boxController.updateBoxMedication);
router.delete('/:boxId/medications/:medId', boxController.deleteBoxMedication);

module.exports = router;
```

### 3. Register Routes in server.js

```javascript
// backend/src/server.js
const boxRoutes = require('./routes/boxes');

// ... other middleware ...

app.use('/api/boxes', boxRoutes);
```

### 4. Create Controller

Create `backend/src/controllers/boxController.js` with CRUD operations for boxes and medications.

### 5. Authentication

All endpoints require authentication. The middleware checks the JWT cookie and adds `req.user` (containing userId) to the request.

**Important**: Always filter results by `userId` to ensure users only see their own boxes.

## Usage Flow

### Creating a Box
1. User clicks "New Box" button → `BoxForm` modal opens
2. User enters box name (e.g., "Bedroom Nightstand")
3. User clicks "Create Box"
4. Frontend sends: `POST /api/boxes { name: "Bedroom Nightstand" }`
5. Page refreshes to show new box in the list

### Adding Medication to a Box
1. User expands a box (clicks the box header or expand icon)
2. User sees list of medications (empty if new box)
3. User clicks "Add Item" or "Add Another Item"
4. `MedicationBoxForm` modal opens
5. User enters medication name (e.g., "Ibuprofen")
6. User clicks "Add to Box"
7. Frontend sends: `POST /api/boxes/box123/medications { name: "Ibuprofen" }`
8. Page refreshes to show medication in the expanded box

### Editing a Medication
1. User finds the medication in the expanded box
2. User clicks the edit icon next to the medication
3. `MedicationBoxForm` modal opens with pre-filled name
4. User modifies the name
5. User clicks "Update"
6. Frontend sends: `PUT /api/boxes/box123/medications/med456 { name: "New Name" }`
7. List updates to show new name

### Deleting a Box
1. User clicks the trash icon on a box
2. Confirmation dialog appears: "Are you sure? This action cannot be undone."
3. If confirmed, frontend sends: `DELETE /api/boxes/box123`
4. Page refreshes with updated list

## Testing Guide

### Manual Testing Checklist

- [ ] Create a new box
- [ ] Edit box name
- [ ] Delete box (verify confirmation dialog)
- [ ] Expand/collapse box
- [ ] Add medication to box
- [ ] Edit medication name
- [ ] Delete medication (verify confirmation)
- [ ] Verify empty state when no boxes exist
- [ ] Verify medication count displays correctly
- [ ] Test on mobile device (check touch targets)
- [ ] Test keyboard navigation (Tab, Enter, Escape)
- [ ] Test screen reader (ARIA labels)

### API Testing Examples

```bash
# Create a box
curl -X POST http://localhost:5000/api/boxes \
  -H "Content-Type: application/json" \
  -d '{"name": "Bathroom Cabinet"}'

# Get all boxes
curl http://localhost:5000/api/boxes

# Add medication to box
curl -X POST http://localhost:5000/api/boxes/box123/medications \
  -H "Content-Type: application/json" \
  -d '{"name": "Aspirin"}'

# Update box name
curl -X PUT http://localhost:5000/api/boxes/box123 \
  -H "Content-Type: application/json" \
  -d '{"name": "New Box Name"}'

# Delete medication
curl -X DELETE http://localhost:5000/api/boxes/box123/medications/med456
```

## Error Handling

The frontend includes error handling for:

- Network errors → Toast message: "Network error. Please check your connection."
- API errors → Toast message with error details
- Validation errors → Form shows validation message (e.g., "Box name is required")
- 401 Unauthorized → Redirects to /login

## Performance Considerations

- Boxes and medications are fetched as a single request on page load
- Changes trigger a full page refresh (could be optimized with local state mutations)
- Consider batching multiple operations if performance becomes an issue

## Future Enhancements

Potential improvements to consider:

1. **Search/Filter**: Add search functionality to find boxes or medications
2. **Organize**: Allow drag-and-drop to reorder boxes or move medications between boxes
3. **Notes**: Add optional notes field (e.g., "Store in cool dry place")
4. **Quantity**: Track stock quantities similar to the Medications tab
5. **Sync with Medications Tab**: Link boxes to the main Medications inventory
6. **Templates**: Pre-populated box templates (e.g., "Daily Routine", "Weekend")
7. **Image Upload**: Allow photos of physical boxes

## Troubleshooting

### Boxes page shows "Loading..." indefinitely
- Check if `/api/boxes` endpoint is working
- Verify authentication is working (check user is logged in)
- Check browser console for API errors

### Modals won't close after save
- Verify API response includes correct data structure
- Check `fetchBoxes()` is being called after save
- Verify setShowBoxForm/setShowMedicationForm are being called in onSave callbacks

### Deleted boxes/medications still showing
- Verify DELETE endpoint returns success
- Check `fetchBoxes()` is being called after delete
- Clear browser cache if state seems stale

## File Structure Summary

```
frontend/src/
├── pages/
│   └── Boxes.jsx                    # Main page component
├── components/
│   ├── BoxItem.jsx                  # Expandable box component
│   ├── BoxForm.jsx                  # Create/edit box modal
│   ├── MedicationBoxForm.jsx         # Add/edit medication modal
│   ├── BoxItem.css
│   ├── BoxForm.css
│   └── MedicationBoxForm.css
├── pages/
│   └── Boxes.css                    # Page styling + modal styles
└── services/
    └── api.js                       # API methods for boxes
```

---

**Last Updated**: March 2026
**Panacea Version**: 1.2.0 (with Boxes feature)
