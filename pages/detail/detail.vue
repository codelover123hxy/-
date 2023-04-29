<template>
	<view class="content">
		文章:{{filename}}
		<view class="download"  @click="download(filename)">
			立即下载
		</view>
		<text style="color:darkgray">共{{pages}}页</text>
		<view style="font-weight: 700;">检索结果</view>
		<view class="">
			<template v-for="(item,index) in details">
				<view class="" style="font-weight: 700">
					<text style="background-color: #f2f2f4;font-weight: 400;">{{index+1}}</text>【第{{item.page}}页】 查看详情
				</view>
				<view class="" >
					<template v-for="(item2,index2) in item.list">
					    <view class="" style="margin: 20rpx auto;">
					    	<template v-for="(item3,index3) in item2.dividedDataAboutKeyWord" >
					    		<view class="" style="display: flex;justify-content: space-between;margin:20rpx auto">
					    			<text style="color:#779fd4;">{{item2.type===1?"来源于图片":"来源于文字"}}</text>
					    			<text style="color: #cf1908;text-decoration: none;"  @click="preview(filename)">查看PDF</text>
					    		</view>	
					    		<rich-text :nodes="item3"></rich-text>
					    	</template>
					    </view>										
					</template>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	import config from '../../config.js'
	export default {
		data() {
			return {
				details:'',
				filename:'',
				pages:''
			}
		},
		methods:{
			preview(name){
				console.log(name)
				uni.showLoading({
					title:'加载中'
				})
				uni.downloadFile({
					url:config.url + '/common/download?name='+name,
					success:(res)=>{
						console.log(res);
						if (res.statusCode === 200) {
							console.log('下载成功');
							uni.hideLoading();
						}
						uni.saveFile({
						    tempFilePath: res.tempFilePath,
						    success: function (save) {
						    // 自动打开手机预览文件页面
								uni.openDocument({
									filePath: save.savedFilePath,
									fileType: 'pdf',
									showMenu:'true',
									success: function (open) {
									// 打开文件成功
										console.log(open)
									}
								})
					        }
						})
					}
				})
			},
			download(name){
				console.log(name)
				uni.showLoading({
					title:'正在下载'
				})
				uni.downloadFile({
					url:config.url + '/common/download?name='+name,
					success:(res)=>{
						console.log(res);
						if (res.statusCode === 200) {
							console.log('下载成功');
							uni.hideLoading();
						}
						uni.saveFile({
						    tempFilePath: res.tempFilePath,
						    success: function (save) {
						    // 自动打开手机预览文件页面
								uni.showToast({
									title:'下载成功',
									icon:'success'
								})
					        }
						})
					}
				})
			},
			join(str,key){
				var reg=new RegExp((`(${key})`),"gm");
				var replace='<span style="color:#FD463E;font-weight:bold;">$1</span>';
				return str.replace(reg,replace);
			}
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			const filename=option.filename; //打印出上个页面传递的参数。
			this.filename=filename;
			const keyword=option.keyword;
			uni.request({
				url:config.url + '/dataPdf/detail?page=1&pageSize=10&keyWord='+keyword +'&filename=' + filename,
				method:'GET',
				success:(res)=>{
					console.log(res);
					this.pages=res.data.data.pages
					this.details=res.data.data.records;
					
					res.data.data.records.forEach((item,index)=>{
						let that=this;
						item.dividedDataAboutKeyWord.forEach((item2,index2)=>{
							if (item2.includes(keyword)){
								item.dividedDataAboutKeyWord[index2]=that.join(item2,keyword);	
							}
						})	
					})
					const details=res.data.data.records;
					let obj=[];
					let map={};
					details.forEach((item,index)=>{
						if (!map[item['page']]){
							map[item['page']] = [item];
						}
						else {
							map[item['page']].push(item);
						}
					})
					Object.keys(map).forEach((key)=>{
						obj.push({
							['page']:key,
							list:map[key]
						})
					})
					console.log(obj)
					this.details=obj;
				}
			})			
		}			
	}
</script>

<style>
	.content{
		padding:20rpx;
	}
	
	.download{
		width: 150rpx;
		height: 50rpx;
	
		text-align: center;
		line-height: 50rpx;
		background-color: aquamarine;
		font-weight: 700;
		color:white;
	}
</style>
