"use strict";
const util_request = require("../util/request.js");
function login(query) {
  return util_request.request({
    method: "get",
    url: "/user/login",
    data: query
  });
}
exports.login = login;
