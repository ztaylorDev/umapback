const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");




//get all users
router.get("/", async (req, res)=>{
  try{
      const users = await User.find();
      res.status(200).json(users);
  }catch(err){
      res.status(500).json(err);
  }
})

//get one user
router.get("/:userId", async (req, res)=>{
  try{
      const users = await User.findById(req.params.userId);
      return res.send(users)
  }catch(ex){
      return res.status(500).send(`internal server error:${ex}`)
  }
})






//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user
     const user = await newUser.save();
     res.status(200).json(user._id);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
  }
});



router.put("/:userId", async (req, res) => {
  try {
    
    const salt = await bcrypt.genSalt(10);
    let user = await User.findByIdAndUpdate(req.params.userId,{
      username : req.body.username,
      email : req.body.email,
      password : await bcrypt.hash(req.body.password, salt),},
      {new: true}
      );
    if (!user)
      return res
        .status(400)
        .send(`The user with id "${req.params.userId}" does not exist.`);
    await user.save();
    return res.send({ _id: user._id, username: user.username, email: user.email});
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});






//Login
router.post("/login", async (req, res) => {
    try {
      //find user
      const user = await User.findOne({ username: req.body.username });
      !user && res.status(400).json("Wrong username or password");
  
      //validate password
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      !validPassword && res.status(400).json("Wrong username or password");
  
      //send response
      res.status(200).json({ _id: user._id, username: user.username });
    } catch (err) {
      res.status(500).json(err);
    }
  });

  
  router.delete('/:userId', async (req, res) => {
    try {
      const user = await User.findByIdAndRemove(req.params.userId);
      if (!user)
        return res.status(400).send(`The user with id "${req.params.userId}" does not exist.`);
      return res.send(user);
    } catch (ex) {
      return res.status(500).send(`Internal Server Error: ${ex}`);
    }
  });






  
  module.exports = router;
