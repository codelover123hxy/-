"use strict";
const common_vendor = require("../../common/vendor.js");
const config = require("../../config.js");
const _sfc_main = {
  data() {
    return {
      details: "",
      filename: "",
      pages: ""
    };
  },
  methods: {
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
    join(str, key) {
      var reg = new RegExp(`(${key})`, "gm");
      var replace = '<span style="color:#FD463E;font-weight:bold;">$1</span>';
      return str.replace(reg, replace);
    }
  },
  onLoad: function(option) {
    const filename = option.filename;
    this.filename = filename;
    const keyword = option.keyword;
    common_vendor.index.request({
      url: config.config.url + "/dataPdf/detail?page=1&pageSize=10&keyWord=" + keyword + "&filename=" + filename,
      method: "GET",
      success: (res) => {
        console.log(res);
        this.pages = res.data.data.pages;
        this.details = res.data.data.records;
        res.data.data.records.forEach((item, index) => {
          let that = this;
          item.dividedDataAboutKeyWord.forEach((item2, index2) => {
            if (item2.includes(keyword)) {
              item.dividedDataAboutKeyWord[index2] = that.join(item2, keyword);
            }
          });
        });
        const details = res.data.data.records;
        let obj = [];
        let map = {};
        details.forEach((item, index) => {
          if (!map[item["page"]]) {
            map[item["page"]] = [item];
          } else {
            map[item["page"]].push(item);
          }
        });
        Object.keys(map).forEach((key) => {
          obj.push({
            ["page"]: key,
            list: map[key]
          });
        });
        console.log(obj);
        this.details = obj;
      }
    });
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.filename),
    b: common_vendor.o(($event) => $options.download($data.filename)),
    c: common_vendor.t($data.pages),
    d: common_vendor.f($data.details, (item, index, i0) => {
      return {
        a: common_vendor.t(index + 1),
        b: common_vendor.t(item.page),
        c: common_vendor.f(item.list, (item2, index2, i1) => {
          return {
            a: common_vendor.f(item2.dividedDataAboutKeyWord, (item3, index3, i2) => {
              return {
                a: item3
              };
            }),
            b: common_vendor.t(item2.type === 1 ? "来源于图片" : "来源于文字")
          };
        })
      };
    }),
    e: common_vendor.o(($event) => $options.preview($data.filename))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/hxy123/Documents/HBuilderProjects/医智搜系统/pages/detail/detail.vue"]]);
wx.createPage(MiniProgramPage);
