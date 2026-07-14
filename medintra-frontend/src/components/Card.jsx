function Card({ children }) {
  return (
    <div
      className="
      bg-slate-900/80
      backdrop-blur-md
      border
      border-slate-800
      rounded-2xl
      p-6
      mb-6
      shadow-xl
      hover:border-cyan-500/50
      hover:shadow-cyan-500/10
      transition-all
      duration-300
      "
    >
      {children}
    </div>
  );
}

export default Card;