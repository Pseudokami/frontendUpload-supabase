// script.js
// --- CONFIGURATION ---
const BACKEND_API_URL = 'http://localhost:3000'; 

// --- DOM ELEMENTS ---
const fileInput = document.getElementById('file-upload');
const uploadBtn = document.getElementById('upload-btn'); 
const processBtn = document.getElementById('process-btn');
const removeBtn = document.getElementById('remove-btn'); 
const displayText = document.getElementById('file-name-text');
const errorMsg = document.getElementById('error-msg');

let selectedFile = null;

// --- FILE SELECTION LOGIC ---
uploadBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  errorMsg.style.display = 'none';

  if (file) {
    if (file.name.endsWith('.csv') || file.name.endsWith('.sql') || file.name.endsWith('.docx')) {
      selectedFile = file;
      displayText.textContent = file.name;
      displayText.style.color = '#374151'; 
      processBtn.disabled = false;
      removeBtn.style.display = 'flex'; 
    } else {
      errorMsg.textContent = 'Only .csv, .sql, or .docx files allowed';
      errorMsg.style.display = 'block';
      clearFile();
    }
  }
});

function clearFile() {
  selectedFile = null;
  fileInput.value = ''; 
  displayText.textContent = 'NO DATA DETECTED';
  displayText.style.color = ''; 
  processBtn.disabled = true;
  removeBtn.style.display = 'none'; 
  errorMsg.style.display = 'none';
}

removeBtn.addEventListener('click', clearFile);

// --- THE NEW UPLOAD LOGIC (Talks to Localhost, NOT Supabase) ---
processBtn.addEventListener('click', async () => {
  if (!selectedFile) return;

  try {
    // 1. UPLOAD
    processBtn.innerText = 'TRANSMITTING TO NODE...';
    processBtn.disabled = true;
    removeBtn.style.display = 'none';

    const formData = new FormData();
    formData.append('file', selectedFile);

    // Send to your local server (server.js)
    const uploadResponse = await fetch(`${BACKEND_API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      throw new Error(errorData.message || 'Upload failed at Backend');
    }

    const result = await uploadResponse.json();
    console.log('Upload success:', result);

    // 2. PROCESS
    processBtn.innerText = 'REQUESTING CLEANSE...';

    const processResponse = await fetch(`${BACKEND_API_URL}/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        filePath: result.filePath,
        fileName: selectedFile.name 
      }),
    });

    if (!processResponse.ok) {
      const procError = await processResponse.json();
      throw new Error(procError.message || 'Processing failed');
    }

    // SUCCESS
    alert('Success! Data uploaded and cleaning started.');
    clearFile(); 
    processBtn.innerText = 'INITIATE_TRANSFER';

  } catch (err) {
    console.error(err);
    // This is where your error text comes from
    errorMsg.textContent = 'System Error: ' + err.message;
    errorMsg.style.display = 'block';
    processBtn.innerText = 'INITIATE_TRANSFER'; 
    processBtn.disabled = false;
    removeBtn.style.display = 'flex';
  }
});