/**
 * Validation utilities for form fields
 * All error messages end with a full stop as per defect prevention standards.
 * Uses UK English spellings.
 */

// Regular expressions for validation
const patterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^[\d\s\-\+\(\)]{8,20}$/,
  postalCode: /^[a-zA-Z0-9\s\-]{3,10}$/,
  // Allows letters, spaces, hyphens, and apostrophes for names
  name: /^[a-zA-Z\s\-'’]+$/,
  // No special characters for basic text
  text: /^[a-zA-Z0-9\s\-_.,!?()'"]+$/
};

/**
 * Validate Email ID field
 * @param {string} value - Email ID value
 * @param {string} label - Field label (default: 'Email ID')
 * @returns {string|null} Error message or null if valid
 */
export const validateEmailId = (value, label = 'Email ID') => {
  if (!value || value.trim() === '') {
    return `${label} is required.`;
  }
  if (!patterns.email.test(value)) {
    return `Please enter a valid ${label}.`;
  }
  if (value.length > 255) {
    return `${label} must not exceed 255 characters.`;
  }
  return null;
};

/**
 * Validate Contact Number field
 * @param {string} value - Contact Number value
 * @param {string} label - Field label (default: 'Contact Number')
 * @returns {string|null} Error message or null if valid
 */
export const validateContactNumber = (value, label = 'Contact Number') => {
  if (!value || value.trim() === '') {
    return `${label} is required.`;
  }
  if (!patterns.phone.test(value)) {
    return `Please enter a valid ${label}.`;
  }
  if (value.replace(/\D/g, '').length < 8) {
    return `${label} must be at least 8 digits.`;
  }
  if (value.replace(/\D/g, '').length > 15) {
    return `${label} must not exceed 15 digits.`;
  }
  return null;
};

/**
 * Validate Postal Code field
 * @param {string} value - Postal Code value
 * @param {string} label - Field label (default: 'Postal Code')
 * @returns {string|null} Error message or null if valid
 */
export const validatePostalCode = (value, label = 'Postal Code') => {
  if (!value || value.trim() === '') {
    return `${label} is required.`;
  }
  if (!patterns.postalCode.test(value)) {
    return `Please enter a valid ${label}.`;
  }
  if (value.length < 3) {
    return `${label} must be at least 3 characters.`;
  }
  if (value.length > 10) {
    return `${label} must not exceed 10 characters.`;
  }
  return null;
};

/**
 * Validate required field
 * @param {string} value - Field value
 * @param {string} label - Field label
 * @returns {string|null} Error message or null if valid
 */
export const validateRequired = (value, label) => {
  if (!value || value.trim() === '') {
    return `${label} is required.`;
  }
  return null;
};

/**
 * Validate field length
 * @param {string} value - Field value
 * @param {string} label - Field label
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @returns {string|null} Error message or null if valid
 */
export const validateLength = (value, label, min = 0, max = 255) => {
  if (!value) return null;

  if (min > 0 && value.trim().length < min) {
    return `${label} must be at least ${min} characters.`;
  }
  if (max && value.length > max) {
    return `${label} must not exceed ${max} characters.`;
  }
  return null;
};

/**
 * Validate password field
 * @param {string} value - Password value
 * @param {string} label - Field label (default: 'Password')
 * @returns {string|null} Error message or null if valid
 */
export const validatePassword = (value, label = 'Password') => {
  if (!value || value.trim() === '') {
    return `${label} is required.`;
  }
  if (value.length < 8) {
    return `${label} must be at least 8 characters.`;
  }
  if (value.length > 128) {
    return `${label} must not exceed 128 characters.`;
  }
  if (!/[a-z]/.test(value)) {
    return `${label} must contain at least one lowercase letter.`;
  }
  if (!/[A-Z]/.test(value)) {
    return `${label} must contain at least one uppercase letter.`;
  }
  if (!/\d/.test(value)) {
    return `${label} must contain at least one number.`;
  }
  return null;
};

/**
 * Validate date field
 * @param {string} value - Date value (DD/MM/YYYY format)
 * @param {string} label - Field label (default: 'Date')
 * @returns {string|null} Error message or null if valid
 */
export const validateDate = (value, label = 'Date') => {
  if (!value || value.trim() === '') {
    return `${label} is required.`;
  }

  // Validate DD/MM/YYYY format
  const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!datePattern.test(value)) {
    return `${label} must be in DD/MM/YYYY format.`;
  }

  const [, day, month, year] = value.match(datePattern);
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  if (monthNum < 1 || monthNum > 12) {
    return `Invalid month in ${label}.`;
  }
  if (dayNum < 1 || dayNum > 31) {
    return `Invalid day in ${label}.`;
  }
  if (yearNum < 1900 || yearNum > 2100) {
    return `Invalid year in ${label}.`;
  }

  return null;
};

