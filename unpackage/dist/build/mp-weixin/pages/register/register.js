"use strict";const e=require("../../common/vendor.js"),s=require("../../config.js"),t={data:()=>({username:"",pwd:"",rePwd:""}),methods:{toLogin(){e.index.navigateBack()},handleRegister(){this.pwd!=this.rePwd?e.index.showToast({title:"两次密码不一致",icon:"none"}):e.index.request({url:s.config.url+"/user/register/verifyUsername?username="+this.username,method:"GET",success:t=>{console.log(t),0==t.data.code?e.index.showToast({title:t.data.msg,icon:"error"}):e.index.request({url:s.config.url+"/user/register",header:{"content-type":"application/x-www-form-urlencoded"},method:"POST",data:{username:this.username,password:this.pwd},success:s=>{console.log(s),e.index.showToast({title:"注册成功",icon:"success"}),e.index.navigateBack()}})}})}}};const o=e._export_sfc(t,[["render",function(s,t,o,r,n,a){return{a:n.username,b:e.o((e=>n.username=e.detail.value)),c:n.pwd,d:e.o((e=>n.pwd=e.detail.value)),e:n.rePwd,f:e.o((e=>n.rePwd=e.detail.value)),g:e.o(((...e)=>a.handleRegister&&a.handleRegister(...e))),h:e.o(((...e)=>a.toLogin&&a.toLogin(...e)))}}]]);wx.createPage(o);
