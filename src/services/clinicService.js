const db = require("../models");

const postNewClinicService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.address ||
        !data.imageBase64 ||
        !data.descHTML ||
        !data.descMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        await db.Clinics.create({
          name: data.name,
          address: data.address,
          image: data.imageBase64,
          descHTML: data.descHTML,
          descMarkdown: data.descMarkdown,
        });
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

const getAllClinicService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinics.findAll();
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = Buffer.from(item.image, "base64").toString("binary");
          return item;
        });
      }
      resolve({
        errCode: 0,
        errMessage: "Ok",
        data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailClinicService = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.Clinics.findOne({
          where: {
            id: inputId,
          },
          attributes: ["name", "address", 'image',"descHTML", "descMarkdown"],
        });
        if (data && data.image) {
          data.image = Buffer.from(data.image, "base64").toString("binary");
        }
        if (data) {
          let doctorClinic = [];
          doctorClinic = await db.Doctor_Info.findAll({
            where: {
              clinicId: inputId,
            },
            attributes: ["doctorId", "provinceId"],
          });

          // data.doctorSpecialty = doctorSpecialty;
          data = {
            ...data.dataValues,
            doctorClinic: doctorClinic,
          };
        } else {
          data = {};
        }
        resolve({
          errCode: 0,
          errMessage: "Ok",
          data,
          // doctorSpecialty
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  postNewClinicService,
  getAllClinicService,
  getDetailClinicService,
};
