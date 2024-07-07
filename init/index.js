const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const intData = require("./data.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("connected to url");
})
.catch((err)=>{
  console.log(err);
});

const initDB = async ()=>{
    await Listing.deleteMany({});
   intData.data=intData.data.map((obj)=>({...obj, owner: '6688055315475a81bb6ecd3b'}));
    await Listing.insertMany(intData.data);
    console.log("data was initialized");
};
initDB();