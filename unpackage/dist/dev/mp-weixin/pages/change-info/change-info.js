"use strict";
const common_vendor = require("../../common/vendor.js");
const config = require("../../config.js");
const _sfc_main = {
  data() {
    return {
      oldPwd: "",
      newPwd: "",
      rePwd: "",
      avatarUrl: "",
      username: "",
      nickName: ""
    };
  },
  onLoad() {
    this.username = common_vendor.index.getStorageSync("username");
    this.nickName = common_vendor.index.getStorageSync("nickName");
    const image = common_vendor.index.getStorageSync("image");
    this.avatarUrl = "http://8.130.109.84:8080/images/nick/" + image;
  },
  methods: {
    handleBlur() {
      console.log(this.nickName);
      common_vendor.index.request({
        url: config.config.url + "/user/setNick",
        method: "POST",
        data: {
          nick: this.nickName
        },
        header: {
          "content-type": "application/x-www-form-urlencoded",
          "Cookie": common_vendor.index.getStorageSync("cookie")
        },
        success: (res) => {
          if (res.data.code == 1) {
            common_vendor.index.showToast({
              title: "保存昵称成功",
              icon: "success"
            });
          }
        }
      });
    },
    save() {
      if (this.newPwd != this.rePwd) {
        common_vendor.index.showToast({
          title: "两次密码不一致"
        });
      } else {
        if (this.newPwd != "") {
          common_vendor.index.request({
            url: config.config.url + "/user/modify",
            method: "POST",
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            data: {
              username: this.username,
              oldPassword: this.oldPwd,
              newPassword: this.newPwd
            },
            success: (res) => {
              console.log(res);
              common_vendor.index.showToast({
                title: "保存成功",
                icon: "success"
              });
            }
          });
        }
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.username),
    b: common_vendor.o((...args) => $options.handleBlur && $options.handleBlur(...args)),
    c: $data.nickName,
    d: common_vendor.o(($event) => $data.nickName = $event.detail.value),
    e: $data.avatarUrl,
    f: $data.oldPwd,
    g: common_vendor.o(($event) => $data.oldPwd = $event.detail.value),
    h: $data.newPwd,
    i: common_vendor.o(($event) => $data.newPwd = $event.detail.value),
    j: $data.rePwd,
    k: common_vendor.o(($event) => $data.rePwd = $event.detail.value),
    l: common_vendor.o((...args) => $options.save && $options.save(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/hxy123/Documents/HBuilderProjects/医智搜系统/pages/change-info/change-info.vue"]]);
wx.createPage(MiniProgramPage);
