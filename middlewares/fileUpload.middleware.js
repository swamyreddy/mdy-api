const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../config/s3");

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "mdy-property-images",
        acl: "public-read",
        key: function (req, file, cb) {
            const fileName = Date.now() + "-" + file.originalname;
            cb(null, "properties/" + fileName);
        },
    }),
});

module.exports = upload;
