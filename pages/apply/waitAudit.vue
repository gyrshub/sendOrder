<template>
	<!-- 销售经理-待审核页面 -->
	<view class="waitAudit">
		<view class="waitAuditItem boxshadow" v-for="(item,index) in applyList" :key="index">
			<view class="hotelName">
				{{item.hotelName}}
			</view>
			<view class="company">
				{{item.companyName}}
			</view>
			<view class="createTime">
				<view class="showTime">
					申请时间:{{item.createTime}}
				</view>
				<view class="btnStyle" @click="reWrite(item.id)" v-if="item.auditState == -1">
					修改
				</view>
			</view>
			<view class="mark" v-if="item.auditState == -1">
				驳回原因:{{item.rejection}}
			</view>
			<view :class="['tip',{success:item.auditState == 1},{fail:item.auditState == -1}]">
				{{item.auditState == -1?'驳回':item.auditState == 1?'通过':'待审核'}}
			</view>
		</view>
		<view style="height: 80rpx;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 0,
				pageNo: 1,
				total: 10,
				overContent: true, // 节流
				applyList: [],
			}
		},
		onReachBottom() {
			// 触底的时候请求数据，即为上拉加载更多
			let allTotal = this.pageNo * 10
			if (allTotal < this.total && this.overContent) {
				this.overContent = false;
				this.pageNo++;
				this.getHotelList();
			}
		},
		created() {
			this.getHotelList();
		},
		methods: {
			async getHotelList() {
				let res = await this.$API.post('/hotel/searchHotel', {
					pageNo: this.pageNo,
					pageSize: 10,
					auditState: 0
				})
				// console.log('酒店列表', res)
				if (res.code == 200) {
					this.overContent = true;
					this.total = res.data.total
					this.applyList = this.applyList.concat(res.data.list);
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
			reWrite(id){
				uni.navigateTo({
					url:`/pages/apply/index?id=${id}&type=1`
				})
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
	.waitAudit {
		font-family: Arial-BoldItalicMT, Arial;
		padding: 0 30rpx;

		.waitAuditItem {
			border-radius: 20rpx;
			background-color: #FFFFFF;
			padding: 22rpx 42rpx 40rpx 42rpx;
			box-sizing: border-box;
			margin-top: 40rpx;
			position: relative;

			.hotelName {
				font-size: 36rpx;
				font-family: YouSheBiaoTiHei;
				color: #000000;
			}

			.company {
				color: rgba(0, 0, 0, 0.2);
				font-size: 36rpx;
				transform: scale(0.5);
				transform-origin: left top;
			}

			.createTime {
				margin-top: -10rpx;
				font-size: 24rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: bold;
				color: #8CAFEE;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.showTime{
					width: 70%;
				}
				.btnStyle{
					border-radius: 20rpx;
					padding: 10rpx 40rpx;
					background-color: #2066E0;
					color: #FFFFFF;
					font-size: 28rpx;
					&:active{
						background-color: #1951b3;
					}
				}
			}
			.mark{
				font-size: 24rpx;
				color: #F20706;
			}

			.tip {
				position: absolute;
				right: 0;
				top: 0;
				background: #2066E0;
				padding: 10rpx 44rpx;
				border-radius: 0px 8px 0px 20px;
				font-size: 40rpx;
				font-family: YouSheBiaoTiHei;
				color: #FFFFFF;
			}
			.success{
				background: #53C79D;
			}
			.fail{
				background: #F20706;
			}
		}
	}
</style>
