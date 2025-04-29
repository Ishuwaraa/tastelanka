import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [conPassword, setConPassword] = useState('');
    const { signup } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (name === '' || email === '' || password === '' || conPassword === '') {
            toast.error('Please fill all the fields');
        } else if (conPassword !== password) {        
            toast.error("Passwords don't match");
        } else {
            const formData = { name, email, password }
            await signup(formData);
    
            //navigate('/', { replace: true });
        }
    }

    return (                               
        <div className="min-h-screen flex items-center justify-center bg-red-50 bg-opacity-75 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-4xl flex">
                
                <div className="bg-primary text-white p-10 flex flex-col justify-center w-2/5">
                    <h1 className="text-3xl font-bold mb-4 hover:cursor-pointer" onClick={() => window.location.href = '/'}>TateLanka</h1>
                    <p className="text-lg">Discover, Review and Connect with Sri Lankan Restaurants.</p>
                </div>
                
                
                <div className="p-10 w-3/5">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Create your account</h2>
                        <p className="text-gray-600">Join our community of food lovers</p>
                    </div>
                    
                    {/* <form autoComplete="off"> */}
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                                Full name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="johndoe@gmail.com"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="••••••••"
                                required
                            />
                        </div>                    
                        <div className="mb-6">
                            <label htmlFor="conPassword" className="block text-gray-700 text-sm font-medium mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="conPassword"
                                value={conPassword}
                                onChange={(e) => setConPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200 font-medium"
                            onClick={(e) => handleSubmit(e)}
                            >
                            Sign Up
                        </button>
                        
                    {/* </form> */}
                    <div className="text-center mt-4">
                        <span className="text-sm">
                            Already have an account? &nbsp;
                            <a href="/login" className="text-red-600 hover:text-red-800 text-sm">
                                Sign in now
                            </a>
                        </span>
                    </div>
                </div>
            </div>
        </div>        
     );
}
 
export default SignUp;