<template>
	<!-- 酒店管家-历史记录页面 -->
	<view class="order">
		<view class="orderItem" v-for="(item,index) in recordList" :key="index">
			<view class="time">
				派单时间：{{item.createTime}}
			</view>
			<view class="orderContent boxshadow">
				<view :class="['tip',{clean:item.orderState == 1},{audit:item.orderState == 2},{error:item.orderState == -1},{finish:item.orderState == 3}]">
					{{item.orderText || ''}}
				</view>
				<view class="content-top">
					<view class="roomInfo">
						<view class="roomNumber">
							ID:{{item.roomNo || ''}}
						</view>
						<view class="hotelName">
							{{item.hotelName || ''}}
						</view>
					</view>
					<view class="ownerContent">
						<view class="owner">
							<view class="owner-row">发布人：<span
									style="color: #999999;font-weight: normal;">{{item.publisher || ''}}</span></view>
							<view class="owner-row">发布人电话：<span
									style="color: #999999;font-weight: normal;">{{item.publisherPhone || ''}}</span>
							</view>
							<view class="owner-row">订单类型：<span
									style="color: #999999;font-weight: normal;">{{item.orderState == 1?'续住清洁':item.orderState == 2?'退房清洁':'钟点房清洁'}}</span>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="content-bottom">
				<view class="remark">
					阿姨电话：{{item.servicePhone || ''}}
				</view>
				<image @click="telephone(item.servicePhone)" style="width: 68rpx;height: 68rpx;"
					src="/static/phone.png">
				</image>
			</view>
		</view>
		<view style="height: 80rpx;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageNo: 1,
				total: 10,
				choosed: false,
				overContent: true, // 节流
				recordList: []
			}
		},
		onReachBottom() {
			// 触底的时候请求数据，即为上拉加载更多
			let allTotal = this.pageNo * 10
			if (allTotal < this.total && this.overContent) {
				this.overContent = false;
				this.pageNo++;
				this.getRecordList();
			}
		},
		onShow() {
			this.recordList = []
			this.pageNo = 1
			this.getRecordList()
		},
		methods: {
			async getRecordList() {
				let res = await this.$post('/hotelOrder/searchHousekeeperHistory', {
					pageNo: this.pageNo,
					pageSize: 10
				})
				// console.log('历史派单', res)
				if (res.code == 200) {
					if (res.data.list) {
						res.data.list.map(d => {
							d.orderText =
								d.orderState == -1 ?
								'驳回' :
								d.orderState == 1 ?
								'清洁中' :
								d.orderState == 2 ?
								'待审核' :
								d.orderState == 3 ?
								'已完成' :
								'待服务'
						})
						this.total = res.data.total
						this.recordList = this.recordList.concat(res.data.list)
					}
				} else {
					if (!this.overContent) {
						this.overContent = true;
						this.pageNo--;
					}
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
				}
			},
			// 打电话
			telephone(phone) {
				let that = this;
				const res = uni.getSystemInfoSync();
				if (res.platform === 'ios') {
					uni.makePhoneCall({
						phoneNumber: phone,
						success() {},
						fail() {}
					})
				} else {
					uni.showActionSheet({
						itemList: [phone],
						success(res) {
							if (res.tapIndex == 0) {
								uni.makePhoneCall({
									phoneNumber: phone
								})
							}
						}
					})
				}
			},
			toPath(url) {
				uni.navigateTo({
					url: url
				})
			},
		}
	}
</script>

<style>
	page {
		background-color: #FAF9FE;
	}
</style>
<style lang="less" scoped>
	.order {
		font-family: Arial-BoldItalicMT, Arial;
		padding: 0 30rpx;

		.orderItem {
			border-radius: 20rpx;
			font-size: 24rpx;
			padding-top: 10rpx;
			margin-bottom: 40rpx;
			.time{
				font-size: 24rpx;
				color: #8CAFEE;
				font-weight: bold;
				margin-bottom: 12rpx;
			}
			.orderContent {
				border-radius: 20rpx;
				overflow: hidden;
				position: relative;

				.tip {
					font-size: 28rpx;
					font-family: YouSheBiaoTiHei;
					padding: 8rpx 40rpx;
					color: #FFFFFF;
					background: #E0BF20;
					border-radius: 0px 0px 0px 20px;
					position: absolute;
					right: 0;
					top: 0;
				}
				.clean{
					background: #46d367;
				}
				.audit {
					background: #53C79D;
				}
				.finish{
					background: #2066E0;
				}
				.error{
					background: #F20706;
				}

				.content-top {
					background-color: #FFFFFF;
					padding: 36rpx 40rpx 30rpx 40rpx;

					.roomInfo {
						display: flex;
						align-items: center;

						.roomNumber {
							font-size: 32rpx;
							color: #FFFFFF;
							background-color: #2066E0;
							padding: 6rpx 12rpx;
							transform: skewX(-15deg);
							border-radius: 4rpx;
							margin-right: 20rpx;
						}

						.hotelName {
							width: 48%;
							font-weight: bold;
							font-size: 18px;
							font-family: YouSheBiaoTiHei;
							color: #000000;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}

					}

					.ownerContent {
						display: flex;
						justify-content: space-between;
						align-items: center;

						.owner {
							font-size: 28rpx;

							.owner-row {
								color: #000000;
								font-weight: bold;
								margin-top: 12rpx;
							}
						}
					}
				}
			}

			.content-bottom {
				width: 80%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				color: #333333;
				padding: 24rpx 40rpx 20rpx 20rpx;
				background: #DFEBFF;
				margin-left: 40rpx;
				border-radius: 0 0 20rpx 20rpx;

				.remark {
					width: 70%;
				}
			}
		}
	}
</style>
