const express = require('express');

const router = express.Router();
const viewsController = require('./../Controllers/viewsController');

router.get('/', (req, res) => {
  res.status(200).render('base', {
    tour: 'the forest Hiker',
    user: 'Ahmed Taha'
  });
});
router.get('/', viewsController.getOverview);
router.get('/tour/:slug', viewsController.getTour);

module.exports = router;
