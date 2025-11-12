# Practical 13 – Node.js Streaming and Response Negotiation  
**Submitted by:** Ritu Singh  
**Roll No:** GF202346594  
**Course / Program:** BCA FULLSTACK Developer  
  

---

##  Objective
Implement two server features using **Node.js** and **Express**:
1. Continuous **data streaming** to the client.
2. **Content negotiation** — server responds with JSON or XML depending on the request.

The output for both tasks is visible directly in the terminal through a single client program.

---

##  Setup Guide

### Step 1: Initialize and install Express
```bash
npm init -y
npm install express
```

### Step 2: Start the server
```bash
node server.js
```

Expected console output:
```
Server listening at http://localhost:3000
Endpoints:
  /stream  -> streaming plain-text lines
  /data    -> JSON (default) or XML if ?format=xml
```

### Step 3: Run the combined client
Open a new terminal and run:
```bash
node client.js
```

---

##  Terminal Output

### 🔹 Task 1 — Streaming
Live stream data prints continuously in the client terminal:
```
STREAM 1 | 2025-11-12T09:00:01Z
STREAM 2 | 2025-11-12T09:00:02Z
...
--- /stream ended by server ---
```

###  Task 2 — Content Negotiation
Two formats are tested by the client:

1. **Default (JSON)** — server returns JSON with the message and timestamp.  
2. **XML (via ?format=xml)** — server returns the same data in XML.

---

##  Key Learnings
- Using `res.write()` for streaming responses  
- Detecting client disconnects with `req.on('close')`  
- Respecting backpressure using `'drain'` when necessary  
- Implementing a simple negotiation mechanism to return JSON or XML

---

