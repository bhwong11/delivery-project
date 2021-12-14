const express = require(`express`)
const router = express.Router()



router.get(`/:id`, (req,res) => {
    res.render(`boards/show`)
})

router.get(`/:id/edit`, (req,res) => {
    res.render(`boards/edit`)
})


module.exports = router