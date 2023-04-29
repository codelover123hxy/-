"use strict";
const common_vendor = require("../../common/vendor.js");
const config = require("../../config.js");
const _sfc_main = {
  data() {
    return {
      searchMethods: "",
      results: [],
      content: "",
      title: "",
      author: "",
      keyword: ""
    };
  },
  onLoad(option) {
  },
  methods: {
    handleSearch() {
      common_vendor.index.request({
        url: config.config.url + "/search/comSearch?title=" + this.title + "&content=" + this.content + "&author=" + this.author + "&keyword=" + this.keyword + "&page=1&pageSize=100",
        method: "GET",
        success: (res) => {
          console.log(res);
          if (res.data.code == 1)
            this.results = res.data.data.records;
          else {
            common_vendor.index.showToast({
              title: res.data.msg,
              icon: "error"
            });
          }
        }
      });
    },
    multiSearch() {
      this.searchMethods = 0;
      this.results = [];
    },
    searchByImage() {
      this.searchMethods = 1;
      this.results = [];
    },
    previewImg(imageUrl, index) {
      console.log(imageUrl);
      let imgs = [];
      this.results.forEach((item, index2) => {
        imgs.push("http://8.130.109.84:8080/images/pdfImg/" + item.picName);
      });
      common_vendor.index.previewImage({
        urls: imgs,
        current: index
        //点击图片传过来的下标
      });
    },
    beforeRead(e) {
      const { file, callback } = e.detail;
      console.log(file.url);
      common_vendor.index.showLoading({
        title: "图片正在上传"
      });
      common_vendor.index.getStorageSync("userId");
      common_vendor.index.uploadFile({
        url: config.config.url + "/search/imageSearch",
        filePath: file.url,
        name: "file",
        header: {
          "Cookie": common_vendor.index.getStorageSync("cookie")
        },
        success: (res) => {
          console.log(JSON.parse(res.data));
          common_vendor.index.hideLoading();
          if (JSON.parse(res.data).code == 1) {
            this.results = JSON.parse(res.data).data;
          }
        }
      });
    },
    afterRead(e) {
      console.log(e);
    },
    preview(name) {
      console.log(name);
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
    download(name) {
      console.log(name);
      common_vendor.index.showLoading({
        title: "正在下载"
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
              common_vendor.index.showToast({
                title: "下载成功",
                icon: "success"
              });
            }
          });
        }
      });
    },
    like(item) {
      const filename = item.filename;
      const userId = common_vendor.index.getStorageSync("userId");
      common_vendor.index.request({
        url: config.config.url + "/article/approve",
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          filename,
          userId
        },
        success: (res) => {
          console.log(res);
          if (res.data.code == 1) {
            if (res.data.data == "喜欢成功") {
              item.likeCount++;
            } else if (res.data.data == "取消喜欢") {
              item.likeCount--;
            }
          }
        }
      });
    },
    click(item) {
      const filename = item.filename;
      const keyword = this.content;
      common_vendor.index.request({
        url: config.config.url + "/article/click?filename=" + filename + "&keyword" + keyword,
        method: "POST",
        success: (res) => {
          console.log(res);
          if (res.data.code == 1) {
            item.clickCount++;
          }
        }
      });
    },
    favor(item) {
      const filename = item.filename;
      const userId = common_vendor.index.getStorageSync("userId");
      common_vendor.index.request({
        url: config.config.url + "/article/star",
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          filename,
          userId
        },
        success: (res) => {
          console.log(res);
          if (res.data.code == 1) {
            if (res.data.code == 1) {
              if (res.data.data == "收藏成功") {
                common_vendor.index.showToast({
                  title: res.data.data,
                  icon: "success"
                });
                item.favoriteCount++;
              } else if (res.data.data == "取消收藏") {
                item.favoriteCount--;
                common_vendor.index.showToast({
                  title: res.data.data,
                  icon: "success"
                });
              }
            }
          }
        }
      });
    }
  }
};
if (!Array) {
  const _component_van_uploader = common_vendor.resolveComponent("van-uploader");
  _component_van_uploader();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.multiSearch && $options.multiSearch(...args)),
    b: common_vendor.o((...args) => $options.searchByImage && $options.searchByImage(...args)),
    c: $data.searchMethods == 1
  }, $data.searchMethods == 1 ? common_vendor.e({
    d: common_vendor.o($options.beforeRead),
    e: common_vendor.o($options.afterRead),
    f: common_vendor.o(($event) => _ctx.fileList = $event),
    g: common_vendor.p({
      capture: "camera",
      accept: "image/*",
      previewImage: "true",
      type: "primary",
      uploadIcon: "plus",
      uploadText: "图片搜索",
      useBeforeRead: true,
      showUpload: true,
      modelValue: _ctx.fileList
    }),
    h: $data.searchMethods == 1
  }, $data.searchMethods == 1 ? {
    i: common_vendor.f($data.results, (item, index, i0) => {
      return {
        a: common_vendor.t(item.filename),
        b: ["http://8.130.109.84:8080/images/pdfImg/" + item.picName],
        c: common_vendor.o(($event) => $options.previewImg(item.picName, index))
      };
    })
  } : {}) : {}, {
    j: $data.searchMethods == 0
  }, $data.searchMethods == 0 ? common_vendor.e({
    k: $data.content,
    l: common_vendor.o(($event) => $data.content = $event.detail.value),
    m: $data.title,
    n: common_vendor.o(($event) => $data.title = $event.detail.value),
    o: $data.author,
    p: common_vendor.o(($event) => $data.author = $event.detail.value),
    q: $data.keyword,
    r: common_vendor.o(($event) => $data.keyword = $event.detail.value),
    s: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    t: $data.searchMethods == 0
  }, $data.searchMethods == 0 ? {
    v: common_vendor.f($data.results, (item, index, i0) => {
      return {
        a: common_vendor.t(item.filename.length > 18 ? item.filename.substring(0, 18) + "…" : item.filename),
        b: common_vendor.t(item.likeCount),
        c: common_vendor.o(($event) => $options.like(item)),
        d: common_vendor.t(item.clickCount),
        e: common_vendor.t(item.favoriteCount),
        f: common_vendor.o(($event) => $options.favor(item)),
        g: common_vendor.o(($event) => $options.download(item.filename)),
        h: common_vendor.o(($event) => $options.preview(item.filename)),
        i: common_vendor.t(item.abs.length > 300 ? item.abs.substring(0, 300) : item.abs),
        j: common_vendor.o(($event) => $options.click(item))
      };
    })
  } : {}) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/hxy123/Documents/HBuilderProjects/医智搜系统/pages/advanced-search/advanced-search.vue"]]);
wx.createPage(MiniProgramPage);
