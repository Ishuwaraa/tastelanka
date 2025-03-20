import { useState } from 'react';
import tastelanka from '../../assets/tastelanka.png';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const Navbar = () => {
    const [burgerIcon, setBurgerIcon] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);
    const { logout, authUser } = useAuthStore();;
    const navigate = useNavigate();

    const toggleBurgerIcon = () => {
        setBurgerIcon(!burgerIcon);
        setMenuVisible(!menuVisible);
    }  

    const onSearch = (e) => {
        e.preventDefault();
        window.location.href = '/search'
    }

    return ( 
        <nav className=' flex items-center justify-between border border-b-1 border-b-gray-200 h-14 fixed top-0 bg-white w-full z-50'>
            <div className=' mx-10'>
                <a href="/"><img src={tastelanka} alt="tastelanka" /></a>
            </div>

            <div className=' hidden lg:flex flex-grow justify-evenly items-center font-montserrat font-semibold '>
                <div className='flex shadow-md w-72 rounded-lg'>
                    <input type="text" className=' w-full text-xs p-1 rounded-lg focus:border-transparent' placeholder='search by location or a restaurant name'/>
                    <div className="p-1 text-white bg-primary hover:cursor-pointer rounded-tr-lg rounded-br-lg">
                        <svg onClick={(e) => onSearch(e)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className='size-6'>
                            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>                
                <a href="/" >Own a Restaurant?</a>
                {authUser && <a href="/profile" >Profile</a>}
                {authUser && <a href="/profile/restaurant" >My Restaurant</a>}
                {authUser && <a href="/profile/inbox" >Messages</a>}
            </div>

            <div className=' mx-10 block lg:hidden' onClick={toggleBurgerIcon}>
            {burgerIcon ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg> 
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            )}                    
            </div>       

            <div className=' mx-10 hidden lg:block'>
                {authUser ? (
                    <button className='btn bg-primary' onClick={logout}>Log out</button>
                ) : (
                    <button className='btn bg-primary' onClick={() => navigate('/login')}>Log in</button>
                )}                
            </div>

            {menuVisible && (
                <div className={`absolute top-14 left-0 w-full font-montserrat font-semibold bg-white border border-b-gray-200  pb-4 lg:hidden transition-all duration-500 ease-in-out transform ${menuVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    <ul className='flex flex-col items-center space-y-4 py-4'>
                    <li><a href="/" className='block w-full text-center'>Own a Restaurant?</a></li>
                    {authUser && <li><a href="/profile" className='block w-full text-center'>Profile</a></li>}
                    {authUser && <li><a href="/profile/restaurant" className='block w-full text-center'>My Restaurant</a></li>}
                    {authUser && <li><a href="/profile/inbox" className='block w-full text-center'>Messages</a></li>}                    
                    </ul>
                    <div className=' flex justify-center'>
                        {authUser ? (
                            <button className='btn bg-primary' onClick={logout}>Log out</button>
                        ) : (
                            <button className='btn bg-primary' onClick={() => navigate('/login')}>Log in</button>
                        )}                        
                    </div>
                </div>
            )}
        </nav>
     );
}
 
export default Navbar;