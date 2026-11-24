export default function SearchForm({ onChangeValue }) {
  return (
    <label className="search-box">
      <span className="sr-only">Tìm theo họ tên hoặc username</span>
      <span className="search-icon" aria-hidden="true">⌕</span>
      <input
        type="search"
        placeholder="Tìm theo name hoặc username..."
        onChange={(event) => onChangeValue(event.target.value)}
      />
    </label>
  );
}