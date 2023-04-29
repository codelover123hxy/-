"use strict";
const common_vendor = require("../../common/vendor.js");
const config = require("../../config.js");
const _sfc_main = {
  data() {
    return {
      navs: ["修改信息", "管理文献", "收藏与喜欢", "建议箱", "我的会员"],
      nickName: "",
      avatarUrl: "",
      navUrl: [
        "../change-info/change-info",
        "../article/article",
        "../my-collection/my-collection",
        "../suggestion/suggestion",
        "../member/member"
      ],
      imgUrl: [
        "../../static/modify.png",
        "../../static/file.png",
        "../../static/collection.png",
        "../../static/suggestion.png",
        "../../static/member.png"
      ]
    };
  },
  methods: {
    toNav(e) {
      console.log(e);
      common_vendor.index.navigateTo({
        url: this.navUrl[e]
      });
    },
    previewImage() {
      common_vendor.index.previewImage({
        urls: [this.avatarUrl],
        current: 0
      });
    },
    quit() {
      common_vendor.index.request({
        url: config.config.url + "/user/logout",
        method: "GET",
        success: (res) => {
          common_vendor.index.navigateTo({
            url: "/pages/login/login"
          });
        }
      });
    }
  },
  onLoad() {
    const nickName = common_vendor.index.getStorageSync("nickName");
    const avatarUrl = common_vendor.index.getStorageSync("avatarUrl");
    const image = common_vendor.index.getStorageSync("image");
    console.log(nickName, avatarUrl);
    this.nickName = nickName;
    this.avatarUrl = "http://8.130.109.84:8080/images/nick/" + image;
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.avatarUrl,
    b: common_vendor.o((...args) => $options.previewImage && $options.previewImage(...args)),
    c: common_vendor.t($data.nickName),
    d: common_vendor.f($data.navs, (item, index, i0) => {
      return {
        a: $data.imgUrl[index],
        b: common_vendor.t(item),
        c: common_vendor.o(($event) => $options.toNav(index))
      };
    }),
    e: common_vendor.o((...args) => $options.quit && $options.quit(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/hxy123/Documents/HBuilderProjects/医智搜系统/pages/personal-center/personal-center.vue"]]);
wx.createPage(MiniProgramPage);
