const mongoose = require("mongoose");


const Tasks= mongoose.model('Task',{
    description:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'users'
    }

})


 module.exports=Tasks