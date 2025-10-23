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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productsController = __importStar(require("../controllers/products.controller"));
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.get('/', productsController.getAll);
router.get('/:id', productsController.getById);
router.get('/:id/related', productsController.getRelated);
router.post('/', (0, express_validator_1.body)('id').isString().notEmpty().withMessage('id is required'), (0, express_validator_1.body)('title').isString().notEmpty().withMessage('title is required'), (0, express_validator_1.body)('price').isNumeric().withMessage('price must be a number'), productsController.createProduct);
router.post('/related', (0, express_validator_1.body)().isArray().withMessage('Expected array of pairs'), (0, express_validator_1.body)('*.productId').isString().notEmpty().withMessage('productId required'), (0, express_validator_1.body)('*.relatedId').isString().notEmpty().withMessage('relatedId required'), productsController.addRelated);
router.delete('/related', (0, express_validator_1.body)().isArray().withMessage('Expected array of IDs'), (0, express_validator_1.body)('*').isString().notEmpty().withMessage('Each ID must be a string'), productsController.deleteRelated);
exports.default = router;
