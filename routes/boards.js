const express = require(`express`)
const router = express.Router()
const Board = require(`../models/MessageBoard`)
const Post = require(`../models/Post`)
const User = require(`../models/User`)

////Board index
router.get(`/`, async (req,res) => {
    let boards
    let posts
    try {
        boards = await Board.find()
        posts = await Post.find({})
    } catch(err) {
        console.log(err)
    }
    res.render(`boards/index`, {
        boards: boards, 
        posts: posts
    })
})

/////New Board
router.get(`/new`, (req,res) => {
    res.render(`boards/new`, { board: new Board() })
})
/////Create Board
router.post(`/`, async (req,res) => {
    console.log(req.body)
    const board = new Board({
        name: req.body.name,
        category: req.body.category
    })
    try {
        const newBoard = await board.save()
        res.redirect(`boards/${newBoard.id}`)
    } catch (err) {
        console.log(err)
        res.render(`boards/new`, {
            board: board
        })
    }
})

////Show board
router.get(`/:id`, async (req,res) => {
    let boards
    let posts
    let board
    try {
        //boards = await Board.find()
        console.log(req.session.currentUser)
        let user = await User.findById(req.session.currentUser.id).populate('messageBoards');
        console.log(user)
        boards = user.messageBoards;
        board = await Board.findById(req.params.id)
        posts = await Post.find({ messageBoard: board.id })
    } catch(err) {
        console.log(err)
    }
    res.render(`boards/show`, {
        boards: boards, 
        posts: posts,
        board: board
    })
})

////edit board
router.get(`/:id/edit`, async (req,res) => {
    let board 
    try {
        board = await Board.findById(req.params.id)
        board.name = req.body.name
        board.category = req.body.category
        await board.save()
        res.redirect(`/boards/${board.id}`)
    } catch {
        if (board == null){
            res.redirect(`/boards/1`)
        } else {
            res.render(`boards/edit`, {
                board: board
            })
        }
    }
})

// 61b937f8dc90c15948fd2eb8

//delete board
router.delete(`/:id`, async (req,res) => {
    let board 
    try {
        board = await Board.findById(req.params.id)
        await board.remove()
        res.redirect(`/profile/1`)
    } catch {
        if (board == null){
            res.redirect(`/`)
        } else {
            res.redirect(`/boards/${board.id}`)
        }
    }
})

module.exports = router