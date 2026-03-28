"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const cacheMiddleware_1 = require("../middleware/cacheMiddleware");
const router = (0, express_1.Router)();
router.route('/')
    .get((0, cacheMiddleware_1.cache)('products', 120), product_controller_1.getProducts)
    .post(auth_middleware_1.protect, auth_middleware_1.adminOnly, upload_middleware_1.uploadFiles.array('images', 5), product_controller_1.createProduct);
router.route('/:id')
    .get((0, cacheMiddleware_1.cache)('products', 120), product_controller_1.getProduct)
    .put(auth_middleware_1.protect, auth_middleware_1.adminOnly, upload_middleware_1.uploadFiles.array('images', 5), product_controller_1.updateProduct)
    .delete(auth_middleware_1.protect, auth_middleware_1.adminOnly, product_controller_1.deleteProduct);
exports.default = router;
