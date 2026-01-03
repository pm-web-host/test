// api-client.js
// সার্ভার-সাইডের সাথে যোগাযোগ করার জন্য ক্লায়ন্ট ফাইল

class TbloodAPI {
  constructor(baseURL = '') {
    this.baseURL = baseURL || (window.location.origin + '/api');
  }

  // ফর্ম ডেটা সংরক্ষণ করা
  async submitForm(collection, data) {
    try {
      const response = await fetch(`${this.baseURL}/submit-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ collection, data })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  }

  // ডাটা পেতে পাওয়া
  async getData(collection) {
    try {
      const response = await fetch(`${this.baseURL}/get-data/${collection}`);
      
      if (!response.ok) {
        throw new Error('Failed to get data');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting data:', error);
      throw error;
    }
  }

  // Firebase কনফিগারেশন পেতে পাওয়া (সার্ভার-সাইড থেকে)
  async getFirebaseConfig() {
    try {
      const response = await fetch(`${this.baseURL}/firebase-config`);
      
      if (!response.ok) {
        throw new Error('Failed to get Firebase config');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting Firebase config:', error);
      throw error;
    }
  }
}

// গ্লোবাল API ইনস্ট্যান্স তৈরি করুন
window.tbloodAPI = new TbloodAPI();