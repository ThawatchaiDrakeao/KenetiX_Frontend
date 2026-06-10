import { useState } from "react";

function LoginButton() {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const getStyle = () => {
    if (pressed) return {
      background: "black",
      border: "2.5px solid #00FF99",
      color: "#00FF99",
    };
    if (hovered) return {
      background: "linear-gradient(135deg, #00FF41, #00E5FF)",
      border: "2px solid transparent",
      color: "#000",
    };
    return {
      background: "#C3FF51",
      border: "2px solid transparent",
      color: "#000",
    };
  };

  return (
    <button
        style={getStyle()}
        onMouseLeave={() => { setHovered(false); setPressed(false); }}
        onMouseEnter={() => setHovered(true)}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        className="px-19 py-3.5 rounded-xl text-[16px] font-bold transition-all duration-150"
    >
      Login
    </button>
  );
}

export default LoginButton;