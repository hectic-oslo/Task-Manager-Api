const express=require("express")
 require('./db/mongoose')
 const User = require("./Models/user")
const Tasks = require("./Models/Task")
const userRouter=require('./Routers/User-Router')
const taskRouter=require('./Routers/task-Router')

const app=express()


const port=process.env.PORT||8080


//express middleware
// app.use((req,res,next)=>{
//     if(req.method==='GET')
//     {
//         res.send('GET request are disabled')
//     }
//     else{
//         next()
//     }
// })

//for development mode
// app.use((req,res,next)=>{
//     res.status(500).send('Site is currently in maintainance ')
// })
app.use(express.json()) 
app.use(userRouter)
app.use(taskRouter)





// app.post('/users',async(req,res)=>{
    
//     const Nuser=new User(req.body)
//     try{
//         await Nuser.save()
//         res.send(Nuser)
//     }
//     catch(error){
//         res.status(400).send(error)
//     }
// //    Nuser.save().then(()=>{
// //         res.send(Nuser)
// //     })
// //     .catch((error)=>{
// //         res.status(400).send(error)
// //     })
// })



// app.get('/users',async(req,res)=>{
   


//     try{
//         const users=await User.find({})
//         res.send(users)
//     }
//     catch(error){
//         res.status(500).send(error)
//     }
//     // User.find({}).then((users)=>{
//     //     res.send(users)
//     // }).catch((error)=>{
//     //     res.status(500).send(error)
//     // })
// })

// app.get('/users/:id',async(req,res)=>{
     
//     const _id=req.params.id

//     try{
//         const user=await User.findById({_id})
//              if(!user){
//             res.status(404).send()
//             }
//         res.send(user)
//     }
//     catch(error){
//         res.status(500).send(error)
//     }
    
//     // User.findById({_id}).then((user)=>{
//     //     if(!user){
//     //         res.status(404).send()
//     //     }
//     //     res.send(user)
//     // }).catch((error)=>{
//     //     res.status(500).send(error)
//     // })
// })

// //update the instances
// app.patch('/users/:id',async(req,res)=>{
// const _id=req.params.id
   
//      const updates=Object.keys(req.body)
//      const allowedUpdate=['name','age','password','email']
//     //  const isValidate=updates.every((update)=>{
//     //      return allowedUpdate.includes(update)})
//          const isValidate=updates.every((update)=>allowedUpdate.includes(update))
     
//      if(!isValidate)
//       return res.status(404).send({'error':'invalid update'})

//     try{
//      const user=await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
//      if(!user)
//      res.status(404).send()
//     res.send(user)
//     }
//     catch(e){
//         res.status(400).send(e)
//     }
// })

// app.delete('/users/:id',async(req,res)=>{
//  const _id=req.params.id
//  try{
//     const user=await User.findByIdAndDelete(_id)
//     if(!user)
//      res.status(404).send()
//     res.send(user)
//  }catch(e){
//      res.status(400).send()
//  }
// })


// const main=async()=>{
//     const task=await Tasks.findById("61be59b53263ab5ab0bf8e2d")
//      await task.populate('owner')
//     console.log(task.owner) 
       
//     const user=await User.findById("61be44184b6e612f5f3a9eb2")
//     await user.populate({path:'tasks'})
//     console.log(user.tasks) 
// }

//main()

 
app.listen(port,()=>{
 console.log('procees is up with port no'+port)
})