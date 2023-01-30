<template>
	<!-- 首页 -->
	<view class="home">
		<view class="status_bar" :style="{ height: statusBarHeight + 10 + 'px' }"></view>
		<view class="home-top">
			<view class="userInfo">
				<view class="userImg boxshadow" @click="toHome">
					<image style="width: 100%;height: 100%;display: block;" v-if="userInfo.avatar" :src="userInfo.avatar"></image>
					<image style="width: 100%;height: 100%;display: block;" v-if="!userInfo.avatar" src="/static/defaultImg.jpg"></image>
				</view>
				
				<view class="hotelName">
					<view class="hotel">
						{{title}}
					</view>
					<view class="name" v-if="userInfo.realName">
						<view class="circle" style="background-color: #1F66DF;margin-right: 24rpx;"></view>
						{{userInfo.realName || ''}}
					</view>
				</view>
				
				<view class="remind boxshadow">
					<!-- <image style="width: 42rpx;height: 42rpx;" src="/static/message.png"></image> -->
					<view class="circle" style="position: absolute;top: 20%;right: 20%;"></view>
				</view>
				
			</view>
			<swiper circular :autoplay="true" style="height: 400rpx;margin: 60rpx -22rpx 0px -22rpx;">
				<swiper-item style="padding: 20rpx;box-sizing: border-box;" v-for="(item,index) in carouselList"
					:key="index">
					<image class="topImg" :src="item.picture"></image>
				</swiper-item>
			</swiper>
			<view class="content" v-if="type== 0">
				<view style="font-weight: bold;font-family: YouSheBiaoTiHei;">
					角色登录
				</view>
				<view class="identityList">
					<view class="identityItem boxshadow" v-for="(item,index) in identityList" :key="index"
						@click="toLogin(item)">
						<image class="identityImg" :src="item.image"></image>
						<view class="identityListText">
							{{item.name}}
						</view>
					</view>
				</view>
			</view>
			<view style="height: 180rpx;"></view>
			<view class="bottomTool">
				<view class="bottomItem" style="background-color: white;">
					<image style="width: 34rpx;height: 34rpx;margin-right: 20rpx;" src="/static/home.png"></image>
					<view>
						首页
					</view>
				</view>
				<view class="bottomItem" @click="toHome">
					<image style="width: 40rpx;height: 40rpx;" src="/static/mine1.png"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'星火邦邦',
				default:{
					avatar:'/static/defaultImg.jpg'
				},
				userInfo:'',
				carouselList: [{
						picture: 'https://zy.xry.ink/file-api/statics/2022/11/09/e65589e9f3394be29f20e09fd6a56ad4_20221109163516A410.png'
					},
					{
						picture: 'https://zy.xry.ink/file-api/statics/2022/11/09/e66369d7dfc746ae80ee095ffa6f9ab4_20221109163639A411.png'
					},
					{
						picture: 'https://zy.xry.ink/file-api/statics/2022/11/09/daaaa442b4394ade8f00f5d3c013a75e_20221109163702A412.png',
					},
					{
						picture: 'https://zy.xry.ink/file-api/statics/2022/11/09/5d50b41299d44884af003f8d4331200f_20221109163726A413.png'
					},
					{
						picture: 'https://zy.xry.ink/file-api/statics/2022/11/09/491a83e76a2344238433d258bc0877c0_20221109163740A414.png'
					},
					{
						picture: 'https://zy.xry.ink/file-api/statics/2022/11/09/a4641fe70dab4bf9ba805685bfc3c6e0_20221109163757A415.png'
					},
				],
				identityList: [{
						name: '清洁人员',
						image: 'https://zy.xry.ink/file-api/statics/2022/11/09/a8d4ee4739ba42db894fb990ac6fc59c_20221109163853A416.png',
						type: 1,
					},
					{
						name: '客房经理',
						image: 'https://zy.xry.ink/file-api/statics/2022/11/09/4f4c34ccd0674ced949fa79ab45f65d4_20221109163940A417.png',
						type: 2,
					},
					{
						name: '销售经理',
						image: 'https://zy.xry.ink/file-api/statics/2022/11/09/29ac5721758d46dd8cdb9d48748ea464_20221109163954A418.png',
						type: 3,
					},
					{
						name: '酒店人员',
						image: 'https://zy.xry.ink/file-api/statics/2022/11/09/8a4d64ebfc0f42ce8e6a59de89d7f274_20221109164008A419.jpg',
						type: 4,
					},
				],
				statusBarHeight: 0, // 状态栏高度
				type:0
			}
		},
		onShow() {
			let type = uni.getStorageSync('loginType')
			if(type){
				this.type = type
				this.getUserInfo()
			}else{
				this.type = 0
				this.userInfo = this.default
			}
		},
		created() {
			let statusBarHeight = getApp().globalData.statusBarHeight; //高度
			this.statusBarHeight = statusBarHeight;
			uni.hideTabBar()
		},
		methods: {
			async getUserInfo(){
				let res = ''
				if(this.type == 1){
					res = await this.$get('/aunt/getAunt')
				}else if(this.type == 2){
					res = await this.$get('/housekeeper/getHousekeeper')
				}else if(this.type == 3){
					res = await this.$get('/salesman/getSalesman')
				}
				// console.log('用户信息',res)
				if(res.code == 200){
					this.userInfo = res.data
				}
			},
			toLogin(item) {
				if (item.type == 4) {
					uni.showToast({
						title: '暂无该身份跳转',
						icon: "none",
					})
					return
				}
				uni.showModal({
					title: '登录',
					content: `确认以${item.name}身份登录?`,
					success: async (res) => {
						if (res.confirm) {
							uni.navigateTo({
								url: `/pages/login/login?type=${item.type}`
							})
						}
					}
				})
			},
			toHome() {
				switch(this.type){
					case '1':
					uni.switchTab({
						url:'/pages/my/index'
					})
					break;
					case '2':
					uni.switchTab({
						url:'/pages/my/steward'
					})
					break;
					case '3':
					uni.switchTab({
						url:'/pages/my/marketingManager'
					})
					break;
					default:
					uni.showToast({
						title:'请选择角色登陆',
						icon:"none"
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
	.home {
		.userInfo {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.remind {
				opacity: 0;
				width: 80rpx;
				height: 80rpx;
				box-sizing: border-box;
				box-sizing: border-box;
				position: relative;
				border-radius: 20rpx;
				background-color: white;
				padding: 20rpx;
			}

			.hotelName {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-weight: bold;
				font-family: YouSheBiaoTiHei;

				.hotel {
					font-size: 36rpx;
					margin-bottom: 8rpx;
				}

				.name {
					font-size: 32rpx;
					display: flex;
					align-items: center;
				}
			}

			.userImg {
				width: 80rpx;
				height: 80rpx;
				border-radius: 20rpx;
				background-color: white;
				overflow: hidden;
			}

			.circle {
				width: 20rpx;
				height: 20rpx;
				border-radius: 50%;
				background-color: #FF2E2E;
			}
		}

		.home-top {
			padding: 24rpx 32rpx;

			.topImg {
				width: 100%;
				height: 100%;
				display: block;
			}
		}

		.content {
			margin-top: 60rpx;

			.identityList {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;

				.identityItem {
					width: 48%;
					height: 170rpx;
					position: relative;
					border-radius: 20rpx;
					margin-top: 20rpx;
					display: flex;
					align-items: flex-end;
					background-color: #FFFFFF;
					.identityImg {
						width: 120rpx;
						height: 160rpx;
						margin-left: 6%;
						display: block;
						image-rendering: -moz-crisp-edges;
						image-rendering: -o-crisp-edges;
						image-rendering: -webkit-optimize-contrast;
						image-rendering: crisp-edges;
						-ms-interpolation-mode: nearest-neighbor;
					}

					.identityListText {
						font-weight: 900;
						font-size: 34rpx;
						position: absolute;
						left: 50%;
						top: 40%;
						font-style: oblique;
						white-space: nowrap;
					}
				}
			}
		}

		.bottomTool {
			width: 100%;
			position: fixed;
			bottom: 0;
			left: 0;
			background-color: #2066E0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 80rpx 130rpx 40rpx 130rpx;
			box-sizing: border-box;
			border-radius: 0 0 40rpx 40rpx;

			&::after {
				content: '';
				background-color: #FAF9FE;
				width: 100%;
				height: 40rpx;
				position: absolute;
				left: 0;
				top: 0;
				border-radius: 0 0 40rpx 40rpx;
			}

			.bottomItem {
				width: 180rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50rpx;
				padding: 10rpx 0;
				color: #2066E0;
				font-size: 28rpx;
				font-family: YouSheBiaoTiHei;
			}
		}
	}
</style>
