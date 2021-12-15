const express = require(`express`);
const router = express.Router();

router.get(`/`, (req, res) => {
  res.render(`meditation/feelings`);
});

router.get(`/spotify`, (req, res) => {
  res.render(`meditation/spotify`);
});

router.get(`/breathing`, (req, res) => {
  res.render(`meditation/breathing`);
});

module.exports = router;
