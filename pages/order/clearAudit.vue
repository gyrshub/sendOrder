<template>
	<!-- 清洁人员-待审核页面 -->
	<view class="order">
		<view class="orderItem" v-for="(item,index) in orderList" :key="index">
			<view class="orderTime">
				{{item.createTime}}
			</view>
			<view class="orderContent boxshadow">
				<view class="content-top">
					<view class="roomInfo">
						<view class="info_left">
							<view class="roomNumber">
								{{item.roomNo}}
							</view>
							<view class="hotelName">
								{{item.hotelName}}
							</view>
						</view>
						<view class="info_right">
							{{item.orderType==1?'续住清洁':item.orderType==2?'退房清洁':'钟点房清洁'}}
						</view>
					</view>
					<view class="showText">
						已清洁
					</view>
				</view>
				<view class="content-bottom">
					<view class="remark">
						备注：{{item.remark || ''}}
					</view>
					<view class="orderBtn">
						{{item.orderState == 2?'待审核':item.orderState == 3?'已完结':'驳回'}}
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
				type:0, // 0待审核页面 1已完结页面
				// 订单状态（-1驳回 0待服务 1清洁中 2待审核 3已完成）
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
		onLoad(options) {
			this.type = options.type
			if(this.type == 1){
				uni.setNavigationBarTitle({
					title: '已完结'
				})
			}
		},
		created() {
			this.getOrderList();
		},
		methods: {
			async getOrderList(){
				let res = ''
				if(this.type == 1){
					res = await this.$post('/hotelOrder/searchAuntCompleted',{
						pageNo:this.pageNo,
						pageSize:10
					})
				}else{
					res = await this.$post('/hotelOrder/searchAuntPendingReview',{
						pageNo:this.pageNo,
						pageSize:10
					})
				}
				this.total = res.data.total
				this.orderList = this.orderList.concat(res.data.list)
				// console.log('订单信息',res)
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
						justify-content: space-between;
						.info_left{
							display: flex;
							align-items: center;
							width: 70%;
							.roomNumber{
								font-size: 32rpx;
								color: #FFFFFF;
								background-color: #2066E0;
								padding: 6rpx 12rpx;
								transform: skewX(-15deg);
								border-radius: 4rpx;
								margin-right: 20rpx;
								flex-shrink: 0;
							}
							.hotelName{
								font-size: 36rpx;
								font-weight: bold;
								font-family: YouSheBiaoTiHei;
								color: #000000;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
						}
						.info_right{
							font-size: 28rpx
						}
						
						
					}
					
					.showText{
						font-size: 28rpx;
						font-weight: bold;
						background: rgba(32, 102, 224, 0.1);
						color: #2066E0;
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
							border-bottom: 10rpx solid rgba(32, 102, 224, 0.1);
							border-left: 10px solid transparent;
							border-right: 10px solid transparent;
						}
					}
				}
				.content-bottom{
					display: flex;
					justify-content: space-between;
					align-items: center;
					color: rgba(0, 0, 0, 0.3);
					padding: 24rpx 24rpx 30rpx 20rpx;
					background: linear-gradient(90deg, #E8EFFB 0%, rgba(255,255,255,0) 100%);
					.remark{
						width: 70%;
					}
					.orderBtn{
						border-radius: 10rpx;
						background-color: #2066E0;
						padding: 10rpx 30rpx;
						color: #FFFFFF;
					}
				}
			}
		}
	}
</style>
