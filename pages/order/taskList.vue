<template>
	<!-- 客房经理-派单列表页面 -->
	<view class="waitAudit">
		<view class="waitAuditItem boxshadow" v-for="(item,index) in applyList" :key="index">
			<view class="item-top">
				<view class="hotelName">
					{{item.hotelName}}
				</view>
				<view class="createTime">
					申请时间:{{item.createTime}}
				</view>
			</view>
			<view class="remarkContent">
				<view class="remark">
					<view style="transform: scale(0.83);transform-origin: center;">
						总房量：
					</view>
					<view class="message" v-if="type == 0">
						{{item.housekeeperDispatchStatistics.totalRoomNum || 0}}间
					</view>
					<view class="message" v-if="type == 1">
						{{item.pendingReviewNum || 0}}间
					</view>
				</view>
				<view class="remarkBtn" @click="toTask(item)">
					{{type == 0?'前去派单':'前去审核'}}
				</view>
			</view>
			<view class="company" v-if="type == 0">
				累计清洁房间：{{item.housekeeperDispatchStatistics.monthFinishNum || 0}}间
			</view>
		</view>
		<view style="position: absolute;left: 50%;top: 40%;transform: translate(-50%,-50%);" v-if="applyList.length === 0">
			<u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
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
				applyList: [],
				type:0,// 0派单页面 1审核页面
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
		},
		onShow() {
			this.applyList = []
			this.pageNo = 1
			this.getOrderList();
		},
		methods: {
			async getOrderList(){
				let res = ''
				if(this.type == 0){
					res = await this.$post('/housekeeper/searchHousekeeperDispatch',{
						pageNo:this.pageNo,
						pageSize:10
					})
				}else{
					res = await this.$post('/housekeeper/searchHousekeeperAudit',{
						pageNo:this.pageNo,
						pageSize:10
					})
				}
				
				// console.log('排单列表',res)
				if(res.code == 200){
					this.overContent = true;
					if(res.data.list){
						res.data.list.map(d=>{
							d.createTime = d.createTime.replace(/\//g,'-').substring(0,d.createTime.length-3)
						})
						this.total = res.data.total
					}
					this.applyList = this.applyList.concat(res.data.list)
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
			toPath(url){
				uni.navigateTo({
					url:url
				})
			},
			toTask(item){
				if(this.type == 0){
					uni.navigateTo({
						url:`/pages/order/taskManagement?id=${item.id}`
					})
				}else{
					uni.navigateTo({
						url:`/pages/order/auditManagement?id=${item.id}`
					})
				}
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
	.waitAudit {
		font-family: Arial-BoldItalicMT, Arial;
		padding: 0 30rpx;
		.waitAuditItem{
			border-radius: 20rpx;
			background: linear-gradient(90deg, #FFFFFF 60%,#C5D7F7 100%);
			padding: 22rpx 42rpx 40rpx 42rpx;
			box-sizing: border-box;
			margin-top: 40rpx;
			position: relative;
			.item-top{
				display: flex;
				.hotelName{
					width: 50%;
					font-size: 36rpx;
					font-family: YouSheBiaoTiHei;
					color: #000000;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					overflow: hidden;
					-webkit-line-clamp: 2;
					overflow: hidden;
					text-overflow: ellipsis;
					flex-shrink: 0;
				}
				.createTime{
					font-size: 24rpx;
					transform: scale(0.83);
					transform-origin: right center;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: bold;
					color: rgba(0, 0, 0, 0.4);
					white-space: nowrap;
				}
			}
			.remarkContent{
				font-size: 24rpx;
				color: #000000;
				display: flex;
				font-weight: bold;
				justify-content: space-between;
				.remark{
					display: flex;
					.message{
						font-weight: normal;
						color: rgba(0, 0, 0, 0.5);
						font-size: 48rpx;
					}
				}
				.remarkBtn{
					font-size: 24rpx;
					color: #FFFFFF;
					border-radius: 20rpx;
					padding: 12rpx 30rpx;
					background-color: #2066E0;
					align-self: flex-end;
					margin-top: 20rpx;
					&:active{
						background-color: #1850b0;
					}
				}
			}
			.company{
				color: rgba(0, 0, 0, 0.2);
				font-size: 24rpx;
				transform: scale(0.667);
				transform-origin: left bottom;
			}
			
		}
	}
</style>
