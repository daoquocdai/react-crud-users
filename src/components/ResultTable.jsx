import { useEffect, useMemo, useState } from "react";

export default function ResultTable({ keyword, user, onAdded }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);

  // Read: gọi API một lần khi component được mount.
  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      try {
        setLoading(true);
        setError("");
        const response = await fetch("https://jsonplaceholder.typicode.com/users", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Không thể tải dữ liệu từ API. Hãy kiểm tra kết nối và thử tải lại.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadUsers();
    return () => controller.abort();
  }, []);

  // Create: App chuyển người dùng mới xuống qua prop user.
  useEffect(() => {
    if (!user) return;

    setUsers((previous) => {
      const nextId = previous.reduce((maxId, item) => Math.max(maxId, Number(item.id) || 0), 0) + 1;
      return [...previous, { ...user, id: nextId }];
    });
    onAdded();
  }, [user, onAdded]);

  const filteredUsers = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) return users;
    return users.filter((item) =>
      (item.name || "").toLowerCase().includes(normalizedKeyword) ||
      (item.username || "").toLowerCase().includes(normalizedKeyword)
    );
  }, [users, keyword]);

  function startEditing(selectedUser) {
    // Sao chép cả address để form không sửa trực tiếp object trong danh sách.
    setEditing({
      ...selectedUser,
      address: { ...(selectedUser.address || {}) },
    });
  }

  function handleEditChange(event) {
    const { id, value } = event.target;
    if (["street", "suite", "city"].includes(id)) {
      setEditing((previous) => ({
        ...previous,
        address: { ...previous.address, [id]: value },
      }));
    } else {
      setEditing((previous) => ({ ...previous, [id]: value }));
    }
  }

  function saveUser(event) {
    event.preventDefault();
    if (!editing.name.trim() || !editing.username.trim()) {
      window.alert("Name và Username không được để trống!");
      return;
    }
    setUsers((previous) => previous.map((item) =>
      item.id === editing.id ? editing : item
    ));
    setEditing(null);
  }

  function removeUser(id) {
    setUsers((previous) => previous.filter((item) => item.id !== id));
  }

  if (loading) {
    return <section className="table-card status-state"><div className="spinner" /><p>Đang tải danh sách người dùng...</p></section>;
  }

  if (error) {
    return (
      <section className="table-card status-state">
        <div className="status-icon">!</div>
        <h3>Không tải được dữ liệu</h3>
        <p>{error}</p>
        <button className="button button-primary" onClick={() => window.location.reload()}>Thử lại</button>
      </section>
    );
  }

  return (
    <>
      <section className="table-card">
        <div className="table-heading">
          <div>
            <p className="eyebrow">DANH SÁCH</p>
            <h2>Người dùng</h2>
          </div>
          <span className="result-count">{filteredUsers.length} kết quả</span>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Username</th>
                <th>Email</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((item) => (
                <tr key={item.id}>
                  <td><span className="id-pill">#{item.id}</span></td>
                  <td className="name-cell">{item.name}</td>
                  <td>{item.username}</td>
                  <td>{item.email || "—"}</td>
                  <td>{formatAddress(item.address)}</td>
                  <td>{item.phone || "—"}</td>
                  <td>
                    <div className="row-actions">
                      <button className="button button-small button-edit" onClick={() => startEditing(item)}>Sửa</button>
                      <button className="button button-small button-delete" onClick={() => removeUser(item.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr><td colSpan="7" className="empty-cell">Không tìm thấy người dùng phù hợp.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="table-note">Thêm, sửa và xóa được thực hiện trên state phía trình duyệt; API JSONPlaceholder chỉ cung cấp dữ liệu mẫu ban đầu.</p>
      </section>

      {editing && (
        <div className="modal-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setEditing(null);
        }}>
          <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="edit-title">
            <div className="modal-heading">
              <div>
                <p className="eyebrow">CẬP NHẬT</p>
                <h2 id="edit-title">Chỉnh sửa người dùng</h2>
              </div>
              <button className="icon-button" type="button" aria-label="Đóng" onClick={() => setEditing(null)}>×</button>
            </div>
            <form onSubmit={saveUser}>
              <div className="form-grid">
                <EditField id="name" label="Họ tên *" value={editing.name} onChange={handleEditChange} required />
                <EditField id="username" label="Username *" value={editing.username} onChange={handleEditChange} required />
                <EditField id="email" label="Email" type="email" value={editing.email || ""} onChange={handleEditChange} />
                <EditField id="phone" label="Số điện thoại" value={editing.phone || ""} onChange={handleEditChange} />
                <EditField id="street" label="Đường" value={editing.address?.street || ""} onChange={handleEditChange} />
                <EditField id="suite" label="Căn hộ / Suite" value={editing.address?.suite || ""} onChange={handleEditChange} />
                <EditField id="city" label="Thành phố" value={editing.address?.city || ""} onChange={handleEditChange} />
                <EditField id="website" label="Website" value={editing.website || ""} onChange={handleEditChange} />
              </div>
              <div className="modal-actions">
                <button className="button button-ghost" type="button" onClick={() => setEditing(null)}>Hủy</button>
                <button className="button button-primary" type="submit">Lưu thay đổi</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}

function EditField({ id, label, value, onChange, type = "text", required = false }) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <input id={id} name={id} type={type} value={value} onChange={onChange} required={required} />
    </label>
  );
}

function formatAddress(address = {}) {
  return [address.street, address.suite, address.city].filter(Boolean).join(", ") || "—";
}