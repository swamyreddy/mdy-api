const express = require("express");
const propertiesController = require("../controllers/properties");
const amenitiesController = require("../controllers/amenities");
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
router.get("/add-property", propertiesController.getAddProperty);

router.post(
    "/add-property",
    upload.fields([
        { name: "defaultPic", maxCount: 1 },
        { name: "files", maxCount: 5 },
        { name: "unitFloorPlans", maxCount: 10 },
    ]),
    propertiesController.postAddProperty,
);
router.post(
    "/get-properties-by-user",
    propertiesController.getPropertiesByUser,
);
router.delete("/delete-property/:id", propertiesController.deleteProperty);
router.get("/get-property-by-id/:id", propertiesController.getPropertyByID);
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
    propertiesController.deletePropertyPhoto,
);

router.delete(
    "/delete-property-unit/:id",
    propertiesController.deletePropertyUnit,
);
router.get("/amenities", amenitiesController.getAmenities);
router.post("/amenities", amenitiesController.createAmenity);
exports.routes = router;
