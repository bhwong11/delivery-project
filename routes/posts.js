const express = require(`express`)
const router = express.Router()
const Board = require(`../models/MessageBoard`)
const Post = require(`../models/Post`)
const User = require(`../models/User`)
const imageMimeTypes = ['image/jpg', 'image/png']

////new Post
router.get(`/new`, async (req,res) => {
    try {
        let user = await User.findById(req.session.currentUser.id).populate('messageBoards');
        const boards = user.messageBoards;
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
    const post = new Post({
        title: req.body.title,
        content: req.body.content, 
        date_created: new Date(req.body.date_created),
        user: req.session.currentUser._id,
        messageBoard: req.body.messageBoard,
    })
    savePostImg(post, req.body.postImg)
    try {
        const newPost = await post.save()
        res.redirect(`/boards/${req.body.messageBoard}`)
    } catch (err) {
        console.log(err)
        console.log('req.body.board',req.body.messageBoard)
        res.render(`posts/new`, {
            post: post,
            boards: [req.body.messageBoard]
        })
    }
})



router.get(`/:id/edit`, (req,res) => {
    res.render(`posts/edit`)
})

//delete post
router.delete(`/:id`, async (req,res) => {
    let post 
    try {
        post = await Post.findById(req.params.id)
        await post.remove()
        res.redirect(`/boards/${boardId}`)
    } catch {
        if (post != null) {
            res.render(`posts/show`, {
                post: post, 
                errorMessage: `Could not remove post`
            })
        } else {
            console.log(`THIS IS HITTING THE ERROR!!!`)
            res.redirect(`/boards/1`)
        }
    }
})

function savePostImg(post, postImgEncoded){
    if(postImgEncoded == null) return
    const postImg = JSON.parse(postImgEncoded)
    if (postImg != null && imageMimeTypes.includes(postImg.type)){
        post.postImage = new Buffer.from(postImg.data, `base64`)
        post.postImageType = postImg.type 
    }
}

module.exports = router