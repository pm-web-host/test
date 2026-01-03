// api-client.js
// A client-side wrapper for Firebase Firestore operations.

class TbloodAPI {
  constructor() {
    // Check if Firebase was initialized in firebase-config.js
    if (typeof db === 'undefined') {
      console.error("Firebase is not initialized. Make sure firebase-config.js is loaded first.");
    }
  }

  /**
   * Saves form data to a Firestore collection.
   * @param {string} collection - The name of the collection (e.g., 'contacts').
   * @param {object} data - The data to save.
   * @returns {Promise} - A promise that resolves when the data is saved.
   */
  async submitForm(collection, data) {
    if (typeof db === 'undefined') {
      throw new Error('Firebase is not initialized.');
    }
    
    try {
      // Add a server-side timestamp
      const dataWithTimestamp = {
        ...data,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };
      
      const docRef = await db.collection(collection).add(dataWithTimestamp);
      console.log("Document written with ID: ", docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  }

  /**
   * Retrieves all documents from a Firestore collection.
   * @param {string} collection - The name of the collection.
   * @returns {Promise<Array>} - A promise that resolves with an array of documents.
   */
  async getData(collection) {
    if (typeof db === 'undefined') {
      throw new Error('Firebase is not initialized.');
    }

    try {
      const snapshot = await db.collection(collection).orderBy('timestamp', 'desc').get();
      const documents = [];
      snapshot.forEach(doc => {
        documents.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return documents;
    } catch (error) {
      console.error("Error getting documents: ", error);
      throw error;
    }
  }

  /**
   * Updates a specific field in a document.
   * @param {string} collection - The name of the collection.
   * @param {string} docId - The ID of the document to update.
   * @param {object} data - The fields to update.
   * @returns {Promise} - A promise that resolves when the document is updated.
   */
  async updateDocument(collection, docId, data) {
    if (typeof db === 'undefined') {
      throw new Error('Firebase is not initialized.');
    }

    try {
      await db.collection(collection).doc(docId).update(data);
      console.log(`Document ${docId} updated successfully.`);
      return { success: true };
    } catch (error) {
      console.error("Error updating document: ", error);
      throw error;
    }
  }
}

// Create a global API instance that other scripts can use
window.tbloodAPI = new TbloodAPI();