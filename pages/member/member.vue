<template>
	<view class="content">
		<view class="user-profile">
			<image :src="avatarUrl" mode="heightFix" style="height:60rpx;border-radius: 30rpx;"></image>
			<text style="color:white;margin-left: 20rpx;">{{nickName}}</text>
			<text style="font-size: small;margin-left: 20rpx;">开通会员，享受无限搜索，上传个性化文件</text >
			<view class="crown">
				<image src="../../static/priority.png" mode="heightFix" style="height: 80rpx;"></image>
			</view>
		</view>
		<view class="member">
			<view class="item" @click="setPrice(1)">
				1个月
				<view class="">
					￥15
				</view>
			</view>
			<view class="item" @click="setPrice(2)">
				3个月
				<view class="">
					￥30
				</view>
			</view>
			<view class="item" @click="setPrice(3)">
				1年
				<view class="">
					￥80
				</view>
			</view>
		</view>
		<view class="priority">
			会员特权
			<view class="" style="display: flex;justify-content: space-around;margin-top: 50rpx;">
				<template v-for="(item,index) in priorities">
					<view class="priority-item">{{item}}</view>
				</template>
			</view>
			
		</view>
		<view class="foot">
			<view class="total-price">总计:￥{{price}}</view>
			<view class="confirm" @click="pay">
				确认支付
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatarUrl:'',
				nickName:'',
				price:'',
				priorities:[
					'无限次数搜索',
					'图片匹配搜索',
					'个性化上传'
				]
			}
		},
		created(){
			this.avatarUrl=uni.getStorageSync('avatarUrl');
			this.nickName=uni.getStorageSync('nickName');
		},
		methods: {
			setPrice(n){
				if (n==1){
					this.price='15';
				}
				else if(n==2){
					this.price='30';
				}
				else if(n==3){
					this.price='80';
				}
			},
			pay(){
				if (this.price==''){
					uni.showToast({
						title:'请选择会员时长',
						icon:'none'
					})
				}
				else{
					uni.showModal({
						content:'是否支付'+this.price+'元会员费',
						success:(res)=>{
							if (res.confirm){
								uni.showToast({
									title:'支付成功',
									icon:'success'
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
		position: fixed;
		height:100%;
		width:100%;
		background-color: rgb(227, 227, 227);
	}
	
	.crown{
		position: absolute;
		right:40rpx;
		top:40rpx;
	}
	
	.member{
		margin-top: 30rpx;
		display:flex;
		justify-content: space-evenly;
	}
	
	.member .item{
		text-align: center;
		background-color: rgb(255, 250, 234);
		height:200rpx;
		width:170rpx;
		padding:10rpx;
		border-radius: 20rpx;
		/* border:1rpx solid ; */
	}
	
	.item view{
		margin-top: 20rpx;
		color:darkgoldenrod;
		font-size: large;
		font-weight: 700;
	}
	
	.user-profile{
		padding:30rpx;
		height:80rpx;
		background-color: black;
	}
	
	.priority{
		padding:20rpx;
		background-color: white;
		height:400rpx;
		border-radius: 20rpx;
		margin-top: 50rpx;
	}
	
	.priority-item{
		font-size: small;
		width:170rpx;
		height:200rpx;
		border-radius: 20rpx;
		text-align: center;
		line-height: 200rpx;
		background-color: rgb(255, 250, 234);
		font-weight: 700;
	}
	
	.foot{
		display: flex;
		position: absolute;
		bottom:0;
		width:100%;
		height:120rpx;
		line-height: 120rpx;
		margin-top: 50rpx;
		background-color:gray;
	}
	
	.foot .confirm{
		position: absolute;
		right:0rpx;
		width:200rpx;
		background-color:darkgoldenrod;
		color:white;font-weight: 700;
		text-align: center;
	}
	
	.foot .total-price{
		position: absolute;
		left:50rpx;
		color:white;font-weight: 700;
	}
</style>
