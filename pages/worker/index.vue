<template>
	<!-- 酒店管家-人员状态页面 -->
	<view class="worker">
		<view class="workerItem boxshadow" v-for="(item,index) in serverList" :key="index">
			<image class="serveImg" :src="item.avatar"></image>
			<view class="serveInfo">
				<view class="serveInfo-title">
					{{item.realName || ''}}
				</view>
				<view class="serveInfo-row">
					年龄:{{item.age || ''}}
				</view>
				<view class="serveInfo-row">
					手机:{{item.phone || ''}}
				</view>
			</view>
			<view class="tip">
				剩余{{item.remainingRoom}}间
			</view>
		</view>
		<view style="position: absolute;left: 50%;top: 40%;transform: translate(-50%,-50%);" v-if="serverList.length === 0">
			<u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
		</view>
		<view style="height: 200rpx;"></view>
		<view class="bottomTool" @click="toBack">
			<view class="loginOut boxshadow">
				返回
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageNo: 1,
				total: 10,
				overContent: true, // 节流
				serverList: []
			}
		},
		onReachBottom() {
			// 触底的时候请求数据，即为上拉加载更多
			let allTotal = this.pageNo * 10
			if (allTotal < this.total && this.overContent) {
				this.overContent = false;
				this.pageNo++;
				this.getWorkerList();
			}
		},
		created() {
			this.getWorkerList();
		},
		methods: {
			async getWorkerList() {
				let res = await this.$API.post('/hotelOrder/searchHousekeeperPersonnelStatus', {
					pageNo:this.pageNo,
					pageSize:10
				})
				// console.log('阿姨列表',res)
				if(res.code == 200){
					this.overContent = true;
					this.total = res.data.total
					this.serverList = this.serverList.concat(res.data.list);
				}else{
					if (!this.overContent) {
						this.overContent = true;
						this.pageNo--;
					}
					uni.showToast({
						title: res.msg,
						icon:'none'
					})
				}
			},
			tapButton(item) {
				if (item.status == 1) {
					this.toPath(`/pages/order/repair?type=1`)
				} else if (item.status == 0) {

				}
			},
			toPath(url) {
				uni.navigateTo({
					url: url
				})
			},
			toBack(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #FAF9FE;
	}
</style>
<style lang="less" scoped>
	.worker {
		font-family: Arial-BoldItalicMT, Arial;
		padding: 0 30rpx;

		.workerItem {
			border-radius: 20rpx;
			background-color: #FFFFFF;
			padding: 26rpx 0 34rpx 34rpx;
			box-sizing: border-box;
			margin-top: 40rpx;
			position: relative;
			margin-right: 30rpx;
			display: flex;
			z-index: 10;

			.tip {
				position: absolute;
				font-size: 38rpx;
				font-weight: bold;
				right: -28rpx;
				top: 30%;
				width: 240rpx;
				background-color: #1E5BC7;
				border-radius: 20rpx 0 0 30rpx;
				color: #FFFFFF;
				text-align: center;
				padding: 4rpx 0;
				box-sizing: border-box;
				transform: rotate(15deg) skewX(15deg);
				z-index: 20;

				&::after {
					content: '';
					width: 0;
					height: 0;
					position: absolute;
					right: -2rpx;
					bottom: -12rpx;
					border-left: 20rpx solid transparent;
					top: 20rpx solid transparent;
					border-right: 20rpx solid transparent;
					border-bottom: 14rpx solid #094294;
					border-radius: 0 0 0 10rpx;
					transform: rotate(-40deg);
					z-index: 9;
				}
			}

			.serveImg {
				border-radius: 20rpx;
				width: 160rpx;
				height: 160rpx;
				margin-right: 40rpx;
				flex-shrink: 0;
			}

			.serveInfo {
				flex: 1;

				.serveInfo-title {
					font-size: 36rpx;
					color: #000000;
					font-family: YouSheBiaoTiHei;
					font-weight: bold;
					margin-bottom: 14rpx;
				}

				.serveInfo-row {
					font-size: 24rpx;
					color: #333333;
				}
			}
		}

		.bottomTool {
			width: 100%;
			position: fixed;
			padding: 0 40rpx;
			box-sizing: border-box;
			left: 0;
			bottom: 80rpx;
			z-index: 10;
		}

		.loginOut {
			color: #7E7D80;
			font-size: 36rpx;
			font-weight: bold;
			font-family: YouSheBiaoTiHei;
			border-radius: 40rpx;
			background-color: white;
			display: flex;
			justify-content: center;
			padding: 28rpx 0;
		}
	}
</style>
