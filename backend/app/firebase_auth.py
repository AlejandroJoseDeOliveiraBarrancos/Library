import firebase_admin
from firebase_admin import credentials, auth
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.config import settings
import os

def initialize_firebase():
    try:
        if firebase_admin._apps:
            print("Firebase Admin SDK already initialized")
            return
        
        try:
            cred_dict = settings.get_firebase_credentials()
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
            print("Firebase Admin SDK initialized successfully")
            
        except ValueError as e:
            print(f"WARNING: Firebase credentials not properly configured: {e}")
            print("Authentication will not work. Please configure Firebase credentials.")
            print("Options:")
            print("1. Set individual Firebase environment variables (FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, etc.)")
            print("2. Provide firebase-credentials.json file")
            return
        
    except ValueError as e:
        print(f"Firebase app already initialized: {e}")
    except Exception as e:
        print(f"ERROR: Firebase initialization failed: {e}")
        print("Authentication will not work until this is fixed.")


security = HTTPBearer()


async def verify_firebase_token(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> dict:
    try:
        if not firebase_admin._apps:
            raise HTTPException(
                status_code=503,
                detail="Firebase Admin SDK not initialized. Please check server configuration."
            )
        
        token = credentials.credentials
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )
    except auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=401,
            detail="Authentication token has expired. Please log in again."
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Token verification error: {str(e)}")
        raise HTTPException(
            status_code=401,
            detail=f"Authentication failed: {str(e)}"
        )


async def get_current_user(token: dict = Security(verify_firebase_token)) -> str:
    return token.get("uid")

