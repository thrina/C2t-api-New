const express = require('express');
const router = express.Router();

const authConroller = require('../api/controllers/AuthConroller');

/***************************************************************************/
/*Auth Controller*/
/***************************************************************************/
router.post('/myaccount/signup', authConroller.signup);
router.post('/myaccount/login', authConroller.login);


/***************************************************************************/

const userConroller = require('../api/controllers/UserConroller');

/***************************************************************************/
/*Users Controller*/
/***************************************************************************/
router.get('/user/list', userConroller.find);
router.get('/myaccount/:userID', userConroller.findOne);
router.put('/myaccount/:userID', userConroller.update);
router.delete('/myaccount/:userID', userConroller.delete);


/***************************************************************************/


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
/*Event Controller*/
/***************************************************************************/
router.get('/event/list', eventController.find);
router.post('/event/create', eventController.create);
router.get('/event/:eventID', eventController.findOne);
router.put('/event/:eventID', eventController.update);
router.delete('/event/:eventID', eventController.delete);


/***************************************************************************/


const advertisementController = require('../api/controllers/AdvertisementController');

/***************************************************************************/
/*Advertisement Controller*/
/***************************************************************************/
router.get('/advertisement/list', advertisementController.find);
router.post('/advertisement/create', advertisementController.create);
router.get('/advertisement/:advertisementID', advertisementController.findOne);
router.put('/advertisement/:advertisementID', advertisementController.update);
router.delete('/advertisement/:advertisementID', advertisementController.delete);


/***************************************************************************/


const categoryController = require('../api/controllers/CategoryController');

/***************************************************************************/
/*Category Controller*/
/***************************************************************************/
router.get('/category/list', categoryController.find);
router.post('/category/create', categoryController.create);
router.get('/category/:categoryID', categoryController.findOne);
router.put('/category/:categoryID', categoryController.update);
router.delete('/category/:categoryID', categoryController.delete);


/***************************************************************************/


const talentController = require('../api/controllers/TalentsController');

/***************************************************************************/
/*Talent Controller*/
/***************************************************************************/
router.get('/talent/list', talentController.find);
router.post('/talent/create', talentController.create);
router.get('/talent/:talentID', talentController.findOne);
router.put('/talent/:talentID', talentController.update);
router.delete('/talent/:talentID', talentController.delete);



module.exports = router;