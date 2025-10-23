import express from 'express';
import cors from 'cors';
import path from 'path';
import './database/init'; 
import productsRouter from './routes/products.routes'; 
import adminRouter from './admin/routes/admin.routes'; 

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'admin/views'));
app.use('/api/products', productsRouter); 
app.use('/admin', adminRouter); 
const clientDist = path.join(__dirname, '../shop.client/dist');
app.use(express.static(clientDist));
app.get(/^\/(?!api|admin).*/, (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});
app.get('/healthz', (_req, res) => res.send('ok'));
app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
