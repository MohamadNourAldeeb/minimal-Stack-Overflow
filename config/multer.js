import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { removePic } from "../utils/compressImage.js";

if (!fs.existsSync(path.join(path.resolve(), "public/images"))) {
    fs.mkdir(path.join(path.resolve(), "public/images"), (err) => {
        if (err) {
            return console.error(err);
        }
    });
}
//*************** Disck Storage and multer ****************** */
//filter image
const fileFilterImage = (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(
            new Error("Please upload only image files - JPEG, PNG, GIF"),
            false
        );
    }

    // Remove existing file if it's a webp file
    if (file.mimetype === "image/webp") {
        removePic(
            path.join(path.resolve(), `public/images/${file.originalname}`)
        );
        return cb(new Error("Cannot upload webp file"), false);
    }

    cb(null, true);
};
//filter for every files
const fileFilterEvery = (req, file, cb) => {
    if (
        !file.originalname.match(
            /\.(jpg|png|jpeg|txt|pdf|docx|xlsx|pptx|gif|mp3|mp4|doc|xls|ppt|mov|avi|csv)$/
        )
    )
        return cb(
            new Error(`
     Please upload from the following types only :
      .jpg,.png,.jpeg,.txt,.pdf,.docx,.xlsx,.pptx,.gif,.mp3,.mp4,.doc,.xls,.ppt,.mov,.avi,.csv`),
            false
        );

    cb(null, true);
};
// config storage
export let configStorage = (pathStorage) => {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, pathStorage);
        },
        filename: function (req, file, cb) {
            let extension = path.extname(file.originalname).toLowerCase();

            let filename = uuidv4();

            cb(null, `${filename}${extension}`);
        },
    });
};
// crete multer with special storage path
//to validate the picture
export let createMulter = (storage) =>
    multer({
        storage,
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
        fileFilter: fileFilterImage,
    });
//to validate the files
export let createMulterEveryType = (storage) =>
    multer({
        storage,
        limits: {
            fileSize: 25 * 1024 * 1024,
        },
        fileFilter: fileFilterEvery,
    });
