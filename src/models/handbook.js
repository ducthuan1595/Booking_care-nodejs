"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Handbooks extends Model {
    static associate(models) {
      // define association here
      // Handbooks.belongsTo(models.User, { foreignKey: "doctorId" });
    }
  }
  Handbooks.init(
    {
      contentHTML: DataTypes.TEXT("long"),
      contentMarkdown: DataTypes.TEXT("long"),
      description: DataTypes.TEXT("long"),
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Handbooks",
    }
  );
  return Handbooks;
};
