const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const Schema = mongoose.Schema;

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wandurlust");
}

main().then(() =>{console.log("connection with db successfull");}).catch((err) => {console.log(err);});

const initDb = async () =>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
}

initDb();