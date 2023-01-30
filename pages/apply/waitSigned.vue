<template>
	<!-- 销售经理-待签约页面 -->
	<view class="waitAudit">
		<view :class="['waitAuditItem','boxshadow',{sItem:item.status == 1},{fItem:item.status == 2}]" v-for="(item,index) in applyList" :key="index">
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
						备注：
					</view>
					<view class="message">
						<view class="message-row">账号：{{item.account}}</view>
						<view class="message-row">密码：{{item.pwd}}</view>
					</view>
				</view>
				<!-- <view :class="['remarkBtn',{sBtn:item.auditState == 2},{fBtn:item.auditState == -1}]"> -->
				<view class="remarkBtn" @click="sendContract(item)">
					{{item.auditState== 1?'发送合同':item.auditState== -1?'审核失败':'待审核'}}
				</view>
			</view>
			<view class="company">
				{{item.companyName}}
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
			async getHotelList(){
				let res = await this.$API.post('/hotel/searchHotel', {
					pageNo:this.pageNo,
					pageSize:10,
					auditState:1
				})
				// console.log('酒店列表',res)
				if(res.code == 200){
					this.overContent = true;
					this.total = res.data.total
					this.applyList = this.applyList.concat(res.data.list);
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
			sendContract(item) {
				let that = this
				if(item.auditState != 1)return
				uni.showModal({
					title: '温馨提示',
					content: '确认已发送合同?',
					success: async (res) => {
						if (res.confirm) {
							let res = await that.$API.put('/hotel/sendContract/' + item.id)
							if (res.code == 200) {
								uni.showToast({
									title: '确认成功',
									icon: "none",
									mask: true,
									success() {
										setTimeout(() => {
											that.pageNo = 1
											that.overContent = true;
											that.applyList = []
											that.getHotelList()
										}, 1000)
									}
								})
							}
						}
					}
				})
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
	.waitAudit {
		font-family: Arial-BoldItalicMT, Arial;
		padding: 0 30rpx;
		.waitAuditItem{
			border-radius: 20rpx;
			background: linear-gradient(90deg, #FFFFFF 80%,#C5D7F7 100%);
			padding: 22rpx 42rpx 40rpx 42rpx;
			box-sizing: border-box;
			margin-top: 40rpx;
			position: relative;
			.item-top{
				display: flex;
				align-items: center;
				.hotelName{
					width: 50%;
					font-size: 36rpx;
					font-family: YouSheBiaoTiHei;
					color: #000000;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.createTime{
					font-size: 24rpx;
					transform: scale(0.83);
					transform-origin: right center;
					white-space: nowrap;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: bold;
					color: rgba(0, 0, 0, 0.4);
				}
			}
			.remarkContent{
				font-size: 24rpx;
				color: #000000;
				display: flex;
				justify-content: space-between;
				margin: 26rpx 0 10rpx 0;
				.remark{
					display: flex;
					.message{
						color: rgba(0, 0, 0, 0.5);
						.message-row{
							transform: scale(0.67);
							transform-origin: left center;
						}
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
				.sBtn{
					background-color: #53C79D;
					&:active{
						background-color: #45a682;
					}
				}
				.fBtn{
					background-color: #F20706;
					&:active{
						background-color: #ad0404;
					}
				}
			}
			.company{
				color: rgba(0, 0, 0, 0.2);
				font-size: 36rpx;
				transform: scale(0.5);
				transform-origin: left bottom;
			}
			
		}
		.sItem{
			background: linear-gradient(90deg, #FFFFFF 80%,#D2F0E5 100%);
		}
		.fItem{
			background: linear-gradient(90deg, #FFFFFF 80%,#FCCECE 100%);
		}
	}
</style>
