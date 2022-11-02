import db from "../models/index";
var bcrypt = require("bcryptjs");

var salt = bcrypt.genSaltSync(10);

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordFromBcrypt = await hashUserPassword(data.password);
      await db.User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashPasswordFromBcrypt,
        gender: data.genderId === '1' ? true : false,
        address: data.address,
        roleId: data.roleId,
        phoneNumber: data.phoneNumber,
      });
      resolve('ok create a new user successfully');
      console.log(hashPasswordFromBcrypt);
    } catch (e) {
      reject(e);
    }
  });
};

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

let getAllUser = () => {
  return new Promise( async(resolve, reject) => {
    try{
      let user = db.User.findAll({
        raw: true,
      })
      resolve(user)
    }catch(e){
      reject(e)
    }
  })
}

let getUserInforById = (id) => {
  return new Promise( async(resolve, reject)=> {
    try{
      let user = await db.User.findOne({
        where: {id: id},
        raw: true,
      })
      if(user){
        resolve(user)
      }
    }catch(e){
      reject(e);
    }
  })
}

let updateUserData = (data) => {
  return new Promise( async(resolve, reject)=> {
    try{
      let user = await db.User.findOne({
        where: {id : data.id},
      })
      if(user){
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.phoneNumber = data.phoneNumber;

        await user.save();
        let allUser = await db.User.findAll();
        resolve(allUser);
      }else {
        resolve();
      }
    }catch(e){
      reject(e);
    }
  })
}
let deleteUserById = (id) => {
  return new Promise(async(resolve, reject)=> {
    try{
      let user = await db.User.findOne({
        where: { id : id}
      })
      if(user){
        await user.destroy();
      }
      resolve();
    }catch(e){
      reject(e)
    }
  })
}

module.exports = {
  createNewUser,
  getAllUser,
  getUserInforById,
  updateUserData,
  deleteUserById,
};
