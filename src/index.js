// src/index.js
import axios from 'axios';

const customAxios = axios.create({
  baseURL: 'https://your-api-base-url.com',
  timeout: 5000,
});

customAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const formattedError = formatError(error);
    // console.error(formattedError);
    // sendErrorToWhatsApp(formattedError);
    return Promise.reject(formattedError);
  }
);



function formatError(error) {
    // Extract relevant details from the error object
    const {
      message,
      config,
      isAxiosError,
    } = error;
  
    // Extract basic information from config
    const {
      url,
      method,
      headers,
      baseURL,
    } = config || {};
  
    return {
    "jeff": "jeff",
      message: message || 'An error occurred',
      url: url || 'No URL',
      method: method || 'No method',
      baseURL: baseURL || 'No base URL',
      headers: headers || {},
      isAxiosError: isAxiosError || false,
    };
  }
  

function sendErrorToWhatsApp(error) {
  console.log('Sending error to WhatsApp:', error);
}

export { customAxios, formatError, sendErrorToWhatsApp };
