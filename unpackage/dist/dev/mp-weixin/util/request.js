"use strict";
const common_vendor = require("../common/vendor.js");
const request = (config) => {
  config.url = "http://8.130.109.84:8080" + config.url;
  if (!config.data) {
    config.data = {};
  }
  console.log(JSON.stringify(config.data));
  let promise = new Promise(function(resolve, reject) {
    common_vendor.index.request(config).then((responses) => {
      if (responses[0]) {
        reject({ message: "网络超时" });
      } else {
        resolve(responses);
      }
    }).catch((error) => {
      reject(error);
    });
  });
  return promise;
};
exports.request = request;
