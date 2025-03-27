import { useState } from "react";
import PromotionEditModal from "./PromotionEditModal";

const PromotionsCard = ({ thumbnail, title, description, editable, restaurantId, promotionId }) => {
    const [openPromotionModal, setOpenPromotionModal] = useState(false);
    
    const handleOpenPromotion = () => setOpenPromotionModal(true);
    const handleClosePromotion = () => setOpenPromotionModal(false);

    return ( 
        <>
        <div className="relative h-32 rounded-lg overflow-hidden">
            {editable && (
                <div className="absolute top-2 right-2 z-10 text-white text-sm font-medium px-3 py-1 border border-white rounded-lg shadow-sm cursor-pointer"
                    onClick={handleOpenPromotion}
                >
                    Edit
                </div>
            )}
            <img src={thumbnail} alt="BUY 1 GET 1 FREE" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-center">
                <h3 className="text-white text-2xl font-bold">{title}</h3>
                <p className="text-white text-sm">{description}</p>
            </div>
        </div>
        <PromotionEditModal 
            open={openPromotionModal} 
            handleClose={handleClosePromotion} 
            title={title}
            description={description}
            image={thumbnail}
            restaurantId={restaurantId}
            promotionId={promotionId}
        />
        </>
     );
}
 
export default PromotionsCard;