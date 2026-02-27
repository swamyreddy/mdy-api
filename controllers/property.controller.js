const Property = require("../models/property.model");
const Sequelize = require("sequelize");
const PropertyPhotos = require("../models/propertyPhotos.model");
const { Op } = require("sequelize");
const Amenity = require("../models/amenity.model");
const PropertyAmenity = require("../models/propertyAmenity.model");
const fs = require("fs");
const path = require("path");
const Unit = require("../models/unit.model");
const formatIndianPrice = require("../utils/priceFormatter");
exports.getAddProperty = (req, res, next) => {
    console.log("Add Property");
    res.render("seller/add-property", {
        docTitle: "Add Property",
        path: "/admin/add-property",
    });
};

exports.postAddProperty = async (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const photos = req.files["files"]?.map((file) => file.filename);
    const units = JSON.parse(req.body.units || "[]");
    const unitFloorPlans =
        req.files?.unitFloorPlans?.map((file) => file.filename) || [];
    const {
        isMultipleProperties,
        title,
        price,
        location,
        defaultPic,
        bathRooms,
        propertyType,
        unitType,
        builtupArea,
        carpetArea,
        createdBy,
        modifiedBy,
        amenities,
        propertyPhotosNames,
        description,
        totalFloors,
        propertyAge,
        facing,
        projectAreaValue,
        projectAreaUnit,
        projectAreaInSqYards,
    } = req.body;
    console.log(
        req.files["defaultPic"]?.map((file) => file.filename[0]),
        "req.fileNEw++",
    );
    await Property.create({
        isMultipleProperties: isMultipleProperties,
        title: title,
        price: price,
        location: location,
        defaultPic: req.files["defaultPic"]?.map((file) => file.filename)[0],
        propertyType: propertyType,
        builtupArea: builtupArea,
        carpetArea: carpetArea,
        unitType: unitType,
        bathRooms: bathRooms,
        description: description,
        totalFloors: totalFloors,
        propertyAge: propertyAge,
        createdBy: createdBy,
        modifiedBy: modifiedBy,
        facing: facing,
        projectAreaValue: projectAreaValue,
        projectAreaUnit: projectAreaUnit,
        projectAreaInSqYards: projectAreaInSqYards,
    })
        .then(async (result) => {
            if (amenities && amenities.length > 0) {
                console.log(JSON.parse(amenities), "amenities++");
                await result.setAmenities(JSON.parse(amenities));
            }
            if (units && units.length > 0) {
                console.log(unitFloorPlans, "unitFloorPlans222");
                await createUnitOfProperty(units, unitFloorPlans, result.id);
            }
            if (photos && photos.length > 0) {
                const photoRecords = photos.map((photo, index) => ({
                    imageUrl: photo,
                    title: Array.isArray(propertyPhotosNames)
                        ? propertyPhotosNames[index]
                        : propertyPhotosNames,
                    propertyId: result.id,
                }));

                await PropertyPhotos.bulkCreate(photoRecords);
            }

            res.json({
                status: "Success",
                data: result,
            });
            console.log(result, "Property saving result");
        })
        .catch((err) => {
            res.json({
                status: "Error",
                data: err,
            });
            console.log(err, "Error accured while creating a Property.");
        });
};

