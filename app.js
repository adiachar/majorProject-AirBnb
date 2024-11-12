const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");


const app = express();
const port = 8080;

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wandurlust");
}

main().then(() =>{console.log("connection with db successfull");}).catch((err) => {console.log(err);});


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));


// get to show all listings
app.get("/listings", wrapAsync( async (req, res) =>{
    const allListings = await Listing.find();
    res.render("listings/index.ejs", {allListings});
}));

//get for create rout
app.get("/listings/new", (req, res) =>{
    res.render("listings/new.ejs");
});

//create rout
app.post("/listings", wrapAsync( async (req, res, next) =>{
    if(!req.body.listing)
    {   
        throw new ExpressError(400, "send valid data");
    }
    let list = new Listing(req.body.listing);                  // remember this, this is very usefull. consider the ejs file also.
    await list.save();
    res.redirect("/listings");
}));

// get for show list
app.get("/listings/:id", wrapAsync( async (req, res) =>{
    const {id} = req.params;
    const list = await Listing.findById(id);
    res.render("listings/show.ejs", {list});
}));

//get for edit rout
app.get("/listings/:id/edit", wrapAsync( async (req, res) =>{
    let {id} = req.params;
    const list = await Listing.findById(id);
    res.render("listings/edit.ejs", {list});
}));

//Update rout
app.patch("/listings/:id", wrapAsync ( async (req, res) => {
    let {id} = req.params;
    if(!req.body){
        throw new ExpressError(400, "validation Error");
    }
    await Listing.findByIdAndUpdate(id, req.body.listing , {new: true}).then((res)=>{console.log(res)}).catch((err)=> {throw err;})
    res.redirect("/listings");
}));

//DELETE rout
app.delete("/listings/:id", wrapAsync( async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


// Page Not Found
app.use((req, res) =>{
    res.send("Page Not Found");
});


app.all('*', (req, res, next) =>{
    next(new ExpressError(404, "page not found"));
});

//error handling middleware
app.use((err, req, res, next) =>{
    let {statusCode = 500, message = "something went wrong"} = err;
    res.status(statusCode).render("listings/error.ejs", {err});
});

app.listen(port, ()=>{
    console.log("listening to the port: " +port);
});


