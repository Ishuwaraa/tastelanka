const RestaurantCardSkeleton = () => {
    return (
        <div className="px-5 py-4 grid grid-cols-3 rounded-lg shadow-lg gap-5 h-52 mb-8 animate-pulse">            
            <div className="col-span-1 flex justify-center">
                <div className="w-full h-40 bg-gray-200 rounded"></div>
            </div>

            <div className="col col-span-2">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                
                <div className="flex justify-between mb-2">
                    <div className="h-5 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
                
                <div className="flex gap-2 mb-4">
                    <div className="h-8 w-16 bg-gray-200 rounded-lg"></div>
                    <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded-lg"></div>
                </div>
                
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
        </div>
    );
}

export default RestaurantCardSkeleton;