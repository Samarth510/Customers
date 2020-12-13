const mongoose=require('mongoose');
const moment=require('moment');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');

var Schema=mongoose.Schema

var customerSchema=new Schema({
    ID:{
        type:Number,
        required:true,
        unique:true,
        default:parseInt(moment(new Date()).format('mmssSSS'))
    },
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
        trim:true
    },
    address:{
        type:String,
        required:true
    },
    update_timestamp:{
        type: Date,
        default: Date.now()
    }
})

customerSchema.methods.GenerateJWTToken= function(callback){
    bcrypt.hash(this.password,10,(err,hashed_pw)=>{
        this.password=hashed_pw;
        this.save()
        .then(result=>{
            console.log(result);
            callback({status:'Success',
                    token: jwt.sign({email:this.email, password: this.password},'abc123')
                });
        })
        .catch(err=>{
            callback({Status: 'error',
            ErrorDetails: err});
        });
    })
}

customerSchema.statics.verifyJWTToken= function(token){
    var decoded;
    try{
        decoded=jwt.verify(token,'abc123');
        return Promise.resolve(decoded);
    }catch(error){
        return Promise.reject(error);
    }
}

var Customer=mongoose.model('Customer',customerSchema);
module.exports=Customer;