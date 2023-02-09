import handbookService from '../services/handbookService';

const postHandbook = async (req, res) => {
  try {
    let info = await handbookService.postHandbookService(req.body);
    return res.status(200).json({
      info,
    });
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server!",
    });
  }
};

const getHandbook = async(req, res) => {
  try {
    let info = await handbookService.getHandbookServer()
    return res.status(200).json({info})
  }catch(e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server!"
    })
  }
}

const getDetailHandbook = async(req, res) => {
  try {
    let info = await handbookService.getDetailHandbook(req.query.id)
    return res.status(200).json({info})
  }catch(e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server!"
    })
  }
}

module.exports = {
  postHandbook,
  getHandbook,
  getDetailHandbook
}