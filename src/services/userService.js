const db = require("../models");
import bcrypt from 'bcryptjs';

let handleUserLogin = (email, password) => {
  return new Promise(async(resolve,reject) => {
    try{
      let userData = {};
      let isExit = await checkUserEmail(email);
      if(isExit) {
        let user = await db.User.findOne({
          where: { email: email},
          attributes: ['email', 'roleId', 'password'],
          raw: true,
        })
        if(user){
          // compare password
          let check = await bcrypt.compareSync(password, user.password);
          if(check){
            userData.errCode = 0;
            userData.errMessage = 'OK';
            delete user.password;
            userData.user = user;
          }else {
            userData.errCode = 3;
            userData.errMessage = 'Wrong password';
          }
        }else {
          userData.errCode = 2;
          userData.errMessage = `User's not found`;
        }
      }else {
        userData.errCode= 1;
        userData.errMessage = 'Your email is not unvalid email!'
      }
      resolve(userData)
    }catch(e){
      reject(e);
    }
  })
}

let checkUserEmail = (email) => {
  return new Promise(async(resolve, reject) => {
    try{
      let user = await db.User.findOne({
        where: { email: email}
      });
      if(user) {
        resolve(true)
      }else {
        resolve(false)
      }
    }catch(e){
      reject(e);
    }
  })
}

module.exports = {
  handleUserLogin,
  checkUserEmail
}