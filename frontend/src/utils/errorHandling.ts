export interface FirebaseError {
  code: string;
  message: string;
}

export const getFirebaseErrorMessage = (error: any): string => {
  const firebaseError = error as FirebaseError;
  
  switch (firebaseError.code) {
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials and try again.';
    
    case 'auth/user-not-found':
      return 'No account found with this email address. Please check your email or create a new account.';
    
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please try logging in instead.';
    
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password.';
    
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support for assistance.';
    
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a moment before trying again.';
    
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. Please try again.';
    
    case 'auth/popup-blocked':
      return 'Popup was blocked by your browser. Please allow popups and try again.';
    
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled. Please try again.';
    
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method.';
    
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please contact support.';
    
    case 'auth/requires-recent-login':
      return 'Please sign in again to complete this action.';
    
    default:
      if (firebaseError.message && firebaseError.message.includes('Firebase')) {
        return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
      }
      return firebaseError.message || 'An unexpected error occurred. Please try again.';
  }
};

export const getApiErrorMessage = (error: any): string => {
  if (error.response?.status === 400) {
    return 'Invalid request. Please check your input and try again.';
  }
  
  if (error.response?.status === 401) {
    return 'You are not authorized to perform this action. Please sign in again.';
  }
  
  if (error.response?.status === 403) {
    return 'Access denied. You do not have permission to perform this action.';
  }
  
  if (error.response?.status === 404) {
    return 'The requested resource was not found.';
  }
  
  if (error.response?.status === 409) {
    return 'A conflict occurred. The resource may already exist.';
  }
  
  if (error.response?.status === 422) {
    return 'Invalid data provided. Please check your input and try again.';
  }
  
  if (error.response?.status >= 500) {
    return 'Server error. Please try again later or contact support if the problem persists.';
  }
  
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
    return 'Network error. Please check your internet connection and try again.';
  }
  
  return error.message || 'An unexpected error occurred. Please try again.';
};
