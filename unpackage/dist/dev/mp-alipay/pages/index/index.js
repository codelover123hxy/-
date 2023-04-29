"use strict";
const common_vendor = require("../../common/vendor.js");
const config = require("../../config.js");
const _sfc_main = {
  data() {
    return {
      avatarUrl: "",
      nickName: "",
      btnName: "",
      fontWeight1: "",
      fontWeight2: "",
      articles: "",
      rotation: [
        {
          id: 1,
          url: "../../static/logo-swiper.jpg"
        },
        {
          id: 2,
          url: "../../static/index.png"
        },
        {
          id: 3,
          url: "../../static/personal-center.png"
        }
      ]
    };
  },
  onLoad() {
  },
  methods: {
    search() {
      common_vendor.index.navigateTo({
        url: "../search/search"
      });
    },
    getHotArticles() {
      this.fontWeight1 = 700;
      this.fontWeight2 = 400;
      common_vendor.index.request({
        url: config.config.url + "/article/hot",
        success: (res) => {
          console.log(res.data.data.records);
          this.articles = res.data.data.records;
        }
      });
    },
    getLatestArticles() {
      this.fontWeight1 = 400;
      this.fontWeight2 = 700;
      common_vendor.index.request({
        url: config.config.url + "/article/new",
        success: (res) => {
          console.log(res.data.data.records);
          this.articles = res.data.data.records;
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.rotation, (item, k0, i0) => {
      return {
        a: item.url,
        b: item.id
      };
    }),
    b: $data.fontWeight1,
    c: common_vendor.o((...args) => $options.getHotArticles && $options.getHotArticles(...args)),
    d: $data.fontWeight2,
    e: common_vendor.o((...args) => $options.getLatestArticles && $options.getLatestArticles(...args)),
    f: common_vendor.f($data.articles, (item, index, i0) => {
      return {
        a: common_vendor.t(item.filename),
        b: common_vendor.t(item.author != null ? item.author : "不详"),
        c: common_vendor.t(item.click),
        d: common_vendor.t(item.favorite),
        e: common_vendor.t(item.likes),
        f: common_vendor.t(item.updateTime)
      };
    }),
    g: common_vendor.o((...args) => $options.search && $options.search(...args)),
    h: $data.avatarUrl,
    i: common_vendor.o((...args) => _ctx.onChooseAvatar && _ctx.onChooseAvatar(...args)),
    j: common_vendor.o((...args) => _ctx.onNickName && _ctx.onNickName(...args)),
    k: $data.nickName,
    l: common_vendor.o(($event) => $data.nickName = $event.detail.value)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/hxy123/Documents/HBuilderProjects/医智搜系统/pages/index/index.vue"]]);
my.createPage(MiniProgramPage);
