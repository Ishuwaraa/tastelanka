import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Recommendations from './pages/Recommendation';
import Restaurant from './pages/Restaurant';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/search' element={<Search />} />
        <Route path='/recommendation' element={<Recommendations />} />
        <Route path='/restaurant' element={<Restaurant />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
