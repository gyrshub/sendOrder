<template>
	<!-- 订单详情页面 -->
	<view class="repair">
		<view class="showTop">
			<view style="display: flex;justify-content: center;">
				<view class="roomNumber">
					{{form.roomNo}}
				</view>
			</view>
		</view>
		<view class="content">
			<view class="content-item" style="justify-content: space-between;">
				<view style="width: 30%;">
					订单类型:
				</view>
				<!-- 1续住清洁 2退房清洁 3钟点房清洁 -->
				<view style="width: 60%;" @click="show = true">
					{{form.orderType == 1?'续住清洁':form.orderType == 2?'退房清洁':'钟点房清洁'}}
				</view>
			</view>
			<view class="content-item" style="justify-content: space-between;" @click="show = true">
				<view style="width: 30%;">
					审核状态:
				</view>
				<view style="width: 60%;" @click="show = true">
					{{form.orderState == 3?'通过':form.orderState == -1?'驳回':'待审核'}}
				</view>
			</view>
			<view class="content-item" style="margin-top: 26rpx;" v-if="form.orderState == -1">
				<view style="margin-right: 20rpx;">
					<span style="color: #FB1828;vertical-align: middle;margin-right: 10rpx;">*</span>驳回原因:
				</view>
				<u-input placeholder="请输入驳回原因" border="surround" fontSize="32rpx" v-model="form.rejection"></u-input>
			</view>
			<view class="content-item">
				<view class="row-content">
					<image class="showImg" :src="form.bedPicture"></image>
					<view>
						床
					</view>
				</view>
				<view class="row-content">
					<image class="showImg" :src="form.toiletPicture"></image>
					<view>
						卫生间
					</view>
				</view>
				<!-- <view class="row-content">
					<image class="showImg" :src="form.airConditionerPicture"></image>
					<view>
						空调
					</view>
				</view> -->
			</view>

			<view class="content-item">
				<view class="row-content">
					<image class="showImg" :src="form.doorPicture"></image>
					<view>
						门牌图
					</view>
				</view>
				<!-- <view class="row-content">
					<image class="showImg" :src="form.tablePicture"></image>
					<view>
						桌子
					</view>
				</view>
				<view class="row-content">
					<image class="showImg" :src="form.chairPicture"></image>
					<view>
						椅子
					</view>
				</view> -->
			</view>
			
			<!-- <view class="content-item">
				<view class="row-content">
					<image class="showImg" :src="form.windowPicture"></image>
					<view>
						窗户
					</view>
				</view>
				<view class="row-content">
					<image class="showImg" :src="form.toiletPicture"></image>
					<view>
						卫生间
					</view>
				</view>
			</view> -->
			<view class="loginOut boxshadow" style="margin-top: 40rpx;" @click="confirmOrder">
				确认审核
			</view>
		</view>
		<!-- 订单类型 -->
		<u-action-sheet :actions="columns" title="审核订单" :show="show" :closeOnClickOverlay="true" @select="confirmType"
			@close="show = false"></u-action-sheet>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 0, // 报修0 上传图片1
				form: {
					bedPicture: '', // 床图片
					// airConditionerPicture: '', // 空调
					// tablePicture: '', // 桌子图片
					// chairPicture: '', // 椅子图片
					// windowPicture: '', // 窗户图片
					toiletPicture: '', // 卫生间
					doorPicture:'',
				},
				show: false,
				columns: [{
					name: '通过'
				}, {
					name: '驳回'
				}],
			};
		},
		onLoad() {
			let a = JSON.parse(uni.getStorageSync('orderDetail'));
			// console.log('订单详情',a)
			this.form = JSON.parse(uni.getStorageSync('orderDetail'))
		},
		methods: {
			async confirmOrder() {
				let that = this
				if(this.form.orderState == 3 || this.form.orderState == -1){
					let	res = await this.$API.put('/hotelOrder/updateHotelOrderAudit', this.form)
					// console.log('结果', res)
					if (res.code == 200) {
						uni.showToast({
							title: '提交成功',
							icon: "none",
							mask: true,
							success() {
								setTimeout(() => {
									uni.navigateBack({
										delta: 1
									})
								}, 1500)
							}
						})
					}
				}else{
					uni.showToast({
						title:'请选择审核状态',
						icon:"none"
					})
				}
			},
			confirmType(value){
				if(value.name == '通过'){
					this.form.orderState = 3
				}else{
					this.form.orderState = -1
				}
			},
			toPath() {
				if (this.type == 0) {
					uni.switchTab({
						url: '/pages/my/index'
					})
				} else {
					uni.navigateBack({
						delta: 1
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
	.repair {
		padding: 36rpx 70rpx;

		.roomNumber {
			font-size: 48rpx;
			color: #FFFFFF;
			font-family: Arial-BoldItalicMT, Arial;
			background-color: #2066E0;
			padding: 6rpx 12rpx;
			transform: skewX(-15deg);
			border-radius: 10rpx;
			margin-right: 20rpx;
		}

		.showTop {}

		.content {
			font-size: 32rpx;
			.content-item {
				margin-top: 40rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-weight: 600;
				color: #333333;

				.showImg {
					width: 200rpx;
					height: 200rpx;
					border-radius: 20rpx;
					margin-bottom: 20rpx;
				}

				.row-content {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}
			}
		}

		.loginOut {
			color: #2066E0;
			width: 100%;
			font-size: 36rpx;
			font-weight: bold;
			font-family: YouSheBiaoTiHei;
			border-radius: 40rpx;
			background-color: white;
			display: flex;
			justify-content: center;
			padding: 28rpx 0;
			margin-bottom: 40rpx;
		}
		.repairBtn{
			width: 80%;
			position: fixed;
			left: 50%;
			bottom: 30rpx;
			transform: translate(-50%, -50%)
		}
	}
</style>
