import clinicService from '../services/clinicService';

const postNewClinic = async (req, res) => {
  try {
    let info = await clinicService.postNewClinicService(req.body);
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

const getAllClinic = async(req, res) => {
  try {
    let info = await clinicService.getAllClinicService();
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
}

const getDetailClinicById = async(req, res) => {
  try {
    let info = await clinicService.getDetailClinicService(req.query.id);
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
}

module.exports = {
  postNewClinic,
  getAllClinic,
  getDetailClinicById,
}