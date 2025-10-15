<div align="center">

# ☁️ Personal Cloud Storage App

### Store, Manage, and Access Your Files Anywhere

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack)

---

</div>

## 📖 About

A modern, full-stack personal cloud storage application built with React, TypeScript, and Backblaze B2. Upload, organize, download, and manage your files with a beautiful, responsive interface. Enjoy **10GB of free storage** with Backblaze B2's free tier!

### ✨ Why This Project?

- 🎯 **Zero Lock-in**: Own your data with Backblaze B2
- 💰 **Cost-Effective**: 10GB free storage, then $6/TB/month
- 🔒 **Secure**: API keys protected on backend, presigned URLs
- 🎨 **Modern UI**: Material-UI with drag-and-drop
- ⚡ **Fast**: Direct uploads to B2, no intermediary storage
- 📱 **Responsive**: Works on desktop, tablet, and mobile

---

## 🚀 Features

### Core Functionality
✅ **Drag-and-Drop Upload** - Intuitive file uploads with visual feedback  
✅ **Multi-File Upload** - Upload multiple files simultaneously  
✅ **Real-time Progress** - Live upload progress bars for each file  
✅ **Image Previews** - Automatic thumbnails for images  
✅ **Smart Download** - One-click downloads with original filenames  
✅ **Safe Delete** - Confirmation dialogs prevent accidental deletions  
✅ **Responsive Grid** - Adapts to screen size (1/2/3/4 columns)  
✅ **File Metadata** - Display size, upload date, and file type  

### Technical Features
🔐 **Secure Architecture** - No API keys exposed to frontend  
⚡ **CORS-Free** - Upload proxy eliminates browser restrictions  
🎯 **TypeScript** - Full type safety and autocomplete  
🧩 **Modular Code** - Clean component architecture  
📦 **10GB Free Storage** - Backblaze B2 free tier included  

---

## 🎬 Demo

### Upload Interface
```
┌─────────────────────────────────────┐
│   📁 Drag & Drop Files Here         │
│          or                         │
│      [Browse Files]                 │
│                                     │
│   Maximum file size: 100MB          │
└─────────────────────────────────────┘

Uploading 2 file(s)...
━━━━━━━━━━━━━━━━━━━━ 100%  photo.jpg ✓
━━━━━━━━━━━━━ 65%  document.pdf
```

### File Grid
```
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│[IMG] │ │[PDF] │ │[IMG] │ │[DOC] │
│Photo │ │Docs  │ │Slide │ │Notes │
│2.3MB │ │450KB │ │1.1MB │ │89KB  │
│⬇ 🗑  │ │⬇ 🗑  │ │⬇ 🗑  │ │⬇ 🗑  │
└──────┘ └──────┘ └──────┘ └──────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript 5** - Type safety
- **Vite** - Lightning-fast build tool
- **Material-UI (MUI)** - Component library
- **Axios** - HTTP client
- **React Dropzone** - Drag-and-drop uploads

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express** - Web framework
- **AWS SDK v3** - S3-compatible API client
- **Multer** - File upload middleware
- **dotenv** - Environment variables

### Cloud Storage
- **Backblaze B2** - Object storage (S3-compatible)
- **10GB Free Tier** - No credit card required

---

## 📦 Installation

### Prerequisites

Before you begin, ensure you have:
- ✅ **Node.js** v18.0.0 or higher ([Download](https://nodejs.org))
- ✅ **npm** v8.0.0 or higher (comes with Node.js)
- ✅ **Backblaze B2 Account** ([Sign up free](https://www.backblaze.com/b2/sign-up.html))

### Step 1: Clone the Repository

```
git clone https://github.com/yourusername/cloud-storage-app.git
cd cloud-storage-app
```

### Step 2: Set Up Backblaze B2

1. **Create a Bucket**
   - Go to [Backblaze B2 Console](https://secure.backblaze.com/b2_buckets.htm)
   - Click "Create a Bucket"
   - Name: `my-cloud-storage` (or any unique name)
   - Files are: **Private**

2. **Generate Application Key**
   - Go to "App Keys"
   - Click "Add a New Application Key"
   - Allow access to your bucket
   - Type: **Read and Write**
   - **Save the keyID and applicationKey** (shown only once!)

3. **Configure CORS** (Important!)
   - Go to your bucket settings
   - Set CORS Rules to: **"Share everything with every origin"**
   - Or use custom JSON (see [CORS Setup](#cors-setup))

### Step 3: Backend Setup

```
cd backend
npm install
```

Create `.env` file:
```
B2_KEY_ID=your_key_id_here
B2_APPLICATION_KEY=your_application_key_here
B2_BUCKET_NAME=my-cloud-storage
B2_REGION=us-west-004
B2_ENDPOINT=https://s3.us-west-004.backblazeb2.com
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Start backend:
```
npm run dev
```

