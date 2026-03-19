# Boxes Feature — Backend Implementation Guide

This guide provides the backend code structure needed to support the Boxes feature.

## Database Model

### Box Schema (MongoDB with Mongoose)

```javascript
// backend/src/models/Box.js

const boxSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        name: {
            type: String,
            required: [true, 'Box name is required'],
            trim: true,
            maxlength: [100, 'Box name cannot exceed 100 characters']
        },
        medications: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    default: mongoose.Types.ObjectId
                },
                name: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: [100, 'Medication name cannot exceed 100 characters']
                }
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Box', boxSchema);
```

## Controller Implementation

### Box Controller

```javascript
// backend/src/controllers/boxController.js

const Box = require('../models/Box');

/**
 * GET /api/boxes
 * Get all boxes for the authenticated user
 */
exports.getBoxes = async (req, res) => {
    try {
        const boxes = await Box.find({ userId: req.user.id })
            .sort({ createdAt: -1 });
        
        res.status(200).json(boxes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * GET /api/boxes/:id
 * Get a single box by ID
 */
exports.getBox = async (req, res) => {
    try {
        const box = await Box.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!box) {
            return res.status(404).json({ message: 'Box not found' });
        }

        res.status(200).json(box);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * POST /api/boxes
 * Create a new box
 */
exports.createBox = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Box name is required' });
        }

        const box = new Box({
            userId: req.user.id,
            name: name.trim(),
            medications: []
        });

        await box.save();
        res.status(201).json(box);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * PUT /api/boxes/:id
 * Update a box (e.g., rename it)
 */
exports.updateBox = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Box name is required' });
        }

        const box = await Box.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!box) {
            return res.status(404).json({ message: 'Box not found' });
        }

        box.name = name.trim();
        await box.save();

        res.status(200).json(box);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * DELETE /api/boxes/:id
 * Delete a box and all its medications
 */
exports.deleteBox = async (req, res) => {
    try {
        const box = await Box.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!box) {
            return res.status(404).json({ message: 'Box not found' });
        }

        res.status(200).json({ message: 'Box deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * POST /api/boxes/:boxId/medications
 * Add a medication to a specific box
 */
exports.addMedicationToBox = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Medication name is required' });
        }

        const box = await Box.findOne({
            _id: req.params.boxId,
            userId: req.user.id
        });

        if (!box) {
            return res.status(404).json({ message: 'Box not found' });
        }

        // Create new medication object with unique ID
        const newMedication = {
            id: new mongoose.Types.ObjectId(),
            name: name.trim()
        };

        box.medications.push(newMedication);
        await box.save();

        res.status(201).json(newMedication);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * PUT /api/boxes/:boxId/medications/:medId
 * Update a medication within a box
 */
exports.updateBoxMedication = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ message: 'Medication name is required' });
        }

        const box = await Box.findOne({
            _id: req.params.boxId,
            userId: req.user.id
        });

        if (!box) {
            return res.status(404).json({ message: 'Box not found' });
        }

        // Find medication in the box
        const medication = box.medications.id(req.params.medId);

        if (!medication) {
            return res.status(404).json({ message: 'Medication not found in box' });
        }

        medication.name = name.trim();
        await box.save();

        res.status(200).json(medication);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * DELETE /api/boxes/:boxId/medications/:medId
 * Delete a medication from a box
 */
exports.deleteBoxMedication = async (req, res) => {
    try {
        const box = await Box.findOne({
            _id: req.params.boxId,
            userId: req.user.id
        });

        if (!box) {
            return res.status(404).json({ message: 'Box not found' });
        }

        // Remove medication from the box
        box.medications.id(req.params.medId).deleteOne();
        await box.save();

        res.status(200).json({ message: 'Medication removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
```

## Routes Setup

### Boxes Routes

```javascript
// backend/src/routes/boxes.js

const express = require('express');
const router = express.Router();
const boxController = require('../controllers/boxController');
const auth = require('../middlewares/auth');

// All routes require authentication
router.use(auth);

// Box endpoints
router.get('/', boxController.getBoxes);
router.post('/', boxController.createBox);
router.get('/:id', boxController.getBox);
router.put('/:id', boxController.updateBox);
router.delete('/:id', boxController.deleteBox);

// Medication endpoints per box
router.post('/:boxId/medications', boxController.addMedicationToBox);
router.put('/:boxId/medications/:medId', boxController.updateBoxMedication);
router.delete('/:boxId/medications/:medId', boxController.deleteBoxMedication);

module.exports = router;
```

### Register in Server

