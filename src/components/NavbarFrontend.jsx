/*
import ActionButton from './ActionButton';

export default function Navbar({ setPage, currentPage }) {
    return (
        <nav className="flex justify-between items-center p-5 bg-black border-gray-800 sticky top-0 z-50">
            <div className="font-black text-[#C3FF51] tracking-wider">KINETIX</div>

            <div className="hidden md:flex gap-6 text-xs text-gray-400">
                <button
                    onClick={() => setPage('allProduct')}
                    className={`text-sm transition-colors ${currentPage === 'allProduct' ? 'text-[#C3FF51] font-bold' : 'text-gray-400 hover:text-white'}`}
                >
                    All Products
                </button>

                <button
                    onClick={() => setPage('allBrand')}
                    className={`text-sm transition-colors ${currentPage === 'allBrand' ? 'text-[#C3FF51] font-bold' : 'text-gray-400 hover:text-white'}`}
                >
                    All Brands
                </button>


                <button
                    onClick={() => setPage('howWork')}
                    className={`text-sm transition-colors ${currentPage === 'howWork' ? 'text-[#C3FF51] font-bold' : 'text-gray-400 hover:text-white'}`}
                >
                    How It Works
                </button>

                <button
                    onClick={() => setPage('contact')}
                    className={`text-sm transition-colors ${currentPage === 'contact' ? 'text-[#C3FF51] font-bold' : 'text-gray-400 hover:text-white'}`}
                >
                    Contact Us
                </button>
            </div>
            <div>
                <ActionButton text="Let's Start" onClick={() => setPage('login')} />

            </div>
        </nav>
    );
}
    */