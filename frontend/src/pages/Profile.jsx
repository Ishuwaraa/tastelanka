import Navbar from "../components/shared/Navbar";
import ProfilePic from "../assets/profilepic.png";
import { useState } from "react";

const Profile = () => {
    const [activeForm, setActiveForm] = useState('profile');
    const [activeLink, setActiveLink] = useState('profile');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const onActiveFormClick = (type) => {
        setActiveForm(type);
        setActiveLink(type);
    }

    return ( 
        <>
        <Navbar />

        <div className="page">
            <div className="flex items-center gap-5">
                <img src={ProfilePic} alt="ishuwara" className="w-16 h-16"/>
                <p className="text-lg font-bold">Ishuwara Avarjana</p>
            </div>

            <div className=" flex flex-col md:grid md:grid-cols-3 gap-10 lg:gap-20 mt-10">
                <div className=" col-span-1 border border-gray-400 rounded-lg md:h-64">
                    <div className=" grid grid-cols-2 gap-5 md:gap-8 md:flex md:flex-col px-10 py-8">
                        <p onClick={() => onActiveFormClick('profile')} className={` ${activeLink === 'profile'? 'text-primary' : 'text-gray-600'} font-semibold hover:cursor-pointer hover:underline`}>Profile</p>
                        <p onClick={() => onActiveFormClick('edit')} className={` ${activeLink === 'edit'? 'text-primary' : 'text-gray-600'} font-semibold hover:cursor-pointer hover:underline`}>Edit Profile</p>
                        <p onClick={() => onActiveFormClick('pass')} className={` ${activeLink === 'pass'? 'text-primary' : 'text-gray-600'} font-semibold hover:cursor-pointer hover:underline`}>Change Password</p>
                        <p onClick={() => onActiveFormClick('delete')} className={` ${activeLink === 'delete'? 'text-primary' : 'text-gray-600'} font-semibold hover:cursor-pointer hover:underline`}>Delete Account</p>
                    </div>
                </div>
        
                <div className=" col-span-2 border border-cusGray rounded-lg">
                    <div className=" px-10 py-8">
                        {activeForm === 'profile' && 
                            <form action="" >
                                <p className=" mb-1 w-full font-semibold">Name</p>
                                <input type="text" className="input" readOnly value={name}/>
                                <p className=" mt-3 mb-1 w-full font-semibold">Email</p>
                                <input type="email" className="input" readOnly value={email}/>
                                <p className=" mt-3 mb-1 w-full font-semibold">Contact</p>
                                <input type="text" className="input" readOnly value={phone}/>                                    
                            </form>
                        }

                        {activeForm === 'edit' &&
                            <form action="">
                                <p className=" mb-1 w-full font-semibold">Name</p>
                                <input type="text" className="input" required placeholder="John Doyle" />
                                
                                <p className=" mt-3 mb-1 w-full font-semibold">Email</p>
                                <input type="email" className="input" required placeholder="johndoyle@gmail.com"/>
                                
                                <p className=" mt-3 mb-1 w-full font-semibold">Contact</p>
                                <input type="text" className="input" required placeholder="0712567345"/>                        

                                <div className=" flex justify-end mt-8">
                                    <button className=" btn bg-primary"> Save Changes</button>
                                </div>
                            </form>
                        }

                        {activeForm === 'pass' &&
                            <form action="">
                                <p className=" mb-1 w-full font-semibold">Current password</p>
                                <input type="password" className="input" required/>                                

                                <p className=" mt-3 mb-1 w-full font-semibold">New password</p>
                                <input type="password" className="input" required/>                                

                                <p className=" mt-3 mb-1 w-full font-semibold">Confirm password</p>
                                <input type="password" className="input" required/>                                
                                <p className=" mt-1 text-sm text-red-600">note: You will be logged out after changing your password</p>

                                {/* {formErrMsg && <p className=" mt-1 text-sm text-red-600">{formErrMsg}</p>} */}
                                <div className=" flex justify-end mt-8">
                                    <button className=" btn bg-primary"> Update Password</button>
                                </div>
                            </form>
                        }

                        {activeForm === 'delete' &&
                            <form action="">
                                <p className=" mb-1 w-full font-semibold">Current password</p>
                                <input type="password" className="input" required/>                                

                                {/* {formErrMsg && <p className=" mt-1 text-sm text-red-600">{formErrMsg}</p>} */}
                                <div className=" flex justify-end mt-8">
                                    <button className=" btn bg-red-500"> Delete Account</button>
                                </div>
                            </form>
                        }
                    </div>
                </div>
            </div>
        </div>
        </>
     );
}
 
export default Profile;