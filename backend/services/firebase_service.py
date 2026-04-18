import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()

class FirebaseService:
    def __init__(self):
        credential_path = os.getenv("FIREBASE_ADMIN_KEY")
        if credential_path and os.path.exists(credential_path):
            if not firebase_admin._apps:
                cred = credentials.Certificate(credential_path)
                firebase_admin.initialize_app(cred)
            self.db = firestore.client()
        else:
            # Fallback for local development if credentials aren't properly set initially
            print("FIREBASE_ADMIN_KEY not found or invalid. Firestore integration will operate in mock mode.")
            self.db = None

    def get_recent_complaints(self, limit=500):
        if not self.db:
            return []
        
        try:
            docs = self.db.collection('COMPLAINTS').order_by('timestamp', direction=firestore.Query.DESCENDING).limit(limit).stream()
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            print(f"Error fetching recent complaints: {e}")
            return []

    def get_all_complaints(self):
        if not self.db:
            return []
        
        try:
            docs = self.db.collection('COMPLAINTS').stream()
            return [doc.to_dict() for doc in docs]
        except Exception as e:
            print(f"Error fetching all complaints: {e}")
            return []

    def store_embedding(self, complaint_id: str, embedding: list):
        if not self.db:
            return
        
        try:
            doc_ref = self.db.collection('COMPLAINTS').document(complaint_id)
            doc_ref.set({'embedding': embedding}, merge=True)
        except Exception as e:
            print(f"Error storing embedding for {complaint_id}: {e}")

firebase_service = FirebaseService()
