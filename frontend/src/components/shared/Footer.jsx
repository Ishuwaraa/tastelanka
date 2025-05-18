// import Logo from "../../assets/footer_logo.png";
import Facebook from "../../assets/facebook.png";
import Instagram from "../../assets/instagram.png";
import Linkedin from "../../assets/linkedin.png";
import Logo from '../../assets/tastelanka.png';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return ( 
        <footer className="bg-gray-100 text-black section">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">                
                    <div className="flex flex-col items-center md:items-start col-span-1">
                        <a href="/" className="flex items-center mb-4">
                            <img src={Logo} alt="TasteLanka Logo" className="w-40"/>
                        </a>
                        <div className="flex space-x-4 mt-4">
                            <a href="#" className="hover:text-gray-200">
                                <img src={Facebook} alt="TasteLanka Logo" className=" h-5 w-5"/>
                            </a>
                            <a href="#" className="hover:text-gray-200">
                                <img src={Instagram} alt="TasteLanka Logo" className="ml-2 h-5 w-5"/>
                            </a>
                            <a href="#" className="hover:text-gray-200">
                                <img src={Linkedin} alt="TasteLanka Logo" className="ml-2 h-5 w-5"/>
                            </a>
                        </div>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 pr-10">
                        <h2 className="text-2xl font-bold mb-4">About Us</h2>
                        <p className="text-sm">
                            TasteLanka is your go-to platform for discovering and sharing the rich culinary experiences of Sri Lanka. Whether
                            you're craving authentic rice and curry, halal street food, or a cozy vegetarian cafe, we help you find the best local
                            restaurants to satisfy your taste buds. With real reviews, dish recommendations, and smart search features,
                            TasteLanka connects food lovers with the hidden gems and popular spots across the island. Our goal is to celebrate the diverse
                            food culture that brings us all together, one meal at a time.
                        </p>
                    </div>
                    
                    <div className="col-span-1">
                        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                        <p className="mb-4 text-sm">
                            Have any questions for us? Just give us a shout!
                        </p>
                        <p className="mb-2 text-sm">
                            Email : shout@tastelanka.lk
                        </p>
                        <p className="text-sm">
                            Tel : 011 2224 448
                        </p>
                    </div>
                </div>
                
                <div className="mt-8 pt-4 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center">
                    <div>
                        © Tastelanka {currentYear}
                    </div>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-gray-200">Home</a>
                        <a href="#" className="hover:text-gray-200">Privacy policy</a>
                        <a href="#" className="hover:text-gray-200">FAQ's</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
 
export default Footer;