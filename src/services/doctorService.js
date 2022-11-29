import db from "../models/index";

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

module.exports = {
  getTopDoctorHome,
};
