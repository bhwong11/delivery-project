const express = require(`express`)
const router = express.Router()
const {User,MessageBoard,Post} = require('../models');


router.get(`/:id`, async (req,res) => {
    try{
        const foundUser = await User.findById(req.userId).populate('messageBoards').exec((err, messageBoards) => {
            console.log("Populated User " + messageBoards);
          })
        if(foundUser){
            return res.status(200).json({
                status:200,
                message:'success',
                user:foundUser,
            })
        }else{
            return res.status(400).json({
                status:400,
                message:'No User with that id was found',
            })
        }
    }catch(err){
        console.log(err)
        res.status(500).json({
            status:500,
            message:'internal server error'
        })
    }
    res.render(`profile/show`)
})

router.get(`/:id/edit`, (req,res) => {
    res.render(`profile/edit`)
})


module.exports = router



const show = async(req,res)=>{
    try{
        const foundUser = await User.findById(req.userId).populate('messageBoards').exec((err, messageBoards) => {
            console.log("Populated User " + messageBoards);
          })
        if(foundUser){
            return res.status(200).json({
                status:200,
                message:'success',
                user:foundUser,
            })
        }else{
            return res.status(400).json({
                status:400,
                message:'No User with that id was found',
            })
        }
    }catch(err){
        console.log(err)
        res.status(500).json({
            status:500,
            message:'internal server error'
        })
    }
}

const update = async(req,res)=>{
    try{
        
        const unupdatedUser = await User.findById(req.userId);

        let newLocation = false;
        let newCompany = false;

        if(req.body.location!==unupdatedUser.location){
            newLocation = true
        }
        if(req.body.city!==unupdatedUser.city){
            newCompany = true
        }

        if(newLocation){
            await MessageBoard.updateMany({users:{$in:[unupdatedUser._id]}})
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
            return res.status(400).json({
                status:400,
                message:'could not find user with that id',
            })
        }
        //IF COMPANY OR CITY IS UPDATED UPDATE MESSAGE BOARD
        

        return res.status(200).json({
            status:200,
            message:'success',
            user:updatedUser,
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            status:500,
            message:'internal server error'
        })
    }
}

const destroy = async(req,res)=>{
    try{
        const deletedUser = await User.findByIdAndDelete(req.userId)
        if(!deletedUser){
            return res.status(400).json({
                status:400,
                message:'could not find user with that id',
            })
        }
        return res.status(200).json({
            status:200,
            message:'success',
            user:deletedUser,
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            status:500,
            message:'internal server error'
        })
    }
}
