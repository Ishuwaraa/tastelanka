import SriLankan from '../assets/sri-lankan.png'
import Chinese from '../assets/chinese.png'
import FastFood from '../assets/fast-food.png'
import Halal from '../assets/halal.png'
import Indian from '../assets/indian.png'
import Vegan from '../assets/vegan.png'

const imageMap = {
    1: SriLankan,
    2: Vegan,
    3: Halal,
    4: FastFood,
    5: Chinese,
    6: Indian
}

const CategoryCard = ({ category, image }) => {
    return ( 
        <div className='w-60 h-52 rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg flex flex-col justify-center gap-7'>
            <div className="flex justify-center">
                <img src={imageMap[image]} alt={category} className='w-16'/>
            </div>
            <div className="flex justify-center">
                <p className='text-primary font-semibold text-lg'>{category}</p>
            </div>
        </div>
     );
}
 
export default CategoryCard;