const express = require(`express`)
const router = express.Router()
const Board = require(`../models/MessageBoard`)
const Post = require(`../models/Post`)

////new Post
router.get(`/new`, (req,res) => {
    res.render(`posts/new`, { post: new Post() })
})
////create Post
router.post(`/`, async (req,res) => {
    console.log(req.body)
    const post = new Post({
        title: req.body.title,
        content: req.body.content
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