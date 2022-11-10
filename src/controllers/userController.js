import userService from '../services/userService';

let handleLogin = async (req, res)=> {
  let email = req.body.email;
  let password = req.body.password;
  if(!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: 'Unvalid input'
    })
  }

  let userData = await userService.handleUserLogin(email, password)

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {}
  })
}

let handleGetAllUsers = async (req, res)=> {
  let id = req.query.id;
  if(!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: 'Not found required paremeters',
      users: []
    })
  }
  let users = await userService.getAllUsers(id);
  console.log(users)

  return res.status(200).json({
    errCode: 0,
    errMessage: 'ok',
    users
  })
}

let handleCreateNewUser = async (req, res) => {
  let message = await userService.createNewUser(req.body);
  return res.status(200).json(message)
}

let hanldeEditUser = async (req, res) => {
  let data = req.body;
  let message = await userService.updateUserData(data);
  return res.status(200).json(message);
}

let hanldeDeleteUser = async (req, res) => {
  if(!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: 'Id not found exist!'
    })
  }
  let message = await userService.deleteUser(req.body.id);
  return res.status(200).json(message)
}

module.exports = {
  handleLogin,
  handleGetAllUsers,
  handleCreateNewUser,
  hanldeEditUser,
  hanldeDeleteUser,
}