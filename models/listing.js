const mongoose=require("mongoose"); 
const review=require("./review.js"); 
//const schema=mongoose.Schema();
const Schema = mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
       
    },
    image:{
        filename:String,
        url: String,
    },

    price:{
        type:Number,
    },
    location:{
        type:String
    },
    country:{
        type:String
    },

    reviews :[
       {
          type: Schema.Types.ObjectId,
          ref: "review"
       } ,
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    category:{
        type:String,
        enum:["mountain" ,"Trending" ,"Rooms", "Iconic Cities" ,"Pools", "Camping","Farms","Arctic"]
    }

});

listingSchema.post("findOneAndDelete" ,async (listing)=>{
    if(listing){
        console.log(" me post");
        await review.deleteMany({_id : {$in : listing.reviews}});
    }
})  ;

const listing= mongoose.model("listing" ,listingSchema);
module.exports=listing;