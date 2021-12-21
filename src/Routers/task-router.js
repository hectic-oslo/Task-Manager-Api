const express = require("express");
require("../db/mongoose");
const Tasks = require("../Models/Task");
const auth = require("../middle-ware/auth");
const router = new express.Router();

router.post("/tasks",auth ,async (req, res) => {
//   const NTask = new Tasks(req.body);
    const NTask=new Tasks({
        ...req.body,
        owner:req.user._id
        }
    )
  try {
    await NTask.save();
    res.send(NTask);
  } catch (error) {
    res.status(400).send(error);
  }
  //    NTask.save().then(()=>{
  //         res.send(NTask)
  //     })
  //     .catch((error)=>{
  //         res.status(400).send(error)
  //     })
});




        //GET /tasks?completed=true
        //GET /tasks?limit=1&skip=1
        //GET /tasks?sortBy=createdAt:desc
router.get("/tasks",auth, async (req, res) => {
 
  const match={}
  const sort={}
  if(req.query.completed){
    match.completed = req.query.completed === 'true'
  
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
       }
  }
    try{
        // tasks= await Tasks.find({owner:req.user._id})//---1

        await req.user.populate({
            path: 'tasks',
            match,
            options: {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
            }
           })
           res.send(req.user.tasks)
       // res.send(tasks)//---1
    }
    catch(error){
      res.status(500).send(error);
    };
});

router.get("/tasks/:id",auth, async(req, res) => {
  const _id = req.params.id;
  try{
     const task= await Tasks.findById({ _id,owner:req.user._id })
     res.send(task)
  }
  catch(e){
    res.status(500).send(error);
  }
//   Tasks.findById({ _id })
//     .then((task) => {
//       if (!task) {
//         res.status(404).send();
//       }
//       res.send(task);
//     })
//     .catch((error) => {
//       res.status(500).send(error);
//     });
});
router.delete('/tasks/:id',auth,async(req,res)=>{
 
    try{
const task=await Tasks.findOneAndDelete({_id:req.params.id,owner:req.user._id})
if(!task)
{res.status(404).send()}
res.send(task)
    }
    catch(e){
        res.status(404).send()
    }
})

module.exports = router;
