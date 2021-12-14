const express = require(`express`)
const router = express.Router()



router.get(`/:id`, (req,res) => {
    res.render(`profile/show`)
})

router.get(`/:id/edit`, (req,res) => {
    res.render(`profile/edit`)
})


module.exports = router