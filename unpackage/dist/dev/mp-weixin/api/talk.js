"use strict";
const util_request = require("../util/request.js");
function getPost(query) {
  return util_request.request({
    method: "get",
    url: "/question/list",
    data: query
  });
}
exports.getPost = getPost;
