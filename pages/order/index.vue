<template>
	<!-- 清洁人员-待服务页面 -->
	<view class="order">
		<view class="orderItem" v-for="(item,index) in orderList" :key="index">
			<view class="orderTime">
				{{item.createTime}}
			</view>
			<view class="orderContent boxshadow">
				<view class="content-top">
					<view class="roomInfo">
						<view :class="['roomNumber',{finishN:item.orderState != 1}]">
							{{item.roomNo || ''}}
						</view>
						<view class="hotelName">
							{{item.hotelName || ''}}
						</view>
						<!-- <view class="">
							编号：{{item.number}}
						</view> -->
					</view>
					<view :class="['showText',{finishT:item.orderState != 0}]">
						{{item.orderState == 0?'待清洁...':item.orderState == 1?'清洁中...':item.orderState == -1?'驳回':'已清洁'}}
					</view>
				</view>
				<view :class="['content-bottom',{finishB:item.orderState != 0}]">
					<view class="remark" v-if="item.orderState != -1">
						备注：{{item.remark || ''}}
					</view>
					<view class="remark" style="color: #F20706;" v-if="item.orderState == -1">
						备注：{{item.rejection || ''}}
					</view>
					<view class="orderBtn" v-if="item.orderState < 3" @click="tapButton(item,index)">
						{{item.orderState == 0?'开始清洁':'上传图片'}}
					</view>
				</view>
			</view>
		</view>
		<view style="height: 80rpx;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageNo:1,
				total: 10,
				overContent: true, // 节流
				orderList: [],
				// 订单状态（-1驳回 0待派单 1待服务 2清洁中 3待审核 4已完成）
			}
		},
		onReachBottom() {
			// 触底的时候请求数据，即为上拉加载更多
			let allTotal = this.pageNo * 10
			if (allTotal < this.total && this.overContent) {
				this.overContent = false;
				this.pageNo++;
				this.getOrderList();
			}
		},
		onShow() {
			this.orderList = []
			this.pageNo = 1
			this.getOrderList();
		},
		methods: {
			async getOrderList(){
				let res = await this.$post('/hotelOrder/searchAuntPendingService',{
					pageNo:this.pageNo,
					pageSize:10
				})
				// console.log('待服务订单',res)
				if(res.code == 200){
					this.overContent = true;
					if(res.data.list){
						this.orderList = this.orderList.concat(res.data.list)
						this.total = res.data.total
					}
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
			tapButton(item,index){
				console.log(index)
				let that = this;
				if(item.orderState == 1 || item.orderState == -1){
					that.toPath(`/pages/order/repair?type=1&id=${item.id}&roomNo=${item.roomNo}`)
				}else if(item.orderState == 0){
					uni.showModal({
						title: '温馨提示',
						content: '确认开始清洁?',
						success: async (over) => {
							let res = await that.$get('/hotelOrder/auntStartClean/'+item.id)
							if(res.code == 200){
								that.orderList[index].orderState = 1
							}else{
								uni.showToast({
									title:res.msg,
									icon:"none"
								})
							}
						}
					})
				}
			},
			toPath(url){
				uni.navigateTo({
					url:url
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
		.orderItem{
			border-radius: 20rpx;
			font-size: 24rpx;
			padding-top: 10rpx;
			.orderTime{
				color: #8CAFEE;
				margin: 20rpx 10rpx;
			}
			.orderContent{
				border-radius: 20rpx;
				overflow: hidden;
				.content-top{
					background-color: #FFFFFF;
					padding: 40rpx 24rpx 26rpx 20rpx;
					.roomInfo{
						display: flex;
						align-items: center;
						.roomNumber{
							font-size: 32rpx;
							color: #FFFFFF;
							background-color: #3FC192;
							padding: 6rpx 12rpx;
							transform: skewX(-15deg);
							border-radius: 4rpx;
							margin-right: 20rpx;
						}
						.finishN{
							background-color: #2066E0;
						}
						.hotelName{
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
					
					.showText{
						font-size: 28rpx;
						font-weight: bold;
						background: rgba(63, 194, 147, 0.1);
						color: #3FC293;
						padding: 18rpx 26rpx;
						margin-top: 20rpx;
						border-radius: 20rpx;
						position: relative;
						&::after{
							position: absolute;
							top: -10rpx;
							left: 5%;
							content: '';
							height: 0;
							width: 0;
							border-bottom: 10rpx solid rgba(63, 194, 147, 0.1);
							border-left: 10px solid transparent;
							border-right: 10px solid transparent;
						}
					}
					.finishT{
						background: rgba(32, 102, 224, 0.1);
						color: #2066E0;
						&::after{
							border-bottom: 10rpx solid rgba(32, 102, 224, 0.1);
						}
					}
				}
				.content-bottom{
					display: flex;
					justify-content: space-between;
					align-items: center;
					color: rgba(0, 0, 0, 0.3);
					padding: 24rpx 24rpx 30rpx 20rpx;
					background: linear-gradient(90deg, #EBF8F4 0%, rgba(255,255,255,0) 100%);
					.remark{
						width: 70%;
					}
					.orderBtn{
						border-radius: 10rpx;
						background-color: #2066E0;
						padding: 10rpx 30rpx;
						color: #FFFFFF;
						&:active{
							background-color: #1a56be;
						}
					}
				}
				.finishB{
					background: linear-gradient(90deg, #E8EFFB 0%, rgba(255,255,255,0) 100%);
				}
			}
		}
	}
</style>
