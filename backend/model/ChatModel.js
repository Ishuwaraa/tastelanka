const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY || "default_key_1234567890123456789012345678901", 'hex');
const IV_LENGTH = 16; // AES block size

function encrypt(text) {
  if (!text || typeof text !== "string") {
    console.error("Invalid input for encryption:", text);
    return text; 
  }
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text, "utf8");
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
  } catch (error) {
    console.error("Encryption error:", error);
    return text; 
  }
}

function decrypt(text) {
  if (!text || typeof text !== "string" || !text.includes(":")) {
    console.error("Invalid input for decryption:", text);
    return text || ""; 
  }
  try {
    const textParts = text.split(":");
    const iv = Buffer.from(textParts[0], "hex");
    const encryptedText = Buffer.from(textParts[1], "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString("utf8");
  } catch (error) {
    console.error("Decryption error:", error);
    return text; 
  }
}

const chatSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    text: {
        type: String,
        set: encrypt,
        get: decrypt,
    }
}, { 
    timestamps: true,
    toJSON: { getters: true }, //apply getters when converting to JSON
    toObject: { getters: true } //apply getters when converting to object
});

module.exports = mongoose.model("Chat", chatSchema);