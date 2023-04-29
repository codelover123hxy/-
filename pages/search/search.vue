<template>
	<view class="content">
		<scroll-view scroll-y="true" class="wrap" v-if="isShow">
			<view class="intro">
				医学名词介绍
			</view>
			<text style="font-weight: 700">{{currentItem.name}}:</text>
			{{currentItem.paraphrase}}
		</scroll-view>
		<view class="" @click="isMethodsShow=true" style="line-height: 70rpx;margin-left:30rpx;width: fit-content;"  >
			<image src="../../static/multiselect.png" mode="heightFix" style="height:30rpx"></image>
			检索方式: <text style="font-weight: 700;">{{searchMethod}}</text> <text @click="toAdvancedSearch" style="margin-left: 20rpx;">高级搜索</text>
		</view>
		<view class="search">			
			<input placeholder="请输入搜索内容" @confirm="search" @click="searchResults='';
			isHotWordsShow=true;isContentSearch=false;isKeywordsSearch=false"
			 v-model="content" type="text">
			<button @click="search"><image src="../../static/search.png" mode="heightFix" style="height: 50rpx;"></image></button>
		</view>
		<view class="" style="margin: 30rpx;" v-if="searchResults.length==0">
			尚未搜索到内容
		</view>
		<view class="search-results" v-if="isContentSearch" >
			<template v-for="(item,index) in searchResults">
				<view class="result" @click="click(item)">					
					<view style="font-weight: 700;width:700rpx;margin:30 auto;color: #85a97b;">
					{{item.filename.length>18?item.filename.substring(0,18)+'…':item.filename}}<text @click="getDetail(item)" 
					style="font-size: small;color:red;position: absolute;right:20rpx" v-if="searchMethod=='内容检索'" class="">
						查看详情
					</text></view>
					<view style="color:darkgrey;font-weight: bold;font-size:small;margin-left: 40rpx;"  class="" v-if="searchMethod=='内容检索'">
						匹配到{{item.count}}条内容
					</view>
					<view class="" style="display: flex;justify-content: space-evenly;font-size: small;margin-top: 10rpx;">
						<view class="icon" @click="like(item)">
							<image src="../../static/like.png" style="height: 40rpx;" mode="heightFix"></image>
							点赞:{{item.likeCount}}
						</view>
						<view class="icon"><image src="../../static/click.png" style="height: 40rpx;" mode="heightFix"></image>点击:{{item.clickCount}}</view>
						<view class="icon" @click="favor(item)"><image src="../../static/favorite.png" style="height: 40rpx;" mode="heightFix"></image>收藏:{{item.favoriteCount}}</view>
					</view>		
					<ul style="margin:10rpx auto;width: fit-content;" v-if="searchMethod=='内容检索'">
						<li>匹配得分:{{item.matchScore.toFixed(3)}}</li>
						<li>点赞得分:{{item.likeScore.toFixed(3)}}</li>
						<li>收藏得分:{{item.starScore.toFixed(3)}}</li>
						<li><text style="font-weight: 700;">总得分:</text>{{item.scores.toFixed(3)}}</li>
					</ul>	
					<view v-if="searchMethod=='标题检索'" class="" style="display: flex;margin: 0 auto;width: fit-content;">
						<text style="width:140rpx;margin-top:10rpx;text-align: center;background-color:rgb(140,191,156);color:white" @click="download(item.filename)">立即下载</text>
						<text style="width:140rpx;margin-top:10rpx;text-align: center;background-color:rgb(140,191,156);color:white;margin-left: 20rpx;" @click="preview(item.filename)">查看PDF</text>
					</view>
					<view style="width:650rpx;margin:20rpx auto" class="" v-if="searchMethod=='标题检索'">
						{{item.abs.length>300?item.abs.substring(0,300):item.abs}}
					</view>
				</view>
			</template>
		</view>
		<view class="noun-search-results" v-if="isNounShow">
			<view style="font-weight: 700">{{searchResults.medicalWord}}</view>
			<view>{{searchResults.paraphrase}}</view>
		</view>
		<scroll-view scroll-y="true" class="keywords-result"  v-if="isKeywordsSearch" >
			<template v-for="(item,index) in searchResults">
				<view class=" "   @click="click(item)">
					<view style="width:700rpx;margin:30rpx auto;width:fit-content;font-weight: bold;color: #85a97b;">{{item.filename.length>18?item.filename.substring(0,18)+'…':item.filename}}</view>
					<view class="" style="display: flex;justify-content: space-evenly;font-size: small;">
						<view class="icon" @click="like(item)"><image src="../../static/like.png" style="height: 40rpx;" mode="heightFix"></image>点赞:{{item.likeCount}}</view>
						<view class="icon"><image src="../../static/click.png" style="height: 40rpx;" mode="heightFix"></image>点击:{{item.clickCount}}</view>
						<view class="icon" @click="favor(item)"><image src="../../static/favorite.png" style="height: 40rpx;" mode="heightFix"></image>收藏:{{item.favoriteCount}}</view>
					</view>	
					<view class="" style="display: flex;margin: 10rpx auto;width: fit-content;">
						<text style="width:140rpx;text-align: center;background-color:rgb(140,191,156);color:white" @click="download(item.filename)">立即下载</text>
						<text style="width:140rpx;text-align: center;background-color:rgb(140,191,156);color:white;margin-left: 20rpx;" @click="preview(item.filename)">查看PDF</text>
					</view>
					<view style="font-size: small;width:650rpx;margin:0 auto">
						{{item.abs.length>300?item.abs.substring(0,300):item.abs}}
					</view>		
				</view>
			</template>
		</scroll-view>
		<view v-if="isHotWordsShow" class="hotwords-view"  @click="isMethodsShow=false">
			<text style="color:red;font-weight: 700;margin-left: 20rpx">热搜</text>
			<template v-for="(item,index) in hotWords">
				<view @click="searchHotWords(item)" class="hot-words">
					{{index+1}}.{{item.keyword.length>15?item.keyword.substring(0,15)+'…':item.keyword}}
					<view style="display: inline;position: absolute;left:580rpx">搜索量:{{item.click}}</view>
				</view> 
			</template>
		</view>		
		<view class="top" v-if="isMethodsShow">
			<view class="" style="font-weight: 700;margin-left: 30rpx;">
				选择搜索方式
			</view>
			<view class="methods">
				<template v-for="(item,index) in methods">
					<view :class="[{selected:link==index,unselected:link!=index}]" @click="select(index)">
						{{item}}
					</view>
				</template>
			</view>		
			<view class="confirm" @click="confirm">
				确定
			</view>
		</view>		
	</view>
