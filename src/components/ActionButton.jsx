
export default function ActionButton({ text, onClick }) {
    return (
        <button
            onClick={onClick}
            className="
      bg-[#C3FF51] text-black py-4 px-10 rounded-full font-bold w-full transition-all
      hover:bg-black hover:text-[#C3FF51] border-2 border-transparent hover:border-[#C3FF51]
      active:bg-white">
            + {text}
        </button>
    );
}
