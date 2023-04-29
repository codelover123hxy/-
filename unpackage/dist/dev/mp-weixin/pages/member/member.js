"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      avatarUrl: "",
      nickName: "",
      price: "",
      priorities: [
        "无限次数搜索",
        "图片匹配搜索",
        "个性化上传"
      ]
    };
  },
  created() {
    this.avatarUrl = common_vendor.index.getStorageSync("avatarUrl");
    this.nickName = common_vendor.index.getStorageSync("nickName");
  },
  methods: {
    setPrice(n) {
      if (n == 1) {
        this.price = "15";
      } else if (n == 2) {
        this.price = "30";
      } else if (n == 3) {
        this.price = "80";
      }
    },
    pay() {
      if (this.price == "") {
        common_vendor.index.showToast({
          title: "请选择会员时长",
          icon: "none"
        });
      } else {
        common_vendor.index.showModal({
          content: "是否支付" + this.price + "元会员费",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.showToast({
                title: "支付成功",
                icon: "success"
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
    a: $data.avatarUrl,
    b: common_vendor.t($data.nickName),
    c: common_vendor.o(($event) => $options.setPrice(1)),
    d: common_vendor.o(($event) => $options.setPrice(2)),
    e: common_vendor.o(($event) => $options.setPrice(3)),
    f: common_vendor.f($data.priorities, (item, index, i0) => {
      return {
        a: common_vendor.t(item)
      };
    }),
    g: common_vendor.t($data.price),
    h: common_vendor.o((...args) => $options.pay && $options.pay(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/hxy123/Documents/HBuilderProjects/医智搜系统/pages/member/member.vue"]]);
wx.createPage(MiniProgramPage);
