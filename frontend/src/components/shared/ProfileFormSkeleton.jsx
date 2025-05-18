const ProfileFormSkeleton = () => {
    return (
        <div className="animate-pulse">
            
            <div className="h-10 bg-gray-200 rounded w-full mb-3"></div>
            <div className="h-10 bg-gray-200 rounded w-full mb-3"></div>            
            <div className="h-10 bg-gray-200 rounded w-full"></div>                        
            <div className="flex justify-end mt-8">
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
}

export default ProfileFormSkeleton;