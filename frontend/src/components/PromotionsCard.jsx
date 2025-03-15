const PromotionsCard = ({ thumbnail, title, description }) => {
    return ( 
        <div className="relative h-32 rounded-lg overflow-hidden">
            <img src={thumbnail} alt="BUY 1 GET 1 FREE" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-center">
                <h3 className="text-white text-2xl font-bold">{title}</h3>
                <p className="text-white text-sm">{description}</p>
            </div>
        </div>
     );
}
 
export default PromotionsCard;