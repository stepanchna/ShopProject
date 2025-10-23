import { Link, Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Shop.Client</h1>
        <nav style={{ display: 'flex', gap: 16 }}>
          <Link to="/">Home</Link>
          <Link to="/products-list">Products</Link>
          <a href="/admin" target="_blank" rel="noreferrer">Admin</a>
        </nav>
      </div>
      <hr />
      <Outlet />
    </div>
  );
}
