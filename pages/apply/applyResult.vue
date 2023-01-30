<template>
	<view class="applyResult">
		<image style="width: 480rpx;height: 480rpx;margin-top: 200rpx;" src="/static/auditResult.png"></image>
		<view style="color: #707070;font-size: 32rpx;margin-top: -140rpx;">
			等待审核...
		</view>
		<view class="bottomTool">
			<view class="loginOut boxshadow" @click="toPath">
				完成
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				type: 100
			};
		},
		onLoad(options) {
			this.type = options.type
		},
		methods:{
			toPath(){
				uni.switchTab({
					url:'/pages/my/marketingManager'
				})
			}
		}
	}
</script>
<style lang="less" scoped>
	.applyResult{
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.bottomTool {
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
		padding: 80rpx 60rpx;
		box-sizing: border-box;
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
	}
</style>
