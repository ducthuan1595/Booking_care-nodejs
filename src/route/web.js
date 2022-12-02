import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";

let router = express.Router();
let initWebRouters = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD); //create a new user
  router.get("/get-crud", homeController.getDisplayCRUD); //display infor user
  router.get("/edit-crud", homeController.getEditCRUD); //edit infor user
  router.post("/put-crud", homeController.putCRUD); //show edited infor user
  router.get("/delete-crud", homeController.deleteCRUD);

  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.hanldeEditUser);
  router.delete("/api/delete-user", userController.hanldeDeleteUser);
  router.get("/api/allcode", userController.getAllcode); //get all user

  //api doctor
  router.get("/api/top-doctor-home", doctorController.getHomeDoctor);
  router.get("/api/get-all-doctors", doctorController.getAllDoctor);
  router.post("/api/save-infor-doctors", doctorController.postInforDoctors);

  router.get(
    "/api/get-detail-doctor-by-id",
    doctorController.getDetailDoctorById
  );
  router.post(
    "/api/bulk-create-schedule",
    doctorController.postBulkCreateSchedule
  );
  router.get(
    "/api/get-schedule-doctor-by-date",
    doctorController.getScheduleByDate
  );

  return app.use("/", router);
};

module.exports = initWebRouters;
