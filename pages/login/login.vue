<template>
	<view class="content">
		<view class="" style="margin:50rpx auto;width:fit-content">
			<image src="../../static/mylogo.jpg" mode="heightFix" style="height: 250rpx"></image>
		</view>
		<view class="">
			<view class="" style="display: flex;">
				<input v-model="username" type="text"  class="text" placeholder="请输入用户名">
			</view>
			<view class="" style="display: flex;">
				<input v-model="password" type="password" class="text" placeholder="请输入密码">
			</view>
			
		</view>
		<view class="login-btn" @click="handleLogin">
			登录
		</view>
		<view class="tip" @click="toRegister">
			还没有账号，去注册
		</view>
		<view class="foot">
			<label>
				<checkbox @click="changeCheckBox" :checked="isApproved"/>
			</label>
			<view style="display: inline;">已阅读并同意医智搜<text @click="toProtocol" style="color:red">《用户协议》</text></view>
		</view>
	</view>
</template>
<script>
	import {login} from '@/api/user.js'
	import config from '../../config.js';
	
	export default {
		data() {
			return {
				username:'',
				password:'',
				isApproved:''
			}
		},
		methods: {
			changeCheckBox(){
				this.isApproved=!this.isApproved;
			},
			toProtocol(){
				uni.navigateTo({
					url:'../protocol/protocol'
				})
			},
			handleLogin(){
				if (!this.isApproved){
					uni.showToast({
						title:'请选择同意用户协议',
						icon:'none'
					})
				}
				else{
					let params={
						username:this.username,
						password:this.password
					}
					login(params).then(res=>{
						console.log(res)
						if (res.data.code==1){
							uni.switchTab({
								url:'../index/index'
							})
							uni.setStorageSync(
								'userId',res.data.data.id
							)
							uni.setStorageSync(
								'cookie', res.header["Set-Cookie"]
							)
							uni.setStorageSync(
								'username', res.data.data.username
							)
							uni.setStorageSync(
								'nickName', res.data.data.nick
							)
							uni.setStorageSync(
								'image', res.data.data.image
							)
						}
						else if(res.data.code==0){
							uni.showToast({
								title:res.data.msg,
								icon:'error'
							})
						}
					})
					// uni.request({
					// 	url: config.url + '/user/login?username=' + this.username + '&password=' + this.password,
					// 	method:'GET',
					// 	success:(res)=>{
					// 		console.log(res);
					// 		if (res.data.code==1){
					// 			uni.switchTab({
					// 				url:'../index/index'
					// 			})
					// 			uni.setStorageSync(
					// 				'userId',res.data.data.id
					// 			)
					// 			uni.setStorageSync(
					// 				'cookie', res.header["Set-Cookie"]
					// 			)
					// 		}
					// 		else if(res.data.code==0){
					// 			uni.showToast({
					// 				title:res.data.msg,
					// 				icon:'error'
					// 			})
					// 		}
					// 	}
					// })
				}
			},
			toRegister(){
				uni.navigateTo({
					url:'../register/register'
				})
			}
		}
	}
</script>

<style>
	.foot{
		margin:100rpx auto;
		width: fit-content;
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
	
	.login-btn{
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
