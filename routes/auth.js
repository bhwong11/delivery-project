const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {User} = require('../models');

router.get('/index',(req,res,next)=>{
    res.render('index');
})

router.get('/signup1',(req,res,next)=>{
    res.render('signup/signup1');
})

router.get('/signup2',(req,res,next)=>{
    res.render('signup/signup2');
})

router.get('/signup3',(req,res,next)=>{
    res.render('signup/signup3');
})

router.post('/signup1',async(req,res)=>{
    try{
        req.session.userInfo = req.body
        return res.redirect('/signup2')
    }catch(err){
        console.log(error.message)
        return res.send(error.message)
    }
})

router.post('/signup2',async(req,res)=>{
    try{
        req.session.userInfo = {
            ...req.body,
            ...req.session.userInfo,
        }
        return res.redirect('/signup2')
    }catch(err){
        console.log(error.message)
        return res.send(error.message)
    }
})

router.post('/signup3',async(req,res,next)=>{
    try{
        //if user exist
        const foundUser = await User.exists({$or:[{email:req.session.userInfo.email},{username:req.body.username}]})
        if(foundUser){
            console.log('User already exist');
            return res.render("/", {err: "User already exists"});
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