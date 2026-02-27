const Amenity = require("../models/amenity.model");

exports.createAmenity = async (req, res) => {
    try {
        const { name } = req.body;

        const result = await Amenity.create({ name: name });

        res.status(201).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

exports.getAmenities = async (req, res) => {
    try {
        const amenities = await Amenity.findAll({
            order: [["name", "ASC"]],
        });

        res.status(200).json(amenities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch amenities" });
    }
};
