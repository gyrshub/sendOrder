<template>
	<!-- 我的页面 -->
	<view class="my">
		<view class="status_bar" :style="{ height:statusBarHeight + 10 + 'px' }"></view>
		<view class="topImage">
			<view class="userInfo">
				<view class="userInfo-left">
					<image class="userImage boxshadow" @click="onloadImg" :src="userInfo.avatar">
					</image>
				</view>
				<view class="userInfo-right">
					<view class="userInfo-row">
						<view class="userInfo-title">
							<view style="width: 100%;display: flex;justify-content: space-between;">
								<view>
									姓
								</view>
								<view>
									名:
								</view>
							</view>
						</view>
						<view class="userInfo-content">
							{{userInfo.realName || ''}}
						</view>
					</view>
					<view class="userInfo-row">
						<span class="userInfo-title">
							服务酒店:
						</span>
						<span class="userInfo-content">
							{{userInfo.hotelName || ''}}
						</span>
					</view>
					<view class="userInfo-row" style="flex-direction: column;">
						<view class="userInfo-title">
							客房经理:
						</view>
						<view class="managerInfo">
							<view class="managerName">
								{{userInfo.houseName || ''}}
							</view>
							<view class="managerPhone">
								{{userInfo.housePhone || ''}}
							</view>
						</view>
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
					本月清洁量
				</view>
				<view class="showNumber">
					<span
						style="font-size: 80rpx;font-weight: bold;font-style: italic;margin-right: 20rpx;">{{userInfo.monthlyCleanNum || 0}}</span>
					间
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
				userInfo: {
					realName: '',
					hotel: '',
					manager: '',
					phone: '',
					clearNumber: 0 
				},
				toolList: [{
						name: '待服务',
						image: '/static/serve.png',
						number: 0,
						url: '/pages/order/index'
					},
					{
						name: '待审核',
						image: '/static/aduit.png',
						number: 0,
						url: '/pages/order/clearAudit?type=0'
					},
					{
						name: '已完结',
						image: '/static/result.png',
						number: 0,
						url: '/pages/order/clearAudit?type=1'
					}
				],
				bottomTool: [{
						name: '报修中心',
						image: '/static/repair.png',
						url: '/pages/order/repair?type=0'
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
				let res = await this.$get('/aunt/getAunt')
				// console.log('阿姨信息', res)
				if (res.code == 200) {
					this.userInfo = res.data
					this.userInfo.hotelName = ''
					this.userInfo.houseName = ''
					this.userInfo.housePhone = ''
					if(this.userInfo.hotelOrderVO){
						this.userInfo.hotelName = this.userInfo.hotelOrderVO.hotelName
					}
					if(this.userInfo.housekeeperVO){
						this.userInfo.houseName = this.userInfo.housekeeperVO.realName
						this.userInfo.housePhone = this.userInfo.housekeeperVO.phone
					}
					
					this.toolList[0].number = res.data.hotelOrderStateStatisticsVO.pendingServiceNum
					this.toolList[1].number = res.data.hotelOrderStateStatisticsVO.pendingReviewNum
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
						console.log('图片',res)
						let upload = await this.$API.put('/aunt/updateAuntAvatar', {
							avatar: result
						})
						if (upload.code == 200) {
							this.getUserInfo()
							uni.hideLoading();
						} else {
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
					this.toPath(item.url)
				}
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
				justify-content: space-between;
				margin-top: 68rpx;

				.userInfo-left {
					display: flex;
					align-items: center;
					flex-direction: column;
					position: relative;

					.userImage {
						width: 230rpx;
						height: 330rpx;
						border-radius: 20rpx;
						flex-shrink: 0;
						position: relative;
						z-index: 5;
					}

				}

				.userInfo-right {
					width: 60%;
					font-size: 34rpx;
					color: #000000;
					font-weight: bold;
					margin-left: 20rpx;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-style: oblique;
					white-space: nowrap;

					.userInfo-row {
						display: flex;
						margin-top: 20rpx;
						flex-wrap: wrap;

						.userInfo-title {
							width: 140rpx;
							margin-right: 40rpx;
						}

						.userInfo-content {
							white-space: normal;
							// flex: 1;
							// flex-wrap: wrap;
						}

						.managerInfo {
							font-size: 24rpx;
							color: #8CAFEE;
							width: 314rpx;
							display: flex;
							flex-direction: column;
							padding: 20rpx 20rpx;
							background: url(/static/nameBox.png) no-repeat;
							background-position: 0 0;
							background-size: 100% 100%;
							background-clip: padding-box;

							.managerName {
								padding: 20rpx 20rpx;
							}

							.managerPhone {
								align-self: center;
							}
						}
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
						width: 70rpx;
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
