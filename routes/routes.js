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


/***************************************************************************/


const eventController = require('../api/controllers/EventController');

/***************************************************************************/
/*News Controller*/
/***************************************************************************/
router.get('/event/list', eventController.find);
router.post('/event/create', eventController.create);
router.get('/event/:eventID', eventController.findOne);
router.put('/event/:eventID', eventController.update);
router.delete('/event/:eventID', eventController.delete);


/***************************************************************************/


const advitismentsController = require('../api/controllers/AdvitismentController');

/***************************************************************************/
/*News Controller*/
/***************************************************************************/
router.get('/advitisment/list', advitismentsController.find);
router.post('/advitisment/create', advitismentsController.create);
router.get('/advitisment/:advitismentID', advitismentsController.findOne);
router.put('/advitisment/:advitismentID', advitismentsController.update);
router.delete('/advitisment/:advitismentID', advitismentsController.delete);



module.exports = router;