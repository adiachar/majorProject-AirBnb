const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://lajollamom.com/wp-content/uploads/2019/01/Fairmont-Grand-Del-Mar-luxury-hotel-scaled.jpg",               // this is if the image is undefined
        set: (v) => v === "" ? "https://lajollamom.com/wp-content/uploads/2019/01/Fairmont-Grand-Del-Mar-luxury-hotel-scaled.jpg" : v,  // this is if the image is there but a empty string
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;