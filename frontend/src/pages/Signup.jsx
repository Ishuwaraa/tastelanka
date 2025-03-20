import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = { name, email, password }
        await signup(formData);

        navigate('/', { replace: true });
    }

    return ( 
        <div>
            create account
            <form autoComplete="off" onSubmit={handleSubmit}>
                <input type="text" placeholder="full name" onChange={(e) => setName(e.target.value)}/>
                <input type="email" placeholder="email" onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)}/>
                <button>sign up</button>
            </form>
            <a href="/login">login</a>
        </div>
     );
}
 
export default SignUp;