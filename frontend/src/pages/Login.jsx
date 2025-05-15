import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useLocation, useNavigate } from "react-router-dom";
import LoginBg from "../assets/login_bg.png";

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
        <div className="min-h-screen flex items-center justify-center bg-opacity-75 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-4xl flex">                            

                <div className="relative bg-primary text-white p-10 flex flex-col justify-center w-2/5 overflow-hidden">                    
                    <div 
                        className="absolute inset-0 opacity-25 z-0"
                        style={{
                            backgroundImage: `url(${LoginBg})`,
                            backgroundSize: "cover",
                            backgroundRepeat: "repeat"
                        }}
                    ></div>
                                        
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold mb-4 hover:cursor-pointer drop-shadow-md text-shadow" onClick={() => window.location.href = '/'}>TateLanka</h1>
                        <p className="text-lg drop-shadow-md">Discover, Review and Connect with Sri Lankan Restaurants.</p>
                    </div>
                </div>
                
                
                <div className="p-10 w-3/5">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Welcome back</h2>
                        <p className="text-gray-600">Please sign in to continue</p>
                    </div>
                    
                    {/* <form> */}
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
                            placeholder="john@email.com"
                            required
                        />
                        </div>
                        
                        <div className="mb-6">
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
                        
                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200 font-medium"
                            onClick={(e) => handleSubmit(e)}
                            >
                            Sign In
                        </button>
                        
                    {/* </form> */}
                    <div className="text-center mt-4 flex justify-between">
                        <span className="text-sm">
                            Don't have an account? &nbsp;
                            <a href="/signup" className="text-red-600 hover:text-red-800 text-sm">
                                Sign up now
                            </a>
                        </span>
                        <a href="/forgot-pass" className="text-red-600 hover:text-red-800 text-sm">
                            Forgot password?
                        </a>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default Login;