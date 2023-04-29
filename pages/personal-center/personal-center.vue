<template>
	<view class="content">
		<view class="top">
			<view @click="previewImage" style="margin:0 auto;width:fit-content;">
				<image  :src="avatarUrl" style="width:150rpx;height:150rpx;border-radius: 150rpx;"></image>
			</view>
			<view class="nickname">
				{{nickName}}
			</view>
		</view>
		<view class="nav-wrap">		
			<view v-for="(item,index) in navs" @click="toNav(index)" class="navs">
				<image :src="imgUrl[index]" mode="heightFix" style="height: 50rpx;position: absolute;top:25rpx;left:50rpx"></image>
				<view class="item" >
					{{item}}
				</view> 
				<view class="icon-nav">
					<image src="../static/arrow.png" mode="heightFix" style="height:50rpx;line-height: 100rpx;"></image>
				</view>
			</view>
		</view>
		<view @click="quit" style="width:200rpx;height:30rpx;border-radius: 15rpx;text-align: center;margin:0 auto;line-height: 30rpx;" class="">
			退出
		</view>
	</view>
</template>

<script>
	import config from '../../config.js';
	export default {
		data() {
			return {
				navs:['修改信息','管理文献','收藏与喜欢','建议箱','我的会员'],
				nickName:'',
				avatarUrl:'',
				navUrl:[
					'../change-info/change-info',
					'../article/article',
					'../my-collection/my-collection',
					'../suggestion/suggestion',
					'../member/member'
				],
				imgUrl:[
					'../../static/modify.png',
					'../../static/file.png',
					'../../static/collection.png',
					'../../static/suggestion.png',
					'../../static/member.png'
				],				
			}
		},
		methods: {
			toNav(e){
				console.log(e);
				uni.navigateTo({
					url:this.navUrl[e]
				})
			},
			previewImage(){
				uni.previewImage({
					urls:[this.avatarUrl],
					current:0
				})
			},
			quit(){
				uni.request({
					url:config.url+'/user/logout',
					method:'GET',
					success:(res)=>{
						uni.navigateTo({
							url:'/pages/login/login'
						})
					}
				})
			}
		},
		onLoad(){
			const nickName = uni.getStorageSync('nickName');
			const avatarUrl= uni.getStorageSync('avatarUrl');
			const image=uni.getStorageSync('image')
			console.log(nickName,avatarUrl)
			this.nickName=nickName;
			this.avatarUrl="http://8.130.109.84:8080/images/nick/"+image;
		}
	}
</script>

<style>
	.nickname{
		text-align: center;
	}
	
	.content{
		position: fixed;
		width:100%;
		height:100%;
		background-color: rgb(250, 250, 250);
	}
	
	.top{
		background-color: rgb(0, 170, 255);
		width:100%;
		box-sizing: border-box;
		padding-top: 50rpx;
		height:300rpx;
	}
	
	.profile{
		padding: 0;
		width: 150rpx;
		height: 150rpx;
		border-radius: 75rpx;
		margin:0rpx auto;
	}
	
	.nav-wrap{
		margin-top: 200rpx;
	}
	
	.navs{
		position: relative;
		width:100%;
		height:100rpx;
		border-bottom: 5rpx solid rgb(250, 250, 250);
		width:100%;
		background-color: white;
	}
	
	.item{
		line-height: 100rpx;
		position: absolute;
		left:150rpx;
		
	}
	
	.icon-nav{
		position:absolute;
		right:150rpx;
		top:50%;
		transform: translateY(-50%);
	}
</style>
