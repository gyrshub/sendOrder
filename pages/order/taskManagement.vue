<template>
	<!-- 酒店管家-派单管理页面 -->
	<view class="order">
		<view class="orderItem">
			<view class="orderContent boxshadow">
				<view :class="['tip',{wait:orderDetail.status == 1}]">
					{{orderDetail.status == 1?'有新单':'无新单'}}
				</view>
				<view class="content-top">
					<view class="roomInfo">
						<view class="roomNumber">
							ID:{{orderDetail.id || ''}}
						</view>
						<view class="hotelName">
							{{orderDetail.hotelName || ''}}
						</view>
					</view>
					<view class="ownerContent">
						<view class="owner">
							<view class="owner-row">发布人：<span
									style="color: #999999;font-weight: normal;">{{orderDetail.publisher || ''}}</span></view>
							<view class="owner-row">发布人电话：<span
									style="color: #999999;font-weight: normal;">{{orderDetail.publisherPhone || ''}}</span>
							</view>
						</view>
						<view :class="['owner-btn',{stop:orderDetail.status == 1}]">
							派单
						</view>
					</view>
				</view>
			</view>
			<view class="content-bottom">
				<view class="remark">
					调度电话：{{orderDetail.dispatchCall || ''}}
				</view>
				<image @click="telephone(orderDetail.dispatchCall)" style="width: 68rpx;height: 68rpx;"
					src="/static/phone.png">
				</image>
			</view>
		</view>
		<view class="roomList" v-if="orderDetail.roomList.length != 0">
			<view :class="['roomItem',{active:item.choosed == true}]"
				v-for="(item,index) in orderDetail.roomList" :key="item.roomNo" @click="choosedRoom(item,index)">
				<view :class="['workImg',{hide:item.serviceAvatar}]">
					<image style="width: 100rpx;height: 100rpx;border-radius: 38rpx;" :src="item.serviceAvatar"></image>
				</view>
				<view :class="['roomNumber',{hourBg:item.orderType == 3},{leaveBg:item.orderType == 2},{againBg:item.orderType == 1}]">
					{{item.roomNo}}
				</view>
			</view>
		</view>
		<view style="height: 160rpx;"></view>
		<view class="bottomTool">
			<view class="bottomBtn" v-if="!choosed">
				请选择房间
			</view>
			<view class="bottomBtn" v-if="choosed" @click="choosWork(0)">
				前去派单
			</view>
			<view class="bottomBtn" v-if="choosed" @click="choosWork(1)">
				更换阿姨
			</view>
			<!-- <view class="bottomBtn" v-if="choosed == false">
				{{choosed?'去选择阿姨派单':'请选择房间'}}
			</view>
			<view class="bottomBtn again" v-if="choosed == true" @click="choosWork(1)">
				续房清洁
			</view>
			<view class="bottomBtn leave" v-if="choosed == true" @click="choosWork(2)">
				退房清洁
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageNo: 1,
				total: 10,
				id: 0,
				choosed: false,
				overContent: true, // 节流
				orderDetail: {
					status: 1, // 0 无新单 1有新单
					roomList: []
				},
			}
		},
		onReachBottom() {
			// 触底的时候请求数据，即为上拉加载更多
			let allTotal = this.pageNo * 10
			if (allTotal < this.total && this.overContent) {
				this.overContent = false;
				this.pageNo++;
				// this.getOrderList();
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		onShow() {
			this.getRoomList()
		},
		methods: {
			choosWork(type) {
				if (!this.choosed) return
				let flag = ''
				let array = []
				let croomList = this.orderDetail.roomList
				for (let i = 0; i < croomList.length; i++) {
					if (croomList[i].choosed) {
						array.push(croomList[i])
					}
					// 类型为给阿姨派单但是选中已派单订单时改拒绝
					if(type == 0 && croomList[i].roomState == 1 && croomList[i].choosed == true){
						uni.showToast({
							title:'该房间已选择阿姨,无法派单',
							icon:'none'
						})
						return
					}
					// 类型为给阿姨派单但是选中已派单订单时改拒绝
					if(type == 1 && croomList[i].roomState == 0 && croomList[i].choosed == true){
						uni.showToast({
							title:'该房间未选择阿姨,无法更换',
							icon:'none'
						})
						return
					}
				}
				uni.navigateTo({
					url: `/pages/worker/choose?ids=${JSON.stringify(array)}&hotelId=${this.orderDetail.id}&type=${type}`
				})
			},
			async getRoomList() {
				let res = await this.$get('/housekeeper/getHousekeeperSelectRoom/' + this.id)
				console.log('选择房间', res)
				if (res.code == 200) {
					this.choosed = false
					res.data.roomList = []
					this.orderDetail = res.data
					let array = []
					if (this.orderDetail.hotelRoomAuntVOList) {
						let finish = 0
						// 0 无新单 1 有新单
						for(let i =0;i<this.orderDetail.hotelRoomAuntVOList.length;i++){
							if(this.orderDetail.hotelRoomAuntVOList[i].roomState == 0){
								finish = 1
							}
						}
						this.orderDetail.status = finish
						
						this.orderDetail.hotelRoomAuntVOList.map(d => {
							d.choosed = false
							let obj = {
								choosed: false,
								roomNo: d.roomNo,
								roomId:d.id,
								id:d.orderId,
								auntId:d.auntId,
								serviceAvatar: d.serviceAvatar,
								roomState:d.roomState,
								orderType:d.orderType
							}
							array.push(obj)
						})
					}
					this.orderDetail.roomList = this.orderDetail.roomList.concat(array)
					// console.log('这是',this.orderDetail.roomList)
				}
			},
			choosedRoom(item, index) {
				// if (this.orderDetail.roomList[index].roomState != 0) return
				if (this.orderDetail.roomList[index].roomState > 1) return
				this.orderDetail.roomList[index].choosed = !this.orderDetail.roomList[index].choosed
				let flag = false
				for (let i = 0; i < this.orderDetail.roomList.length; i++) {
					if (this.orderDetail.roomList[i].choosed) {
						flag = true
					}
				}
				this.choosed = flag
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

				.wait {
					background: #53C79D;
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

						.owner-btn {
							font-size: 36rpx;
							color: #999999;
							font-weight: bold;
						}

						.stop {
							color: #2066E0;
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

		.roomList {
			margin-top: 18rpx;
			display: flex;
			flex-wrap: wrap;
			background-color: #FFFFFF;
			border-radius: 20rpx;
			padding: 30rpx 32rpx;
			box-sizing: border-box;

			.roomItem {
				width: 100rpx;
				margin-right: 32rpx;
				margin-bottom: 20rpx;

				&:nth-of-type(5n) {
					margin-right: 0;
				}

				.workImg {
					width: 100rpx;
					height: 100rpx;
					border-radius: 38rpx;
					background-color: #2066E0;
					box-sizing: border-box;
					border: 6rpx solid transparent;
					display: flex;
					justify-content: center;
					align-items: center;
				}

				.hide {
					background-color: transparent;
				}

				.roomNumber {
					width: 100%;
					font-size: 28rpx;
					padding: 4rpx 0;
					color: #ffffff;
					background-color: #2066E0;
					border-radius: 10rpx;
					text-align: center;
					border: 6rpx solid transparent;
					box-sizing: border-box;
					margin-top: -6rpx;
				}
				.againBg{
					background-color: #FFD200;
				}
				.leaveBg{
					background-color: #3FC192;
				}
				.hourBg{
					background-color: #ff5500;
				}
			}

			.active {
				.workImg {
					border: 6rpx solid #FFD200;
				}

				.roomNumber {
					border: 6rpx solid #FFD200;
				}
			}
		}

		.bottomTool {
			width: 100%;
			position: fixed;
			left: 0;
			bottom: 0;
			display: flex;
			justify-content: space-evenly;;
			padding: 20rpx 0 36rpx 0;
			
			.bottomBtn {
				font-size: 32rpx;
				color: #FFFFFF;
				padding: 28rpx 72rpx;
				border-radius: 40rpx;
				background-color: #2066E0;
			}
			.again {
				background-color: #FFD200;
			}
			.leave{
				background-color: #3FC192;
			}
		}
	}
</style>
