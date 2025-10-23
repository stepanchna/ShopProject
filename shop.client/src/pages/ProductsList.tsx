import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';

type Product = { id: string; title: string; description: string; price: number };

export default function ProductsList() {
  const [items, setItems] = useState<Product[] | null>(null);

  useEffect(() => {
    api.get<Product[]>('/products').then(res => setItems(res.data));
  }, []);

  return (
    <div>
      <h2>Список товаров {items ? `(${items.length})` : ''}</h2>
      {!items ? (
        <p>Загрузка…</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map(p => (
            <li key={p.id} style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
              <Link to={`/products/${p.id}`} style={{ fontWeight: 700 }}>{p.title}</Link>
              <div style={{ color: '#555' }}>{p.price} ₽</div>
              <div style={{ fontSize: 14 }}>{p.description}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
