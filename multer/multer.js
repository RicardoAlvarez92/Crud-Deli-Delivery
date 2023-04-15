const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: path.join(__dirname, "uploads"),
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
})

const upload = multer({storage});

exports.upload = upload.single("imagen");