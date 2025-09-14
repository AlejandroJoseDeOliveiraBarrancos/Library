class BetaSignupForm {
  constructor() {
    this.form = document.getElementById('betaForm');
    this.modal = document.getElementById('successModal');
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupFormValidation();
  }

  setupEventListeners() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    const inputs = this.form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });

    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  setupFormValidation() {
    const inputs = this.form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('invalid', (e) => {
        e.preventDefault();
        this.showFieldError(input, this.getValidationMessage(input));
      });
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    this.clearFieldError(field);

    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = `${this.getFieldLabel(field)} is required.`;
    }

    if (fieldName === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address.';
      }
    }

    if (fieldName === 'phone' && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number.';
      }
    }

    if ((fieldName === 'firstName' || fieldName === 'lastName') && value) {
      if (value.length < 2) {
        isValid = false;
        errorMessage = `${this.getFieldLabel(field)} must be at least 2 characters long.`;
      }
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        isValid = false;
        errorMessage = `${this.getFieldLabel(field)} can only contain letters and spaces.`;
      }
    }

    if (fieldName === 'motivation' && value) {
      if (value.length < 10) {
        isValid = false;
        errorMessage = 'Please provide at least 10 characters explaining your interest.';
      }
    }

    if (fieldName === 'experience') {
      const experienceSelected = this.form.querySelector('input[name="experience"]:checked');
      if (!experienceSelected) {
        isValid = false;
        errorMessage = 'Please select your experience level.';
      }
    }

    if (fieldName === 'terms') {
      const termsChecked = this.form.querySelector('input[name="terms"]:checked');
      if (!termsChecked) {
        isValid = false;
        errorMessage = 'You must agree to the Terms of Service and Privacy Policy.';
      }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  validateForm() {
    const fields = this.form.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isFormValid = false;
      }
    });

    const experienceField = this.form.querySelector('input[name="experience"]:checked');
    if (!experienceField) {
      const experienceError = document.getElementById('experienceError');
      this.showError(experienceError, 'Please select your experience level.');
      isFormValid = false;
    }

    const termsField = this.form.querySelector('input[name="terms"]:checked');
    if (!termsField) {
      const termsError = document.getElementById('termsError');
      this.showError(termsError, 'You must agree to the Terms of Service and Privacy Policy.');
      isFormValid = false;
    }

    return isFormValid;
  }

  showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.name}Error`);
    if (errorElement) {
      this.showError(errorElement, message);
    }
    field.classList.add('error');
  }

  clearFieldError(field) {
    const errorElement = document.getElementById(`${field.name}Error`);
    if (errorElement) {
      this.clearError(errorElement);
    }
    field.classList.remove('error');
  }

  showError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }

  clearError(errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }

  getFieldLabel(field) {
    const label = this.form.querySelector(`label[for="${field.id}"]`);
    return label ? label.textContent.replace(' *', '') : field.name;
  }

  getValidationMessage(field) {
    const fieldName = field.name;
    const value = field.value.trim();

    if (field.hasAttribute('required') && !value) {
      return `${this.getFieldLabel(field)} is required.`;
    }

    switch (fieldName) {
      case 'email':
        return 'Please enter a valid email address.';
      case 'phone':
        return 'Please enter a valid phone number.';
      case 'firstName':
      case 'lastName':
        return `${this.getFieldLabel(field)} must be at least 2 characters long and contain only letters.`;
      case 'role':
        return 'Please select your role.';
      case 'motivation':
        return 'Please provide at least 10 characters explaining your interest.';
      default:
        return 'Please fill in this field correctly.';
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      this.scrollToFirstError();
      return;
    }

    const submitButton = this.form.querySelector('.form__submit');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitButton.disabled = true;

    try {
      const formData = this.collectFormData();
      
      await this.simulateApiCall();
      
      this.saveToLocalStorage(formData);
      
      this.showSuccessModal();
      
      this.resetForm();
      
    } catch (error) {
      console.error('Form submission error:', error);
      this.showErrorMessage('Something went wrong. Please try again.');
    } finally {
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
    }
  }

  collectFormData() {
    const formData = new FormData(this.form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      if (data[key]) {
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }

    data.submissionDate = new Date().toISOString();
    data.userAgent = navigator.userAgent;
    data.timestamp = Date.now();

    return data;
  }

  async simulateApiCall() {
    return new Promise(resolve => {
      setTimeout(resolve, 1500);
    });
  }

  saveToLocalStorage(data) {
    try {       
      const existingSubmissions = JSON.parse(localStorage.getItem('betaSignups') || '[]');
      
      existingSubmissions.push(data);
      
      localStorage.setItem('betaSignups', JSON.stringify(existingSubmissions));
      
      console.log('Form data saved to localStorage:', data);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw error;
    }
  }

  showSuccessModal() {
    this.modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      this.modal.querySelector('.modal__content').style.transform = 'scale(1)';
    }, 100);
  }

  hideSuccessModal() {
    this.modal.classList.remove('show');
    document.body.style.overflow = 'auto';
  }

  resetForm() {
    this.form.reset();
    
    const errorElements = this.form.querySelectorAll('.form__error');
    errorElements.forEach(element => this.clearError(element));
    
    const inputElements = this.form.querySelectorAll('input, select, textarea');
    inputElements.forEach(element => element.classList.remove('error'));
  }

  scrollToFirstError() {
    const firstError = this.form.querySelector('.form__error[style*="block"]');
    if (firstError) {
      firstError.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error-message';
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
      errorDiv.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        document.body.removeChild(errorDiv);
      }, 300);
    }, 5000);
  }
}

function closeModal() {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
  }
}

const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .form__input.error,
  .form__select.error,
  .form__textarea.error {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
  
  .nav__menu.active {
    display: flex;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .nav__toggle.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  
  .nav__toggle.active span:nth-child(2) {
    opacity: 0;
  }
  
  .nav__toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
  new BetaSignupForm();
});

document.addEventListener('DOMContentLoaded', () => {

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);


  document.querySelectorAll('.stat, .feature').forEach(el => {
    observer.observe(el);
  });

  const animationStyle = document.createElement('style');
  animationStyle.textContent = `
    .stat, .feature {
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.6s ease-out;
    }
    
    .stat.animate, .feature.animate {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(animationStyle);
});
