<template>
	<!-- 登录页面 -->
	<view class="login-wrapper">
		<view class="header">
			<image class="header-img" src="/static/loginImg.png" mode="widthFix"></image>
			<view class="header-title">
				星火邦邦
			</view>
			<view class="header-identity">
				{{type==1?'清洁人员':type==2?'客房经理':type==3?'销售经理':'酒店人员'}}
			</view>
		</view>
		<view class="content">
			<view class="search">
				<u-input placeholder="请输入账号" border="none" v-model="form.account"
					placeholderStyle="color: #2066E0;font-size: 32rpx;opacity: 0.7;" fontSize="32rpx" color="#2066E0">
					<image class="searchIcon" src="/static/user.png" slot="prefix"></image>
				</u-input>
			</view>
			<view class="search">
				<u-input placeholder="请输入密码" type="password" border="none" v-model="form.pwd"
					placeholderStyle="color: #2066E0;font-size: 32rpx;opacity: 0.7;" fontSize="32rpx" color="#2066E0">
					<image class="searchIcon" src="/static/password.png" slot="prefix"></image>
				</u-input>
			</view>
			<button type="default" v-if="consent == true" class="loginButton" @click="toLogin">
				登    录
			</button>
			<button type="default" v-if="consent == false" class="fail">
				登    录
			</button>
			<view class="attention">
				<u-checkbox-group v-model="checkboxValue1" @change="checkboxChange">
					<u-checkbox  name="true">
					</u-checkbox>
				</u-checkbox-group>
				<view style="text-align: left;">
					同意服务条款、隐私政策、中国联通认证服务协议
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				form:{
					account:'',
					pwd:'',
					loginType:0
				},
				checkboxValue1:["true"],
				consent:true,
				type:0
			};
		},
		onLoad(options) {
			// console.log('传值',options)
			this.type = options.type
			this.form.loginType = options.type
			uni.clearStorageSync('token');
		},
		methods: {
			async toLogin(){
				if(this.form.account == ''){
					uni.showToast({
						title:'请输入账号',
						icon:'none'
					})
					return
				}
				if(this.form.pwd == ''){
					uni.showToast({
						title:'请输入密码',
						icon:'none'
					})
					return
				}
				let res = await this.$post('/home/login', this.form)
				// console.log('登录',res)
				uni.showLoading({
					title: "正在登录",
					icon: "none",
					mask: true
				})
				if(res.code == 200){
					uni.hideLoading();
					uni.setStorageSync('loginType',this.type)
					uni.setStorageSync('token', res.data.token)
					uni.setStorageSync('id', res.data.id)
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
					}
				}else{
					uni.hideLoading();
					uni.showToast({
						title:res.msg,
						icon:"none"
					})
				}
				
			},
			toPage(val) {
				uni.navigateTo({
					url: val,
				});
			},
			toBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			checkboxChange(value){
				this.consent = value[0] == 'true'?true:false
			},
			// 微信登录
			async login(e) {
				// console.log('点击数据',e)
				let that = this;
				uni.showLoading({
					title: "正在登录",
					icon: "none",
					mask: true
				})
				if (e.detail.errMsg == "getPhoneNumber:ok") {

					let res = await that.$API.post('/user/login', {
						code: that.code,
						encryptedData: e.detail.encryptedData,
						iv: e.detail.iv
					})
					if (res.code == 200) {
						uni.hideLoading();
						uni.setStorageSync('token', res.data.token)
						uni.setStorageSync('openId', res.data.wxOpenId)
						getApp().globalData.current = 0
						uni.switchTab({
							url: '/pages/tarbarRouter/indexRouter'
						})
					} else {
						uni.hideLoading();
						uni.redirectTo({
							url: "/pages/login/login"
						})
					}
				} else {
					uni.hideLoading();
					uni.redirectTo({
						url: "/pages/login/Login"
					})
				}
			},
		}
	};
</script>

<style scoped>
	.login-wrapper {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}

	.goback {
		width: 90%;
		display: flex;
		padding-top: 60rpx;
		justify-content: flex-start;
		z-index: 11;
	}

	.content {
		width: 85%;
		margin-top: 40rpx;
		text-align: center;
		color: rgba(0, 0, 0, 0.6);
	}

	.search {
		border: 1px solid #2066E0;
		border-radius: 50rpx;
		padding: 10px 20px;
		margin-top: 20rpx;
	}

	.searchIcon {
		width: 32rpx;
		height: 40rpx;
		display: block;
		margin-right: 40rpx;
	}

	.header {
		width: 100%;
		z-index: 11;
		position: relative;
	}

	.header-img {
		width: 100%;
		display: block;
	}

	.header-title {
		font-size: 84rpx;
		font-family: YouSheBiaoTiHei;
		color: #FFFFFF;
		font-weight: bold;

		position: absolute;
		top: 33%;
		left: 10%;
	}
	.header-identity{
		font-size: 48rpx;
		font-weight: bold;
		font-family: YouSheBiaoTiHei;
		position: absolute;
		top: 50%;
		left: 16.5%;
		color: #FFFFFF;
	}
	.loginButton {
		height: 100rpx;
		font-size: 38rpx;
		color: #FFFFFF;
		font-family: YouSheBiaoTiHei;
		font-weight: bold;
		background-color: #2066E0 !important;
		margin-top: 60rpx;
		border-radius: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.loginButton:active {
		background-color: #174aa3 !important;
	}
	.fail{
		height: 100rpx;
		font-size: 38rpx;
		color: #FFFFFF;
		font-family: YouSheBiaoTiHei;
		font-weight: bold;
		background-color: #4d4d4e !important;
		margin-top: 60rpx;
		border-radius: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.attention {
		font-size: 24rpx;
		color: #2066E0;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 40rpx;
	}
</style>
