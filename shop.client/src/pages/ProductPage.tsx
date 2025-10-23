import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Link, useParams } from 'react-router-dom';

type Product = { id: string; title: string; description: string; price: number };

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[] | null>(null);

  useEffect(() => {
    if (!id) return;
    setProduct(null);
    setRelated(null);

    api.get<Product>(`/products/${id}`).then(res => setProduct(res.data));
    api.get<Product[]>(`/products/${id}/related`).then(res => setRelated(res.data));
  }, [id]);

  if (!product) return <p>Загрузка…</p>;

  return (
    <div>
      <h2>{product.title}</h2>
      <div style={{ marginBottom: 8 }}><b>Price:</b> {product.price} ₽</div>
      <div style={{ marginBottom: 16 }}><b>Description:</b> {product.description || '—'}</div>

      <h3>Похожие товары</h3>
      {!related ? (
        <p>Загрузка…</p>
      ) : related.length === 0 ? (
        <p>— нет —</p>
      ) : (
        <ul>
          {related.map(r => (
            <li key={r.id}>
              <Link to={`/products/${r.id}`}>{r.title}</Link> — {r.price} ₽
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
