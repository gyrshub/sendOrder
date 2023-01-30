<template>
	<!-- 酒店经理-酒店管理页面 -->
	<view class="waitAudit">
		<view class="waitAuditItem boxshadow" v-for="(item,index) in applyList" :key="index">
			<view class="infoContent">
				<view class="hotelName">
					{{item.hotel}}
				</view>
				<view class="telphone">
					{{item.name}}:{{item.phone}}
				</view>
				<view class="createTime">
					申请时间:{{item.time}}
				</view>
			</view>
			<view class="tool">
				<view class="">
					联系次数:{{item.number}}
				</view>
				<view class="remarkBtn" @click="telephone(item.phone)">
					拨打电话
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
				applyList: [{
					time:'2022-05-06 15:30',
					name:'张总',
					phone:'13848411777',
					hotel:'希尔顿酒店',
					number:1,
				},{
					time:'2022-05-06 15:30',
					name:'张总',
					phone:'13848411777',
					hotel:'希尔顿酒店',
					number:2,
				},{
					time:'2022-05-06 15:30',
					name:'张总',
					phone:'13848411777',
					hotel:'希尔顿酒店',
					number:3,
				}],
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
		created() {
			// this.getOrderList();
		},
		methods: {
			async getOrderList(){
				
			},
			tapButton(item){
				if(item.status == 1){
					this.toPath(`/pages/order/repair?type=1`)
				}else if(item.status == 0){
					
				}
			},
			toPath(url){
				uni.navigateTo({
					url:url
				})
			},
			// 打电话
			telephone(phone){
				let that = this;
				const res = uni.getSystemInfoSync();
				if (res.platform === 'ios') {
					uni.makePhoneCall({
						phoneNumber: phone,
						success() {
						},
						fail() {
						}
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
		}
	}
</script>

<style>
	page {
		background-color: #FAF9FE;
	}
</style>
<style lang="less" scoped>
	.waitAudit {
		font-family: Arial-BoldItalicMT, Arial;
		padding: 0 30rpx;
		.waitAuditItem{
			border-radius: 20rpx;
			background-color: #FFFFFF;
			padding: 22rpx 42rpx 40rpx 42rpx;
			box-sizing: border-box;
			margin-top: 40rpx;
			position: relative;
			display: flex;
			justify-content: space-between;
			.infoContent{
				width: 68%;
				.hotelName{
					font-size: 36rpx;
					font-family: YouSheBiaoTiHei;
					color: #000000;
				}
				.telphone{
					color: rgba(0, 0, 0, 0.8);
					font-size: 28rpx;
				}
				.createTime{
					margin-top: 8rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: bold;
					color: #8CAFEE;
				}
			}
			.tool{
				font-size: 28rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.remarkBtn{
					font-size: 24rpx;
					color: #FFFFFF;
					border-radius: 20rpx;
					padding: 12rpx 30rpx;
					background-color: #2066E0;
					align-self: flex-end;
					margin-top: 10rpx;
					&:active{
						background-color: #1850b0;
					}
				}
			}
		}
	}
</style>
