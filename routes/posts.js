const express = require(`express`)
const router = express.Router()
const Board = require(`../models/MessageBoard`)
const Post = require(`../models/Post`)

////new Post
router.get(`/new`, async (req,res) => {
    try {
        const boards = await Board.find({})
        const params = { 
            boards: boards,
            post: new Post()
        }
        res.render(`posts/new`, params)
    } catch {
        res.redirect(`/posts`)
    }
})
////create Post
router.post(`/`, async (req,res) => {
    console.log(`!! ATENTION !!`)
    console.log(req.body)
    const post = new Post({
        title: req.body.title,
        content: req.body.content, 
        date_created: new Date(req.body.date_created),
        user: req.session.currentUser,
        messageBoard: req.body.board
    })
    try {
        const newPost = await post.save()
        res.redirect(`boards/1`)
    } catch (err) {
        console.log(err)
        res.render(`posts/new`, {
            post: post
        })
    }
})


router.get(`/:id/edit`, (req,res) => {
    res.render(`posts/edit`)
})


module.exports = router


/////New Book
router.get(`/new`, async (req,res) => { 
    renderNewPage(res, new Book())
})

