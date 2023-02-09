const db = require("../models");

const postHandbookService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.description ||
        !data.imageBase64 ||
        !data.contentHTML ||
        !data.contentMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        await db.Handbooks.create({
          description: data.description,
          image: data.imageBase64,
          contentHTML: data.contentHTML,
          contentMarkdown: data.contentMarkdown,
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

const getHandbookServer = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Handbooks.findAll();
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
}

const getDetailHandbook = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameter'
        })
      }else {
        let data = await db.Handbooks.findOne({
          where: {
            id: id
          },
          attributes: ['image', 'description', 'contentHTML', 'contentMarkdown', 'id']
        })
        if (data && data.image) {
          data.image = Buffer.from(data.image, "base64").toString("binary");
        }
        if(data) {
          let allHandbook = [];
          allHandbook = await db.Handbooks.findAll();
          if(allHandbook) {
            allHandbook.map((item) => {
              item.image = Buffer.from(item.image, "base64").toString("binary");
              return item;
            });
          }
          data.allHandbook = allHandbook;
        }
        else {
          data = {}
        }   
        resolve({
          errCode: 0,
          errMessage: "Ok",
          data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  postHandbookService,
  getHandbookServer,
  getDetailHandbook
};