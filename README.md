## Project Structure

* **Frontend:**
    * `index.html` - The main user interface.
    * `style.css` - Custom YoRHa aesthetic styling.
    * `script.js` - Handles user interaction and sends files to the local backend.
* **Backend:**
    * `server.js` - A local Node.js server that acts as a secure bridge. It uses **Axios** to handle the file upload to Supabase, bypassing ISP/Network timeouts.

## How to Run This Project
### Prerequisites
* [Node.js](https://nodejs.org/) installed on your computer.
* VS Code (recommended).

### Step 1: Install Dependencies
Since `node_modules` are not uploaded to GitHub, you must install the required libraries first.

1.  Open this folder in VS Code.
2.  Open a Terminal (`Ctrl + ~`).
3.  Run this command:
    ```bash
    npm install express multer cors axios @supabase/supabase-js
    ```

### Step 2: Configure Keys (If needed)
* Open `server.js`.
* Ensure the `SUPABASE_URL` and `SUPABASE_KEY` are correct.
    * *Note: For this project, keys are currently hardcoded in `server.js` for ease of testing.*

### Step 3: Start the Backend Server
1.  In the terminal, run:
    ```bash
    node server.js
    ```
2.  You should see the message: `Backend server running on port 3000`.
3.  **Keep this terminal open.** The backend must be running for uploads to work.

### Step 4: Open the Frontend
1.  Right-click `index.html`.
2.  Select **"Open with Live Server"**.
3.  The YoRHa UI will open in your browser.

---

## Features & Status
### ✅ Completed
* **UI/UX:** Fully styled Nier: Automata interface with animations and sound effects (visual only).
* **File Selection:** Validation for `.csv`, `.sql`, and `.docx` files.
* **Backend Bridge:** Local Node.js server configured with IPv4 and Axios to prevent `ConnectTimeoutError` on Windows networks.
* **Uploads:** Successfully uploads large datasets (tested with `passengers.csv`) to Supabase Storage (Status 200 OK).

### ⚠️ Pending (Backend Team Attention)
* **Cleaning Process:** The frontend successfully triggers the upload, but returns a **404 Error** when attempting to trigger the cleaning function.
    * *Reason:* The Edge Function `process-upload` has not yet been deployed to Supabase.
    * *Action:* Once the backend team deploys this function, no code changes are needed here; it will start working automatically.

---

## 🔧 Troubleshooting

**"System Error: Network Error"**
* Ensure the backend is running (`node server.js`).
* Ensure you are accessing `index.html` via Live Server (port 5500), not double-clicking the file.

**"Fetch Failed" / Timeout**
* This project uses `axios` specifically to fix this issue. If it persists, ensure you ran `npm install` to get the latest version of Axios.
