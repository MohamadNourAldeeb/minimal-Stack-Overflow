import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

export let encrypt = (value) => {
    const secretKey = Buffer.from(process.env.AES_SECRET_KEY || "", "hex");
    const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        secretKey,
        Buffer.alloc(16)
    );
    let encrypted = cipher.update(value, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
};

export let decrypt = (value) => {
    const secretKey = Buffer.from(process.env.AES_SECRET_KEY || "", "hex");
    const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        secretKey,
        Buffer.alloc(16)
    );
    let decrypted = decipher.update(value, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};
