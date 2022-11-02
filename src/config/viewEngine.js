import express from 'express'; //new version
//const express = require('express'); old version

let configViewEngine = (app)=> {
  app.use(express.static('./src/public'));
  app.set('view engine', 'ejs');
  app.set('views', './src/views')
}

module.exports = configViewEngine;