"use strict";
const common_vendor = require("../../common/vendor.js");
const config = require("../../config.js");
const _sfc_main = {
  data() {
    return {
      fileList: [],
      articles: []
    };
  },
  onLoad(option) {
    const userId = common_vendor.index.getStorageSync("userId");
    console.log(userId);
    common_vendor.index.request({
      url: config.config.url + "/article/getOwnFile?page=1&pageSize=20&userId=" + userId,
      method: "GET",
      header: {
        "Cookie": common_vendor.index.getStorageSync("cookie")
      },
      success: (res) => {
        console.log(res);
        if (res.data.code == 1) {
          this.articles = res.data.data.records;
        } else if (res.data.code == 0) {
          common_vendor.index.showToast({
            title: res.data.msg,
            icon: "error"
          });
        }
      }
    });
  },
  methods: {
    previewPdf(name) {
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
    beforeRead(e) {
      const { file, callback } = e.detail;
      console.log(file.url);
      common_vendor.index.showLoading({
        title: "正在上传"
      });
      const userId = common_vendor.index.getStorageSync("userId");
      common_vendor.index.uploadFile({
        url: config.config.url + "/common/newUpload",
        filePath: file.url,
        name: "file",
        formData: {
          "userId": userId
        },
        header: {
          "Cookie": common_vendor.index.getStorageSync("cookie")
        },
        success: (res) => {
          console.log(res);
          if (JSON.parse(res.data).code == 1) {
            common_vendor.index.showToast({
              title: "上传成功",
              icon: "success"
            });
            common_vendor.index.hideLoading();
            common_vendor.index.request({
              url: config.config.url + "/article/getOwnFile?page=1&pageSize=20&userId=" + userId,
              method: "GET",
              header: {
                "Cookie": common_vendor.index.getStorageSync("cookie")
              },
              success: (res2) => {
                console.log(res2);
                if (res2.data.code == 1) {
                  this.articles = res2.data.data.records;
                } else if (res2.data.code == 0) {
                  common_vendor.index.showToast({
                    title: res2.data.msg,
                    icon: "error"
                  });
                }
              }
            });
          }
        }
      });
    },
    afterRead(e) {
      console.log(e);
    }
  }
};
if (!Array) {
  const _component_van_uploader = common_vendor.resolveComponent("van-uploader");
  _component_van_uploader();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.beforeRead),
    b: common_vendor.o($options.afterRead),
    c: common_vendor.o(($event) => $data.fileList = $event),
    d: common_vendor.p({
      accept: "",
      type: "primary",
      uploadIcon: "plus",
      uploadText: "上传pdf",
      useBeforeRead: true,
      showUpload: true,
      modelValue: $data.fileList
    }),
    e: common_vendor.f($data.articles, (item, index, i0) => {
      return {
        a: common_vendor.t(item.filename),
        b: common_vendor.t(item.likes),
        c: common_vendor.t(item.click),
        d: common_vendor.t(item.favorite),
        e: common_vendor.o(($event) => $options.previewPdf(item.filename))
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/hxy123/Documents/HBuilderProjects/医智搜系统/pages/article/article.vue"]]);
wx.createPage(MiniProgramPage);
