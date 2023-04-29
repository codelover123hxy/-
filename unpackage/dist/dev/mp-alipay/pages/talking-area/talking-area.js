"use strict";
const common_vendor = require("../../common/vendor.js");
const config = require("../../config.js");
const _sfc_main = {
  data() {
    return {
      postList: "",
      isShow: "",
      isCommentViewShow: "",
      content: "",
      comment: "",
      currentPostId: ""
    };
  },
  methods: {
    clickPost(index) {
      const id = this.postList[index].id;
      common_vendor.index.request({
        url: config.config.url + "/question/click",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: {
          questionId: id
        },
        success: (res) => {
          console.log(res);
          this.postList[index].click++;
        }
      });
    },
    likePost(index) {
      const id = this.postList[index].id;
      common_vendor.index.request({
        url: config.config.url + "/question/approve",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: {
          questionId: id
        },
        success: (res) => {
          console.log(res);
          this.postList[index].likes++;
        }
      });
    },
    deletePost(index) {
      const postId = this.postList[index].id;
      common_vendor.index.showModal({
        title: "提示",
        cancelText: "取消",
        confirmText: "确认",
        showCancel: true,
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.request({
              url: config.config.url + "/question/deleteQuestion?questionId=" + postId,
              method: "DELETE",
              success: (res2) => {
                console.log(res2);
                common_vendor.index.showToast({
                  title: "删除成功",
                  icon: "success"
                });
                this.postList.splice(index, 1);
              }
            });
          }
        }
      });
    },
    likeComment(index, index2) {
      const commentId = this.postList[index].comment[index2].id;
      common_vendor.index.request({
        url: config.config.url + "/comment/approve",
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          commentId
        },
        success: (res) => {
          console.log(res);
          this.postList[index].comment[index2].likes++;
        }
      });
    },
    deleteComment(index, index2) {
      const commentId = this.postList[index].comment[index2].id;
      common_vendor.index.showModal({
        title: "提示",
        cancelText: "取消",
        confirmText: "确认",
        showCancel: true,
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.request({
              url: config.config.url + "/comment/delete?commentId=" + commentId,
              method: "DELETE",
              success: (res2) => {
                common_vendor.index.showToast({
                  title: "删除成功",
                  icon: "success"
                });
                this.postList[index].comment.splice(index2, 1);
              }
            });
          }
        }
      });
    },
    showComment(index) {
      console.log(config.config.url);
      this.postList[index].id;
      if (this.postList[index].btnName == "查看评论") {
        common_vendor.index.request({
          url: config.config.url + "/comment/list?questionId=1632352104556711937&page=1&pageSize=10",
          method: "GET",
          success: (res) => {
            console.log(res);
            this.postList[index].comment = res.data.data.records;
            this.postList[index].btnName = "收起评论";
          }
        });
        common_vendor.index.request({
          url: config.config.url + "/comment/total?questionId=1632352104556711937",
          method: "GET",
          success: (res) => {
            console.log(res);
            let totalComment = res.data.data;
            this.postList[index].totalComment = totalComment;
          }
        });
      } else if (this.postList[index].btnName == "收起评论") {
        this.postList[index].btnName = "查看评论";
      }
    },
    submitPost() {
      common_vendor.index.request({
        url: config.config.url + "/question/postQuestion",
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          content: this.content,
          userId: "",
          username: ""
        },
        success: (res) => {
          console.log(res);
        }
      });
    },
    submitComment() {
      common_vendor.index.request({
        url: config.config.url + "/comment/postComment",
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {
          content: this.comment,
          userId: "",
          questionId: this.currentPostId
        },
        success: (res) => {
          console.log(res);
          this.isCommentViewShow = false;
        }
      });
    }
  },
  onPullDownRefresh() {
    common_vendor.index.startPullDownRefresh({
      success: () => {
      }
    });
  },
  created() {
    this.isShow = false;
    common_vendor.index.request({
      url: "http://8.130.109.84:8080/question/list?page=1&pageSize=10",
      method: "GET",
      success: (res) => {
        console.log(res);
        this.postList = res.data.data.records;
        console.log(this.postList);
        this.postList.forEach((item, index) => {
          console.log(item);
          item.btnName = "查看评论";
          item.likeStatus = "../../static/like.png";
        });
      }
    });
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.postList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.userName),
        b: common_vendor.t(item.click),
        c: common_vendor.o(($event) => $options.deletePost(index)),
        d: common_vendor.t(item.time),
        e: common_vendor.t(item.content),
        f: item.likeStatus,
        g: item.likes != 0
      }, item.likes != 0 ? {
        h: common_vendor.t(item.likes)
      } : {}, {
        i: common_vendor.o(($event) => $options.likePost(index)),
        j: common_vendor.o(($event) => {
          $data.isCommentViewShow = !$data.isCommentViewShow;
          this.currentPostId = index;
        }),
        k: common_vendor.o(($event) => $options.clickPost(index)),
        l: common_vendor.t(item.btnName),
        m: item.btnName == "收起评论"
      }, item.btnName == "收起评论" ? {
        n: common_vendor.t(item.totalComment)
      } : {}, {
        o: common_vendor.o(($event) => $options.showComment(index)),
        p: item.btnName == "收起评论"
      }, item.btnName == "收起评论" ? {
        q: common_vendor.f(item.comment, (item2, index2, i1) => {
          return common_vendor.e({
            a: common_vendor.t(item2.time),
            b: common_vendor.t(item2.content),
            c: item2.likes != 0
          }, item2.likes != 0 ? {
            d: common_vendor.t(item2.likes)
          } : {}, {
            e: common_vendor.o(($event) => $options.likeComment(index, index2)),
            f: common_vendor.o(($event) => $options.deleteComment(index, index2))
          });
        })
      } : {});
    }),
    b: common_vendor.o(($event) => this.isShow = true),
    c: $data.isShow
  }, $data.isShow ? {
    d: common_vendor.o(($event) => this.isShow = false),
    e: $data.content,
    f: common_vendor.o(($event) => $data.content = $event.detail.value),
    g: common_vendor.o((...args) => $options.submitPost && $options.submitPost(...args))
  } : {}, {
    h: $data.isCommentViewShow
  }, $data.isCommentViewShow ? {
    i: $data.comment,
    j: common_vendor.o(($event) => $data.comment = $event.detail.value),
    k: common_vendor.o((...args) => $options.submitComment && $options.submitComment(...args)),
    l: common_vendor.o(() => {
    })
  } : {}, {
    m: common_vendor.o(($event) => $data.isCommentViewShow = false)
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/hxy123/Documents/HBuilderProjects/医智搜系统/pages/talking-area/talking-area.vue"]]);
my.createPage(MiniProgramPage);
