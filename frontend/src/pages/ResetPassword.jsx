import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPassword = () => {
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    
    const handleSubmit = async () => {

        if(newPass !== confirmPass) {
            toast.error('passwords do not match');
            return
        }

        try {
            const { data } = await axiosInstance.post(`user/reset-pass/${token}`, { password: newPass });
            console.log(data);
            toast.success('password reset successfully');
            navigate('/login', { replace: true });
        } catch (err) {
            console.log(err.message);
        }
    }

    return ( 
        <div>
            enter your new password<br />
            <input type="password" placeholder="new password" value={newPass} onChange={(e) => setNewPass(e.target.value)} /><br />
            <input type="password" placeholder="confirm password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
            <button onClick={handleSubmit}>Reset password</button>
        </div>
    );
}
 
export default ResetPassword;