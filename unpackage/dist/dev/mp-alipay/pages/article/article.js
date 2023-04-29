"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  methods: {
    chooseWeChatMessage() {
      common_vendor.index.chooseMessageFile({
        count: 10,
        type: "type",
        success: (res) => {
          const tempFiles = res.tempFiles;
          console.log(res.tempFiles);
          if (res.type = "file") {
            common_vendor.index.openDocument({
              filePath: tempFiles[0].path,
              showMenu: false,
              success: (res2) => {
                console.log("打开文档成功");
              }
            });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.chooseWeChatMessage && $options.chooseWeChatMessage(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/hxy123/Documents/HBuilderProjects/医智搜系统/pages/article/article.vue"]]);
my.createPage(MiniProgramPage);
