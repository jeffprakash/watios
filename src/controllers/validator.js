import axios from "axios";



const verify_passkey = async(paskey) => {

    try {

        const key = await axios.post('http://localhost:3000/verify', { passkey: paskey });

        console.log(key.data);

        if(key.status !== true){
            return false;  
        }


    return true;
        
    } catch (error) {
        console.log(error)
        return false;
    };

};




export { verify_passkey };