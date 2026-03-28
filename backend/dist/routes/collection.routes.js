"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const collection_controller_1 = require("../controllers/collection.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = (0, express_1.Router)();
router.route('/')
    .get(collection_controller_1.getCollections)
    .post(auth_middleware_1.protect, auth_middleware_1.adminOnly, upload_middleware_1.uploadFiles.array('image', 1), collection_controller_1.createCollection);
router.route('/:id')
    .get(collection_controller_1.getCollection)
    .put(auth_middleware_1.protect, auth_middleware_1.adminOnly, upload_middleware_1.uploadFiles.array('image', 1), collection_controller_1.updateCollection)
    .delete(auth_middleware_1.protect, auth_middleware_1.adminOnly, collection_controller_1.deleteCollection);
exports.default = router;
