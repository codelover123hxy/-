<template>
	<view class="content">
		<view class="wrap">
			<view class="username-view">
				用户名: <label for="">{{username}}</label>
			</view>
			<view class="username-view" style="display: flex;">
				<text>昵称:</text><input @blur="handleBlur" style="padding-left: 40rpx;" placeholder="请输入昵称" v-model="nickName"> 
			</view>
			<view style="font-size: x-small;">(可编辑)</view>
			<view class="" style="display: flex;margin-top: 20rpx;">
				<view style="line-height: 80rpx">头像</view><image :src="avatarUrl"  style="margin-left: 30rpx;width:80rpx;height:80rpx;border-radius: 40rpx;"></image>
			</view>
			<view class="password-view" style="display: flex">
				<view style="line-height: 80rpx">原密码</view><input v-model="oldPwd" placeholder="填写原密码" class="password" type="password">
			</view>
			<view class="password-view" style="display: flex">
				<view style="line-height: 80rpx">新密码</view><input  v-model="newPwd" 
				placeholder="填写新密码" class="password" type="password"></view>
			<view class="password-view" style="display: flex">
				<view style="line-height: 80rpx">确认密码</view><input  v-model="rePwd" 
			placeholder="确认密码" class="password" type="password"></view>
		</view>
		<view class="submit-btn" @click="save"> 
			保存
		</view>
	</view>
</template>

<script>
	import config from '../../config.js'
	export default {
		data() {
			return {
				oldPwd:'',
				newPwd:'',
				rePwd:'',
				avatarUrl:'',
				username:'',
				nickName:''
			}
		},
		onLoad(){
			this.username=uni.getStorageSync('username');
			this.nickName=uni.getStorageSync('nickName');
			const image=uni.getStorageSync('image');
			this.avatarUrl="http://8.130.109.84:8080/images/nick/"+image;
		},
		methods: {
			handleBlur(){
				console.log(this.nickName);
				uni.request({
					url:config.url+'/user/setNick',
					method:'POST',
					data:{
						nick:this.nickName
					},
					header: {
					    'content-type': 'application/x-www-form-urlencoded',
						'Cookie':uni.getStorageSync('cookie')
					},
					success:(res)=>{
						if (res.data.code==1){
							uni.showToast({
								title:'保存昵称成功',
								icon:'success'
							})
						}
					}
				})
			},
			save(){				
				if (this.newPwd!=this.rePwd){
					uni.showToast({
						title:'两次密码不一致'
					})
				}
				else{
					if (this.newPwd!=''){
						uni.request({
							url:config.url+'/user/modify',
							method:'POST',
							header: {
								'content-type': 'application/x-www-form-urlencoded' 
							},
							data:{
								username:this.username,
								oldPassword:this.oldPwd,
								newPassword:this.newPwd
							},
							success:(res)=>{
								console.log(res);
								uni.showToast({
									title:'保存成功',
									icon:'success'
								})
							}
						})
					}
				}
			}
		}
	}
</script>

<style>
	.wrap{
		padding:30rpx;
	}
	
	.password{
		border-bottom:1rpx solid rgba(1,1,1,0.2);
		position: absolute;
		right:20rpx;
		width:500rpx;
		height:80rpx;
	}
	
	.password-view{
		height:80rpx;
	}
	
	.submit-btn{
		background-color:rgb(29, 169, 255);
		width: 500rpx;
		color:white;
		font-weight: 700;
		margin: 50rpx auto;
		height:80rpx;
		border-radius: 40rpx;
		text-align: center;
		line-height: 80rpx;
	}
</style>
