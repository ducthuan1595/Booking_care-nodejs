const { reject } = require("lodash");
const db = require("../models");

const postNewSpecialtyService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.name || !data.descHTML || !data.descMarkdown) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        await db.Specialty.create({
          name: data.name,
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

const getAllSpecialtyService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll();
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

const getDetailSpecialtyByIdServer = (inputId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId || !location) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.Specialty.findOne({
          where: {
            id: inputId,
          },
          attributes: ["descHTML", "descMarkdown"],
        });
        if (data) {
          let doctorSpecialty = [];
          if (location === "All") {
            doctorSpecialty = await db.Doctor_Info.findAll({
              where: {
                specialtyId: inputId,
              },
              attributes: ["doctorId", "provinceId"],
              raw: true,
              // nest: true,
              // plain: true,
              // isNewRecord: true,
            });
          } else {
            // find diff location
            doctorSpecialty = await db.Doctor_Info.findAll({
              where: {
                specialtyId: inputId,
                provinceId: location,
              },
              attributes: ["doctorId", "provinceId"],
            });
          }
          data.doctorSpecialty = doctorSpecialty;
          // data = {
          //   ...data.dataValues,
          //   doctorSpecialty: doctorSpecialty
          // }
          // data.push(...doctorSpecialty)
          // console.log("data11", data);
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
  postNewSpecialtyService,
  getAllSpecialtyService,
  getDetailSpecialtyByIdServer,
};
