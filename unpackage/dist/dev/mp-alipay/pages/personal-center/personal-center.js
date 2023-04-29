"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      navs: ["修改信息", "管理文献", "我的收藏", "建议箱"],
      nickname: "",
      navUrl: [
        "../change-info/change-info",
        "../article/article",
        "../my-collection/my-collection",
        "../suggestion/suggestion"
      ],
      imgUrl: [
        "../../static/modify.png",
        "../../static/file.png",
        "../../static/collection.png",
        "../../static/suggestion.png"
      ]
    };
  },
  methods: {
    getUserProfile() {
      common_vendor.index.showToast({
        title: "获取失败",
        icon: "error"
      });
    },
    toNav(e) {
      console.log(e);
      common_vendor.index.navigateTo({
        url: this.navUrl[e]
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.getUserProfile && $options.getUserProfile(...args)),
    b: common_vendor.t($data.nickname),
    c: common_vendor.f($data.navs, (item, index, i0) => {
      return {
        a: $data.imgUrl[index],
        b: common_vendor.t(item),
        c: common_vendor.o(($event) => $options.toNav(index))
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/hxy123/Documents/HBuilderProjects/医智搜系统/pages/personal-center/personal-center.vue"]]);
my.createPage(MiniProgramPage);
