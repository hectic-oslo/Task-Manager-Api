const mongoose = require("mongoose");
// const validator = require("validator");

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  // useCreateIndex:true   //-----------> not supported
});


// const me = new user({
//   name: "      Abhishek",
//   age: 19,
//   email: "abhi@gh",
//   password:'PASSWhghhORD!'
// });

// me.save()
//   .then(() => {
//     console.log(me);
//   })
//   .catch((error) => {
//     console.log("error!", error);
//   });

//  const Task=new Tasks({
//      description:'close the door',
//      completed:true
//  })
// Task.save().then(()=>{
//     console.log(Task)
// }).catch((error)=>{
//     console.log(error)
// })
