const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const {
    addNewMessage,
    getAllMessage,
} = require("../../controller/Support/supportMessageController");
const checkPermission = require("../../middleware/checkPermission");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/service");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                "-" +
                uniqueSuffix +
                "." +
                file.originalname.split(".")[1]
        );
    },
});

const upload = multer({
    limits: {
        fileSize: 2000000,
    },
    fileFilter: (req, file, cb) => {
        const allowed = [".jpg", ".jpeg", ".png", ".webp"];
        const ext = path.extname(file.originalname);
        if (!allowed.includes(ext)) {
            return cb(new Error("Please upload jpg, jpeg, webp, or png"));
        }
        cb(undefined, true);
    },
    storage: storage,
});

router.use(checkPermission());

router.patch("/update/:id", upload.single("image"), addNewMessage);
router.get("/all/:id", getAllMessage);

module.exports = router;
