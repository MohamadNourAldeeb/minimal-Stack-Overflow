import Jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

export let verifyToken = (token, SECRET_KEY) => {
    const secretKey = Buffer.from(process.env.AES_SECRET_KEY || "", "hex");
    const decoded = Jwt.verify(token, SECRET_KEY);
    // Check if the token contains the 'encrypted' property
    if (!decoded || !decoded.hasOwnProperty("encrypted")) {
        throw new Error("Invalid token");
    }
    // Decrypt the payload
    const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        secretKey,
        Buffer.alloc(16)
    );
    let decrypted = decipher.update(decoded.encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    // Parse the decrypted payload
    return JSON.parse(decrypted);
};

export let generateToken = (payload, SECRET_KEY, expiresIn) => {
    const secretKey = Buffer.from(process.env.AES_SECRET_KEY || "", "hex");
    const payloadStr = JSON.stringify(payload);
    const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        secretKey,
        Buffer.alloc(16)
    );
    let encrypted = cipher.update(payloadStr, "utf8", "hex");
    encrypted += cipher.final("hex");
    // Sign the encrypted payload
    return Jwt.sign(
        {
            encrypted,
        },
        SECRET_KEY,
        {
            expiresIn,
        }
    );
};
