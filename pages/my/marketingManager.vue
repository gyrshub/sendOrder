<template>
	<!-- 个人中心-销售经理页面 -->
	<view class="my">
		<view class="status_bar" :style="{ height:statusBarHeight + 10 + 'px' }"></view>
		<view class="topImage">
			<view class="userInfo">
				<view class="showContent">
					<view class="imgBg boxshadow">
						<image class="userImage boxshadow" @click="onloadImg" :src="userInfo.avatar">
						</image>
					</view>
					<view class="labelStyle">
						销售经理
					</view>
					<view>
						{{userInfo.realName}}
					</view>
				</view>
			</view>
		</view>
		<view class="content boxshadow">
			<view class="tool">
				<view class="tool-item" v-for="(item,index) in toolList" :key="index" @click="toPath(item.url)">
					<view class="iconSize">
						<image style="display: block;width: 100%;height: 100%;" :src="item.image"></image>
						<view class="remind" v-if="item.number!=0">
							<view style="transform: scale(0.75);">
								{{item.number}}
							</view>
						</view>
					</view>
					<view class="tooltext">
						{{item.name}}
					</view>
				</view>
			</view>
			<view class="clearNumber">
				<view style="margin-top: 30rpx;">
					本月签单量
				</view>
				<view class="showNumber">
					<span
						style="font-size: 80rpx;font-weight: bold;font-style: italic;margin-right: 20rpx;">{{userInfo.totalSignNum || 0}}</span>
					家
				</view>
			</view>
			<view class="repair">
				<view class="repair-item" v-for="(item,index) in bottomTool" :key="index" @click="clickTool(item)">
					<view class="icon">
						<image style="display: block;width: 100%;height: 100%;" :src="item.image"></image>
					</view>
					<view class="repairtext">
						{{item.name}}
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="loginOut boxshadow" @click="loginOut()">
			退出登录
		</view> -->
		<view style="height: 180rpx;"></view>
		<view class="bottomTool">
			<view class="bottomItem" @click="toHome">
				<image style="width: 34rpx;height: 34rpx;" src="/static/home1.png"></image>
			</view>
			<view class="bottomItem" style="background-color: white;">
				<image style="width: 40rpx;height: 40rpx;margin-right: 20rpx;" src="/static/mine.png"></image>
				<view>
					个人中心
				</view>
			</view>
		</view>
	</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
				toolList: [{
						name: '签约申请',
						image: '/static/apply.png',
						number: 0,
						url: '/pages/apply/index'
					},
					{
						name: '待审核',
						image: '/static/waitAudit.png',
						number: 0,
						url: '/pages/apply/waitAudit'
					},
					{
						name: '待签约',
						image: '/static/Signed.png',
						number: 0,
						url: '/pages/apply/waitSigned'
					}, {
						name: '已入驻',
						image: '/static/join.png',
						number: 0,
						url: '/pages/apply/enter'
					}
				],
				bottomTool: [{
						name: '我的客户',
						image: '/static/client.png',
						url: '/pages/order/clearAudit?type=0'
					},
					{
						name: '我的市场',
						image: '/static/market.png',
						url: '/pages/order/clearAudit?type=0'
					},
					{
						name: '我的提成',
						image: '/static/royalty.png',
						url: '/pages/order/clearAudit?type=0'
					},
					{
						name: '退出登录',
						image: '/static/share.png',
					}
				]
			}
		},
		created() {
			let statusBarHeight = getApp().globalData.statusBarHeight; //高度
			this.statusBarHeight = statusBarHeight;
			uni.hideTabBar()
		},
		onShow() {
			this.getUserInfo()
		},
		methods: {
			async getUserInfo() {
				let res = await this.$get('/salesman/getSalesman')
				// console.log('管家信息', res)
				if (res.code == 200) {
					this.userInfo = res.data
					if (res.data.hotelAuditStateStatisticsVO) {
						this.toolList[1].number = res.data.hotelAuditStateStatisticsVO.pendingReviewNum
						this.toolList[2].number = res.data.hotelAuditStateStatisticsVO.pendingContractNum
					}
				}
			},
			onloadImg() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: async (res) => {
						uni.showLoading({
							title: "正在上传",
							mask: true
						})
						const result = await this.uploadFilePromise(res.tempFilePaths[0])
						let upload = await this.$API.put('/salesman/updateSalesmanAvatar',{
							avatar:result
						})
						if(upload.code == 200){
							this.getUserInfo()
							uni.hideLoading();
						}else{
							uni.hideLoading();
						}
					}
				})
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: 'https://applets.xhbb.cc/file-api/upload', 
						filePath: url,
						name: 'file',
						formData: {
							user: 'test'
						},
						success: (res) => {
							let onlineImage = JSON.parse(res.data)
							setTimeout(() => {
								resolve(onlineImage.data.url)
							}, 1000)
						}
					});
				})
			},
			toPath(url) {
				uni.navigateTo({
					url: url
				})
			},
			toHome() {
				uni.switchTab({
					url: '/pages/home/index'
				})
			},
			clickTool(item) {
				if (item.name == '退出登录') {
					this.loginOut()
				} else {
					this.notThing()
				}
			},
			notThing() {
				uni.showToast({
					title: '暂无页面',
					icon: "none"
				})
			},
			loginOut() {
				uni.showModal({
					title: '温馨提示',
					content: '确认退出登录?',
					success: async (res) => {
						if (res.confirm) {
							uni.removeStorageSync('loginType')
							uni.removeStorageSync('token')
							uni.removeStorageSync('id')
							setTimeout(() => {
								uni.switchTab({
									url: '/pages/home/index'
								})
							}, 400)
						}
					}
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
	.my {
		padding: 20rpx 32rpx;

		.topImage {
			padding: 0 32rpx 32rpx 32rpx;

			.userInfo {
				display: flex;
				justify-content: center;
				margin-top: 68rpx;
				color: #000000;

				.showContent {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					font-size: 32rpx;
					font-weight: bold;

					.imgBg {
						width: 240rpx;
						height: 240rpx;
						border-radius: 50%;
						background-color: #FFFFFF;
						display: flex;
						justify-content: center;
						align-items: center;

						.userImage {
							width: 220rpx;
							height: 220rpx;
							border-radius: 50%;
							flex-shrink: 0;
							position: relative;
							z-index: 5;
						}
					}

					.labelStyle {
						border-radius: 30rpx;
						background-color: white;
						color: #2066E0;
						font-family: YouSheBiaoTiHei;
						padding: 10rpx 30rpx;
						margin-top: -40rpx;
						margin-bottom: 10rpx;
						position: relative;
						z-index: 10;
					}
				}
			}
		}

		.content {
			background-color: white;
			padding: 60rpx 20rpx;
			border-radius: 20rpx;
			font-size: 32rpx;
			font-weight: bold;

			.tool {
				display: flex;
				padding-bottom: 30rpx;
				border-bottom: 4rpx dashed #E9F0FD;
				justify-content: space-between;

				.tool-item {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;
					font-size: 28rpx;
					font-weight: normal;

					.iconSize {
						width: 90rpx;
						height: 90rpx;
						margin-bottom: 20rpx;
						position: relative;

						.remind {
							font-size: 24rpx;
							color: white;
							width: 26rpx;
							height: 26rpx;
							background: #FF2E2E;
							border-radius: 50%;
							position: absolute;
							top: 0;
							right: 0;
							display: flex;
							justify-content: center;
							align-items: center;
						}
					}
				}
			}

			.clearNumber {
				border-bottom: 4rpx dashed #E9F0FD;

				.showNumber {
					font-weight: normal;
					display: flex;
					justify-content: center;
					align-items: center;
					font-family: Arial-BoldItalicMT, Arial;
					color: #2066E0;
					font-size: 40rpx;
					margin: 40rpx 0 80rpx 0;
				}
			}

			.repair {
				margin-top: 40rpx;
				display: flex;

				.repair-item {
					width: 25%;
					display: flex;
					flex-direction: column;
					align-items: center;
					font-size: 28rpx;
					font-weight: normal;

					.icon {
						width: 60rpx;
						height: 60rpx;
						margin-bottom: 20rpx;
					}
				}
			}
		}

		.loginOut {
			color: #7E7D80;
			margin: 80rpx 0;
			width: 100%;
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

	.bottomTool {
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #2066E0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 80rpx 80rpx 40rpx 80rpx;
		box-sizing: border-box;
		border-radius: 0 0 40rpx 40rpx;

		&::after {
			content: '';
			background-color: #FAF9FE;
			width: 100%;
			height: 40rpx;
			position: absolute;
			left: 0;
			top: 0;
			border-radius: 0 0 40rpx 40rpx;
		}

		.bottomItem {
			width: 220rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50rpx;
			padding: 10rpx 0;
			color: #2066E0;
			font-size: 28rpx;
			font-family: YouSheBiaoTiHei;
		}
	}
</style>
