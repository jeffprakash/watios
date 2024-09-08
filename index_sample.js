// watios.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Module-level variables
let globalPhoneNumber = '';
const errorMap = new Map(); // Map to track error occurrences

// Function to create a custom Axios instance
function createWatios({ phonenumber, passkey }) {
  if (!validatePasskey(passkey)) {
    throw new Error('Invalid passkey provided');
  }

  globalPhoneNumber = phonenumber;

  const instance = axios.create({
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' },
  });

  instance.phonenumber = phonenumber;

  // Add response interceptor to track successful responses and errors
  instance.interceptors.response.use(
    (response) => {
      // Format and log success response
      const successData = formatSuccessResponse(response);
      console.log('Success Response:', successData);

      // Optionally send success stats
      sendStatsToService(successData);

      return response;
    },
    (error) => {
      // Use watiosAlert to handle and format errors
      watiosAlert(error);

      // Send the error to be handled by the caller
      return Promise.reject(error);
    }
  );

  // Middleware function to handle errors
  function watiosErrorHandler(err, req, res, next) {
    watiosAlert(err);

    // Send a 500 status with error message
    res.status(500).send('An error occurred, our team has been notified!');
  }

  return { instance, watiosErrorHandler };
}

// Function to validate the passkey
function validatePasskey(passkey) {
  const validPasskey = process.env.PASSKEY || 'jeff'; // Use environment variable if available
  return passkey === validPasskey;
}

// Format error for WhatsApp notification and stats logging
function formatGeneralError(error) {
  const now = new Date().toLocaleString();
  return {
    date: now,
    errorCode: error.response?.status || 'UNKNOWN_ERROR',
    message: error.message || 'An error occurred',
    stack: error.stack || 'No stack trace available',
    name: error.name || 'Unknown error',
    url: error.config?.url || 'N/A',
    method: error.config?.method || 'N/A',
  };
}

// Function to check if the error should be sent to WhatsApp
function shouldSendError(error) {
  const errorKey = `${error.errorCode}-${error.url}-${error.method}`;
  const currentTime = Date.now();

  if (errorMap.has(errorKey)) {
    const lastErrorTime = errorMap.get(errorKey);
    if (currentTime - lastErrorTime < 180000) {
      console.log('Duplicate error detected within 3 minutes. Not sending to WhatsApp.');
      return false;
    }
  }

  errorMap.set(errorKey, currentTime);
  return true;
}

// Function to send error to WhatsApp
function sendErrorToWhatsApp(error, phoneNumber) {
  const now = new Date().toLocaleString();
  const stackLines = error.stack ? error.stack.split('\n') : [];
  const firstTwoLines = stackLines.slice(0, 2).join('\n');
  const msgtext = `🚨 *ERROR ALERT* 🚨
*Date & Time:* ${now}
*Error Code:* ${error.errorCode}
*Message:* ${error.message}
*Stack:* ${firstTwoLines || 'N/A'}
`;

  console.log('Sending message:', msgtext);

  // Uncomment when ready to send messages
  // sent_message(phoneNumber, msgtext);
}

// Format success response for stats logging
function formatSuccessResponse(response) {
  const now = new Date().toLocaleString();
  return {
    date: now,
    statusCode: response.status,
    statusText: response.statusText,
    data: response.data,
    headers: response.headers,
  };
}

// Function to send stats to your Supabase or any other service
function sendStatsToService(successData) {
  console.log('Sending success stats to service:', successData);
  // Assuming you have a function similar to sent_stats for success data
  sent_stats(successData);
}

// Function to handle errors directly by passing the error object
function watiosAlert(error) {
  const formattedError = formatGeneralError(error);

  // Log and send to WhatsApp if needed
  if (shouldSendError(formattedError)) {
    sendErrorToWhatsApp(formattedError, globalPhoneNumber);
  }

  console.error('Watios captured:', formattedError);
}

export { createWatios, watiosAlert };