/**
 * Validate name field
 * @param {string} value - Name value
 * @param {string} label - Field label (default: 'Name')
 * @returns {string|null} Error message or null if valid
 */
export const validateName = (value, label = 'Name') => {
  if (!value || value.trim() === '') {
    return `${label} is required.`;
  }
  if (!patterns.name.test(value)) {
    return `${label} must contain only letters.`;
  }
  if (value.trim().length < 2) {
    return `${label} must be at least 2 characters.`;
  }
  if (value.length > 100) {
    return `${label} must not exceed 100 characters.`;
  }
  return null;
};

/**
 * Validate numeric field
 * @param {string|number} value - Numeric value
 * @param {string} label - Field label
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {string|null} Error message or null if valid
 */
export const validateNumber = (value, label, min = null, max = null) => {
  if (value === '' || value === null || value === undefined) {
    return `${label} is required.`;
  }

  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return `${label} must be a valid number.`;
  }

  if (min !== null && numValue < min) {
    return `${label} must be at least ${min}.`;
  }
  if (max !== null && numValue > max) {
    return `${label} must not exceed ${max}.`;
  }

  return null;
};

/**
 * Validate price field
 * @param {string|number} value - Price value
 * @param {string} label - Field label (default: 'Price')
 * @returns {string|null} Error message or null if valid
 */
export const validatePrice = (value, label = 'Price') => {
  if (value === '' || value === null || value === undefined) {
    return `${label} is required.`;
  }

  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return `${label} must be a valid number.`;
  }
  if (numValue < 0) {
    return `${label} cannot be negative.`;
  }
  if (numValue > 999999999.99) {
    return `${label} exceeds maximum allowed value.`;
  }

  return null;
};

/**
 * Run multiple validations and return first error
 * @param {Array} validators - Array of validation functions
 * @returns {string|null} First error message or null if all valid
 */
export const runValidations = (...validators) => {
  for (const validator of validators) {
    const error = validator();
    if (error) return error;
  }
  return null;
};

/**
 * Format validation error message with full stop
 * @param {string} message - Error message
 * @returns {string} Formatted message with full stop
 */
export const formatErrorMessage = (message) => {
  if (!message) return message;
  const trimmed = message.trim().replace(/\.$/, '');
  return `${trimmed}.`;
};

/**
 * Validate form object
 * @param {Object} values - Form values
 * @param {Object} rules - Validation rules { field: { validator, label, ...options } }
 * @returns {Object} Errors object { field: errorMessage }
 */
export const validateForm = (values, rules) => {
  const errors = {};

  for (const [field, rule] of Object.entries(rules)) {
    const value = values[field];
    let error = null;

    switch (rule.validator) {
      case 'required':
        error = validateRequired(value, rule.label);
        break;
      case 'email':
        error = validateEmailId(value, rule.label);
        break;
      case 'contactNumber':
        error = validateContactNumber(value, rule.label);
        break;
      case 'postalCode':
        error = validatePostalCode(value, rule.label);
        break;
      case 'password':
        error = validatePassword(value, rule.label);
        break;
      case 'name':
        error = validateName(value, rule.label);
        break;
      case 'date':
        error = validateDate(value, rule.label);
        break;
      case 'number':
        error = validateNumber(value, rule.label, rule.min, rule.max);
        break;
      case 'price':
        error = validatePrice(value, rule.label);
        break;
      case 'length':
        error = validateLength(value, rule.label, rule.min, rule.max);
        break;
      default:
        if (typeof rule.validator === 'function') {
          error = rule.validator(value);
        }
    }

    if (error) {
      errors[field] = error;
    }
  }

  return errors;
};

export default {
  validateEmailId,
  validateContactNumber,
  validatePostalCode,
  validateRequired,
  validateLength,
  validatePassword,
  validateDate,
  validateName,
  validateNumber,
  validatePrice,
  runValidations,
  formatErrorMessage,
  validateForm
};
