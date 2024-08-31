import axios from "axios";


// Function to send the error details to the /add_usage API
async function sent_stats(error) {
    try {
      // Define the API endpoint and the request body (error details)
      const apiEndpoint = 'http://localhost:3000/add_usage';
      const requestBody = {
        details: error,
      };
  
      // Make a POST request to the /add_usage API
      const response = await axios.post(apiEndpoint, requestBody);
  
      // Log the success response
    //   console.log('Error sent to /add_usage successfully:', response.data);

    return response.data;
  
    } catch (e) {
      console.error('Error sending to /add_usage API:', e);
    }
  }


  // Function to send the error details to the /add_usage API
async function sent_message(phonenumber,msgtext) {
  try {
    // Define the API endpoint and the request body (error details)
    const apiEndpoint = 'http://localhost:3000/send_message';
    const requestBody = {
      phonenumber: phonenumber,
      text: msgtext,
    };

    // Make a POST request to the /add_usage API
    const response = await axios.post(apiEndpoint, requestBody);

    // Log the success response
  //   console.log('Error sent to /add_usage successfully:', response.data);

  return response.data;

  } catch (e) {
    console.error('Error sending to /add_usage API:', e);
  }
}

    export {sent_stats,sent_message}
  