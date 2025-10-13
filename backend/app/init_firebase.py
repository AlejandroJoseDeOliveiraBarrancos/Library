"""
Script to initialize and test Firebase connection
Run this to verify your Firebase credentials are working
"""
import os
import sys
from firebase_admin import credentials, auth, initialize_app


def test_firebase_connection():
    """Test Firebase Admin SDK connection"""
    print("Testing Firebase connection...")
    print("-" * 50)
    
    creds_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-credentials.json")
    
    if not os.path.exists(creds_path):
        print(f"Error: Firebase credentials file not found at: {creds_path}")
        print("\nHow to fix:")
        print("1. Go to Firebase Console > Project Settings > Service Accounts")
        print("2. Click 'Generate new private key'")
        print(f"3. Save the file as '{creds_path}'")
        return False
    
    try:
        cred = credentials.Certificate(creds_path)
        initialize_app(cred)
        print("Firebase Admin SDK initialized successfully!")
        
        page = auth.list_users(max_results=1)
        print("Firebase connection is working!")
        print(f"Project ID: {cred.project_id}")
        
        return True
        
    except Exception as e:
        print(f"Error initializing Firebase: {e}")
        print("\nCommon issues:")
        print("- Ensure the credentials file is valid JSON")
        print("- Verify the service account has the correct permissions")
        print("- Check that the Firebase project exists")
        return False


if __name__ == "__main__":
    success = test_firebase_connection()
    sys.exit(0 if success else 1)

