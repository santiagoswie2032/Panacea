import documentStore from '../config/documentStore.js';
import path from 'path';
import fs from 'fs';
import config from '../config/env.js';

// Get all documents for user
export const getAll = async (req, res, next) => {
    try {
        const { category } = req.query;
        const documents = documentStore.find({ userId: req.userId });
        const filtered = category ? documents.filter((d) => d.category === category) : documents;
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json({ success: true, data: filtered });
    } catch (error) {
        next(error);
    }
};

// Upload document
export const upload = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
        }

        const { name, category } = req.body;

        if (!name || !category) {
            return res.status(400).json({
                success: false,
                message: 'Name and category are required',
            });
        }

        const document = documentStore.create({
            userId: req.userId,
            name,
            category,
            fileName: req.file.filename,
            originalName: req.file.originalname,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
        });

        res.status(201).json({ success: true, data: document });
    } catch (error) {
        next(error);
    }
};

// Rename document
export const rename = async (req, res, next) => {
    try {
        const { name } = req.body;

        const document = documentStore.findByIdAndUpdate(req.params.id, { name });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found',
            });
        }

        res.json({ success: true, data: document });
    } catch (error) {
        next(error);
    }
};

// Delete document
export const remove = async (req, res, next) => {
    try {
        const document = documentStore.findByIdAndDelete(req.params.id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found',
            });
        }

        // Delete physical file
        const filePath = path.join(
            config.upload.dir,
            req.userId.toString(),
            document.fileName
        );
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.json({ success: true, message: 'Document deleted' });
    } catch (error) {
        next(error);
    }
};

// Download / Preview document
export const download = async (req, res, next) => {
    try {
        const document = documentStore.findById(req.params.id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found',
            });
        }

        const filePath = path.join(
            config.upload.dir,
            req.userId.toString(),
            document.fileName
        );

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found on server',
            });
        }

        res.sendFile(path.resolve(filePath));
    } catch (error) {
        next(error);
    }
};
