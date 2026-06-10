export default function HeroButton() {
  return (
    <button
      className="bg-[#C3FF51] text-[#080809] w-[100px] h-[40px] rounded-[20px] 
         transition-all duration-300
         hover:bg-transparent hover:text-green-300
         hover:border-2 hover:border-bg-gradient-to-r from-[#00FF41] to-[#00E5FF]
         active:bg-gradient-to-r active:from-green-400 active:to-cyan-400
         active:text-black"
    >
      Button
    </button>
  );
}