exports.updateProperty = async (req, res) => {
    console.log(req.body, "id+++");
    const url = req.protocol + "://" + req.get("host");
    const units = JSON.parse(req.body.units || "[]");
    let defaultPicTemp = "";
    if (req.files["defaultPic"]) {
        defaultPicTemp = req.files["defaultPic"]?.map((file) => file.filename);
    }
    const unitFloorPlans =
        req.files?.unitFloorPlans?.map((file) => file.filename) || [];
    const {
        id,
        isMultipleProperties,
        title,
        price,
        location,
        propertyType,
        unitType,
        bathRooms,
        builtupArea,
        carpetArea,
        createdBy,
        modifiedBy,
        amenities,
        propertyPhotosNames,
        description,
        totalFloors,
        propertyAge,
        facing,
        projectAreaValue,
        projectAreaUnit,
        projectAreaInSqYards,
    } = req.body;

    await Property.findByPk(id)
        .then((property) => {
            console.log(property, "property");
            property.title = title;
            property.isMultipleProperties = isMultipleProperties;
            property.price = price;
            property.location = location;
            if (req.files["defaultPic"]) {
                property.defaultPic = defaultPicTemp[0];
            }
            property.propertyType = propertyType;
            property.unitType = unitType;
            property.bathRooms = bathRooms;
            property.builtupArea = builtupArea;
            property.carpetArea = carpetArea;
            property.description = description;
            property.totalFloors = totalFloors;
            property.propertyAge = propertyAge;
            property.projectAreaValue = projectAreaValue;
            property.projectAreaUnit = projectAreaUnit;
            property.projectAreaInSqYards = projectAreaInSqYards;
            property.facing = facing;
            return property.save();
        })
        .then(async (result) => {
            if (amenities && amenities.length > 0) {
                await result.setAmenities(JSON.parse(amenities));
            }
            console.log(req.files.files, "req.fileswamy2+++=");
            if (units && units.length > 0) {
                console.log(unitFloorPlans, "unitFloorPlans222");
                await createUnitOfProperty(units, unitFloorPlans, result.id);
            }
            if (req.files.files && req.files.files.length > 0) {
                const photos = req.files.files["files"]?.map(
                    (file) => file.filename,
                );

                const photoRecords = req.files.files.map((photo, index) => ({
                    imageUrl: photo.filename,
                    title: Array.isArray(req.body.titles)
                        ? req.body.titles[index]
                        : req.body.titles,
                    propertyId: result.id,
                }));
                console.log(photoRecords, "photoRecords++");
                await PropertyPhotos.bulkCreate(photoRecords);
            }
            res.json({
                status: "Success",
                data: result,
            });
        })
        .catch((err) => {
            console.log(err, "error");
            res.json({
                status: "Error",
                data: err,
            });
        });
};
async function createUnitOfProperty(units, unitFloorPlans, propetyId) {
    console.log(unitFloorPlans, "unitFloorPlans+++");
    const floorPlans = units.map((unit, index) => ({
        unitName: unit.unitName,
        unitPrice: unit.unitPrice,
        unitSpace: unit.unitSpace,
        propertyId: propetyId,
        unitFloorPlan: unitFloorPlans[unit.fileIndex] || null,
    }));

    await Unit.bulkCreate(floorPlans);
}
exports.getProperties = (req, res, next) => {
    if (!req.body) req.body = {};
    let filters = req.body && req.body?.filter ? req.body?.filter : {};
    const priceRange = filters?.searchQuery?.priceRange || "";
    // You can define mappings for user-friendly ranges
    let min = 0;
    let max = Number.MAX_SAFE_INTEGER;
    if (priceRange) {
        switch (priceRange) {
            case "":
                min = 0;
                max = Number.MAX_SAFE_INTEGER;
                break;
            case "0-25L":
                min = 0;
                max = 2500000;
                break;
            case "25L-50L":
                min = 2500000;
                max = 5000000;
                break;
            case "50L-1Cr":
                min = 5000000;
                max = 10000000;
                break;
            case "1Cr-2Cr":
                min = 10000000;
                max = 20000000;
                break;
            case "2Cr+":
                min = 20000000;
                max = Number.MAX_SAFE_INTEGER;
                break;
        }
    }
    let propertyType = filters?.searchQuery?.propertyType;
    if (propertyType == 0) {
        propertyType = null;
    }
    let orderClause = [];
    let sort = filters?.searchQuery?.sort;
    if (sort === "low_to_high") {
        orderClause = [["price", "DESC"]];
    } else if (sort === "high_to_low") {
        orderClause = [["price", "ASC"]];
    } else {
        orderClause = [["createdAt", "DESC"]]; // default
    }
    const searchValue = filters?.searchQuery?.location || "";
    console.log(propertyType, "propertyType++");

    Property.findAll(
        {
            where: {
                [Op.and]: [
                    // ✅ AND group
                    propertyType ? { propertyType } : {}, // optional
                    {
                        price: { [Op.between]: [min, max] },
                    },
                    {
                        [Op.or]: [
                            // ✅ nested OR group
                            {
                                title: {
                                    [Op.like]: `%${searchValue}%`,
                                },
                            },
                            {
                                location: {
                                    [Op.like]: `%${searchValue}%`,
                                },
                            },
                        ],
                    },
                ],
            },
            include: [
                {
                    model: Unit,
                    as: "units",
                },
            ],
            order: orderClause,
        },

        // include: [
        //     {
        //         model: PropertyPhotos,
        //         as: "myPropertyPhotos",
        //         attributes: ["id", "imageUrl"],
        //     },
        // ],
    )
        .then((result) => {
            if (result && result.length > 0) {
                result.forEach((res) => {
                    if (res.isMultipleProperties) {
                        if (res.units && res.units.length > 0) {
                            res.unitType = checkUnitTypes(res.units);
                        } else {
                            res.unitType = 0;
                        }
                        res.price = bindMultiplePrices(res.units);
                    } else {
                        res.price = formatIndianPrice(res.price);
                    }
                });
            }
            res.json(result);
        })
        .catch((err) => {
            console.log(err);
        });
};
exports.getPropertiesByUser = (req, res, next) => {
    Property.findAll({
        where: {
            createdBy: req.body.userId,
        },
        include: [
            {
                model: PropertyPhotos,
                as: "photos",
                attributes: ["id", "imageUrl", "fullImageUrl"],
            },

            {
                model: Amenity,
                as: "amenities",
                attributes: ["id", "name"],
                // Exclude junction table attributes
            },

            {
                model: Unit,
                as: "units",
            },
        ],
    })
        .then((result) => {
            result.defaultPic = result.defaultPicUrl;
            if (result && result.length > 0) {
                result.forEach((res) => {
                    if (res.isMultipleProperties) {
                        if (res.units && res.units.length > 0) {
                            res.unitType = checkUnitTypes(res.units);
                        } else {
                            res.unitType = 0;
                        }
                        res.price = bindMultiplePrices(res.units);
                    } else {
                        res.price = formatIndianPrice(res.price);
                    }
                });
            }
            res.json(result);
        })
        .catch((err) => {
            console.log(err);
        });
};

