const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {User,MessageBoard} = require('../models');
let userInfo = null

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
        userInfo = req.body
        return res.redirect('/signup2')
    }catch(err){
        console.log(error.message)
        return res.send(error.message)
    }
})

router.post('/signup2',async(req,res)=>{
    try{
        userInfo = {
            ...req.body,
            ...userInfo,
        }
        return res.redirect('/signup3')
    }catch(err){
        console.log(error.message)
        return res.send(error.message)
    }
})

router.post('/signup3',async(req,res,next)=>{
    try{
        //if user exist
        console.log('USER INFO',userInfo)
        const foundUser = await User.exists({$or:[{email:userInfo.email},{username:req.body.username}]})
        if(foundUser){
            console.log('User already exist',foundUser);
            return res.render("index", {err: "User already exists"});
        }

        //if user does not exist
            //hash and salt password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
            //create user with hashed password
        const createdUser = await User.create({...userInfo,...req.body});
        console.log('created User',createdUser)

        //CREATE WAY FOR USER TO AUTO BE ADDED TO COMPANY AND CITY MESSAGE BOARD
        //if the message board for city doesn't exist make one
        //auto post message

        
        let newOldMessageBoard = (await MessageBoard.find({}))[0]
        if(!newOldMessageBoard){
            newOldMessageBoard = await MessageBoard.create({
                name:'oldNew',
                category:'newOld',
                users:[createdUser._id]
            })
        }else{
            await MessageBoard.updateOne({_id:newOldMessageBoard._id},{$push: {users: createdUser._id}},{new:true})
        }
        console.log('newOld',newOldMessageBoard)
        await User.updateOne({_id:createdUser._id},{$push: {messageBoards: newOldMessageBoard._id}},{new:true})
        console.log('newOld done')

        //join company message board for when user joins in, create one if it doesn't exist
        let companyMessageBoard = await MessageBoard.findOne({name:userInfo.company})
        if(!companyMessageBoard){
            companyMessageBoard = await MessageBoard.create({
                name:userInfo.company,
                category:'company',
                users:[createdUser._id]
            })
        }else{
            await MessageBoard.updateOne({_id:companyMessageBoard._id},{$push: {users: createdUser._id}},{new:true})
        }
        console.log('Company Board',companyMessageBoard)
        await User.updateOne({_id:createdUser._id},{$push: {messageBoards: companyMessageBoard._id}},{new:true})
        console.log('company board done')

        //join city message board for when user joins in, create one if it doesn't exist
        let cityMessageBoard = await MessageBoard.findOne({name:userInfo.city})
        if(!cityMessageBoard){
            cityMessageBoard = await MessageBoard.create({
                name:userInfo.city,
                category:'city',
                users:[createdUser._id]
            })
        }else{
            await MessageBoard.updateOne({_id:cityMessageBoard._id},{$push: {users: createdUser._id}},{new:true})
        }
        console.log('City Board',cityMessageBoard)
        await User.updateOne({_id:createdUser._id},{$push: {messageBoards: cityMessageBoard._id}},{new:true})
        console.log('City Board done')

        req.session.currentUser = {
            id: createdUser._id,
            username: createdUser.username,
            email: createdUser.email,
        }

        return res.redirect(`/boards/${newOldMessageBoard._id}`);

    }catch(error){
        console.log(error.message)
        return res.send(error.message)
    }
})

router.get('/signin',(req,res)=>{
    return res.render('profile/signin')
})


router.post('/signin', async(req,res,next)=>{
    try{
        //check if user exist
        const foundUser = await User.findOne({username: req.body.username}).select('+password');
        if(!foundUser){
            console.log(`user does not exist`)
            return res.redirect('/index')
        }
        console.log(foundUser)
        
        //check password
        console.log(req.body.password,foundUser.password)
        const matchedPassword = await bcrypt.compare(req.body.password,foundUser.password)
        if(!matchedPassword){
            //return res.redirect("/register")
            console.log('invalid user info')
            return res.redirect('/index');
        }

        req.session.currentUser = {
            id: foundUser._id,
            username: foundUser.username,
            email: foundUser.email,
        }

        //find all boards and use id of the first one
        const newOldBoards = await MessageBoard.find({})

        return res.redirect(`/boards/${newOldBoards[0]._id}`);

    }catch(error){
        console.log(error.message);
        return res.send(error.message)

    }
})

router.get('/logout',async(req,res,next)=>{
    try{
        await req.session.destroy();
        return res.redirect('/index')
    }catch(error){
        console.log(error.message);
        return res.send(error.message)
    }
})

module.exports = router;