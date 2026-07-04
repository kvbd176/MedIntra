function SearchBar({
  value,
  onChange,
  placeholder
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="
        border
        rounded-lg
        p-2
        w-full
      "
    />
  );
}

export default SearchBar;