import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Recommendations from './pages/Recommendation';
import Restaurant from './pages/Restaurant';
import Profile from './pages/Profile';
import Inbox from './pages/Inbox';
import MyRestaurant from './pages/MyRestaurant';
import Login from './pages/Login';
import { useAuthStore } from './store/useAuthStore';
import { useEffect, useState } from 'react';
import SignUp from './pages/Signup';
import { Toaster } from "react-hot-toast";
import Category from './pages/Category';
import AddRestaurant from './pages/AddRestaurant';
import NearbyRestaurants from './pages/NearbyRestaurants';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import LoadingPan from './assets/loading_pan.gif';

function App() {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();  

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <img src={LoadingPan} alt="Loading..." className="w-36 mb-4" />
        <p className="text-lg text-gray-600 font-bold">Loading...</p>
      </div>
    );
  }

  // const [showLoader, setShowLoader] = useState(true);

  // useEffect(() => {
  //   checkAuth();

  //   // Force 5-second loading screen
  //   const timer = setTimeout(() => {
  //     setShowLoader(false);
  //   }, 50000);

  //   return () => clearTimeout(timer);
  // }, [checkAuth]);

  // if ((isCheckingAuth || showLoader) && !authUser) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-screen">
  //       <img src={LoadingPan} alt="Loading..." className="w-36 mb-4" />
  //       <p className="text-lg text-gray-600 font-bold">Loading...</p>
  //     </div>
  //   );
  // }

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/login' element={!authUser? <Login /> : <Navigate to='/' />} />
        <Route path='/signup' element={!authUser? <SignUp /> : <Navigate to='/' />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/forgot-pass' element={<ForgotPassword />} />
        <Route path='/search' element={<Search />} />
        <Route path='/category' element={<Category />} />
        <Route path='/recommendation' element={<Recommendations />} />
        <Route path='/restaurant' element={<Restaurant />} />
        <Route path='/nearby' element={<NearbyRestaurants />} />
        <Route path='/add-restaurant' element={authUser?.role !== 'owner' ? <AddRestaurant /> : <Navigate to='/' />} />
        <Route path='/profile'>
          <Route index element={authUser? <Profile /> : <Navigate to='/login' />} />
          <Route path='inbox' element={authUser? <Inbox /> : <Navigate to='/login' />} />
          <Route path='restaurant' element={authUser? <MyRestaurant /> : <Navigate to='/login' />} />
        </Route>
      </Routes>

      <Toaster position="top-right"/>
    </BrowserRouter>
  )
}

export default App
