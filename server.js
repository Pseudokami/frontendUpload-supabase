// server.js - AXIOS VERSION (The "Reliable Messenger")
const express = require('express');
const multer = require('multer'); 
const cors = require('cors');
const axios = require('axios'); // <--- The new messenger

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors()); 
app.use(express.json());

// --- YOUR KEYS ---
const SUPABASE_URL = 'https://egnrgisgkgekzznzkofq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnbnJnaXNna2dla3p6bnprb2ZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDA1NTc2NSwiZXhwIjoyMDc5NjMxNzY1fQ.lpR8WIErtjdDqCv-qnjIacLH_vyTFelDu43Tax9gMFg'; 

// ENDPOINT 1: Upload via Axios
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) throw new Error("No file received");
    
    const file = req.file;
    // Clean filename
    const fileName = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.]/g, '')}`;
    
    console.log(`Axios Upload Start: ${fileName} (${file.size} bytes)`);

    // Target URL
    const storageUrl = `${SUPABASE_URL}/storage/v1/object/uploads/${fileName}`;

    // SEND USING AXIOS
    const response = await axios.post(storageUrl, file.buffer, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': file.mimetype,
        'x-upsert': 'false'
      },
      // Important: Allow big files without crashing
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    console.log('Axios Upload SUCCESS:', response.status);
    res.json({ message: 'Uploaded successfully', filePath: fileName });

  } catch (err) {
    console.error("Upload Failed:");
    if (err.response) {
      // The server responded with a status code outside the 2xx range
      console.error(`Status: ${err.response.status}`);
      console.error(`Data:`, err.response.data);
      res.status(err.response.status).json({ message: err.response.data });
    } else if (err.request) {
      // The request was made but no response was received
      console.error("No response received (Timeout or Network Error)");
      res.status(500).json({ message: "Network Timeout - Axios failed to connect" });
    } else {
      console.error("Error", err.message);
      res.status(500).json({ message: err.message });
    }
  }
});

// ENDPOINT 2: Process via Axios
app.post('/process', async (req, res) => {
  try {
    const { filePath } = req.body;
    console.log(`Triggering process for: ${filePath}`);

    const funcUrl = `${SUPABASE_URL}/functions/v1/process-upload`;
    
    const response = await axios.post(funcUrl, { path: filePath }, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Process Triggered:', response.data);
    res.json({ message: 'Cleaning started', data: response.data });

  } catch (err) {
    console.error("Process Error:", err.message);
    // If 404, it means function is missing, but we won't crash the frontend
    if (err.response && err.response.status === 404) {
        res.json({ message: 'Upload worked, but Cleaning Function not found (404)' });
    } else {
        res.status(500).json({ message: err.message });
    }
  }
});

app.listen(3000, () => console.log('Backend server running on port 3000'));