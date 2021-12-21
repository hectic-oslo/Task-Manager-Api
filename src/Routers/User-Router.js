const express = require("express");
require("../db/mongoose");
const User = require("../Models/user");
const auth = require("../middle-ware/auth");
const{SendWelcomeMail,SendCancelationMail}=require('../emails/account')
const router = new express.Router();

router.post("/users", async (req, res) => {
  const Nuser = new User(req.body);
  try {
    await Nuser.save();
    await SendWelcomeMail(Nuser.email,Nuser.name)
    res.send(Nuser);
  } catch (error) {
    res.status(400).send(error);
  }
  //    Nuser.save().then(()=>{
  //         res.send(Nuser)
  //     })
  //     .catch((error)=>{
  //         res.status(400).send(error)
  //     })
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
   await SendCancelationMail(req.user.email,req.user.name)
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
  // User.find({}).then((users)=>{
  //     res.send(users)
  // }).catch((error)=>{
  //     res.status(500).send(error)
  // })
});

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById({ _id });
    if (!user) {
      res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }

  // User.findById({_id}).then((user)=>{
  //     if(!user){
  //         res.status(404).send()
  //     }
  //     res.send(user)
  // }).catch((error)=>{
  //     res.status(500).send(error)
  // })
});

// update logined user instatces
router.patch("/users/my", auth, async (req, res) => {
  const _id = req.params.id;

  const updates = Object.keys(req.body);
  const allowedUpdate = ["name", "age", "password", "email"];

  const isValidate = updates.every((update) => allowedUpdate.includes(update));

  if (!isValidate) return res.status(404).send({ error: "invalid update" });

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();

    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

//update the instances
router.patch("/users/:id", async (req, res) => {
  const _id = req.params.id;

  const updates = Object.keys(req.body);
  const allowedUpdate = ["name", "age", "password", "email"];
  //  const isValidate=updates.every((update)=>{
  //      return allowedUpdate.includes(update)})

  const isValidate = updates.every((update) => allowedUpdate.includes(update));

  if (!isValidate) return res.status(404).send({ error: "invalid update" });

  try {
    // const user=await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})

    const user = await User.findById(_id);
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    if (!user) res.status(404).send();

    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// router.delete("/users/:id", async (req, res) => {
//   const _id = req.params.id;
//   try {
//     const user = await User.findByIdAndDelete(_id);
//     if (!user) res.status(404).send();
//     res.send(user);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

router.delete("/users/me", auth, async (req, res) => {
  try {
    const user = await User.remove();

    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    res.send({ user, token });
    // res.send({ user:user.getPublicProfile(), token });  //
    //  res.send(user)
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(503).send(e);
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(503).send(e);
  }
});

//img upload in
const multer = require("multer");
const sharp=require('sharp')
const upload = multer({
  //dest:'images',
  limits: {
    fileSize: 100000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(doc|pdf|docx|jpg|jpeg)$/)) {
      return cb(new Error("upload a doc,pdf or docx file"));
    }
    cb(undefined, true);
  },
});

// router.post('users/upload',auth,upload.single('upload'),async(req,res)=>{
//   req.user.images=req.file.Buffer
//   await req.user.save()
//       res.send()
//  },(error,req,res,next)=>{
//      res.status(404).send({
//          error:error.message
//      })
//  })

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250
    }).png().toBuffer()
    // const buffer= await sharp(req.file.buffer).resize({height:200,width:278}).png().toBuffer()
    req.user.avatar = buffer;
    // req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  }
);

// router.get("/users/:id/avatar", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user || !user.avatar) {
//       throw new Error();
//     }
//     res.set("Content-Type", "image/jpg");
//     res.send(user.avatar);
//   } catch (e) {
//     res.status(404).send();
//   }
// });


////////errrrrrrrr---solved
router.get("/users/:id/avatar",async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user || !user.avatar) {
        res.send({ msg: "either user or avatar is missing" });
      }
      res.set("Content-Type", "image/png");
      res.send(user.avatar);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// const jwt = require("jsonwebtoken");
// const cmp=jwt.sign({_id:'abhishek'},"asasasa")
// console.log(cmp)

module.exports = router;
