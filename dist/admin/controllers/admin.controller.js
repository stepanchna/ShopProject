"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = getProducts;
exports.getNewProduct = getNewProduct;
exports.postNewProduct = postNewProduct;
exports.getProductPage = getProductPage;
exports.postProductChanges = postProductChanges;
const db_1 = __importDefault(require("../../database/db"));
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
const API = 'http://localhost:3000/api/products';
// Список товаров
function getProducts(_req, res) {
    const products = db_1.default.prepare('SELECT * FROM products').all();
    res.render('products', { products });
}
// Форма «Add product»
function getNewProduct(_req, res) {
    res.render('new-product');
}
// Создание товара — строго по ТЗ: через API и вернуть на /admin/:id
async function postNewProduct(req, res) {
    const { title, description, price } = req.body;
    if (!title || !price)
        return res.status(400).send('Title and price are required');
    const id = (0, uuid_1.v4)();
    const created = await axios_1.default.post(API, {
        id,
        title,
        description: description || '',
        price: Number(price)
    });
    return res.redirect(`/admin/${created.data.id}`);
}
// Страница товара с «похожими» и «остальными»
async function getProductPage(req, res) {
    const id = req.params.id;
    // сам товар из БД
    const product = db_1.default.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!product)
        return res.status(404).send('Product not found');
    // похожие через API
    const { data: related } = await axios_1.default.get(`${API}/${id}/related`);
    // остальные: все минус текущий и уже похожие
    const all = db_1.default.prepare('SELECT * FROM products').all();
    const relatedIds = new Set(related.map((p) => p.id));
    const other = all.filter((p) => p.id !== id && !relatedIds.has(p.id));
    res.render('product', { product, related, other });
}
// Сохранение изменений «похожих»
async function postProductChanges(req, res) {
    const id = req.params.id;
    const toRemove = Array.isArray(req.body.removeRelated)
        ? req.body.removeRelated
        : req.body.removeRelated ? [req.body.removeRelated] : [];
    const toAdd = Array.isArray(req.body.addRelated)
        ? req.body.addRelated
        : req.body.addRelated ? [req.body.addRelated] : [];
    // По ТЗ DELETE /api/products/related принимает массив id товаров и удаляет все их связи.
    if (toRemove.length) {
        const uniqueToRemove = Array.from(new Set([id, ...toRemove]));
        await axios_1.default.delete(`${API}/related`, { data: uniqueToRemove });
    }
    if (toAdd.length) {
        const pairs = toAdd.map((relatedId) => ({ productId: id, relatedId }));
        await axios_1.default.post(`${API}/related`, pairs);
    }
    return res.redirect(`/admin/${id}`);
}
