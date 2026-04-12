# RailSeva

AI-assisted complaint management system for Indian Railways.

RailSeva helps passengers file complaints, attach media, extract ticket details, classify issues, and route them to the correct department. It combines a React frontend, a Node.js backend, and a FastAPI-based ML service for OCR and media analysis.

## Overview

RailSeva is designed to streamline railway complaint handling with a simple user flow:

1. A passenger submits a complaint from the web app.
2. Optional ticket/media files are processed by the ML service.
3. The backend stores the complaint in MongoDB.
4. Media files are uploaded to Cloudinary for production-friendly storage.
5. Admin and department users can review, resolve, transfer, and report complaints.

The project also includes multilingual UI support and a Gemini-powered assistant endpoint for railway-related queries.

## Features

### Passenger Side

- Complaint submission with journey details
- Optional media upload
- Ticket OCR for extracting PNR, train number, coach, and seat details
- Complaint status tracking
- Multilingual interface

### Admin and Department Side

- Complaint dashboard
- Department-wise complaint filtering
- Complaint transfer and resolution workflow
- Complaint reporting for irrelevant issues
- Complaint history and logs

### AI and Media Processing

- OCR for ticket images
- Complaint categorization from uploaded media
- Optional chatbot-style generative response endpoint
- Cloudinary media storage for deployment use cases

## Tech Stack

### Frontend

- React 18
- React Router
- React Bootstrap
- i18next for translations
- Axios for API calls

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- Multer for file handling
- Cloudinary for media storage
- Nodemailer for OTP emails
- Google Generative AI endpoint

### ML API

- FastAPI
- Tesseract OCR
- OpenCV
- Pillow
- NumPy
- scikit-learn
- Transformers

## Repository Structure

```text
RailSeva/
├── backend/
│   ├── index.js
│   ├── s3Upload.js
│   ├── routes/
│   ├── models/
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── mlApi/
│   ├── test_main.py
│   ├── codebase.py
│   ├── audio.py
│   └── video.py
└── mlmodel/
```

## Prerequisites

Before running the project locally, install:

- Node.js 18 or later
- npm
- Python 3.12 or later
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account
- Gmail account with App Password enabled

For Linux-based systems, also install:

```bash
sudo apt update
sudo apt install -y tesseract-ocr ffmpeg libgl1 python3.12-venv
```

## Environment Setup

Create and fill these variables in [backend/.env](backend/.env):

```dotenv
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GMAIL_USER=your_gmail_address
GMAIL_PASS=your_gmail_app_password
PORT=8001
SERVER_URL=http://localhost:8001
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### What each variable does

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret for auth flows
- `GMAIL_USER`: Gmail address used to send OTP emails
- `GMAIL_PASS`: Gmail App Password
- `PORT`: Backend port, currently `8001`
- `SERVER_URL`: Base URL used to build file links in development
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud identifier
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd RailSeva
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Set up the ML API environment

```bash
cd ../mlApi
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi "uvicorn[standard]" pillow numpy opencv-python pytesseract torch transformers scikit-learn python-multipart moviepy openai-whisper
```

## How to Run

Run each service in a separate terminal.

### Terminal 1: ML API

```bash
cd /home/vipul/RailSeva/mlApi
source .venv/bin/activate
uvicorn test_main:app --host 0.0.0.0 --port 8000 --reload
```

### Terminal 2: Backend

```bash
cd /home/vipul/RailSeva/backend
node index.js
```

### Terminal 3: Frontend

```bash
cd /home/vipul/RailSeva/frontend
npm start
```

## Important URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:8001
- ML API docs: http://localhost:8000/docs

## Main API Endpoints

### Authentication

- `POST /auth/signup`
- `POST /auth/signin`
- `POST /auth/verify-otp`

### Complaint Flow

- `POST /upload-media`
- `POST /submit-complaint`
- `GET /complaintstatus/:complaintId`
- `GET /complaintstatus/all`
- `GET /complaintslogs/all`
- `PUT /complaintslogs/:id`
- `POST /resolve-complaint/:id`
- `POST /resolve/:id/transfer`
- `POST /complaints/:id/report`

### ML and Assistant

- `POST /ocr-image`
- `POST /api/generate`
- `GET /complaints/dashboard`

## Media Storage

RailSeva currently uses Cloudinary for storing uploaded complaint media and resolution images. This is a good choice for deployment because:

- It is easier to scale than local disk storage.
- It supports images, videos, and audio.
- It provides a CDN-backed secure URL for stored files.

For development, the backend still handles uploads through Multer before sending them to Cloudinary.

## Branding

The project branding has been updated from Rail Madad to RailSeva across the UI, translation files, and email content.

## Security Notes

- Do not commit [backend/.env](backend/.env) to Git.
- Use a Gmail App Password instead of your normal password.
- Rotate exposed API secrets if they were shared during testing.
- Move hardcoded secrets to environment variables before production deployment.

## Troubleshooting

### Cloudinary errors

- Confirm your `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are correct.
- Restart the backend after changing `.env`.

### ML API not starting

- Ensure the virtual environment is activated.
- Install `python3.12-venv` on Ubuntu/Debian if `.venv` creation fails.

### Empty department list

- Open the department page and select the correct department.
- New complaints follow the category-to-department mapping in the backend.
- Older complaints may need a refresh or manual correction if they were created before the mapping fix.

### Uploaded file URL looks wrong

- Check `SERVER_URL` in [backend/.env](backend/.env).
- It should usually be `http://localhost:8001` in development.

## Notes for Production

- Cloudinary is a better choice than local storage for deployment.
- MongoDB Atlas is recommended for production data storage.
- Use proper secret management and do not keep API keys in source code.
- Consider externalizing the Gemini API key from the backend source before deploying.

## Future Improvements

- Add a dedicated admin login flow
- Add better complaint analytics and reporting charts
- Move all secrets to env variables
- Add deployment configs for frontend and backend
- Add database migration scripts for old complaint records

## License

No license has been specified yet.
