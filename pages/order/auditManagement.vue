<template>
	<!-- 酒店管家-审核管理页面 -->
	<view class="order">
		<view class="topTool">
			<view class="topTool_btn" @click="changType">
				{{type?'退出批量审核':'批量审核'}}
			</view>
		</view>
		<view class="orderItem">
			<view class="orderContent boxshadow">
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
									style="color: #999999;font-weight: normal;">{{orderDetail.publisher || ''}}</span>
							</view>
							<view class="owner-row">发布人电话：<span
									style="color: #999999;font-weight: normal;">{{orderDetail.publisherPhone || ''}}</span>
							</view>
							<view class="owner-row">类型区别：
								<span style="color: #FFD200;font-weight: normal;margin-right: 20rpx;">续房清洁</span>
								<span style="color: #3FC192;font-weight: normal;margin-right: 20rpx;">退房清洁</span>
								<span style="color: #ff5500;font-weight: normal;">钟点房清洁</span>
							</view>
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
			<view :class="['roomItem',{active:item.choosed == true}]" v-for="(item,index) in orderDetail.roomList"
				:key="item.roomNo" @click="choosedRoom(item,index)">
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
			<view class="bottomBtn" @click="resultWork(true)" v-if="type == true">
				通过订单
			</view>
			<view class="bottomBtn" @click="resultWork(false)" v-if="type == true">
				驳回订单
			</view>
		</view>
		<u-popup :show="show" @close="close" :closeOnClickOverlay="true" mode="center" round="10">
		    <view style="width: 60vw;padding: 60rpx 40rpx;">
				<view style="margin-bottom: 40rpx;">
					<view style="font-size: 32rpx;margin-bottom: 20rpx;">
						驳回原因
					</view>
					<u--input
					    placeholder="请输入驳回原因"
					    border="surround"
					    v-model="rejection"
						fontSize="32rpx"
						placeholderStyle="font-size: 32rpx;"
					  ></u--input>
				</view>
				<view style="display: flex;justify-content: space-between;">
					<u-button type="primary" text="确定" customStyle="width: 45%;" @click="auditOrder"></u-button>
					<u-button type="error" text="取消" customStyle="width: 45%;" @click="close()"></u-button>
				</view>
		    </view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show:false,
				pageNo: 1,
				total: 10,
				id: 0,
				choosed: false,
				overContent: true, // 节流
				orderDetail: {
					roomList: []
				},
				rejection:'',
				type: false,
				form:''
			}
		},
		onLoad(options) {
			this.id = options.id
		},
		onShow() {
			this.getRoomList()
		},
		methods: {
			resultWork(flag) {
				let that = this
				if (!that.choosed) {
					uni.showToast({
						title: '请选择要审核的房间',
						icon: "none"
					})
					return
				}
				let obj = {
					ids:[]
				}
				let array = []
				for (let i = 0; i < that.orderDetail.roomList.length; i++) {
					if (that.orderDetail.roomList[i].choosed) {
						array.push(that.orderDetail.roomList[i])
						obj.ids.push(that.orderDetail.roomList[i].id)
					}
				}
				// true 通过
				if (flag) {
					uni.showModal({
						content: '是否批量通过订单',
						success: async (res)=> {
							if (res.confirm) {
								obj.orderState = 3
								let result = await that.$API.put('/hotelOrder/updateHotelOrderAudit', obj)
								if(result.code == 200){
									uni.showToast({
										title:'批量审核成功',
										icon:"none",
										mask:true,
										success() {
											setTimeout(()=>{
												that.type = false
												that.getRoomList()
											},1000)
										}
									})
								}
							}
						}
					})
				} else {
					uni.showModal({
						content: '是否批量驳回订单',
						success(res) {
							if (res.confirm) {
								that.form = obj 
								that.show = true;
							}
						}
					})
				}
			},
			async getRoomList() {
				let res = await this.$get('/housekeeper/getHousekeeperAuditRoom/' + this.id)
				// console.log('选择房间', res)
				if (res.code == 200) {
					this.choosed = false
					res.data.roomList = []
					this.orderDetail = res.data
					let array = []
					if (this.orderDetail.hotelOrderVOList) {

						this.orderDetail.hotelOrderVOList.map(d => {
							d.choosed = false
							let obj = {
								choosed: false,
								roomNo: d.roomNo,
								id:d.id,
								serviceAvatar: d.serviceAvatar,
								orderType: d.orderType,
								orderState:d.orderState,
								rejection:'',
								doorPicture:d.doorPicture,
								// airConditionerPicture:d.airConditionerPicture,
								bedPicture:d.bedPicture,
								// chairPicture:d.chairPicture,
								// tablePicture:d.tablePicture,
								toiletPicture:d.toiletPicture,
								// windowPicture:d.windowPicture
							}
							array.push(obj)
						})
					}
					this.orderDetail.roomList = this.orderDetail.roomList.concat(array)
					// console.log('这是',this.orderDetail.roomList)
				}
			},
			async auditOrder(){
				let that = this
				if(this.rejection == ''){
					uni.showToast({
						title:'请输入驳回原因',
						icon:"none",
					})
					return
				}
				this.form.rejection = this.rejection
				this.form.orderState = -1
				let res = await this.$API.put('/hotelOrder/updateHotelOrderAudit',this.form)
				if(res.code == 200){
					uni.showToast({
						title:'批量审核成功',
						icon:"none",
						mask:true,
						success() {
							setTimeout(()=>{
								that.show = false
								that.type = false
								that.getRoomList()
								that.rejection = ''
								that.form = ''
							},1000)
						}
					})
				}
			},
			choosedRoom(item, index) {
				if (this.type) {
					// if (this.orderDetail.roomList[index].roomState > 1) return
					this.orderDetail.roomList[index].choosed = !this.orderDetail.roomList[index].choosed
					let flag = false
					for (let i = 0; i < this.orderDetail.roomList.length; i++) {
						if (this.orderDetail.roomList[i].choosed) {
							flag = true
						}
					}
					this.choosed = flag
				} else {
					let array = []
					array.push(item.id)
					item.ids = array
					uni.setStorageSync('orderDetail',JSON.stringify(item))
					uni.navigateTo({
						url:'/pages/order/orderDetail'
					})
				}
			},
			changType() {
				this.type = !this.type;
				if (this.type == false) {
					for (let i = 0; i < this.orderDetail.roomList.length; i++) {
						this.orderDetail.roomList[i].choosed = false
					}
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
			close(){
				this.show = false
				this.rejection = ''
				this.form = ''
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

		.topTool {
			width: 100%;
			display: flex;
			justify-content: flex-end;
			position: fixed;
			top: 0;
			left: 0;
			padding: 20rpx 32rpx;
			box-sizing: border-box;

			.topTool_btn {
				font-size: 32rpx;
				color: #ffffff;
				background-color: #2066E0;
				border-radius: 20rpx;
				padding: 10rpx 20rpx;
			}
		}

		.orderItem {
			margin-top: 90rpx;
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

				.againBg {
					background-color: #FFD200;
				}

				.leaveBg {
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
			justify-content: space-evenly;
			;
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

			.leave {
				background-color: #3FC192;
			}
		}
	}
</style>
