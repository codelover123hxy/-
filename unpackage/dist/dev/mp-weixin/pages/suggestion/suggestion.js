"use strict";
const common_vendor = require("../../common/vendor.js");
const config = require("../../config.js");
const _sfc_main = {
  data() {
    return {
      suggestion: "",
      suggestions: "",
      isShow: "",
      query: {
        page: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    submitSuggestion() {
      const userId = common_vendor.index.getStorageSync("userId");
      common_vendor.index.request({
        url: config.config.url + "/advise/post",
        method: "POST",
        data: {
          userId,
          content: this.suggestion
        },
        success: (res) => {
          console.log(res);
          if (res.data.code == 1) {
            common_vendor.index.showToast({
              title: "发送成功",
              icon: "success"
            });
          }
        }
      });
    }
  },
  onLoad(option) {
    common_vendor.index.request({
      url: config.config.url + "/advise/list?page=" + this.query.page + "&pageSize=" + this.query.pageSize,
      method: "GET",
      success: (res) => {
        console.log(res);
        if (res.data.code == 1)
          this.suggestions = res.data.data.records;
      }
    });
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.suggestions, (item, index, i0) => {
      return {
        a: common_vendor.t(item.content),
        b: common_vendor.t(item.reply != "" ? item.reply : "未处理")
      };
    }),
    b: common_vendor.o(($event) => $data.isShow = true),
    c: $data.isShow
  }, $data.isShow ? {
    d: $data.suggestion,
    e: common_vendor.o(($event) => $data.suggestion = $event.detail.value),
    f: common_vendor.t($data.suggestion.length),
    g: common_vendor.o((...args) => $options.submitSuggestion && $options.submitSuggestion(...args)),
    h: common_vendor.o(() => {
    })
  } : {}, {
    i: common_vendor.o(($event) => $data.isShow = false)
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/hxy123/Documents/HBuilderProjects/医智搜系统/pages/suggestion/suggestion.vue"]]);
wx.createPage(MiniProgramPage);
