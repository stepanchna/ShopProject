"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = getAllProducts;
exports.getProductById = getProductById;
const db_1 = __importDefault(require("../database/db"));
function getAllProducts() {
    const stmt = db_1.default.prepare('SELECT * FROM products');
    return stmt.all();
}
function getProductById(id) {
    const stmt = db_1.default.prepare('SELECT * FROM products WHERE id = ?');
    return stmt.get(id);
}
