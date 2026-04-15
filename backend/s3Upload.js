const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config(); 
const axios = require('axios');
const FormData = require('form-data');
const cloudinary = require('cloudinary').v2;
const Complaint = require('./models/Complaint');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration to store files on disk
const uploadWithMulter = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
            const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
            cb(null, uniqueName);
        }
    })
}).single('file'); // Limit to one file

// Sends the uploaded file to the ML service for complaint classification.
// Sends the uploaded file to the ML service and returns the parsed result.
const processWithMLModel = async (file) => {
    try {
        const form = new FormData();
        // With diskStorage, multer provides file.path instead of file.buffer.
        form.append('file', fs.createReadStream(file.path), { filename: file.originalname, contentType: file.mimetype });

        // Send the file to the ML model
        const mlResponse = await axios.post('http://localhost:8000/upload-image/', form, {
            headers: {
                ...form.getHeaders() // Include form-data headers
            }
        });

        return mlResponse.data;
    } catch (error) {
        console.error('Error processing with ML model:', error);
        throw new Error('Error processing file with ML model.');
    }
};

// Uploads a file to Cloudinary and returns its public URL.
const uploadToCloudinary = async (file) => {
    try {
        if (!file) {
            throw new Error('No file provided');
        }

        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            throw new Error('Cloudinary environment variables are missing.');
        }

        const result = await cloudinary.uploader.upload(file.path, {
            resource_type: 'auto',
            folder: 'railseva/complaints',
        });

        return result.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        const cloudinaryMessage = error?.error?.message || error?.message || 'Unknown Cloudinary error';
        throw new Error(`Error uploading file to Cloudinary: ${cloudinaryMessage}`);
    }
};

// Builds and saves the complaint record after optional ML and upload steps.
// Coordinates ML processing, cloud upload, and complaint persistence.
const handleUpload = async (req, res) => {
    try {
        let mlData = { complaint_description: null, category: null };
        let fileUrl = null;

        if (req.file) {
            // Process the file with ML model only when media is provided.
            mlData = await processWithMLModel(req.file);

            // Upload file to Cloudinary
            fileUrl = await uploadToCloudinary(req.file);
        }

        // Save the complaint to MongoDB
        const complaintData = req.body;
        const complaint_description = mlData.complaint_description || complaintData.description || null;
        const category = mlData.category || 'Miscellaneous';

        const complaint = new Complaint({
            userId: complaintData.userId,
            trainNo: complaintData.trainNo || null,
            pnrNo: complaintData.pnrNo || null,
            coachNo: complaintData.coachNo || null,
            seatNo: complaintData.seatNo || null,
            description: complaintData.description || null,
            file: fileUrl || null,
            category: category || null,
            complaint_description: complaint_description || null,
            status: 'Under Review',
            resolutionText: complaintData.resolutionText || null,
            trainName: complaintData.trainName || null,
            currentLocation: complaintData.currentLocation || null,
        });

        await complaint.save();

        console.log('Complaint saved successfully:', complaint._id);
        res.json({ 
          message: "Complaint submitted successfully", 
          complaint: complaint,
          _id: complaint._id,
          url: fileUrl 
        });
    } catch (error) {
        console.error('Error handling upload:', error);
        res.status(500).json({ error: error.message });
    } finally {
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
};

const router = express.Router();

// Accepts a new complaint upload and stores the processed record.
router.post('/upload-media', (req, res) => {
    uploadWithMulter(req, res, err => {
        if (err) {
            console.error('Error uploading file:', err);
            return res.status(422).json({ error: 'Error uploading file. Please try again.' });
        }
        handleUpload(req, res);
    });
});

// Marks a complaint as resolved and stores the resolution image.
router.post('/resolve-complaint/:id', uploadWithMulter, async (req, res) => {
    try {
        const { resolutionText } = req.body;

        if (!req.file || !resolutionText) {
            return res.status(400).json({ error: 'Both resolution text and image are required.' });
        }

        // Upload the resolution image to Cloudinary
        const resolutionImageUrl = await uploadToCloudinary(req.file);

        // Fetch the complaint by ID
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        // Update complaint fields
        const resolvedAt = new Date();
        const resolvedMonth = `${resolvedAt.getFullYear()}-${(resolvedAt.getMonth() + 1).toString().padStart(2, '0')}`;

        complaint.resolutionText = resolutionText;
        complaint.resolutionImageUrl = resolutionImageUrl;
        complaint.status = 'Resolved';
        complaint.resolvedAt = resolvedAt;
        complaint.resolvedMonth = resolvedMonth;
        complaint.isArchived = true;

        // Save the updated complaint
        await complaint.save();

        res.json({ 
            message: 'Complaint resolved successfully', 
            complaint 
        });
    } catch (error) {
        console.error('Error resolving complaint:', error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
    }
});

module.exports = router;
