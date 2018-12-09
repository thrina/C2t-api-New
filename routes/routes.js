const express = require('express');
const router = express.Router();
const newsController = require('../api/controllers/NewsController');

/***************************************************************************/
/*News Controller*/
/***************************************************************************/
router.get('/news/list', newsController.find);
router.post('/news/create', newsController.create);
router.get('/news/:newsID', newsController.findOne);
router.put('/news/:newsID', newsController.update);
router.delete('/news/:newsID', newsController.delete);


module.exports = router;