"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user = require("../../api/user.js");
require("../../util/request.js");
const _sfc_main = {
  data() {
    return {
      username: "",
      password: "",
      isApproved: ""
    };
  },
  methods: {
    changeCheckBox() {
      this.isApproved = !this.isApproved;
    },
    toProtocol() {
      common_vendor.index.navigateTo({
        url: "../protocol/protocol"
      });
    },
    handleLogin() {
      if (!this.isApproved) {
        common_vendor.index.showToast({
          title: "请选择同意用户协议",
          icon: "none"
        });
      } else {
        let params = {
          username: this.username,
          password: this.password
        };
        api_user.login(params).then((res) => {
          console.log(res);
          if (res.data.code == 1) {
            common_vendor.index.switchTab({
              url: "../index/index"
            });
            common_vendor.index.setStorageSync(
              "userId",
              res.data.data.id
            );
            common_vendor.index.setStorageSync(
              "cookie",
              res.header["Set-Cookie"]
            );
            common_vendor.index.setStorageSync(
              "username",
              res.data.data.username
            );
            common_vendor.index.setStorageSync(
              "nickName",
              res.data.data.nick
            );
            common_vendor.index.setStorageSync(
              "image",
              res.data.data.image
            );
          } else if (res.data.code == 0) {
            common_vendor.index.showToast({
              title: res.data.msg,
              icon: "error"
            });
          }
        });
      }
    },
    toRegister() {
      common_vendor.index.navigateTo({
        url: "../register/register"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.username,
    b: common_vendor.o(($event) => $data.username = $event.detail.value),
    c: $data.password,
    d: common_vendor.o(($event) => $data.password = $event.detail.value),
    e: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    f: common_vendor.o((...args) => $options.toRegister && $options.toRegister(...args)),
    g: common_vendor.o((...args) => $options.changeCheckBox && $options.changeCheckBox(...args)),
    h: $data.isApproved,
    i: common_vendor.o((...args) => $options.toProtocol && $options.toProtocol(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/hxy123/Documents/HBuilderProjects/医智搜系统/pages/login/login.vue"]]);
wx.createPage(MiniProgramPage);
