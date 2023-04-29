"use strict";
const common_vendor = require("../../common/vendor.js");
const config = require("../../config.js");
const _sfc_main = {
  data() {
    return {
      username: "",
      pwd: "",
      rePwd: ""
    };
  },
  methods: {
    toLogin() {
      common_vendor.index.navigateBack();
    },
    handleRegister() {
      if (this.pwd != this.rePwd) {
        common_vendor.index.showToast({
          title: "两次密码不一致",
          icon: "none"
        });
      } else {
        common_vendor.index.request({
          url: config.config.url + "/user/register/verifyUsername?username=" + this.username,
          method: "GET",
          success: (res) => {
            console.log(res);
            if (res.data.code == 0) {
              common_vendor.index.showToast({
                title: res.data.msg,
                icon: "error"
              });
            } else if (res.data.code == 1) {
              common_vendor.index.request({
                url: config.config.url + "/user/register",
                header: {
                  "content-type": "application/x-www-form-urlencoded"
                },
                method: "POST",
                data: {
                  username: this.username,
                  password: this.pwd
                },
                success: (res2) => {
                  console.log(res2);
                  common_vendor.index.showToast({
                    title: "注册成功",
                    icon: "success"
                  });
                  common_vendor.index.navigateBack();
                }
              });
            }
          }
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.username,
    b: common_vendor.o(($event) => $data.username = $event.detail.value),
    c: $data.pwd,
    d: common_vendor.o(($event) => $data.pwd = $event.detail.value),
    e: $data.rePwd,
    f: common_vendor.o(($event) => $data.rePwd = $event.detail.value),
    g: common_vendor.o((...args) => $options.handleRegister && $options.handleRegister(...args)),
    h: common_vendor.o((...args) => $options.toLogin && $options.toLogin(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/hxy123/Documents/HBuilderProjects/医智搜系统/pages/register/register.vue"]]);
wx.createPage(MiniProgramPage);
