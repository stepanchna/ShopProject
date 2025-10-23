"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log('BOOT FROM', __filename);
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("./database/init");
const path_1 = __importDefault(require("path"));
const products_routes_1 = __importDefault(require("./routes/products.routes"));
const admin_routes_1 = __importDefault(require("./admin/routes/admin.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); // для <form>
app.set('view engine', 'ejs');
// при ts-node __dirname указывает на src/, поэтому путь ниже правильный
app.set('views', path_1.default.join(__dirname, 'admin/views'));
app.use('/api/products', products_routes_1.default);
app.get('/admin/__ping', (_req, res) => res.send('inline OK'));
app.use('/admin', admin_routes_1.default);
app.get('/', (_req, res) => res.send('Shop.Project API is running 🚀'));
const clientDist = path_1.default.join(__dirname, '../shop.client/dist');
app.use(express_1.default.static(clientDist));
app.get(/^\/(?!api|admin).*/, (_req, res) => {
    res.sendFile(path_1.default.join(clientDist, 'index.html'));
});
app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));
