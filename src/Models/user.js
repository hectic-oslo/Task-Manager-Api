const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Tasks = require("./Task");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive no");
      }
    },
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    
    // validate(value) {
    //   if (!validator.isEmail(value)) {
    //     throw new Error("enter a valid email");
    //   }
    // },
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Please entere a secure password");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
         required: true,
        
        
      },
    },
  ],
  avatar:{
    type:Buffer
  }
},{
  timestamps:true
});

//for tasks app
userSchema.virtual('tasks',{
  ref:'Task',
  localField:'_id',
  foreignField:'owner'

})


//for jwt auth tokens
userSchema.methods.generateAuthToken = async function (){
  const user = this;

  const token = jwt.sign({ _id: user._id.toString()}, "secretcode");
  // console.log(token);
   user.tokens =  user.tokens.concat({ token });
 
  await user.save();
  
  return token;
  
};

// userSchema.methods.generateAuthToken = async function(){ 
//   const user = this
//   const token = jwt.sign({_id:user.id.toString()},"thisismynewcourse")
//   user.tokens = user.tokens.concat({token})
//   await user.save()
//   return token
//   }

// converting plane text into hash
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  //  console.log('from user schema')

  next();
});

//for logging in
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  //console.log(email)
  if (!user) {
    throw new Error("unable to login/mail not found");
    // console.log(user)
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("password not matched");
  }
  //console.log(user)
  return user;
};


// userSchema.methods.getPublicProfile=function(){
//   const user=this
//   const userObject=user.toObject()
//    delete userObject.password
//    delete userObject.tokens
//   return userObject
// }
userSchema.methods.toJSON=function(){
  const user=this
  const userObject=user.toObject()
   delete userObject.password
   delete userObject.tokens
   delete userObject.avatar
  return userObject
}
// delete user task when user is removed
userSchema.pre('remove',async function(next){
  const user=this

  await Tasks.deleteMany({owner:user._id})
  next()
})

const User = mongoose.model("users", userSchema);

module.exports = User;
