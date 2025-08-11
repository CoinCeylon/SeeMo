import dotenv from "dotenv";
dotenv.config();

import geoip from "geoip-lite";
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import { Lucid, Blockfrost } from "lucid-cardano";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cors from "cors";
import {MongoClient} from "mongodb";


const blockfrostKey = process.env.BLOCKFROST_KEY;
const BLOCKFROST_URL = process.env.BLOCKFROST_URL;

//sensitive
const uri = process.env.MONGO_URI; 
const client = new MongoClient(uri);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Serve static files (HTML, JS)
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());
app.use(cors());

//sensitive
//derived private
const privateKeyHex = process.env.PRIVATE_KEY;

app.post("/api/upload-hashes", async (req, res) => {
    try {
        const hashes = req.body.hashes;

        const lucid = await Lucid.new(
            new Blockfrost(
                //sensitive
                BLOCKFROST_URL,
                //sensitive
                blockfrostKey
            ),
            "Preprod"
        );

        lucid.selectWalletFromPrivateKey(privateKeyHex);
        const senderAddress = await lucid.wallet.address();


        const metadata = {};
        hashes.forEach((hash, i)=>{
            metadata[i+1] = {
                product_hash:hash,
                timestamp:Date.now()
            };
        });

            console.log("Metadata to attach:", metadata);

            const tx = await lucid
                .newTx()
                .payToAddress(senderAddress, { lovelace: BigInt(2_000_000) })
                .attachMetadata(1234, metadata)
                .complete();

            console.log("Transaction built. Signing...");

            const signedTx = await tx.sign().complete();

            console.log("Transaction signed. Submitting...");

            const txHash = await signedTx.submit();
          

            console.log("Transaction submitted! Hash:", txHash);
            console.log("Preparing MongoDB insertion...");

            const db = client.db("product_auth");
            const transactions = db.collection("transactions");

            const doc = {
                company: "CompanyA",
                txHash: txHash,
                productHashes: hashes,
                createdAt: new Date(),
            };

            const result = await transactions.insertOne(doc);
            console.log("Data inserted to MongoDB:", result.insertedId);

        res.json([txHash]);

    } catch (err) {
        console.error("Error submitting transaction:", err);
        res.status(500).json({ error: err.message });
    }
});

// Accept POST request with product_hash and check if it's in the block
app.post("/api/lookup/:txHash", async (req, res) => {
    try {
        const { txHash } = req.params;
        const { product_hash } = req.body;

        if (!product_hash) {
            return res.status(400).json({ status: "Error", type: "Incomplete Inputs" });
        }

        const response = await fetch(
            BLOCKFROST_URL + `/txs/${txHash}/metadata`,
            {
                headers: { project_id: blockfrostKey }
            }
        );

        if (!response.ok) {
            const text = await response.text();
            return res.status(response.status).json({
                status: "Invalid",
                type: "Invalid Unique Code",
                error: text
            });
        }

        const metadataArray = await response.json();
        const labelEntry = metadataArray.find(item => item.label === "1234");

        if (!labelEntry || !labelEntry.json_metadata) {
            return res.status(404).json({ status: "Invalid", type: "Unique code not found" });
        }

        const hashesBlock = labelEntry.json_metadata;

        const found = Object.values(hashesBlock).some(
            (entry) => entry.product_hash === product_hash
        );

        if (found) {
            const db = client.db("product_auth");
            const verifications = db.collection("verifications");

            const now = new Date();
            const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
            const time = now.toTimeString().split(" ")[0].slice(0, 5); // HH:MM (24h format)

            // Get IP and geolocation - test
            const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
            const geo = geoip.lookup(ip);
            const location = geo ? `${geo.city || "Unknown"}, ${geo.country}` : "Unknown";

            let record = await verifications.findOne({ product_hash });

            const attempt = record ? record.verifications.length + 1 : 1;

            const newEntry = {
                attempt,
                date,
                time,
                location
            };

            if (record) {
                await verifications.updateOne(
                    { product_hash },
                    { $push: { verifications: newEntry } }
                );
            } else {
                await verifications.insertOne({
                    product_hash,
                    verifications: [newEntry]
                });
            }

            return res.json({
                status: "Verified",
                type: "Match",
                history: record ? [...record.verifications, newEntry] : [newEntry]
            });

        } else {
            return res.json({
                status: "Item not found",
                type: "Mismatch",
                history: []
            });
        }

    } catch (err) {
        res.status(500).json({ status: "Error", type: "Not found", error: err.message });
    }
});

//sensitive
const PORT = process.env.PORT || 3000;
async function startServer() {
    try {
        await client.connect();
        console.log("Connected to MongoDB cluster.");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    }
}

startServer();
