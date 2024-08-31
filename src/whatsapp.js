import axios from "axios";


async function sendMessage(phonenumber, text) {
    try {
      const response = await axios.post(`https://graph.facebook.com/v19.0/${phonenumberid}/messages`, {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: `${phonenumber}`,
        type: "text",
        text: {
          body: `${text}`
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        }
      });
      
      console.log(response.data); // Log the response data
    } catch (error) {
      console.error('Error:', error.response.data); // Log error response data
    }
  }





