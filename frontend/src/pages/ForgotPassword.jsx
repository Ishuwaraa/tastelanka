import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async () => {
        try {
            const { data } = await axiosInstance.post('user/forgot-pass', { email: email });
            console.log(data);
            toast.success('password reset link sent successfully')
        } catch (err) {
            console.log(err.message);
        }
    }

    return ( 
        <div>
            enter your email address to send the reset link<br />
            <input type="email" placeholder="john@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
            <button onClick={handleSubmit}>send reset link</button>
        </div>
    );
}
 
export default ForgotPassword;