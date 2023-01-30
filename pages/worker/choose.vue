<template>
	<!-- 酒店管家-选择阿姨页面 -->
	<view class="worker" style="position: relative;z-index: 1;">
		<view :class="['workerItem','boxshadow',{active:item.choosed}]" v-for="(item,index) in serverList" :key="index"
			@click="chooseWorker(index)">
			<image class="serveImg" :src="item.avatar"></image>
			<view class="serveInfo">
				<view class="serveInfo-title">
					{{item.realName || ''}}
				</view>
				<view class="serveInfo-row">
					年龄:{{item.age || ''}}
				</view>
				<view class="serveInfo-row">
					工龄:{{item.workAge || ''}}
				</view>
				<view class="serveInfo-row">
					手机:{{item.phone || ''}}
				</view>
			</view>
			<view class="tip">
				{{item.choosed?'已选择':'选择'}}
			</view>
		</view>
		<view style="height: 200rpx;"></view>
		<view class="bottomTool" @click="confirmWorker">
			<view :class="['loginOut','boxshadow',{lightText:choosed}]">
				选择阿姨
			</view>
		</view>
		<u-popup :show="show" @close="close" mode="center" round="10">
		    <view style="width: 60vw;padding: 60rpx 40rpx;">
				<view style="margin-bottom: 40rpx;">
					<view style="font-size: 32rpx;margin-bottom: 20rpx;">
						订单备注
					</view>
					<u--input
					    placeholder="请输入订单备注"
					    border="surround"
					    v-model="form.remark"
						fontSize="32rpx"
						placeholderStyle="font-size: 32rpx;"
					  ></u--input>
				</view>
				<view style="display: flex;justify-content: space-between;">
					<u-button type="primary" text="确定" customStyle="width: 40%;" @click="auditOrder"></u-button>
					<u-button type="error" text="取消" customStyle="width: 40%;" @click="close()"></u-button>
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
				overContent: true, // 节流
				serverList: [],
				choosed: false,
				form: {
					// orderType:0,// 1续住 2退房
					addAuntRoomDTOList: '',
					hotelId: '',
					remark:'',
				},
				type: 0, // 0选择阿姨派单 1更换阿姨
			}
		},
		onReachBottom() {
			// 触底的时候请求数据，即为上拉加载更多
			let allTotal = this.pageNo * 10
			if (allTotal < this.total && this.overContent) {
				this.overContent = false;
				this.pageNo++;
				this.getWorkerList();
			}
		},
		onLoad(options) {
			// console.log('传值', options)
			// this.form.orderType = options.type
			this.type = options.type
			this.form.hotelId = options.hotelId
			if (options.ids) {
				if (this.type == 0) {
					this.form.addAuntRoomDTOList = JSON.parse(options.ids)
				} else {
					this.form.updateAuntRoomDTOList = JSON.parse(options.ids)
				}
			}
		},
		created() {
			this.getWorkerList();
		},
		methods: {
			async getWorkerList() {
				let res = await this.$API.post('/aunt/searchAunt', {
					pageNo: this.pageNo,
					pageSize: 10
				})
				// console.log('阿姨列表',res)
				if (res.code == 200) {
					this.overContent = true;
					res.data.list.map(d => {
						d.choosed = false
					})
					this.total = res.data.total
					this.serverList = this.serverList.concat(res.data.list);
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
			chooseWorker(index) {
				let flag = false
				for (let i = 0; i < this.serverList.length; i++) {
					this.serverList[i].choosed = false
					if (i == index) {
						flag = true
						this.serverList[i].choosed = true
					}
				}
				this.choosed = flag

				if (this.type == 0) {
					for (let i = 0; i < this.form.addAuntRoomDTOList.length; i++) {
						this.form.addAuntRoomDTOList[i].auntId = this.serverList[index].id
					}
				} else {
					for (let i = 0; i < this.form.updateAuntRoomDTOList.length; i++) {
						this.form.updateAuntRoomDTOList[i].auntId = this.serverList[index].id
					}
				}

			},
			async confirmWorker() {
				if (!this.choosed) {
					uni.showToast({
						title: '请选择阿姨',
						icon: "none"
					})
					return
				}
				this.show = true
			},
			async auditOrder(){
				let that = this
				let res = ''
				if(this.type == 0){
					res = await this.$post('/hotelOrder/addHotelOrder', this.form)
				}else{
					res = await this.$API.put('/hotelOrder/updateHotelOrder', this.form)
				}
				if (res.code == 200) {
					let title = this.type == 0?'派单成功':'更换成功'
					uni.showToast({
						title: title,
						icon: "none",
						mask: true,
						success() {
							setTimeout(() => {
								that.show = true
								uni.navigateBack({
									delta: 1
								})
							}, 1500)
						}
					})
				} else {
					uni.showToast({
						title: res.msg,
						icon: "none",
					})
				}
			},
			close(){
				this.show = false
				this.form.remark = ''
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
	.worker {
		font-family: Arial-BoldItalicMT, Arial;
		padding: 0 30rpx;

		.workerItem {
			border-radius: 20rpx;
			background-color: #FFFFFF;
			padding: 26rpx 0 34rpx 34rpx;
			box-sizing: border-box;
			margin-top: 40rpx;
			position: relative;
			margin-right: 30rpx;
			display: flex;
			border: 6rpx solid transparent;

			.tip {
				position: absolute;
				font-size: 38rpx;
				font-weight: bold;
				right: -32rpx;
				top: 30%;
				width: 240rpx;
				background-color: #1E5BC7;
				border-radius: 20rpx 0 0 30rpx;
				color: #FFFFFF;
				text-align: center;
				padding: 4rpx 0;
				box-sizing: border-box;
				transform: rotate(15deg) skewX(15deg);

				&::after {
					content: '';
					width: 0;
					height: 0;
					position: absolute;
					right: -2rpx;
					bottom: -12rpx;
					border-left: 20rpx solid transparent;
					top: 20rpx solid transparent;
					border-right: 20rpx solid transparent;
					border-bottom: 14rpx solid #094294;
					border-radius: 0 0 0 10rpx;
					transform: rotate(-40deg);
				}
			}

			.serveImg {
				border-radius: 20rpx;
				width: 160rpx;
				height: 160rpx;
				margin-right: 40rpx;
				flex-shrink: 0;
			}

			.serveInfo {
				flex: 1;

				.serveInfo-title {
					font-size: 36rpx;
					color: #000000;
					font-family: YouSheBiaoTiHei;
					font-weight: bold;
					margin-bottom: 14rpx;
				}

				.serveInfo-row {
					font-size: 24rpx;
					color: #333333;
				}
			}
		}

		.active {
			border: 6rpx solid #094BC9;
		}

		.bottomTool {
			width: 100%;
			position: fixed;
			padding: 0 40rpx;
			box-sizing: border-box;
			left: 0;
			bottom: 80rpx;
		}

		.loginOut {
			color: #7E7D80;
			font-size: 36rpx;
			font-weight: bold;
			font-family: YouSheBiaoTiHei;
			border-radius: 40rpx;
			background-color: white;
			display: flex;
			justify-content: center;
			padding: 28rpx 0;
		}
		.lightText{
			color: #094BC9;
		}
	}
</style>
