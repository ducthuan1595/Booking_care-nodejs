import express from 'express';
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';

let router = express.Router();
let initWebRouters = (app)=> {
  router.get('/', homeController.getHomePage);
  router.get('/crud', homeController.getCRUD);
  router.post('/post-crud', homeController.postCRUD);//create a new user
  router.get('/get-crud', homeController.getDisplayCRUD);//display infor user
  router.get('/edit-crud', homeController.getEditCRUD);//edit infor user
  router.post('/put-crud', homeController.putCRUD);//show edited infor user
  router.get('/delete-crud', homeController.deleteCRUD);

  router.post('/api/login', userController.handleLogin);

  return app.use('/', router);
}

module.exports = initWebRouters;