function bindMultiplePrices(units) {
    let prices = "";
    const unitPrices = [
        ...new Set(units.map((unit) => parseInt(unit.unitPrice))),
    ].sort((a, b) => a - b);
    if (unitPrices.length === 0) {
        prices = 0;
    } else if (unitPrices.length === 1) {
        prices = formatIndianPrice(unitPrices[0]);
    } else {
        prices = `${formatIndianPrice(unitPrices[0])} to ${formatIndianPrice(unitPrices[unitPrices.length - 1])}`;
    }
    return prices;
}
function checkUnitTypes(units) {
    console.log(units, "units.length++++");
    if (units.length == 0) return 0;
    let bedRoomsCount = "";
    const unitTypes = [
        ...new Set(units.map((unit) => parseInt(unit.unitName))),
    ].sort((a, b) => a - b);
    if (unitTypes.length === 0) {
        bedRoomsCount = 0;
    } else if (unitTypes.length === 1) {
        bedRoomsCount = unitTypes[0];
    } else {
        bedRoomsCount = `${unitTypes[0]} to ${unitTypes[unitTypes.length - 1]}`;
    }
    return bedRoomsCount;
}

exports.deleteProperty = (req, res, next) => {
    console.log(req.params, "req.params++++");
    Property.findByPk(parseInt(req.params.id))
        .then((property) => {
            return property.destroy();
        })
        .then((result) => {
            res.json("Success");
        })
        .catch((err) => {
            res.json({
                status: "Error",
                data: err,
            });
        });

    Property.destroy()
        .then((result) => {
            // res.render("buyer/user", {
            //     props: result,
            //     docTitle: "Property Details",
            //     path: "/",
            // });
            res.json(result);
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.deletePropertyPhoto = (req, res, next) => {
    console.log(req.params, "req.params++++");
    PropertyPhotos.findByPk(parseInt(req.params.id))
        .then((photo) => {
            return photo.destroy();
        })
        .then((result) => {
            const imageFileName = result.imageUrl.split("/").pop();
            console.log(imageFileName, "imageFileName++");
            console.log(__dirname, "dirname++");
            const filePath = path.join(__dirname, "../images", imageFileName);
            console.log(filePath, "filePath++");
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(
                        err,
                        "Error accured while deleting the image file.",
                    );
                } else {
                    console.log("Image file deleted successfully.");
                }
            });
            res.json("Success");
        })
        .catch((err) => {
            res.json({
                status: "Error",
                data: err,
            });
        });
};
exports.deletePropertyUnit = (req, res, next) => {
    console.log(req.params, "req.params++++");
    Unit.findByPk(parseInt(req.params.id))
        .then((unit) => {
            return unit.destroy();
        })
        .then((result) => {
            const imageFileName = result.unitFloorPlan;
            console.log(imageFileName, "imageFileName++");
            console.log(__dirname, "dirname++");
            const filePath = path.join(__dirname, "../images", imageFileName);
            console.log(filePath, "filePath++");
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(
                        err,
                        "Error accured while deleting the image file.",
                    );
                } else {
                    console.log("Unit Image file deleted successfully.");
                }
            });
            res.json("Success");
        })
        .catch((err) => {
            res.json({
                status: "Error",
                data: err,
            });
        });
};

exports.getPropertyByID = (req, res) => {
    console.log(req.params.id, "req.params.id+++");
    Property.findByPk(parseInt(req.params.id), {
        include: [
            {
                model: PropertyPhotos,
                as: "photos",
                attributes: ["id", "imageUrl", "fullImageUrl", "title"],
            },
            {
                model: Unit,
                as: "units",
                attributes: [
                    "id",
                    "unitName",
                    "unitPrice",
                    "unitSpace",
                    "unitFloorPlan",
                    "unitFloorPlanUrl",
                ],
            },

            {
                model: Amenity,
                as: "amenities",
                attributes: ["id", "name"],
                // Exclude junction table attributes
            },
        ],
    }).then(async (property) => {
        let photosUrls = [];
        property = property?.toJSON();
        console.log(property, "property.photos12+++=");
        if (property?.photos && property?.photos.length > 0) {
            photosUrls = await property.photos.map((file) => {
                return {
                    title: file.title,
                    id: file.id,
                    src: file.fullImageUrl,
                };
            });
        }
        console.log(photosUrls, "photosUrls+++=");
        property.photos = photosUrls;
        if (property.units) {
            if (property.isMultipleProperties) {
                property.unitType = checkUnitTypes(property.units);
                property.price = bindMultiplePrices(property.units);
            } else {
                property.price = formatIndianPrice(property.price);
                property.units.push({
                    unitName: property.unitType,
                    unitPrice: property.price,
                    unitFloorPlanUrl: property.defaultPicUrl,
                    unitSpace: property.builtupArea,
                });
            }
        }

        res.json({
            status: "Success",
            data: property,
        });
    });
};
