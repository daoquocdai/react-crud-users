import { useState } from "react";
import SearchForm from "./components/SearchForm.jsx";
import AddUser from "./components/AddUser.jsx";
import ResultTable from "./components/ResultTable.jsx";

export default function App() {
  // State được đặt tại App vì cả SearchForm/AddUser và ResultTable đều cần phối hợp.
  const [kw, setKeyword] = useState("");
  const [newUser, setNewUser] = useState(null);

  return (
    <main className="page-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">REACT FUNDAMENTALS · CRUD</p>
          <h1>Quản lý người dùng</h1>
          <p className="hero-description">
            Quản lý danh sách, tìm kiếm và cập nhật thông tin người dùng trong một giao diện.
          </p>
        </div>
        <div className="hero-mark" aria-hidden="true">U</div>
      </header>

      <section className="toolbar" aria-label="Công cụ quản lý người dùng">
        <SearchForm onChangeValue={setKeyword} />
        <AddUser onAdd={setNewUser} />
      </section>

      <ResultTable
        keyword={kw}
        user={newUser}
        onAdded={() => setNewUser(null)}
      />

      <footer className="footer">
        Bài tập React CRUD · Dữ liệu ban đầu từ JSONPlaceholder
      </footer>
    </main>
  );
}