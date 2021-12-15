const express = require(`express`)
const router = express.Router()
const {User,MessageBoard,Post} = require('../models');


router.get(`/:id`, async (req,res) => {
    try{
        let context = null
        const foundUser = await User.findById(req.params.id).populate('messageBoards').exec((err, messageBoards) => {
            console.log("Populated User " + messageBoards);
          })
        if(foundUser){
            context = foundUser
        }else{
            return res.redirect('/index',{err:'no found user with that ID'})
        }
        //insert error hanlding if no found User here
    }catch(err){
        console.log(err)
        res.status(500).json({
            status:500,
            message:'internal server error'
        })
    }
    res.render(`profile/show`,context)
})

router.get(`/:id/edit`,async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        return res.render(`profile/edit`,{user});
    }catch(err){
        return res.redirect('/index',{err})
    }
})

router.post(`/:id/edit`, async (req,res) => {
    try{
        
        const unupdatedUser = await User.findById(req.params.id);
        //IF COMPANY OR CITY IS UPDATED UPDATE MESSAGE BOARD
        let newLocation = false;
        let newCompany = false;

        if(req.body.location && req.body.location!==unupdatedUser.location){
            newLocation = true
        }
        if(req.body.city && req.body.city!==unupdatedUser.city){
            newCompany = true
        }

        if(newLocation){
            //pull user out of old board
            await MessageBoard.updateOne({$and:[
                {users:{$in:[unupdatedUser._id]}},
                {category:'company'}
            ]},
                { $pull: { users: { $elemMatch: { _id:unupdatedUser._id } } } },
                { new: true })
            
            //pull board out of user
            await User.updateOne({_id:unupdatedUser._id},
                { $pull: { messageBoards: { $elemMatch: { category:'company' } } } },
                { new: true })
            
            //create message board if not existing, push user if existing
            let companyMessageBoard = await MessageBoard.findOne({company:req.body.company})
            if(!companyMessageBoard){
                companyMessageBoard = await MessageBoard.create({
                    name:req.body.company,
                    category:'company',
                    users:[unupdatedUser._id]
                })
            }else{
                await MessageBoard.updateOne({_id:companyMessageBoard._id},{$push: {users: unupdatedUser._id}},done)
            }
            await User.updateOne({_id:unupdatedUser._id},{$push: {messageBoards: companyMessageBoard._id}},done)
        }

        if(newCity){
            //pull user out of old board
            await MessageBoard.updateOne({$and:[
                {users:{$in:[unupdatedUser._id]}},
                {category:'city'}
            ]},
                { $pull: { users: { $elemMatch: { _id:unupdatedUser._id } } } },
                { new: true })
            
            //pull board out of user
            await User.updateOne({_id:unupdatedUser._id},
                { $pull: { messageBoards: { $elemMatch: { category:'city' } } } },
                { new: true })
            
            //create message board if not existing, push user if existing
            let companyMessageBoard = await MessageBoard.findOne({city:req.body.city})
            if(!cityMessageBoard){
                cityMessageBoard = await MessageBoard.create({
                    name:req.body.city,
                    category:'city',
                    users:[unupdatedUser._id]
                })
            }else{
                await MessageBoard.updateOne({_id:cityMessageBoard._id},{$push: {users: unupdatedUser._id}},done)
            }
            await User.updateOne({_id:unupdatedUser._id},{$push: {messageBoards: cityMessageBoard._id}},done)
        }
        
        

        const updateBody = {
            email:req.body.email,
            username:req.body.username,
            location:req.body.location,
            company:req.body.company,
        }

        const updatedUser = await User.findByIdAndUpdate(req.userId,updateBody,{new:true}).populate('messageBoards').exec((err, messageBoards) => {
            console.log("Populated User " + messageBoards);
          })
        if(!updatedUser){
            return res.redirect('/index',{err:'updated user was no able to be found'})
        }

        res.redirect(`profile/${updatedUser._id}`)
    }catch(err){
        console.log(err)
        return res.redirect('/index',{err})
    }
    
})

module.exports = router


