const { protect } = require("../middlewares/auth.middleware");
const express = require("express");
const propertiesController = require("../controllers/property.controller");
const amenitiesController = require("../controllers/amenities.controller");
const multer = require("multer");
const router = express.Router();
const fileStorage = multer.diskStorage({
    destination: "./images",
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});
// Multer Mime Type Validation
var upload = multer({
    storage: fileStorage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
    },
});
router.get("/add-property", protect, propertiesController.getAddProperty);

router.post(
    "/add-property",
    upload.fields([
        { name: "defaultPic", maxCount: 1 },
        { name: "files", maxCount: 5 },
        { name: "unitFloorPlans", maxCount: 10 },
    ]),
    propertiesController.postAddProperty,
);
router.post("/", propertiesController.getProperties);
router.post(
    "/get-properties-by-user",
    protect,
    propertiesController.getPropertiesByUser,
);
router.delete(
    "/delete-property/:id",
    protect,
    propertiesController.deleteProperty,
);
router.get(
    "/get-property-by-id/:id",
    protect,
    propertiesController.getPropertyByID,
);
router.post(
    "/edit-property",
    upload.fields([
        { name: "defaultPic", maxCount: 1 },
        { name: "files", maxCount: 5 },
        { name: "unitFloorPlans", maxCount: 10 },
    ]),
    propertiesController.updateProperty,
);
router.delete(
    "/delete-property-photo/:id",
    protect,
    propertiesController.deletePropertyPhoto,
);

router.delete(
    "/delete-property-unit/:id",
    protect,
    propertiesController.deletePropertyUnit,
);
router.get("/amenities", amenitiesController.getAmenities);
router.post("/amenities", protect, amenitiesController.createAmenity);
module.exports = router;
