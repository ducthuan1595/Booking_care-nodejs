import db from "../models/index";
import _ from "lodash";
import emailService from '../services/emailService';
require("dotenv").config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

const getTopDoctorHome = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limit,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.AllCode,
            as: "positionData",
            attributes: ["value_en", "value_vi"],
          },
          {
            model: db.AllCode,
            as: "genderData",
            attributes: ["value_en", "value_vi"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllDoctorServer = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          //bo password and image
          exclude: ["password", "image"],
        },
      });
      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let checkRequiredFields = (inputData) => {
  let arr = [
    "doctorId",
    "contentHTML",
    "contentMarkdown",
    "action",
    "selectedPrice",
    "selectedPayment",
    "selectedProvince",
    "nameClinic",
    "addressClinic",
    // "note",
    "specialtyId",
  ];
  let isValid = true;
  let element = "";
  for (let i = 0; i < arr.length; i++) {
    if (!inputData[arr[i]]) {
      isValid = false;
      element = arr[i];
      break;
    }
  }
  return {
    isValid,
    element,
  };
};
const saveDetailInforDoctors = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkObj = checkRequiredFields(inputData);
      if (checkObj.isValid === false) {
        resolve({
          errCode: 1,
          errMessage: `Missing required parameter: ${checkObj.element}`,
        });
      } else {
        //upset to markdown
        if (inputData.action === "CREATE") {
          await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
            doctorId: inputData.doctorId,
          });
        } else if (inputData.action === "EDIT") {
          let markdown = await db.Markdown.findOne({
            where: { doctorId: inputData.doctorId },
            raw: false,
          });
          if (markdown) {
            markdown.contentHTML = inputData.contentHTML;
            markdown.contentMarkdown = inputData.contentMarkdown;
            markdown.description = inputData.description;
            markdown.doctorId = inputData.doctorId;
            markdown.updateAt = new Date();
            await markdown.save();
          }
        }
        //upset to doctor info table
        let doctorInfo = await db.Doctor_info.findOne({
          where: {
            doctorId: inputData.doctorId,
          },
          raw: false,
        });
        if (doctorInfo) {
          //update
          doctorInfo.doctorId = inputData.doctorId;
          doctorInfo.priceId = inputData.selectedPrice;
          doctorInfo.provinceId = inputData.selectedProvince;
          doctorInfo.paymentId = inputData.selectedPayment;
          doctorInfo.addressClinic = inputData.addressClinic;
          doctorInfo.nameClinic = inputData.nameClinic;
          doctorInfo.note = inputData.note;
          doctorInfo.specialtyId = inputData.specialtyId;
          doctorInfo.clinicId = inputData.clinicId;

          await doctorInfo.save();
        } else {
          await db.Doctor_info.create({
            doctorId: inputData.doctorId,
            priceId: inputData.selectedPrice,
            provinceId: inputData.selectedProvince,
            paymentId: inputData.selectedPayment,
            addressClinic: inputData.addressClinic,
            nameClinic: inputData.nameClinic,
            note: inputData.note,
            specialtyId: inputData.specialtyId,
            clinicId: inputData.clinicId,
          });
        }
        resolve({
          errCode: 0,
          errMessage: "Save info doctor success",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailDoctorByIdServer = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.User.findOne({
          where: { id: id },
          //attributes(remote cac truong k can thiet)
          attributes: {
            exclude: ["password"],
          },
          //relationship(get infor of itself cung voi infor dk call in include)
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"], //only get infor has in attributes
            },
            {
              model: db.AllCode,
              as: "positionData",
              attributes: ["value_en", "value_vi"],
            },
            {
              model: db.Doctor_info,
              attributes: {
                exclude: ["id", "doctorId"], //remove attribute when receive data
              },
              include: [
                //only get info has in attributes
                {
                  model: db.AllCode,
                  as: "priceTypeData",
                  attributes: ["value_en", "value_vi"],
                },
                {
                  model: db.AllCode,
                  as: "provinceTypeData",
                  attributes: ["value_en", "value_vi"],
                },
                {
                  model: db.AllCode,
                  as: "paymentTypeData",
                  attributes: ["value_en", "value_vi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true, //lam beautiful code
        });
        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }
        if (!data) data = {};
        resolve({
          errCode: 0,
          data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const bulkCreateScheduleService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule && !data.doctorId && !data.formatedDate) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            return item;
          });
        }
        //get all date existing
        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.formatedDate },
          attributes: ["doctorId", "date", "timeType", "maxNumber"],
          raw: true,
        });

        //compare different time
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }

        resolve({
          errCode: 0,
          errMessage: "Ok",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getScheduleByDateService = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let data = await db.Schedule.findAll({
          where: {
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.AllCode,
              as: "timeTypeData",
              attributes: ["value_vi", "value_en"],
            },
            {
              model: db.User,
              as: "doctorData",
              attributes: ["firstName", "lastName"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!data) data = [];
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getExtraInfoDoctorByIdService = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.Doctor_info.findOne({
          where: {
            doctorId: doctorId,
          },
          attributes: {
            exclude: ["id", "doctorId"], //remove attribute when receive data
          },
          include: [
            //only get info has in attributes
            {
              model: db.AllCode,
              as: "priceTypeData",
              attributes: ["value_en", "value_vi"],
            },
            {
              model: db.AllCode,
              as: "provinceTypeData",
              attributes: ["value_en", "value_vi"],
            },
            {
              model: db.AllCode,
              as: "paymentTypeData",
              attributes: ["value_en", "value_vi"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!data) data = {};
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getProfileInfoDoctorService = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let data = await db.User.findOne({
          where: { id: doctorId },
          //attributes(remote cac field k nessery)
          attributes: {
            exclude: ["password"],
          },
          //relationship(get info of itself cung voi info dk call in include)
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"], //only get infor has in attributes
            },
            {
              model: db.AllCode,
              as: "positionData",
              attributes: ["value_en", "value_vi"],
            },
            {
              model: db.Doctor_info,
              attributes: {
                exclude: ["id", "doctorId"], //remove attribute when receive data
              },
              include: [
                //only get info has in attributes
                {
                  model: db.AllCode,
                  as: "priceTypeData",
                  attributes: ["value_en", "value_vi"],
                },
                {
                  model: db.AllCode,
                  as: "provinceTypeData",
                  attributes: ["value_en", "value_vi"],
                },
                {
                  model: db.AllCode,
                  as: "paymentTypeData",
                  attributes: ["value_en", "value_vi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true, //lam beautiful code
        });
        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }
        if (!data) data = {};
        resolve({
          errCode: 0,
          data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllListPatientForDoctor = (doctorId, date) => {
  return new Promise(async(resolve, reject) => {
    try {
      if(!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        let data = await db.Booking.findAll({
          where: {
            doctorId: doctorId,
            date: date,
            statusId: 'S2'
          },
          include: [
            {
              model: db.User, as: 'patientData',
              attributes: ['email', 'firstName', 'address', 'gender'],
              include: [
                {model: db.AllCode, as: 'genderData', attributes: ['value_en', 'value_vi']}
              ]
            },
            {
                model: db.AllCode, as: 'timeTypeDataPatient', attributes: ['value_en', 'value_vi']
            }
          ],
          raw: false,
          nest: true
        })
        resolve({
          errCode: 0,
          data
        })
      }
    } catch (e) {
      reject(e);
    }
  })
}

let sendRemedyService = (data) => {
  return new Promise(async (resolve, reject) => {
    try{
      if(!data.doctorId || !data.patientId || !data.email ||!data.timeType) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameter'
        })
      }else {
        // update patient status
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            statusId: 'S2'
          },
          raw: false,
        });
        // console.log('appointment', appointment)
        if(appointment) {
          appointment.statusId = 'S3';
          await appointment.save();
        }
        // send email remedy
        // console.log('check server', data)
        await emailService.sendAttachment(data)
        resolve({
          errCode: 0,
          errMessage: 'Ok'
        })
      }
    }catch(e) {
      reject(e)
    }
  })
}

module.exports = {
  getTopDoctorHome,
  getAllDoctorServer,
  saveDetailInforDoctors,
  getDetailDoctorByIdServer,
  bulkCreateScheduleService,
  getScheduleByDateService,
  getExtraInfoDoctorByIdService,
  getProfileInfoDoctorService,
  getAllListPatientForDoctor,
  sendRemedyService
};
