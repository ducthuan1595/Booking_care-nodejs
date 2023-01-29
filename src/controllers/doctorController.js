import doctorService from "../services/doctorService";

let getHomeDoctor = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10;
  try {
    let response = await doctorService.getTopDoctorHome(+limit);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getAllDoctor = async (req, res) => {
  try {
    let doctors = await doctorService.getAllDoctorServer();
    return res.status(200).json(doctors);
  } catch (e) {
    console.log(e);
    return res.state(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

const postInforDoctors = async (req, res) => {
  try {
    let response = await doctorService.saveDetailInforDoctors(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

const getDetailDoctorById = async (req, res) => {
  try {
    let infor = await doctorService.getDetailDoctorByIdServer(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

const postBulkCreateSchedule = async (req, res) => {
  try {
    let infor = await doctorService.bulkCreateScheduleService(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

const getScheduleByDate = async (req, res) => {
  try {
    let infor = await doctorService.getScheduleByDateService(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server!",
    });
  }
};

const getExtraInfoDoctorById = async (req, res) => {
  try {
    let info = await doctorService.getExtraInfoDoctorByIdService(
      req.query.doctorId
    );
    return res.status(200).json({
      info,
    });
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

const getProfileInfoDoctor = async (req, res) => {
  try {
    let info = await doctorService.getProfileInfoDoctorService(
      req.query.doctorId
    );
    return res.status(200).json({
      info,
    });
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};
const getAllListPatientForDoctor = async (req, res) => {
  try {
    let info = await doctorService.getAllListPatientForDoctor(req.query.doctorId, req.query.date);
    return res.status(200).json({
      info
    })
  } catch (e) {
    console.log(e)
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error From the server"
    })
  }
}

module.exports = {
  getHomeDoctor,
  getAllDoctor,
  postInforDoctors,
  getDetailDoctorById,
  postBulkCreateSchedule,
  getScheduleByDate,
  getExtraInfoDoctorById,
  getProfileInfoDoctor,
  getAllListPatientForDoctor
};
