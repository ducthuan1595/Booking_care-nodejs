import specialtyService from "../services/specialtyService";

const postNewSpecialty = async (req, res) => {
  try {
    let info = await specialtyService.postNewSpecialtyService(req.body);
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

const getAllSpecialty = async (req, res) => {
  try {
    let info = await specialtyService.getAllSpecialtyService();
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

module.exports = {
  postNewSpecialty,
  getAllSpecialty,
};
