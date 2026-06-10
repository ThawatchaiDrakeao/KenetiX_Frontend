
export default function ProductButton({ text, onClick }) {
    return (
        <button
            onClick={onClick}
            className="
      bg-[#C3FF51]/25 text-[#C3FF51] py-4 px-10 rounded-full font-bold w-full transition-all
      hover:bg-[#C3FF51] hover:text-black border-2 border-transparent
      active:bg-white">
            + {text}
        </button>
    );
}
