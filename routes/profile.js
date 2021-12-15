const express = require(`express`)
const router = express.Router()
const {User,MessageBoard,Post} = require('../models');


router.get(`/:id`, async (req,res) => {
    try{
        let context = null
        const foundUser = await User.findById(req.params.id).populate('messageBoards');
        if(foundUser){
            context = {user:foundUser}
        }else{
            return res.redirect('/')
        }
        return res.render(`profile/show`,context)
        //insert error hanlding if no found User here
    }catch(err){
        console.log(err)
        res.status(500).json({
            status:500,
            message:'internal server error'
        })
    }
})

router.get(`/:id/edit`,async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        return res.render(`profile/edit`,{user});
    }catch(err){
        return res.redirect('/')
    }
})

router.put(`/:id/edit`, async (req,res) => {
    try{

        const unupdatedUser = await User.findById(req.params.id);
        //IF COMPANY OR CITY IS UPDATED UPDATE MESSAGE BOARD
        let newCity = false;
        let newCompany = false;
        console.log('old user',unupdatedUser)

        if(req.body.city && req.body.city!==unupdatedUser.city){
            newCity = true
        }
        if(req.body.company && req.body.company!==unupdatedUser.company){
            newCompany = true
        }

        if(newCompany){
            //pull user out of old board
            const companyBoard = await MessageBoard.findOne({$and:[
                {users:{$in:[unupdatedUser._id]}},
                {category:'company'}
            ]}).populate('users');
            console.log('old board',companyBoard)
            companyBoard.users = companyBoard.users.filter(e=>e._id!==unupdatedUser._id)
            await companyBoard.save();
            console.log('new board',companyBoard)
            //pull board out of user

            const newCompanyUser =await User.findById(unupdatedUser._id).populate('messageBoards')
            newCompanyUser.messageBoards = newCompanyUser.messageBoards.filter(e=>e.category!=='company')
            await newCompanyUser.save();
            console.log('company change user',newCompanyUser)

            
            //create message board if not existing, push user if existing
            let companyMessageBoard = await MessageBoard.findOne({name:req.body.company})
            if(!companyMessageBoard){
                companyMessageBoard = await MessageBoard.create({
                    name:req.body.company,
                    category:'company',
                    users:[unupdatedUser._id]
                })
            }else{
                await MessageBoard.updateOne({_id:companyMessageBoard._id},{$push: {users: unupdatedUser._id}},{new:true})
            }
            console.log('NEW COMPANY')
            await User.updateOne({_id:unupdatedUser._id},{$push: {messageBoards: companyMessageBoard._id}},{new:true})
        }

        if(newCity){
            //pull user out of old board
            const cityBoard = await MessageBoard.findOne({$and:[
                {users:{$in:[unupdatedUser._id]}},
                {category:'city'}
            ]}).populate('users');
            console.log('old board',cityBoard)
            cityBoard.users = cityBoard.users.filter(e=>e._id!==unupdatedUser._id)
            await cityBoard.save();
            console.log('new board',cityBoard)
            //pull board out of user

            const newCityUser =await User.findById(unupdatedUser._id).populate('messageBoards')
            newCityUser.messageBoards = newCityUser.messageBoards.filter(e=>e.category!=='city')
            await newCityUser.save();
            console.log('city change user',newCityUser)
            
            //create message board if not existing, push user if existing
            let cityMessageBoard = await MessageBoard.findOne({name:req.body.city})
            if(!cityMessageBoard){
                cityMessageBoard = await MessageBoard.create({
                    name:req.body.city,
                    category:'city',
                    users:[unupdatedUser._id]
                })
            }else{
                await MessageBoard.updateOne({_id:cityMessageBoard._id},{$push: {users: unupdatedUser._id}},{new:true})
            }
            await User.updateOne({_id:unupdatedUser._id},{$push: {messageBoards: cityMessageBoard._id}},{new:true})
        }
        
        

        const updateBody = {
            email:req.body.email,
            username:req.body.username,
            city:req.body.city,
            company:req.body.company,
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id,updateBody,{new:true}).populate('messageBoards')
        if(!updatedUser){
            return res.redirect('/')
        }

        res.redirect(`/profile/${updatedUser._id}`)
    }catch(err){
        console.log(err)
        return res.redirect('/')
    }
    
})

module.exports = router