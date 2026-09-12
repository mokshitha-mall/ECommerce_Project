import express from "express"

import {createProduct, getAllProducts, getProductById, updateProduct, deletedProduct, publishProduct, unPublishProduct, importProducts, exportProducts} from "../controllers/productController.js"
import authentication from "../middlewares/authMiddleware.js"
import role from "../middlewares/roleMiddleware.js"
import upload from "../middlewares/uploadMiddleware.js"

const router = express.Router()


router.post("/import", authentication, role("admin"), upload.single("file"), importProducts)
router.get("/export", authentication, role("admin"), exportProducts)


router.post("/",authentication,role("admin"), createProduct)

router.get("/",authentication, getAllProducts)

router.get("/:id",authentication, getProductById)

router.put("/:id",authentication, role("admin"), updateProduct)

router.delete("/:id",authentication, role("admin"), deletedProduct)

router.patch("/:id/publish",authentication, role("admin"), publishProduct)

router.patch("/:id/unpublish",authentication, role("admin"), unPublishProduct)


export default router