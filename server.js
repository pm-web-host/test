// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const admin = require('firebase-admin');

// Firebase সার্ভিস অ্যাকাউন্ট কী (এটা সার্ভারে থাকবে)
const serviceAccount = {
  "type": "service_account",
  "project_id": "mail-tblood-b8424",
  "private_key_id": "2e0578f4aa4ddae9a00e20e6c98512ba56a4b7ac",
  "private_key": ""-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDGmXeVLJY7aLFA\n661T24oIGs3BfBTsam7oEmm4rvohdiRFVJcddeiVnHwlMPzct/bw5bNWZWXDbnfH\nQqECOeGBDIg4ym0wjR4yPR9ZbV/5r2NqCl9aafyLcwZUjUhfn9SiX0k9E1mQ6fpg\n+AhA2/ZqjUM/4yZXbhqztvhJ3GgrBj4pzy0q1mXKnYeMEMpTjqcAwC2W4JsjZUy7\nhYOiASiXSmL8cmYOav0wG5PGPRREqYNTr1B6nW+aXJOC1K77a7k5eFSuPJ2yvgO8\nzogRwHlQsrbqb7eXCpwkEDoz1RqHW/rqA4ZDs9djWmt5gPZN20rIkZ7s7FuC4c46\n7dqGy2mLAgMBAAECggEAUtyVWFhSFleIHV4341UmMlt8nc33rOx7ebi1A6l+E5gH\naiXxJwmbEVFJOvtFhZH8JmawfMuxuejNcQYLx7H+tKlV7NwI0skOYEfAXL+V28eh\n4wyQ3Fh8VnKXoY+RMtStE1JObH02UZBON0dFqkocdjiaZn2P8cquuW0OC0M68zfb\naQXgoYooCVxyQhjiMHDhEyqjwPi3fL1BNj+aOtyGcYmZzXj0ZPkpBxW3o0bu8MjM\nHNndE6RVlDQLMNHGgdptXBBPzQm8YtExXdvcFIy7PP8Bygd4+BAhIGPnh+6x4U9O\nYvjyaG/ZkS8zRBigZHx7iIuGjj3f43goPhSzihcTAQKBgQDlQxOiiIKY1M9ZhyH0\nL/3BzbNC+/F+lc8bUWBd+I46GX9CbGq2sE7bxF3noMVfurMb9mWyis+M6c/Y1DdQ\njlOL1mijw97ObJ9ACMsGpSByH3VFiwTpyY25FjKBXlKmsYn7TwwGbClaqxjgcbhS\n1j2XBNv7Y4yc8Q706aU6WUmSeQKBgQDdwutiuBixELn/mK0voRDOZIXi22EGyBy6\nccbr5I4IRjgSamfWCL/gG5y6vfj1LZ3BCfILKSmfprkTBAbBjn1yO2MqbJlXBUgR\nmwYb2/2Alc50u8EO0XJ3DAV+TZZIi1xpfT0akUQQjtSZrfHwo4kHwKXE2XkTyl7y\nkxKI0i67IwKBgEa2d7nsDQwCp6nfilN88fHy9lW0y/nVTzoH0YdqgMPe1WexdQDA\nRLJ4UNZ+uiIavd/kEd4N/pJiE5+3ZRBNtestyLyqT3CwBDaF/8ke6XEJzuwSQwOx\nDSuHczB/3VJY9Ew1R2o7tk2m9FdV/BpgxkJsV0WkoNxPZeOYpUPoAk9RAoGAaG+z\nivpIJptJ/SVZ6mRgFdMheoT2XMtBPEz48X7hpOPs5D9YR2Q3eMOIPCnbZRvmf1K/\nuqHYCGfsIRh0VhNU4Mc3HHOog2LpXeE0L0qbSENEx5TkhqX80jPHIoRHkkKPct6Y\nODrRYzrgxL82ga2CizQe3WXNr5ROws6gm+7gMyECgYEAhS3rZMlOXEI1eAY8HXfc\nGtW3H2UvS/XhT6HSAniKFllP6e6uOWwe4WoxzqMJeOML/1GAnQPWwQr5UZxlYo4R\nMdSmJC+qpHavxWjSoqWecxgXdmto1Tucvv0sfLtK11wcJ3pNHmaI0z1aNWiZE/0x\nehKbaFE+6W8hiDOZjf0iGsY=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@mail-tblood-b8424.iam.gserviceaccount.com",
  "client_id": "112379748462930871508",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
};

// Firebase Admin SDK ইনিশিয়ালাইজ করুন
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'mail-tblood-b8424'
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
    projectId: 'mail-tblood-b8424',
    authDomain: 'mail-tblood-b8424.firebaseapp.com',
    storageBucket: 'mail-tblood-b8424.firebasestorage.app'
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