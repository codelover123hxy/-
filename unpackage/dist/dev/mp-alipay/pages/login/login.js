"use strict";
const common_vendor = require("../../common/vendor.js");
const config = require("../../config.js");
const _sfc_main = {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    handleLogin() {
      common_vendor.index.request({
        url: config.config.url + "/user/login?username=" + this.username + "&password=" + this.password,
        method: "GET",
        success: (res) => {
          console.log(res);
          common_vendor.index.switchTab({
            url: "../index/index"
          });
        }
      });
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
    f: common_vendor.o((...args) => $options.toRegister && $options.toRegister(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/hxy123/Documents/HBuilderProjects/医智搜系统/pages/login/login.vue"]]);
my.createPage(MiniProgramPage);
