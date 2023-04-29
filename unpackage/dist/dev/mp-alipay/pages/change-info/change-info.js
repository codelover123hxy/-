"use strict";
const common_vendor = require("../../common/vendor.js");
const config = require("../../config.js");
const _sfc_main = {
  data() {
    return {
      oldPwd: "",
      newPwd: "",
      rePwd: ""
    };
  },
  methods: {
    save() {
      if (this.newPwd != this.rePwd) {
        common_vendor.index.showToast({
          title: "两次密码不一致"
        });
      } else {
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
              title: "修改成功",
              icon: "success"
            });
          }
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.oldPwd,
    b: common_vendor.o(($event) => $data.oldPwd = $event.detail.value),
    c: $data.newPwd,
    d: common_vendor.o(($event) => $data.newPwd = $event.detail.value),
    e: $data.rePwd,
    f: common_vendor.o(($event) => $data.rePwd = $event.detail.value),
    g: common_vendor.o((...args) => $options.save && $options.save(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/hxy123/Documents/HBuilderProjects/医智搜系统/pages/change-info/change-info.vue"]]);
my.createPage(MiniProgramPage);
