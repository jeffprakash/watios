import axios from 'axios';
import dotenv from "dotenv";

import { sent_stats, sent_message } from './api.js'; // Import success handler

dotenv.config();

// Module-level variables
let globalPhoneNumber = '';
const errorMap = new Map(); // Map to track error occurrences

// Function to create a custom Axios instance
function createWatios({ phonenumber, passkey }) {
  // Validate the passkey
  if (!validatePasskey(passkey)) {
    throw new Error('Invalid passkey provided');
  }

  globalPhoneNumber = phonenumber;

  const instance = axios.create({
    timeout: 5000, // No baseURL, just timeout
    headers: { 'Content-Type': 'application/json' }, // Set default headers for JSON
  });

  instance.phonenumber = phonenumber; // Store in instance for potential use

  // Override the default error handler to use watiosAlert
  instance.interceptors.response.use(
    (response) => {
      const formattedSuccess = formatSuccess(response);
      sent_stats(formattedSuccess);
      return response;
    },
    (error) => {
      const formattedError = formatError(error);
      if (shouldSendError(formattedError)) {
        sendErrorToWhatsApp(formattedError, phonenumber);
      }
      sent_stats(formattedError);
      return Promise.reject(formattedError);
    }
  );

  return instance;
}

// Function to validate the passkey
function validatePasskey(passkey) {
  const validPasskey = process.env.PASSKEY || 'jeff'; // Use environment variable if available
  return passkey === validPasskey;
}

// Function to format the error with more details
function formatError(error) {
  const { message, config, isAxiosError, code, response } = error;
  const { url, method, headers } = config || {};

  const errorMessage = getErrorMessage(code, message, response);
  const status = response?.status || 'No status';
  const responseData = response?.data || 'No response data';
  const now = new Date().toLocaleString(); // Get the current date and time

  return {
    date: now,
    errorCode: code || 'UNKNOWN_ERROR',
    message: errorMessage,
    url: url || 'No URL',
    method: method || 'No method',
    headers: headers || {},
    status: status,
    responseData: responseData, // Include response data for more details
    isAxiosError: isAxiosError || false,
  };
}

// Function to format general JavaScript errors (non-Axios)
function formatGeneralError(error) {
  const now = new Date().toLocaleString(); // Get the current date and time

  return {
    date: now,
    errorCode: error.code || 'UNKNOWN_ERROR',
    message: error.message || 'An error occurred',
    stack: error.stack || 'No stack trace available',
    name: error.name || 'Unknown error',
  };
}

// Function to format success responses for Supabase
function formatSuccess(response) {
  const { config: { url, method, headers }, status, data } = response;
  const now = new Date().toLocaleString(); // Get the current date and time

  return {
    date: now,
    message: 'Success',
    url: url || 'No URL',
    method: method || 'No method',
    headers: headers || {},
    status: status || 'No status',
    responseData: data || 'No response data',
  };
}

// Function to get a more descriptive error message
function getErrorMessage(code, message, response) {
  const responseData = response?.data || {};
  switch (code) {
    case 'ENOTFOUND':
      return `Network error: Unable to resolve the URL. Please check your internet connection or verify the URL.`;
    case 'ECONNABORTED':
      return `Request timed out: The request took too long and was aborted. Please try again later.`;
    case 'ECONNREFUSED':
      return `Connection refused: The server refused to establish a connection. Please ensure the server is running.`;
    case 'ETIMEDOUT':
      return `Request timed out: The server did not respond in time. Please try again later.`;
    case 'ERR_NETWORK':
      return `Network error: There was an issue with the network. Please check your connection and try again.`;
    case 'ERR_BAD_REQUEST':
      return `Bad request: ${responseData.error?.message || 'The request could not be understood by the server. Please check the request syntax and body.'}`;
    default:
      return `An unknown error occurred: ${message || 'No error message available.'}`;
  }
}

// Function to send the formatted error message to WhatsApp
function sendErrorToWhatsApp(error, phoneNumber) {
  const now = new Date().toLocaleString(); // Get the current date and time

  const msgtext = `🚨 *ERROR ALERT* 🚨

*Date & Time:* ${now}
*Error Code:* ${error.errorCode}
*Message:* ${error.message}
*URL:* ${error.url || 'N/A'}
*Method:* ${error.method || 'N/A'}
*Status:* ${error.status || 'N/A'}
*Response Data:* ${JSON.stringify(error.responseData || {})}
`;

console.log('Sending error message to WhatsApp...', msgtext);
  // sent_message(phoneNumber, msgtext); // Sending the message to WhatsApp
}

// Function to check if the error should be sent to WhatsApp (prevents duplicates within 3 minutes)
function shouldSendError(error) {
  const errorKey = `${error.errorCode}-${error.url}-${error.method}`; // Unique key for the error
  const currentTime = Date.now();

  if (errorMap.has(errorKey)) {
    const lastErrorTime = errorMap.get(errorKey);
    // Check if the last error was sent within the last 3 minutes (180000 ms)
    if (currentTime - lastErrorTime < 180000) {
      console.log('Duplicate error detected within 3 minutes. Not sending to WhatsApp.');
      return false; // Don't send duplicate
    }
  }

  // Update the map with the current time
  errorMap.set(errorKey, currentTime);
  return true; // Send error
}

// General error handler for any error type
function watiosAlert(error) {
  let formattedError;

  // Check if it's an Axios error
  if (error.isAxiosError) {
    formattedError = formatError(error);
  } else {
    formattedError = formatGeneralError(error); // Handle general errors
  }

  console.log('Error occurred:', formattedError);

  // Use the global phone number
  if (!globalPhoneNumber) {
    throw new Error('Phone number is not available');
  }

  // Check if we should send the error to WhatsApp
  if (shouldSendError(formattedError)) {
    sendErrorToWhatsApp(formattedError, globalPhoneNumber); // Send to WhatsApp
  }

  sent_stats(formattedError); // Send error details to Supabase
  return formattedError; // Returning formatted error for further handling if needed
}

export { createWatios, watiosAlert };
