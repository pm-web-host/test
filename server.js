// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const admin = require('firebase-admin');

// Firebase সার্ভিস অ্যাকাউন্ট কী (এটা সার্ভারে থাকবে)
const serviceAccount = {
  "type": "service_account",
  "project_id": "mail-tblood",
  "private_key_id": "bff8512298466d83411e94d216cec4a338a45983",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDOGFN+vuKWgDQP\nRRzAQvRvYjOiaOzRkV8brqFcVVT5WH+Oi+JFTBvwR36oXdz9GfE4YWqVqgRq0bOt\npN0DOmKgmz/3L762LJivIwV12415ea5GFPRbMwjE4+HnnCDrYBvMyTD5ix0sRc2R\nX5uaaECvv5vJiNn3MhSRGsjkJHFjK/Y82EMGkL2kEk6pDwM73+Gc5FTVJcGM1t2Y\nncUeAvAEc8wKhKBOeyGswwzGVU4LHXxSBW/dcZy+WbMUT/MgRKj7e85H7EzKOFLJ\nJjOsoXE8BOWdr9ONshB8PE7OyEyVwswJ4oJJYau9QXj5E0G6vuuq8PwtSImdQelJ\nq0JBuSFDAgMBAAECggEAGemVFeqKMsILyZ+27bV9ZkPCmjj3DaJpguGCCEnyVSd7\nYkDUQkI/gQZ8Nk8W6fvJCH23GPo3c/bJ0JtZ7n34yJi8gifOorkYuWx900O3lf5m\nmwkncBAKmjbMwIIw4WdEF4t0TOvgzyA3qH+M4O0atP4yaDR8s0forhXgDE9Isl8q\n4jZTy+ZKwLHKsGkwuoVYaufa0tjmBCyIPSRQL5LkUmb4RzhG+/SAqxdp40pquX5u\nM7vyVnERBnb4z4Gy9fWY/mvMZDDXCmISAysbZKt9FbVzhY1HoPOpXtHK+014py/V\nc+PXwVUIv+0ghOAtUVJBQSngRxsbSj/ck3jSY1IrgQKBgQDpNgQY5sONnuBJNO1z\n/OIjdCT1i45Xcgl1Rp6PhuqDQxtTBBwSzlNNLguJkRtbJjFiihpiqdYhcYH1MHhd\nV5Ton/lvXtuQIzfFkbS6dpel3GXQpdRjRjX8yZVkE6fUqzbN7iS+hx0WtrLft+SY\njw4NeVBXawDQ9Qxd26hsPEVTrwKBgQDiO/rALOjRW0yCpramfm3+RpB3zzE8dq8y\nVZVpqeOczunJnAOzJdNuG4udOJJ99QquV8IaDTnSDnVXSepl01tHcLwxrQD6cIlc\n1hqHIu9k77KturDG089EVdjReEEnPkp7Qjmsu2iOaMw5QSkf7ZF4row33cNr8G/9\nKL+MEzqsrQKBgDnkg93eo1rrvsfNkMjDVSvx8B7Ydwx0La7kSgZdOqg9J3JTSdjN\nSVaWgJy03fKhp47Ls8McYCDLObSxRJ//VuLsm5IvHRhJ9dVg11mWiQzOiqPiFrhS\nPKK1NBW032vm2OMEJDD7/5ec4QiycNgCYz2rCOu6j2hP/LLsDYJY7+jXAoGAKPqS\nVgMMfPebqULHbOsTw25Gttz53yjkXSqxcL1MNFgqctFmvimI3bXxmR3pMxWSxLey\nugNRSOJDkPcblSwuqYcbH6hlt/dwejdyAK5sTI06gUuCv9EYBxnBt1ef/ZrD5QW+\n6rHbo4gKDgjmiRkAM6ryTSBHSKL5thKOd7H3+9UCgYBTDmqDZGE0vP0QdJCZ06bZ\nHHs9jJBFMF6rqA9GhzpHl2/xkwVSkWkVdsV+h0jzrQGt2JXA7S+x3FK+blFwhHoa\n6R/7GfIfC2XDi2u8i8B/E8xbo7usyKCB3LmRldcKhOic9176p32pD9qAiEvQyE+d\nTv+1YQWp7hMjIOjhSrj7WA==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@mail-tblood.iam.gserviceaccount.com",
  "client_id": "109945669558353324051",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
};

// Firebase Admin SDK ইনিশিয়ালাইজ করুন
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'mail-tblood'
});

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 3000;

// CORS সেটআপ
app.use(cors({
  origin: ['http://localhost:3000', 'https://github.com/pm-web-host/test'], // আপনার ডোমেইন
  credentials: true
}));

// স্ট্যাটিক ফাইল সার্ভ করুন
app.use(express.static('public'));

// Firebase অপারেশন ডেটা দেওয়ার এন্ডপয়ন্ট (API key ছাড়)
app.get('/api/firebase-config', (req, res) => {
  // শুধু অনুমতি ডোমেইন থেকেই ডেটা দিন
  const safeConfig = {
    projectId: 'mail-tblood',
    authDomain: 'mail-tblood.firebaseapp.com',
    storageBucket: 'mail-tblood.firebasestorage.app'
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