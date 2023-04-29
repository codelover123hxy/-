"use strict";
const common_vendor = require("../../common/vendor.js");
const config = require("../../config.js");
const _sfc_main = {
  data() {
    return {
      favorites: "",
      fontWeight1: "",
      fontWeight2: ""
    };
  },
  methods: {
    getDetail(index) {
      const name = this.favorites[index].fileName;
      common_vendor.index.showLoading({
        title: "加载中"
      });
      common_vendor.index.downloadFile({
        url: config.config.url + "/common/download?name=" + name,
        success: (res) => {
          console.log(res);
          if (res.statusCode === 200) {
            console.log("下载成功");
            common_vendor.index.hideLoading();
          }
          common_vendor.index.saveFile({
            tempFilePath: res.tempFilePath,
            success: function(save) {
              common_vendor.index.openDocument({
                filePath: save.savedFilePath,
                fileType: "pdf",
                showMenu: "true",
                success: function(open) {
                  console.log(open);
                }
              });
            }
          });
        }
      });
    },
    getFavors() {
      const userId = common_vendor.index.getStorageSync("userId");
      this.fontWeight1 = 700;
      this.fontWeight2 = 400;
      console.log(userId);
      common_vendor.index.request({
        url: config.config.url + "/star/list?userId=" + userId + "&page=1&pageSize=10",
        method: "GET",
        success: (res) => {
          console.log(res);
          if (res.data.code == 1) {
            this.favorites = res.data.data.records;
          } else if (res.data.code == 0) {
            this.favorites = [];
          }
        }
      });
    },
    getLikes() {
      const userId = common_vendor.index.getStorageSync("userId");
      this.fontWeight1 = 400;
      this.fontWeight2 = 700;
      console.log(userId);
      common_vendor.index.request({
        url: config.config.url + "/like/list?userId=" + userId + "&page=1&pageSize=10",
        method: "GET",
        success: (res) => {
          console.log(res);
          if (res.data.code == 1) {
            this.favorites = res.data.data.records;
          } else if (res.data.code == 0) {
            this.favorites = [];
          }
        }
      });
    }
  },
  onLoad(option) {
    this.getFavors();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.fontWeight1,
    b: common_vendor.o((...args) => $options.getFavors && $options.getFavors(...args)),
    c: $data.fontWeight2,
    d: common_vendor.o((...args) => $options.getLikes && $options.getLikes(...args)),
    e: $data.favorites.length == 0
  }, $data.favorites.length == 0 ? {
    f: common_vendor.t($data.fontWeight1 == 700 ? "收藏" : "喜欢")
  } : {}, {
    g: common_vendor.f($data.favorites, (item, index, i0) => {
      return {
        a: common_vendor.t(item.fileName.length > 16 ? item.fileName.substring(0, 16) + "…" : item.fileName),
        b: common_vendor.o(($event) => $options.getDetail(index))
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/hxy123/Documents/HBuilderProjects/医智搜系统/pages/my-collection/my-collection.vue"]]);
wx.createPage(MiniProgramPage);
