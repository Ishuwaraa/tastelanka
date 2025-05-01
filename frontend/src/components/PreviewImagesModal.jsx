import { Modal } from '@mui/material';
import { useState } from 'react';
import ArrowLeft from '../assets/arrow-left.png';
import ArrowRight from '../assets/arrow-right.png';

const PreviewImagesModal = ({ open, handleClose, images }) => {
    const [currIndex, setCurrIndex] = useState(0);
    
    const handlePrev = (e) => {
        e.stopPropagation();
        setCurrIndex((prev) => (prev === 0 ? images?.length - 1 : prev - 1));
    }

    const handlenext = (e) => {
        e.stopPropagation();
        setCurrIndex((prev) => (prev === images?.length - 1 ? 0 : prev + 1));
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >            
            <div className="fixed inset-0 flex items-center justify-center bg-black/60" onClick={handleClose}>
                <div className="relative bg-slate-100 p-4 shadow-md w-[800px] h-[600px] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                    
                    <button className="absolute justify-center left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10" 
                        onClick={(e) => handlePrev(e)}
                        disabled={images?.length === 1}
                    >
                        <img src={ArrowLeft} alt='left arrow' className='w-5'/>
                    </button>
                    
                    <div className="w-full h-full flex items-center justify-center overflow-hidden">
                        <img 
                            src={images[currIndex]} 
                            alt="Restaurant" 
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>

                    <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10" 
                        onClick={(e) => handlenext(e)}
                        disabled={images?.length === 1}
                    >
                        <img src={ArrowRight} alt='right arrow' className='w-5'/>
                    </button>
                </div>
            </div>
        </Modal>
     );
}
 
export default PreviewImagesModal;