```javascript
// backend/src/server.js

const boxRoutes = require('./routes/boxes');

// ... existing middleware and routes ...

// Add boxes routes
app.use('/api/boxes', boxRoutes);

// ... rest of server setup ...
```

## Authentication Middleware

Ensure your auth middleware adds `req.user.id`:

```javascript
// backend/src/middlewares/auth.js

const auth = (req, res, next) => {
    try {
        // Extract token from cookie or header
        const token = req.cookies.auth || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify and decode token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }

            // Add user info to request
            req.user = { id: decoded.userId }; // Ensure this is set
            next();
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = auth;
```

## Testing the API

### Using cURL

```bash
# 1. Create a box
curl -X POST http://localhost:5000/api/boxes \
  -H "Content-Type: application/json" \
  -H "Cookie: auth=<your_jwt_token>" \
  -d '{
    "name": "Bathroom Cabinet"
  }'

# Response:
# {
#   "_id": "507f1f77bcf86cd799439011",
#   "userId": "507f1f77bcf86cd799439012",
#   "name": "Bathroom Cabinet",
#   "medications": [],
#   "createdAt": "2026-03-19T10:00:00Z",
#   "updatedAt": "2026-03-19T10:00:00Z"
# }

# 2. Get all boxes
curl http://localhost:5000/api/boxes \
  -H "Cookie: auth=<your_jwt_token>"

# 3. Add medication to box
curl -X POST http://localhost:5000/api/boxes/507f1f77bcf86cd799439011/medications \
  -H "Content-Type: application/json" \
  -H "Cookie: auth=<your_jwt_token>" \
  -d '{
    "name": "Aspirin"
  }'

# 4. Update box name
curl -X PUT http://localhost:5000/api/boxes/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Cookie: auth=<your_jwt_token>" \
  -d '{
    "name": "Master Bathroom Cabinet"
  }'

# 5. Delete medication
curl -X DELETE http://localhost:5000/api/boxes/507f1f77bcf86cd799439011/medications/med_id_here \
  -H "Cookie: auth=<your_jwt_token>"

# 6. Delete box
curl -X DELETE http://localhost:5000/api/boxes/507f1f77bcf86cd799439011 \
  -H "Cookie: auth=<your_jwt_token>"
```

### Using Postman

1. Set up environment variables:
   - `base_url`: http://localhost:5000
   - `auth_token`: Your JWT token from login

2. Create requests:

**GET All Boxes**
```
GET {{base_url}}/api/boxes
Headers: Authorization: Bearer {{auth_token}}
```

**POST Create Box**
```
POST {{base_url}}/api/boxes
Headers: Content-Type: application/json
Body: {
    "name": "Bathroom Cabinet"
}
```

**POST Add Medication**
```
POST {{base_url}}/api/boxes/{{box_id}}/medications
Headers: Content-Type: application/json
Body: {
    "name": "Aspirin"
}
```

## Error Handling

The API returns standard HTTP status codes:

| Status | Meaning |
|--------|---------|
| 200 | OK — Request succeeded |
| 201 | Created — New resource created |
| 400 | Bad Request — Invalid input |
| 401 | Unauthorized — Authentication required |
| 404 | Not Found — Resource doesn't exist |
| 500 | Server Error — Internal server error |

**Error Response Format:**
```json
{
    "message": "Box not found"
}
```

## Validation Rules

### Box Name
- Required
- Max 100 characters
- Will be trimmed of whitespace

### Medication Name
- Required
- Max 100 characters
- Will be trimmed of whitespace

## Security Considerations

1. **User Isolation**: Always filter by `userId` to ensure users only see their own boxes
2. **Authentication**: All endpoints require valid JWT token
3. **Authorization**: Verify the box belongs to the authenticated user before modifying
4. **Input Validation**: Validate and sanitize all input data
5. **Rate Limiting**: Consider adding rate limiting for API endpoints

## Performance Tips

1. **Indexing**: Add index on `userId` for faster queries
2. **Pagination**: If boxes list becomes large, consider adding pagination
3. **Validation**: Validate on both client and server side
4. **Caching**: Consider caching boxes list for temporary periods

## Deployment Checklist

- [ ] Database connection configured
- [ ] JWT secret is set in environment variables
- [ ] Authentication middleware is working
- [ ] Box model is created and migrations run
- [ ] Routes are registered in server.js
- [ ] Error handling is in place
- [ ] CORS is configured if needed
- [ ] Input validation is working
- [ ] API endpoints tested with real data
- [ ] User isolation verified (can't access other users' boxes)

---

**Created**: March 2026
**Panacea Backend Version**: 1.2.0 (with Boxes API)
