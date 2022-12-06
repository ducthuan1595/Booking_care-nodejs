import patientService from "../services/patientService";

const postBookAppointment = async (req, res) => {
  try {
    let info = await patientService.postBookAppointmentService(req.body);
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

const postVerifyBookAppointment = async (req, res) => {
  try {
    let info = await patientService.postVerifyBookAppointmentService(req.body);
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
  postBookAppointment,
  postVerifyBookAppointment,
};
