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


const advertisementController = require('../api/controllers/AdvertisementController');

/***************************************************************************/
/*News Controller*/
/***************************************************************************/
router.get('/advertisement/list', advertisementController.find);
router.post('/advertisement/create', advertisementController.create);
router.get('/advertisement/:advertisementID', advertisementController.findOne);
router.put('/advertisement/:advertisementID', advertisementController.update);
router.delete('/advertisement/:advertisementID', advertisementController.delete);



module.exports = router;