</template>

<script>
import config from '../../config.js'
export default {
	data() {
		return {
			isHotWordsShow:'',
			isContentSearch:'',
			isKeywordsSearch:'',
			link:'',
			content:'',
			hotWords:'',
			searchResults:[],
			isMethodsShow:true,
			isNounShow:'',
			keyword:'',
			methods:[
				'内容检索','标题检索','关键词检索','名词检索'
			],
			searchMethod:'',
			isShow:'',
			currentItem:'',
		};
	},
	onReady() {
		this.getServerData();
	},
	onLoad(){
		uni.request({
			url:config.url+'/searchWord/hot',
			method:'GET',
			success:(res)=>{
				console.log(res);
				if (res.data.code==1)
					this.hotWords=res.data.data.records.splice(0,10);
			}
		})
	},
	methods: {
		toAdvancedSearch(){
			uni.navigateTo({
				url:'../advanced-search/advanced-search'
			})
		},
		getDetail(item){
			const filename = item.filename;
			console.log('item',item)
			uni.navigateTo({
				url:'/pages/detail/detail?filename=' + filename + '&keyword=' + this.keyword
			})
		},
		searchHotWords(item){
			const keyword=item.keyword;
			this.keyword=item.keyword;
			this.isContentSearch=false;
			uni.request({
				url:config.url + '/search/content?keyword=' + keyword + '&page=1&pageSize=10',
				method:'GET',
				success:(res)=>{
					console.log(res);
					if (res.data.code == 1){
						this.searchResults = res.data.data.records;
						this.isHotWordsShow = false;
						this.isContentSearch = true;
						this.isKeywordsSearch = false;
						this.isMethodsShow = false;
					}
				}
			})
		},
		like(item){
			const filename=item.filename;
			const userId=uni.getStorageSync('userId');
			uni.request({
				url:config.url + '/article/approve',
				method:'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded' 
				},
				data:{
					filename:filename,
					userId:userId
				},
				success:(res)=>{
					console.log(res);
					if (res.data.code==1){
						if (res.data.data=='喜欢成功'){
							item.likeCount++;
						}
						else if(res.data.data=='取消喜欢'){
							item.likeCount--;
						}
					}
				}
			})
		},	
		click(item){
			const filename=item.filename;
			const keyword=this.content;
			uni.request({
				url:config.url + '/article/click?filename='+filename+'&keyword'+keyword,
				method:'POST',
				success:(res)=>{
					console.log(res);
					if (res.data.code==1){
						item.clickCount++;
					}
				}
			})
		},
		favor(item){
			const filename=item.filename;
			const userId=uni.getStorageSync('userId');
			uni.request({
				url:config.url + '/article/star',
				method:'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded' 
				},
				data:{
					filename:filename,
					userId:userId
				},
				success:(res)=>{
					console.log(res);
					if (res.data.code==1){						
						if (res.data.code==1){
							if (res.data.data=='收藏成功'){
								uni.showToast({
									title:res.data.data,
									icon:'success'
								})
								item.favoriteCount++;
							}
							else if(res.data.data=='取消收藏'){
								item.favoriteCount--;
								uni.showToast({
									title:res.data.data,
									icon:'success'
								})
							}
						}
					}
				}
			})
		},
		search(){			
			const keyword=this.content;
			let method='';
			if (this.searchMethod=='名词检索'){
				uni.request({
					url:config.url + '/searchNoun/explanation?noun=' + keyword,
					method:'GET',
					success:(res)=>{
						console.log(res);
						if (res.data.code==1){
							this.searchResults=res.data.data;
							this.isContentSearch=false;
							this.isKeywordsSearch=false;
							this.isHotWordsShow=false;
							this.isNounShow=true;
							
						}
						else if (res.data.code==0){
							uni.showToast({
								title:res.data.msg,
								icon:'none'
							})
						}
					}
				})
			}
			else{
				if (this.searchMethod=='内容检索'){
					this.isContentSearch=true;
					method='content';					
					this.keyword=keyword;
				}
				else if(this.searchMethod=='标题检索'){
					this.isContentSearch=true;
					method='title';
				}
				else if(this.searchMethod=='关键词检索'){
					method='keyword';
					this.isContentSearch=false;
					this.isKeywordsSearch=true;
				}
				if (method==''){
					uni.showToast({
						title:'请选择检索方式！',
						icon:'none'
					})
				}
				else{
					console.log(keyword,method);
					uni.request({
						url:config.url+'/search/' + method + '?keyword=' + keyword + '&page=1&pageSize=10',
						method:'GET',
						success:(res)=>{
							console.log(res);
							if (res.data.code==1){
								this.searchResults=res.data.data.records;
								this.isHotWordsShow=false;
							}
						}
					})
				}
			}			
		},
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
		confirm(){
			this.isMethodsShow=false;
			this.searchMethod=this.methods[Number(this.link)];
			this.content="";
		},
		select(index){
			this.link=index;
		},
		activeWord(e){
	  		if(e.currentIndex!=-1){
	  			let detail = this.chartData.series[e.currentIndex]
				console.log(detail)
				this.currentItem=detail;
				this.isShow=true;
	  		}
	  	},
		getServerData() {
      //模拟从服务器获取数据时的延时
			setTimeout(() => {
        //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
				let res = {
					series: [
					
					]
				};
				this.chartData = JSON.parse(JSON.stringify(res));
			}, 500);
		},
	}
};
</script>
<style scoped>	
	.noun-search-results{
		padding: 30rpx;
	}
	
	.hot-words{
		padding-left:10rpx;
		height:60rpx;
		line-height: 60rpx;
		border-bottom: 1rpx solid darkgrey;
	}
	
	.hotwords-view{
		margin-top: 30rpx;
	}

	.selected{
		background-color:salmon;
	}
	.top{
		position: absolute;
		z-index: 3;
		background-color: white;
		padding-bottom:20rpx;
		top:70rpx;
		width:100%;
	}
	
	.methods{
		position: relative;
		padding-top: 50rpx;
		margin: 0 auto;
		width: fit-content;
		box-sizing: border-box;
		display: flex;
		justify-content: space-evenly;
		height:150rpx;
		width:100%;		
	}
	
	.unselected{
		width:160rpx;
		height: 60rpx;
		border-radius: 30rpx;
		background-color: rgb(227, 227, 227);
		text-align: center;
		line-height: 60rpx;
	}
	
	.selected{
		width:160rpx;
		height: 60rpx;
		border-radius: 30rpx;
		text-align: center;
		line-height: 60rpx;
		background-color:salmon;
	}
	
	.confirm{
		background-color: aqua;
		height:70rpx;
		width:300rpx;
		line-height: 70rpx;
		text-align: center;
		border-radius: 35rpx;
		margin:0 auto;
	}
	
	.charts-box {
		width: 100%;
		height: 300px;
	}
  
	.search{
		background-color:rgb(250,250,250);
		width:100%;
		height: 70rpx;
		position: relative;
	}
  
	.search input{
		background-color:rgb(250,250,250);
		border:none;
		height: 70rpx;
		position: absolute;
		width:400rpx;
		border-radius: 10rpx;
		left:50rpx;
	}
  
	.search button{
		position: absolute;
		right:80rpx;
		width:70rpx;
		height: 70rpx;
		padding: 0;
		text-align: center;
	}
	
	.keywords-result{
		margin-top: 50rpx;
		height:900rpx;
	}
  
	.wrap{
		position: fixed;
		top:150rpx;
		left:50%;
		transform:translate(-50%);
		border-radius: 20rpx;
		padding: 20rpx;
		box-sizing: border-box;
		border:1rpx solid;
		z-index:3;
		width:600rpx;
		height:300rpx;
		background-color: white;
	}
  
	.intro{
		text-align: center;
		font-size: larger;
		color:royalblue;
		font-weight: 700;
	}
</style>