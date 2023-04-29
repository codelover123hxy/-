<template>
	<view class="content">
		<view class="" style="margin:50rpx auto;width:fit-content">
			<image src="../../static/logo.jpg" mode="heightFix" style="height: 300rpx"></image>
		</view>
		<view class="">
			<input v-model="username" type="text"  class="text" placeholder="请输入用户名">
			<input v-model="pwd" type="password" class="text" placeholder="请输入密码">
			<input v-model="rePwd" type="password" class="text" placeholder="请输入重复密码">
		</view>
		<view class="register-btn" @click="handleRegister">
			注册
		</view>
		<view class="tip" @click="toLogin">
			已经有账号，去登录
		</view>
	</view>
</template>

<script>
	import config from '../../config.js';
	export default {
		data() {
			return {
				username:'',
				pwd:'',
				rePwd:''
			}
		},
		methods: {
			toLogin(){
				uni.navigateBack();
			},
			handleRegister(){
				if (this.pwd!=this.rePwd){
					uni.showToast({
						title:'两次密码不一致',
						icon:'none'
					})
				}
				else{
					uni.request({
						url:config.url+'/user/register/verifyUsername?username='+this.username,
						method:'GET',
						success:(res)=>{
							console.log(res);
							if (res.data.code==0){
								uni.showToast({
									title:res.data.msg,
									icon:'error'
								})
							}
							else if (res.data.code==1){
								uni.request({
									url:config.url + '/user/register',
									header: {
										'content-type': 'application/x-www-form-urlencoded' 
									},
									method:'POST',
									data:{
										username:this.username,
										password:this.pwd
									},
									success:(res)=>{
										console.log(res);
										uni.showToast({
											title:'注册成功',
											icon:'success'
										})
										uni.navigateBack();
									}
								})
							}
						}
					})	
				}
			}
		}
	}
</script>

<style>
	.content{
		padding-top: 100rpx;
	}
	
	.text{
		background-color: rgb(240, 240, 240);
		height:70rpx;
		line-height: 70rpx;
		width:600rpx;
		margin:20rpx auto;
		padding-left: 60rpx;
		box-sizing: border-box;
	}
	
	.tip{
		text-align: center;
		font-size: small;
		color:royalblue;
	}
	
	.register-btn{
		border-radius: 10rpx;
		height:80rpx;
		width: 600rpx;
		background-color: rgb(255, 70, 73);
		color:white;
		font-weight: 700;
		text-align: center;
		margin:50rpx auto;
		line-height: 80rpx;
	}
</style>
