import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowUp from '../assets/arrow-up.png';

const RecommendationInput = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    //extract query param if on recommendation page
    useEffect(() => {
        if (!isHomePage) {
            const searchParams = new URLSearchParams(location.search);
            const urlQuery = searchParams.get('query');
            if (urlQuery) {
                setQuery(urlQuery);
            }
        }
    }, [location, isHomePage]);

    const handleSubmit = () => {
        if (!query.trim()) return;
        
        if (isHomePage) {
            //if on home page redirect to recommendation page with query
            navigate(`/recommendation?query=${encodeURIComponent(query)}`);
        } else {
            //if already on recommendation page, trigger search without redirect
            onSearch(query);
            
            // Update URL with new query parameter without page reload
            const searchParams = new URLSearchParams(location.search);
            searchParams.set('query', query);
            navigate({
                pathname: location.pathname,
                search: searchParams.toString()
            }, { replace: true });
        }
    };

    return ( 
        <div className="relative flex justify-center flex-col md:mx-28">
            <textarea
                rows="4"
                className="block p-4 w-full resize-none text-gray-900 bg-gray-100 rounded-3xl"
                placeholder="I want to taste spicy kottu near Colombo"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            ></textarea>
            <button className="absolute bottom-2 right-2 bg-primary rounded-full w-8 h-8 flex items-center justify-center"
                onClick={handleSubmit}
            >
                <img src={ArrowUp} alt="submit" />
            </button>
        </div>
     );
}
 
export default RecommendationInput;