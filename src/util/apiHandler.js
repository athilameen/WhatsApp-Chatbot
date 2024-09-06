import axios from "axios";
import fs from 'fs';
import FormData from 'form-data';


const token=process.env.TOKEN;
const version=process.env.VERSION;
const phone_no_id=process.env.PHONE_NO_ID;


//# This is for sending Text Messages
export async function sendTextMessage(to,msg){
    try {
        // Make the Axios request to send the message
        await axios.post(`https://graph.facebook.com/${version}/${phone_no_id}/messages?access_token=${token}`, {
            messaging_product: "whatsapp",
            to: to,
            text:{
                body:""+msg
            }
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        // If the request is successful, return true
        return true;
    } catch (error) {
        // If an error occurs, log it and return false
        console.error("Error sending message:", error);
        return false;
    }
}


//# This is for sending Text Messages
export async function sendMarkAsRead(MsgId) {
    try {
        // Make the Axios request to send the message
        await axios.post(`https://graph.facebook.com/${version}/${phone_no_id}/messages?access_token=${token}`, {
            messaging_product: "whatsapp",
            status: "read",
            message_id: MsgId
            }, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        // If the request is successful, return true
        return true;
    } catch (error) {
        // If an error occurs, log it and return false
        console.error("Error sending message:", error);
        return false;
    }
}


//media messages
export async function uploadMediaFile(filePath) {
    const formData = new FormData();
    formData.append('messaging_product', 'whatsapp');
    formData.append('file', fs.createReadStream(filePath));
  
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/${version}/${phone_no_id}/media`,
      headers: {
        'Authorization': 'Bearer ' +token,
        'Cookie': 'ps_l=1; ps_n=1',
        'content-type': 'multipart/form-data',
        ...formData.getHeaders()
      },
      data: formData
    };
  
    try {
      const response = await axios.request(config);
      console.log(response.data);
      return response.data;

    } catch (error) {
      console.log(error);
      return error;
    }
}

export async function getMediaURLFromMediaID(mediaId) {
    try {
        const response = await axios.get(`https://graph.facebook.com/${version}/${mediaId}`, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
         });

         // Check if the response contains the expected fields
        if ('url' in response.data) {
            return response.data ;
        } else {
            return { error: "Unexpected response format" };
        }

    } catch (error) {
        // If an error occurs, log it and return a structured error response
        console.error("Error getting media link:", error);

        // Type assertion for AxiosError
        if (axios.isAxiosError(error)) {
            return { error: error.response?.data?.error || "Media not found" };
        } else {
            return { error: "An unknown error occurred" };
        }
    }
}

  //getMediaURLFromMediaURL
export async function downloadMediaFromURL(mediaUrl) {
    try {
  
        const mediaResponse = await axios.get(mediaUrl, {
          headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`
          },
          responseType: 'arraybuffer',
          responseEncoding: 'binary'
  
      });
  
      console.log("data # ",mediaResponse.data);
      return mediaResponse.data;
  
      } catch (error) {
         // If an error occurs, log it and return a server error
         console.error('Error downloadMediaFromURL ', error);
         return error;
      }
}





export async function deleteMediaUsingId(mediaId){
    try {
        const response = await axios.delete(`https://graph.facebook.com/${version}/${mediaId}`, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
        });

        console.log("data # ", response.data);
        return response.data ;

    } catch (error) {
        // If an error occurs, log it and return a structured error response
        console.error('Error deleting media:', error);

        // Type assertion for AxiosError
        if (axios.isAxiosError(error)) {
            return { error: error.response?.data?.error || 'Failed to delete media' };
        } else {
            return { error: 'An unknown error occurred' };
        }
    }
}


