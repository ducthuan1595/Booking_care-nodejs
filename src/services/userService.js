const db = require("../models");
import bcrypt from "bcryptjs";

var salt = bcrypt.genSaltSync(10);

let hashUserPassword = async (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};
//login api
let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExit = await checkUserEmail(email);
      if (isExit) {
        let user = await db.User.findOne({
          where: { email: email },
          attributes: ["email", "roleId", "password", "firstName", "lastName"],
          raw: true,
        });
        if (user) {
          // compare password
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "OK";
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Wrong password";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = `User's not found`;
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = "Your email is not unvalid email!";
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: email },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // check email has exist?
      let check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          erroCode: 1,
          errMessage: "Your email is not availible!",
        });
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: hashPasswordFromBcrypt,
          gender: data.gender,
          address: data.address,
          roleId: data.roleId,
          positionId: data.positionId,
          phoneNumber: data.phoneNumber,
        });
        resolve({
          errCode: 0,
          message: "OK",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userFound = await db.User.findOne({
        //findOne() support by sequelize(API reference)
        where: { id: id },
      });
      if (!userFound) {
        resolve({
          errCode: 2,
          errMesage: "User not found!",
        });
      }
      await db.User.destroy({
        where: { id: id },
      });
      resolve({
        errCode: 0,
        errMessage: "Delete user successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing required param",
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        console.log(user);
        await user.save();
        // await db.User.save({
        //   firstName: data.firstName,
        //   lastName: data.lastName.
        //   address = data.address,
        // })
        resolve({
          errCode: 0,
          message: "Update user successfuly",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "User not found",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          erroCode: 1,
          errMessage: "Not Found parameters!",
        });
      } else {
        let res = {}; //data
        let allCode = await db.AllCode.findAll({
          where: { type: typeInput },
        }); //findeAll() is method of sequelize
        res.errCode = 0; //errCode dk define in getAllcode().json
        res.data = allCode;
        resolve(res);
      }
    } catch (e) {
      reject(e); //resquest from getAllcode() /userController.js
    }
  });
};

//export to userController.js
module.exports = {
  handleUserLogin,
  checkUserEmail,
  getAllUsers,
  createNewUser,
  deleteUser,
  updateUserData,
  getAllCodeService,
};
