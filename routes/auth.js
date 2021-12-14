const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {User} = require('../models');

router.post('/register',async(req,res,next)=>{
    try{
        //if user exist
        const foundUser = await User.exists({$or:[{email:req.body.email},{username:req.body.username}]})
        if(foundUser){
            console.log('User already exist');
            return res.render("auth/register", {err: "User already exists"});
        }

        //if user does not exist
            //hash and salt password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
            //create user with hashed password
        const createdUser = await User.create(req.body);

        //return to login
        return res.redirect('/login')

    }catch(error){
        console.log(error.message)
        return res.send(error.message)
    }
})

module.exports = router;