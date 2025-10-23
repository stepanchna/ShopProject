import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';

type Product = { id: string; title: string; description: string; price: number };

export default function Home() {
  const [data, setData] = useState<{ n: number; m: number } | null>(null);

  useEffect(() => {
    api.get<Product[]>('/products').then(res => {
      const arr = res.data;
      const n = arr.length;
      const m = arr.reduce((s, p) => s + Number(p.price || 0), 0);
      setData({ n, m });
    });
  }, []);

  return (
    <div>
      <h2>Shop.Client</h2>
      {data ? (
        <p>
          В базе данных находится <b>{data.n}</b> товаров общей стоимостью <b>{data.m.toFixed(2)}</b>
        </p>
      ) : (
        <p>Загружаем…</p>
      )}

      <p><Link to="/products-list">Перейти к списку товаров</Link></p>
      <p><a href="/admin" target="_blank" rel="noreferrer">Перейти в систему администрирования</a></p>
    </div>
  );
}
