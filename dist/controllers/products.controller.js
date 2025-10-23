"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getById = getById;
exports.getRelated = getRelated;
exports.addRelated = addRelated;
exports.deleteRelated = deleteRelated;
exports.createProduct = createProduct;
const express_validator_1 = require("express-validator");
const model = __importStar(require("../models/products.model"));
const db_1 = __importDefault(require("../database/db"));
function getAll(req, res) {
    const products = model.getAllProducts();
    res.json(products);
}
function getById(req, res) {
    const product = model.getProductById(req.params.id);
    if (!product)
        return res.status(404).json({ message: 'Product not found' });
    res.json(product);
}
function getRelated(req, res) {
    const id = req.params.id;
    const stmt = db_1.default.prepare(`
    SELECT p.* FROM related_products r
    JOIN products p ON p.id = r.related_id
    WHERE r.product_id = ?
  `);
    const related = stmt.all(id);
    res.json(related);
}
function addRelated(req, res) {
    const pairs = req.body;
    if (!Array.isArray(pairs))
        return res.status(400).json({ error: 'Expected array' });
    const stmt = db_1.default.prepare(`
    INSERT INTO related_products (product_id, related_id) VALUES (?, ?)
  `);
    const insert = db_1.default.transaction((pairs) => {
        for (const pair of pairs) {
            stmt.run(pair.productId, pair.relatedId);
        }
    });
    insert(pairs);
    res.json({ success: true });
}
function deleteRelated(req, res) {
    const ids = req.body;
    if (!Array.isArray(ids))
        return res.status(400).json({ error: 'Expected array of ids' });
    const stmt = db_1.default.prepare(`
    DELETE FROM related_products WHERE product_id = ?
  `);
    const del = db_1.default.transaction((ids) => {
        for (const id of ids)
            stmt.run(id);
    });
    del(ids);
    res.json({ success: true });
}
function createProduct(req, res) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { id, title, description, price } = req.body;
    try {
        const existing = db_1.default.prepare('SELECT * FROM products WHERE id = ?').get(id);
        if (existing) {
            return res.status(400).json({ error: 'Product with this ID already exists' });
        }
        const stmt = db_1.default.prepare('INSERT INTO products (id, title, description, price) VALUES (?, ?, ?, ?)');
        stmt.run(id, title, description, price);
        const newProduct = db_1.default.prepare('SELECT * FROM products WHERE id = ?').get(id);
        return res.status(201).json(newProduct);
    }
    catch (error) {
        return res.status(500).json({
            error: 'Failed to create product',
            details: error.message
        });
    }
}
