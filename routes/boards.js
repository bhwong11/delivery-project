const express = require(`express`)
const router = express.Router()

router.get(`/new`, (req,res) => {
    res.render(`boards/new`)
})

router.get(`/:id`, (req,res) => {
    res.render(`boards/show`)
})

router.get(`/:id/edit`, (req,res) => {
    res.render(`boards/edit`)
})


module.exports = router