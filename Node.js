// server.js (Node.js উদাহরণ)
const express = require('express');
const admin = require('firebase-admin');
const config = require('./config'); // সার্ভার-সাইড কনফিগ

const app = express();

// Firebase কনফিগারেশন প্রদান করুন (সার্ভার-সাইডে)
admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json')),
  projectId: config.firebase.projectId
});

// API এন্ডপয়ন্ট তৈরি করুন
app.get('/api/firebase-config', (req, res) => {
  const origin = req.get('origin');
  const allowedOrigins = ['http://localhost:3000', 'https://yourdomain.com'];
  
  if (allowedOrigins.includes(origin) || !origin) {
    // শুধু প্রয়োজন কনফিগারেশন পাঠান
    res.json({
      projectId: config.firebase.projectId,
      authDomain: config.firebase.authDomain,
      // API key পাঠাবেন না
    });
  } else {
    res.status(403).json({ error: 'Unauthorized' });
  }
});