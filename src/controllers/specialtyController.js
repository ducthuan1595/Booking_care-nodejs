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

const editSpecialty = async (req, res) => {
  try {
    let info = await specialtyService.editSpecialtyService(req.body);
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

const deleteSpecialty = async (req, res) => {
  try {
    console.log(req.body);
    let info = await specialtyService.deleteSpecialtyService(req.body);
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

const getDetailSpecialtyById = async (req, res) => {
  try {
    let info = await specialtyService.getDetailSpecialtyByIdServer(req.query.id, req.query.location);
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
  postNewSpecialty,
  getAllSpecialty,
  getDetailSpecialtyById,
  editSpecialty,
  deleteSpecialty
};
