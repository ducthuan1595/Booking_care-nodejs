import db from '../models/index';
import CRUDService from '../services/CRUDService';

let getHomePage = async (req, res) => {
  try {
    let data =  await db.User.findAll();
    // console.log(data);
    return res.render('homePage.ejs', {
      data: JSON.stringify(data)
    });
  } catch (e){
    console.log(e);
  }
}

let getCRUD = async (req, res) => {
  return res.render('crud.ejs')
}

let postCRUD = async (req, res) => {
  let message =  await CRUDService.createNewUser(req.body);
  console.log(message);
  return res.send('post crud')
}

let getDisplayCRUD = async (req, res) => {
  let data = await CRUDService.getAllUser();
  // console.log(data);
  return res.render('displayCRUD.ejs', {
    data: data,
  })
}

let getEditCRUD = async (req, res)=> {
  let id = req.query.id;
  if (id) {
    let userData = await CRUDService.getUserInforById(id);
    if(userData) {

    }
    console.log(userData)
    return res.render('editCRUD.ejs', {
      userData: userData,
    })
  } else {
    return res.send('User not found')
  }
}

let putCRUD = async (req, res)=> {
  let data = req.body;
  let allUser =  await CRUDService.updateUserData(data);
  return res.render('displayCRUD.ejs', {
    data: allUser,
  })
}

let deleteCRUD = async(req, res)=> {
  let id = req.query.id;
  console.log(id)
  if(id){
    await CRUDService.deleteUserById(id);
    return res.send('delete user')

  }else {
    return res.send('user not found!')
  }
}

module.exports = {
  getHomePage,
  getCRUD,
  postCRUD,
  getDisplayCRUD,
  getEditCRUD,
  putCRUD,
  deleteCRUD,
}