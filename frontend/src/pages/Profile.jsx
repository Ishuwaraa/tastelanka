import Navbar from "../components/shared/Navbar";
import DummyPic from "../assets/dummy.jpg";
import EditPen from "../assets/edit_pen.png";
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import RestaurantCard from "../components/RestaurantCard";
import TrendingRestaurantCard from "../components/TrendingRestaurantCard";
import TrendingRestaurantCardSkeleton from "../components/shared/TrendingRestaurantCardSkeleton";
import Footer from "../components/shared/Footer";
import ProfileFormSkeleton from "../components/shared/ProfileFormSkeleton";

const Profile = () => {
    const [activeForm, setActiveForm] = useState('profile');
    const [activeLink, setActiveLink] = useState('profile');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [favRestaurants, setFavRestaurants] = useState([]);
    const [profileLoading, setProfileLoading] = useState(false);
    const [favRestaurantLoading, setFavRestaurantLoading] = useState(false);

    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [profilePic, setProfilePic] = useState(null);

    const onActiveFormClick = (type) => {
        setActiveForm(type);
        setActiveLink(type);
    }

    const fetchUserData = async () => {
        try {
            setProfileLoading(true);
            setFavRestaurantLoading(true);
            const { data } = await axiosInstance.get('user/');    
            // console.log(data);        
            setName(data?.name);
            setEmail(data?.email);
            setPhone(data?.phone);
            setProfilePic(data?.profilePic);
            setFavRestaurants(data?.favs);
        } catch (err) {
            console.log(err.message);
        } finally {
            setProfileLoading(false);
            setFavRestaurantLoading(false);
        }
    };

    const onSubmit = async (event, type) => {
        event.preventDefault();

        if(type === 'edit') {
            try {
                const { data } = await axiosInstance.patch('user/', { name: newName, phone: newPhone ? newPhone : phone });
                setName(data?.name);
                setPhone(data?.phone);                
                toast.success('profile updated');
            } catch (err) {
                console.log(err.message);
            }
        } else if (type === 'pass') {
            if (confirmPass === newPassword) {
                try {
                    await axiosInstance.patch('user/pass', { currPass: password, newPass: newPassword });                
                    window.location.reload();
                    toast.success('password updated');
                } catch (err) {
                    if (err?.response?.status === 400) {
                        toast.error(err.response.data.msg);
                    } else {
                        console.log(err.message);
                    }
                }
            } else {
                toast.error('passwords do not match');
            }
        } else if (type === 'delete') {
            if(window.confirm('Are you sure you want to delete this account?')){
            }
        }
    }

    const handleFileSelectAndUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*'; 

        input.onchange = async (event) => {
            const file = event.target.files?.[0];

            if (file) {
                const formData = new FormData();
                formData.append('file', file);
        
                try {
                    const { data } = await axiosInstance.post('user/profilepic', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });                        
                    setProfilePic(data?.profilePic);
                    toast.success('Profile pic updated successfully!');
                } catch (err) {
                    console.log(err.message);
                }
            }
        };
        input.click();
    };
      
    useEffect(() => {
        fetchUserData();
    }, []);

    return ( 
        <>
        <Navbar />

        <div className="page">
            <div className="flex items-center gap-5">
                <div className="relative w-16 h-16">
                    <img src={profilePic ? profilePic : DummyPic} alt={name || "profile"} className="w-16 h-16 rounded-full object-cover border border-gray-200"/>
                                                            
                    <button className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md border border-gray-200" onClick={handleFileSelectAndUpload}>                            
                        <img src={EditPen} alt="edit" className="w-4 h-4" />
                    </button>
                </div>
                
                <p className="text-lg font-bold">{name || "User"}</p>
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
                        {profileLoading ? (
                            <ProfileFormSkeleton />
                        ) : (
                            activeForm === 'profile' && 
                                <form action="" >
                                    <p className=" mb-1 w-full font-semibold">Name</p>
                                    <input type="text" className="input" readOnly value={name}/>
                                    <p className=" mt-3 mb-1 w-full font-semibold">Email</p>
                                    <input type="email" className="input" readOnly value={email}/>
                                    <p className=" mt-3 mb-1 w-full font-semibold">Contact</p>
                                    <input type="text" className="input" readOnly value={phone ? phone : ''}/>                                    
                                </form>
                            
                        )}

                        {activeForm === 'edit' &&
                            <form action="" onSubmit={(e) => onSubmit(e, 'edit')}>
                                <p className=" mb-1 w-full font-semibold">Name</p>
                                <input type="text" className="input" required placeholder={name} onChange={(e) => setNewName(e.target.value)}/>
                                
                                <p className=" mt-3 mb-1 w-full font-semibold">Email</p>
                                <input type="email" className="input" required placeholder="johndoyle@gmail.com" value={email} readOnly/>
                                
                                <p className=" mt-3 mb-1 w-full font-semibold">Contact</p>
                                <input type="text" className="input" placeholder={phone ? phone : '0112224448'} onChange={(e) => setNewPhone(e.target.value)}/>                        

                                <div className=" flex justify-end mt-8">
                                    <button className=" btn bg-primary"> Save Changes</button>
                                </div>
                            </form>
                        }

                        {activeForm === 'pass' &&
                            <form action="" onSubmit={(e) => onSubmit(e, 'pass')}>
                                <p className=" mb-1 w-full font-semibold">Current password</p>
                                <input type="password" className="input" required onChange={(e) => setPassword(e.target.value)}/>                                

                                <p className=" mt-3 mb-1 w-full font-semibold">New password</p>
                                <input type="password" className="input" required onChange={(e) => setNewPassword(e.target.value)}/>                                

                                <p className=" mt-3 mb-1 w-full font-semibold">Confirm password</p>
                                <input type="password" className="input" required onChange={(e) => setConfirmPass(e.target.value)}/>                                
                                {/* <p className=" mt-1 text-sm text-red-600">note: You will be logged out after changing your password</p> */}

                                {/* {formErrMsg && <p className=" mt-1 text-sm text-red-600">{formErrMsg}</p>} */}
                                <div className=" flex justify-end mt-8">
                                    <button className=" btn bg-primary"> Update Password</button>
                                </div>
                            </form>
                        }

                        {activeForm === 'delete' &&
                            <form action="" onSubmit={(e) => onSubmit(e, 'delete')}>
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

            <div className="mt-16">
                <p className="text-2xl font-semibold">Your favourites</p>

                <div className="flex justify-center mt-10">
                    {favRestaurantLoading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {Array(3).fill(0).map((_, index) => (
                                <TrendingRestaurantCardSkeleton key={index} />
                            ))}
                        </div>
                    ) : (
                        favRestaurants.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {favRestaurants.map((restaurant, index) => (
                                    <a href={`/restaurant?id=${restaurant._id}&f=true`} key={index}>
                                        <TrendingRestaurantCard
                                            restaurant={restaurant?.name}
                                            thumbnail={restaurant?.thumbnail}
                                            location={restaurant?.location}
                                            reviews={Math.floor(Math.random() * 10) + 1}
                                            rating={restaurant?.rating}
                                        />
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Add your favourite restaurants here for easy access</p>
                        )
                    )}
                </div>

                {/* <div className="w-full flex flex-col items-center mt-10">
                    {Array(3).fill(0).map((restaurant, index) => (
                        <a href='/' key={index} className="md:w-3/4">
                            <RestaurantCard
                                restaurant="title"
                                rating={4}
                                reviewsCount={3}
                                categories={['cat1']}
                                image={DummyPic}
                            />
                        </a>
                    ))}
                </div> */}
            </div>
        </div>

        <Footer />
        </>
     );
}
 
export default Profile;