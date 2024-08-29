const mongoose=require("mongoose"); 
const listing=require("../models/listing.js");
const initData=require("./data.js");


main().then(()=>{
    console.log("DB connected...");
}).catch(err=>console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

 const  initDB = async ()=>{
   await  listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj ,owner:"66783db4af69b596f3b252ae" }));
    await listing.insertMany(initData.data);
    console.log("data was initialized");

};

initDB();  



