function Card({ children }) {
  return (
    <div className="bg-white shadow rounded-xl p-6 mb-6">
      {children}
    </div>
  );
}

export default Card;