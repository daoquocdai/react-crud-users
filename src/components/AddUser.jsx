import { useState } from "react";

const emptyUser = {
  name: "",
  username: "",
  email: "",
  address: { street: "", suite: "", city: "" },
  phone: "",
  website: "",
};

export default function AddUser({ onAdd }) {
  const [adding, setAdding] = useState(false);
  const [user, setUser] = useState(emptyUser);

  function handleChange(event) {
    const { id, value } = event.target;
    if (["street", "suite", "city"].includes(id)) {
      setUser((previous) => ({
        ...previous,
        address: { ...previous.address, [id]: value },
      }));
    } else {
      setUser((previous) => ({ ...previous, [id]: value }));
    }
  }

  function handleAdd(event) {
    event.preventDefault();
    if (!user.name.trim() || !user.username.trim()) {
      window.alert("Vui lòng nhập Name và Username!");
      return;
    }

    onAdd({
      ...user,
      name: user.name.trim(),
      username: user.username.trim(),
      address: { ...user.address },
    });
    setUser({ ...emptyUser, address: { ...emptyUser.address } });
    setAdding(false);
  }

  return (
    <>
      <button className="button button-primary" onClick={() => setAdding(true)}>
        <span aria-hidden="true">＋</span> Thêm người dùng
      </button>

      {adding && (
        <div className="modal-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setAdding(false);
        }}>
          <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="add-title">
            <div className="modal-heading">
              <div>
                <p className="eyebrow">TẠO MỚI</p>
                <h2 id="add-title">Thêm người dùng</h2>
              </div>
              <button className="icon-button" type="button" aria-label="Đóng" onClick={() => setAdding(false)}>×</button>
            </div>

            <form onSubmit={handleAdd}>
              <div className="form-grid">
                <Field id="name" label="Họ tên *" value={user.name} onChange={handleChange} required />
                <Field id="username" label="Username *" value={user.username} onChange={handleChange} required />
                <Field id="email" label="Email" type="email" value={user.email} onChange={handleChange} />
                <Field id="phone" label="Số điện thoại" value={user.phone} onChange={handleChange} />
                <Field id="street" label="Đường" value={user.address.street} onChange={handleChange} />
                <Field id="suite" label="Căn hộ / Suite" value={user.address.suite} onChange={handleChange} />
                <Field id="city" label="Thành phố" value={user.address.city} onChange={handleChange} />
                <Field id="website" label="Website" value={user.website} onChange={handleChange} />
              </div>
              <div className="modal-actions">
                <button className="button button-ghost" type="button" onClick={() => setAdding(false)}>Hủy</button>
                <button className="button button-primary" type="submit">Lưu người dùng</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}

function Field({ id, label, value, onChange, type = "text", required = false }) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <input id={id} name={id} type={type} value={value} onChange={onChange} required={required} />
    </label>
  );
}