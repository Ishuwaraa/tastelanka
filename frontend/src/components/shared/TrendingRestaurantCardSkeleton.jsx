const TrendingRestaurantCardSkeleton = () => {
    return (
        <div className="card h-96 bg-white rounded shadow animate-pulse">            
            <div className="w-full h-48 bg-gray-200"></div>

            <div className="m-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>

            <div className="grid grid-cols-2 m-4">
                <div className="flex items-center gap-1">
                    <div className="h-5 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div>
            </div>
        </div>
    );
}

export default TrendingRestaurantCardSkeleton;