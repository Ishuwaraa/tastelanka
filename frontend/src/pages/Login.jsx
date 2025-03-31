import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, authUser } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = { email, password };
        await login(formData);
        
        //get the latest authUser value directly from the store
        const currentUser = useAuthStore.getState().authUser;        
        if (currentUser !== null) {
            navigate(from, { replace: true });
        }
    }

    return ( 
        <div>
            log into account
            <form autoComplete="off" onSubmit={handleSubmit}>
                <input type="email" placeholder="email" onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)}/>
                <button>log in</button>
            </form>
            <a href="/signup">create account</a><br />
            <a href="/forgot-pass">forgot password? Reset here</a>
        </div>
     );
}
 
export default Login;