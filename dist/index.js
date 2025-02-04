"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const pgClient = new pg_1.Client("postgresql://neondb_owner:npg_t4lCE5GBVZUF@ep-lucky-mode-a54x24er-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require");
pgClient.connect();
//@ts-ignore
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const city = req.body.city;
    const country = req.body.country;
    const street = req.body.street;
    const pincode = req.body.pincode;
    try {
        yield pgClient.query("BEGIN;");
        const response = yield pgClient.query(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id`, [username, email, password]);
        const user_id = response.rows[0].id;
        const addressInsertQuery = yield pgClient.query(`INSERT INTO address (user_id,city,country,street,pincode) VALUES ($1, $2, $3, $4, $5)`, [user_id, city, country, street, pincode]);
        yield pgClient.query("COMMIT;");
        res.json({
            message: "you have signed up"
        });
    }
    catch (er) {
        res.json({
            message: "error while signing"
        });
    }
}));
app.get("/metadata", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    const response1 = yield pgClient.query("SELECT username,email,id FROM users WHERE id = $1", [id]);
    const response2 = yield pgClient.query("SELECT * FROM address WHERE user_id = $1", [id]);
    res.json({
        user: response1.rows[0],
        address: response2.rows[0]
    });
}));
app.get("/better-metadata", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    const response = yield pgClient.query("SELECT users.id,users.username,users.email,address.city,address.country,address.pincode FROM users JOIN address ON users.id = address.user_id WHERE users.id = $1", [id]);
    res.json({
        response: response.rows
    });
}));
app.listen(3001);
