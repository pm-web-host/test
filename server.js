// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const admin = require('firebase-admin');

// Firebase সার্ভিস অ্যাকাউন্ট কী (এটা সার্ভারে থাকবে)
const serviceAccount = {
  "type": "service_account",
  "project_id": "bbrerr13xr",
  "private_key_id": "07dd9512342fc5a39c5a3d7ffbbc4c1e118e3887",
  "private_key": ""-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC2wh0PXz/Rben9\nYjIMUhlpZG3BkYYGMhN45gr54ZA7ZCOw9t7ENvD8rrad3JmEhMWFXcQb7qcvW+a7\nfJmErzEcXSA7+nTEjwh9dE5uR6AeMCFTV0k7vf3h+HaRaLhwTE05su3xDrcyonzY\niY95E4LUzDAtrxhvLX+O/YNbvq2nZdxVP2GOyfY0tpCUWzESonKN5JGxG25n4k9C\nwYRgg3XeTLXrFkpZQG295jBVBXmpI7hjQTMj5GCGfzf4Xy1w5rOgJnDvfrPhSwgq\nBBZ/Df5QEGMrKUKUk8WujBFrpvtEKGc73p+tKOBnMLaaMGG7kb4hcb6gxp2H1TJN\ndSRQ601bAgMBAAECggEACOGdtD8JOhNmK8byBAZDWjX5XXmbHUGhZPPXnwrBTcQ7\n4HWGyttD/SDnxVEl8WTbDR71kPPukk8cLd/2vUDJmVrEiRWj8goPZrqttbnrrpE2\nircdsHZhrZxmSq0KStlyZqDq45bhppId5g9SoRbRJKfi7tK+VGd4y56cm8CZmMkL\nPlHPDEpty98G6NmxWJ77npwItLC7Gre/EXBERw/5RfxAgBGKW5l/lIv4MkFh0g/N\nhLGkDS5mpHFozofZ5sRsU8HjAWvsVTTnNIqtHF6Im/4zk7vIqK22R8hcS/KEcH5t\nKmg37BE+r2R6Do7KDZDv9phPEGtkq7j4Y6EuCQw3VQKBgQDdM3FDlvBkaGFv2AJb\nhAtonI0LAyTsIGXM1p37dYNHyBvSHv00NUB0zqMDQPyxfA/JJnl4J11Lh9yevv1t\nrjO1TXqMPIZ5q+bCj1ST88gPilwGXVaiw/uxSCCKl3wvN8fiYG450ArJqE6aVxBp\nORaaYbHmeBSGej0ww/wNg2+IlQKBgQDTgnIXbCm6qUKr2EjZcZKjhD06xLquiHkV\nbKJmGZaLu9qn1YatsAxqwB1uWzf/6VH4AzpfyB+DDHu6R2i1HSsupOkpp5MdTRk3\nb1DxX1HpQ5iqZ1W1HmnIln1rIE2LTPJ28BfHOOmetmBrdiOUOCEfvaM6tugLk3vW\nPmsdxwvSLwKBgHFSlHlDD77w9tIcwQBvgoTCh0OYBcduxZiObvtPdcVFkHMyaxff\nHDl7T2owVgT7gP7VVi+nQxWZ8f3l7OHO+DCvE9Raga490gfk9DikEN9dS8367ZKP\ngxeM0xcNipKKKj4glvfJTG2Ja1OIvSCbHahT2pcu95z5bPXZwfyOVIqNAoGAG5Ff\nCYqBjeDN3dQc+qqA8GsmB+joZCNJlO9J44DmTGQ5xbJhEXZmx+suatnc3LAujOLu\n0tkkslIINmlkTmb03+mCsnkzBZis9rq9lBhWds7msR8y3p6OLyTeR/433TY0TChT\nERZr7NHck2Uckg8W0ipHgjmg2RFqDKyqDYGKGuUCgYEAoVVOfOQV8Bz7MKMlRy4c\n05z+WdeQws1avE50TwYXxN+kOc0R334uQq/OMEolChS+8UFMoTrtOyz+ONFeAJT/\nY+VtJu1dOG7eCtJgYRM2c2kcg4ue4T0NsV+oGZf5oV500AY94g1PHsdecILzWVu0\n2srGEcVcFqfKC7m6+kVVZ3M=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@bbrerr13xr.iam.gserviceaccount.com",
  "client_id": "110219151397864255958",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
};

// Firebase Admin SDK ইনিশিয়ালাইজ করুন
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'bbrerr13xr'
});

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 3000;

// CORS সেটআপ
app.use(cors({
  origin: ['http://localhost:3000', 'https://tbloods.online'], // আপনার ডোমেইন
  credentials: true
}));

// স্ট্যাটিক ফাইল সার্ভ করুন
app.use(express.static('public'));

// Firebase অপারেশন ডেটা দেওয়ার এন্ডপয়ন্ট (API key ছাড়)
app.get('/api/firebase-config', (req, res) => {
  // শুধু অনুমতি ডোমেইন থেকেই ডেটা দিন
  const safeConfig = {
    projectId: 'bbrerr13xr',
    authDomain: 'bbrerr13xr.firebaseapp.com',
    storageBucket: 'bbrerr13xr.firebasestorage.app'
  };
  
  res.json(safeConfig);
});

// ডাটা সংরক্ষণ করার প্রক্সি
app.post('/api/submit-form', async (req, res) => {
  try {
    const { collection, data } = req.body;
    
    // সার্ভার-সাইডে ভ্যালিডেশন যোগ করুন
    const dataWithTimestamp = {
      ...data,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection(collection).add(dataWithTimestamp);
    
    res.json({ 
      success: true, 
      id: docRef.id 
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to submit form' 
    });
  }
});

// ডাটা পেতে পাওয়ার প্রক্সি
app.get('/api/get-data/:collection', async (req, res) => {
  try {
    const { collection } = req.params;
    const snapshot = await db.collection(collection).get();
    
    const documents = [];
    snapshot.forEach(doc => {
      documents.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json(documents);
  } catch (error) {
    console.error('Error getting data:', error);
    res.status(500).json({ 
      error: 'Failed to get data' 
    });
  }
});

// সবধরনত HTML ফাইল সার্ভ করুন
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});