**Expected output:**
```
🚀 Backend server running on http://localhost:5000
📦 Connected to B2 bucket: my-cloud-storage
🌐 Accepting requests from: http://localhost:5173
```

### Step 4: Frontend Setup

Open a **new terminal**:

```
cd frontend
npm install
```

Create `.env` file:
```
VITE_API_URL=http://localhost:5000
```

Start frontend:
```
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### Step 5: Open the App

Visit **http://localhost:5173** in your browser 🎉

---

## 🎯 Usage

### Upload Files

1. **Drag & Drop**: Drag files from your desktop to the upload zone
2. **Browse**: Click "Browse Files" to select files
3. **Watch Progress**: See real-time upload progress bars
4. **View Files**: Uploaded files appear in the grid below

### Download Files

Click the **⬇️ download icon** on any file card

### Delete Files

1. Click the **🗑️ delete icon**
2. Confirm in the popup dialog
3. File is removed from storage immediately

### File Organization

Files are displayed in a responsive grid:
- **Mobile**: 1 column
- **Tablet**: 2 columns
- **Desktop**: 3 columns
- **Large screens**: 4 columns

---

## 📁 Project Structure

```
cloud-storage-app/
│
├── backend/                    # Node.js Express server
│   ├── src/
│   │   ├── server.js          # Main server file
│   │   └── b2Client.js        # B2 SDK configuration
│   ├── .env                   # Environment variables (DO NOT COMMIT)
│   ├── .env.example           # Environment template
│   └── package.json
│
├── frontend/                   # React TypeScript app
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.tsx    # Drag-drop upload
│   │   │   ├── FileList.tsx      # File grid display
│   │   │   ├── FileItem.tsx      # Individual file card
│   │   │   └── ProgressBar.tsx   # Upload progress
│   │   ├── services/
│   │   │   ├── api.ts            # Backend API calls
│   │   │   └── uploadService.ts  # Upload logic
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript interfaces
│   │   ├── App.tsx               # Main component
│   │   └── main.tsx              # React entry
│   ├── .env                   # Environment variables
│   └── package.json
│
└── README.md                  # This file
```

---

## 🔧 Configuration

### CORS Setup

For development (current setup):
```
{
  "corsRuleName": "allowAll",
  "allowedOrigins": ["*"],
  "allowedOperations": ["s3_put", "s3_get", "s3_delete"],
  "allowedHeaders": ["*"],
  "maxAgeSeconds": 3600
}
```

## 🚀 Deployment

### Backend → Railway/Render

1. Push code to GitHub
2. Create account on [Railway.app](https://railway.app) or [Render.com](https://render.com)
3. Connect GitHub repository
4. Add environment variables in dashboard
5. Deploy!

### Frontend → Vercel

```
cd frontend
npm run build
npx vercel --prod
```

**Update environment variables**:
- Set `VITE_API_URL` to your production backend URL
- Update backend `FRONTEND_URL` to your Vercel domain
- Update B2 CORS rules with production domains

---

## 💰 Cost Breakdown

### Backblaze B2 Pricing

| Tier | Storage | Download | Monthly Cost |
|------|---------|----------|--------------|
| **Free** | 10GB | 1GB/day | $0 |
| Paid | Per GB | Per GB | ~$0.006/GB storage |

**Example**: 
- 20GB storage = (20-10) × $0.006 = **$0.06/month**
- 50GB storage = (50-10) × $0.006 = **$0.24/month**

Compare to competitors: AWS S3 ($0.023/GB), Google Cloud ($0.020/GB) 💸

---

## 📚 Resources

- [Backblaze B2 Documentation](https://www.backblaze.com/docs/cloud-storage)
- [Material-UI Components](https://mui.com/material-ui/getting-started/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)

---


### ⭐ Star this repo if you found it helpful!

**Made with ❤️ and ☕ by Chinmay Dhamgunde**

[Back to Top ↑](#-personal-cloud-storage-app)

</div>