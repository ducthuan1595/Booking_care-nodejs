"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Markdown extends Model {
    static associate(models) {
      // define association here
    }
  }
  Markdown.init(
    {
      contentHTM: DataTypes.TEXT("long"),
      contentMardown: DataTypes.TEXT("long"),
      description: DataTypes.TEXT("long"),
      doctorId: DataTypes.INTEGER,
      specialtyId: DataTypes.INTEGER,
      clinicId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Markdown",
    }
  );
  return Markdown;
};
