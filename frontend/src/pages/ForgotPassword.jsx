import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (email !== '') {
            try {
                const { data } = await axiosInstance.post('user/forgot-pass', { email: email });
                console.log(data);
                toast.success('password reset link sent successfully')
                setSubmitted(true);
            } catch (err) {
                console.log(err);
                toast.error(err?.response?.data?.msg);
            }
        } else {
            toast.error('Please enter your email');
        }
    }

    return (         
        <div className="min-h-screen flex items-center justify-center bg-red-50 bg-opacity-75 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-md p-8">
                {!submitted ? (
                <>
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
                        <p className="text-gray-600 mt-2">Enter your email to receive a password reset link</p>
                    </div>
                    
                    {/* <form autoComplete="off"> */}
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="john@gmail.com"
                                required
                            />
                        </div>
                        
                        <button
                            onClick={(e) => handleSubmit(e)}
                            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200 font-medium"
                        >
                            Send Reset Link
                        </button>
                        
                    {/* </form> */}
                    <div className="text-center mt-4">
                        <a href="#" className="text-red-600 hover:text-red-800 text-sm">
                            Back to Login
                        </a>
                    </div>
                </>
                ) : (
                <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="mt-4 text-2xl font-bold text-gray-800">Check Your Email</h2>
                    <p className="mt-2 text-gray-600">
                        We've sent a password reset link to <span className="font-medium">{email}</span>
                    </p>
                    <p className="mt-4 text-gray-600">
                        Didn't receive the email? Check your spam folder or 
                    <button 
                        onClick={() => setSubmitted(false)} 
                        className="text-red-600 hover:text-red-800 ml-1"
                    >
                        try again
                    </button>
                    </p>
                </div>
                )}
            </div>
        </div>
    );
}
 
export default ForgotPassword;