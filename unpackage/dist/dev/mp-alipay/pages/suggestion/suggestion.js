"use strict";
const common_vendor = require("../../common/vendor.js");
const config = require("../../config.js");
const _sfc_main = {
  data() {
    return {
      suggestion: ""
    };
  },
  methods: {
    submitSuggestion() {
      common_vendor.index.request({
        url: config.config.url + "/advise/post",
        method: "POST",
        data: {
          userId: "",
          content: this.suggestion
        },
        success: (res) => {
          console.log(res);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.suggestion,
    b: common_vendor.o(($event) => $data.suggestion = $event.detail.value),
    c: common_vendor.t($data.suggestion.length),
    d: common_vendor.o((...args) => $options.submitSuggestion && $options.submitSuggestion(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/hxy123/Documents/HBuilderProjects/医智搜系统/pages/suggestion/suggestion.vue"]]);
my.createPage(MiniProgramPage);
