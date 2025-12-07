// --- CONFIGURATION ---
const SUPABASE_URL = 'https://egnrgisgkgekzznzkofq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnbnJnaXNna2dla3p6bnprb2ZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNTU3NjUsImV4cCI6MjA3OTYzMTc2NX0.YlyeENHJ5NyGRF9gujJzZpNPUfTprkg0dNTnd463IDg';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- DOM ELEMENTS ---
const fileInput = document.getElementById('file-upload');
const uploadBtn = document.getElementById('upload-btn'); 
const processBtn = document.getElementById('process-btn');
const removeBtn = document.getElementById('remove-btn');
const fileDisplay = document.getElementById('file-display');
const displayText = document.getElementById('file-name-text');
const errorMsg = document.getElementById('error-msg');

let selectedFile = null;

// --- FUNCTIONS ---
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
  
  // Reset UI
  displayText.textContent = 'NO DATA DETECTED';
  displayText.style.color = '';
  processBtn.disabled = true;
  removeBtn.style.display = 'none';
  errorMsg.style.display = 'none';
}

removeBtn.addEventListener('click', clearFile);


// --- UPLOAD LOGIC ---
processBtn.addEventListener('click', async () => {
  if (!selectedFile) return;

  try {
    processBtn.innerText = 'Uploading...';
    processBtn.disabled = true;
    removeBtn.style.display = 'none';

    const fileName = `${Date.now()}_${selectedFile.name}`;

    const { data, error } = await supabase
      .storage
      .from('uploads') 
      .upload(fileName, selectedFile);

    if (error) throw error;

    alert('Success! File sent to database for cleaning.');
    clearFile(); // Reset everything after success
    processBtn.innerText = 'INITIATE_TRANSFER';

  } catch (err) {
    console.error(err);
    errorMsg.textContent = 'Upload Failed: ' + err.message;
    errorMsg.style.display = 'block';
    processBtn.innerText = 'INITIATE_TRANSFER'; 
    processBtn.disabled = false;
    removeBtn.style.display = 'flex';
  }
});