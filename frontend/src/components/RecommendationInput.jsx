import ArrowUp from '../assets/arrow-up.png';

const RecommendationInput = () => {
    return ( 
        <div className="relative flex justify-center flex-col md:mx-28">
            <textarea
                rows="4"
                className="block p-4 w-full resize-none text-gray-900 bg-gray-100 rounded-3xl"
                placeholder="I want to taste spicy kottu near Colombo"
            ></textarea>
            <button className="absolute bottom-2 right-2 bg-primary rounded-full w-8 h-8 flex items-center justify-center"
                onClick={() => window.location.href = '/recommendation'}
            >
                <img src={ArrowUp} alt="submit" />
            </button>
        </div>
     );
}
 
export default RecommendationInput;