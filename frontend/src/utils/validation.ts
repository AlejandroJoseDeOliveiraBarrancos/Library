export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, message: 'Email is required' };
  }
  
  if (email.length > 254) {
    return { isValid: false, message: 'Email is too long (maximum 254 characters)' };
  }
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: 'Password is too long (maximum 128 characters)' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)' };
  }
  
  return { isValid: true };
};

// Display name validation
export const validateDisplayName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, message: 'Full name is required' };
  }
  
  if (name.length < 2) {
    return { isValid: false, message: 'Full name must be at least 2 characters long' };
  }
  
  if (name.length > 50) {
    return { isValid: false, message: 'Full name is too long (maximum 50 characters)' };
  }
  
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, message: 'Full name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { isValid: true };
};

export const validatePasswordConfirmation = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, message: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }
  
  return { isValid: true };
};

export const validateFieldLength = (value: string, fieldName: string, minLength: number, maxLength: number): ValidationResult => {
  if (!value.trim()) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  if (value.length < minLength) {
    return { isValid: false, message: `${fieldName} must be at least ${minLength} characters long` };
  }
  
  if (value.length > maxLength) {
    return { isValid: false, message: `${fieldName} is too long (maximum ${maxLength} characters)` };
  }
  
  return { isValid: true };
};
