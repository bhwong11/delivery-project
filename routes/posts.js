const express = require(`express`)
const router = express.Router()



router.get(`/new`, (req,res) => {
    res.render(`posts/new`)
})

router.get(`/:id/edit`, (req,res) => {
    res.render(`posts/edit`)
})


module.exports = router