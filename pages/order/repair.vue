<template>
	<!-- 报修中心和上传图片页面 -->
	<view class="repair">
		<view style="display: flex;justify-content: center;" v-if="type == 1">
			<view class="roomNumber">
				{{form.roomNo}}
			</view>
		</view>
		<view class="showTop" v-if="type == 0">
			<view>
				<view style="font-size: 28rpx;color: #999999;">
					<span style="color: #FB1828;vertical-align: middle;margin-right: 10rpx;">*</span>请填写房间号
				</view>
				<u-input placeholder="请输入房间号" border="surround" fontSize="32rpx" v-model="form.roomNo"></u-input>
			</view>
			<view class="" style="margin-top: 20rpx;">
				<view style="font-size: 28rpx;color: #999999;">
					请填写备注(可选)
				</view>
				<u-input placeholder="请输入备注" border="surround" fontSize="32rpx" v-model="form.remark"></u-input>
			</view>
		</view>
		<view class="content" v-if="type == 0">
			<view class="content-item" style="justify-content: center;">
				<u-upload width="90" height="90" :fileList="fileList10" @afterRead="afterRead"
					@delete="deletePic" name="10" :maxCount="5">
					<view class="row-content">
						<image src="/static/addIcon.png" mode="widthFix" class="showImg"></image>
					</view>
				</u-upload>
			</view>
			<view class="loginOut boxshadow repairBtn" @click="repair">
				上传图片
			</view>
		</view>
		<view class="content" v-if="type == 1">
			<view class="content-item" style="justify-content: space-between;">
				<view style="width: 30%;">
					<span style="color: #FB1828;vertical-align: middle;margin-right: 10rpx;" >*</span>订单类型:
				</view>
				<!-- 1续住清洁 2退房清洁 3钟点房清洁 -->
				<view style="width: 60%;" @click="show = true">
					{{form.orderType == 1?'续住清洁':form.orderType == 2?'退房清洁':form.orderType == 3?'钟点房清洁':'请选择清洁类型'}}
				</view>
			</view>
			<view class="content-item">
				<view class="row-content">
					<image class="showImg" :src="localImg.bed"></image>
					<view>
						示例图片
					</view>
				</view>
				<view class="row-content">
					<u-upload customStyle="flex:none;" width="100" height="100" :fileList="fileList1"
						@afterRead="afterRead" @delete="deletePic" name="1" :maxCount="1">
						<view class="row-content">
							<image src="/static/addIcon.png" mode="widthFix" class="showImg"></image>
							<view>
								床
							</view>
						</view>
					</u-upload>
					<view v-if="fileList1.length!=0">
						床
					</view>
				</view>
			</view>

			<!-- <view class="content-item">
				<view class="row-content">
					<image class="showImg" src="/static/bedImage.png"></image>
					<view>
						示例图片
					</view>
				</view>
				<view class="row-content">
					<u-upload customStyle="flex:none;" width="100" height="100" :fileList="fileList2"
						@afterRead="afterRead" @delete="deletePic" name="2" :maxCount="1">
						<view class="row-content">
							<image src="/static/addIcon.png" mode="widthFix" class="showImg"></image>
							<view>
								空调
							</view>
						</view>
					</u-upload>
					<view v-if="fileList2.length!=0">
						空调
					</view>
				</view>
			</view> -->

			<!-- <view class="content-item">
				<view class="row-content">
					<image class="showImg" src="/static/bedImage.png"></image>
					<view>
						示例图片
					</view>
				</view>
				<view class="row-content">
					<u-upload customStyle="flex:none;" width="100" height="100" :fileList="fileList3"
						@afterRead="afterRead" @delete="deletePic" name="3" :maxCount="1">
						<view class="row-content">
							<image src="/static/addIcon.png" mode="widthFix" class="showImg"></image>
							<view>
								桌子
							</view>
						</view>
					</u-upload>
					<view v-if="fileList3.length!=0">
						桌子
					</view>
				</view>
			</view> -->

			<!-- <view class="content-item">
				<view class="row-content">
					<image class="showImg" src="/static/bedImage.png"></image>
					<view>
						示例图片
					</view>
				</view>
				<view class="row-content">
					<u-upload customStyle="flex:none;" width="100" height="100" :fileList="fileList4"
						@afterRead="afterRead" @delete="deletePic" name="4" :maxCount="1">
						<view class="row-content">
							<image src="/static/addIcon.png" mode="widthFix" class="showImg"></image>
							<view>
								椅子
							</view>
						</view>
					</u-upload>
					<view v-if="fileList4.length!=0">
						椅子
					</view>
				</view>
			</view> -->
			
			<view class="content-item">
				<view class="row-content">
					<image class="showImg" :src="localImg.bathRoom"></image>
					<view>
						示例图片
					</view>
				</view>
				<view class="row-content">
					<u-upload customStyle="flex:none;" width="100" height="100" :fileList="fileList6"
						@afterRead="afterRead" @delete="deletePic" name="6" :maxCount="1">
						<view class="row-content">
							<image src="/static/addIcon.png" mode="widthFix" class="showImg"></image>
							<view>
								卫生间
							</view>
						</view>
					</u-upload>
					<view v-if="fileList6.length!=0">
						卫生间
					</view>
				</view>
			</view>
			
			<view class="content-item">
				<view class="row-content">
					<image class="showImg" :src="localImg.door"></image>
					<view>
						示例图片
					</view>
				</view>
				<view class="row-content">
					<u-upload customStyle="flex:none;" width="100" height="100" :fileList="fileList5"
						@afterRead="afterRead" @delete="deletePic" name="5" :maxCount="1">
						<view class="row-content">
							<image src="/static/addIcon.png" mode="widthFix" class="showImg"></image>
							<view>
								门牌
							</view>
						</view>
					</u-upload>
					<view v-if="fileList5.length!=0">
						门牌
					</view>
				</view>
			</view>
			<view class="loginOut boxshadow" style="margin-top: 40rpx;" @click="confirmOrder">
				上传订单
			</view>
		</view>
		<!-- 订单类型 -->
		<u-action-sheet :actions="columns" title="选择订单类型" :show="show" :closeOnClickOverlay="true" @select="confirmType"
			@close="show = false"></u-action-sheet>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 0, // 报修0 上传图片1
				fileList1: [],
				fileList2: [],
				fileList3: [],
				fileList4: [],
				fileList5: [],
				fileList6: [],
				fileList10:[],// 保修中心图片
				localImg:{
					// bathRoom:'/static/bathroom.jpg',
					// bed:'/static/bedImage.jpg',
					// door:'/static/door.png',
					bed:'https://zy.xry.ink/file-api/statics/2022/11/09/029dfc38d0ac42e59d9dccf0289c7b14_20221109163259A409.jpg',
					door:'https://zy.xry.ink/file-api/statics/2022/11/09/6fea8b85bf9242e99bafa1899a9ca714_20221109115306A368.png',
					bathRoom:'https://zy.xry.ink/file-api/statics/2022/11/09/4dd06d1729c44669b6f896739867e3f5_20221109163232A408.jpg',
				},
				form: {
					id: '',
					roomNo: '',
					bedPicture: '', // 床图片
					airConditionerPicture: '', // 空调
					tablePicture: '', // 桌子图片
					chairPicture: '', // 椅子图片
					windowPicture: '', // 窗户图片
					toiletPicture: '', // 卫生间
					picture:'',
					remark:'',
					orderType:'',// 订单类型（1续住清洁 2退房清洁 3钟点房清洁）
				},
				show: false,
				columns: [{
					name: '续住清洁'
				}, {
					name: '退房清洁'
				},{
					name:'钟点房清洁'
				}],
			};
		},
		onLoad(options) {
			this.type = options.type
			this.form.roomNo = options.roomNo
			this.form.id = options.id
			let titleText = this.type == 0 ? '报修中心' : '上传图片'
			// 更改标题
			uni.setNavigationBarTitle({
				title: titleText
			})
		},
		methods: {
			async repair(){
				if (this.form.roomNo == '') {
					uni.showToast({
						title: '请输入房间号',
						icon: "none"
					})
					return
				}
				if (this.fileList10.length == 0) {
					uni.showToast({
						title: '请上传图片',
						icon: "none"
					})
					return
				}
				// console.log('this.form',this.form,this.fileList10)
				let array = []
				for(let i = 0;i<this.fileList10.length;i++){
					array.push(this.fileList10[i].url)
				}
				this.form.picture = JSON.stringify(array)
				let res = await this.$API.post('/repairCenter/addRepairCenter', this.form)
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
			},
			async confirmOrder() {
				if(this.form.orderType == ''){
					uni.showToast({
						title: '请选择清洁类型',
						icon: "none"
					})
					return
				}
				if (this.fileList1.length == 0) {
					uni.showToast({
						title: '请上传床图片',
						icon: "none"
					})
					return
				}
				// if (this.fileList2.length == 0) {
				// 	uni.showToast({
				// 		title: '请上传空调图片',
				// 		icon: "none"
				// 	})
				// 	return
				// }
				// if (this.fileList3.length == 0) {
				// 	uni.showToast({
				// 		title: '请上传桌子图片',
				// 		icon: "none"
				// 	})
				// 	return
				// }
				// if (this.fileList4.length == 0) {
				// 	uni.showToast({
				// 		title: '请上传椅子图片',
				// 		icon: "none"
				// 	})
				// 	return
				// }
				if (this.fileList5.length == 0) {
					uni.showToast({
						title: '请上传门牌图片',
						icon: "none"
					})
					return
				}
				if (this.fileList6.length == 0) {
					uni.showToast({
						title: '请上传卫生间图片',
						icon: "none"
					})
					return
				}
				this.form.bedPicture = this.fileList1[0].url;
				// this.form.airConditionerPicture = this.fileList2[0].url;
				// this.form.tablePicture = this.fileList3[0].url;
				// this.form.chairPicture = this.fileList4[0].url;
				// this.form.windowPicture = this.fileList5[0].url;
				this.form.doorPicture = this.fileList5[0].url;
				this.form.toiletPicture = this.fileList6[0].url;
				let	res = await this.$API.post('/hotelOrder/auntUploadPicture', this.form)
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
			},
			// 新增图片
			async afterRead(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					uni.showLoading({
						title: '上传中...',
						mask: true
					})
					const result = await this.uploadFilePromise(lists[i].url, event.name)
					if (result) {
						uni.hideLoading()
						uni.showToast({
							title: '上传成功',
							icon: "none",
						})
						let item = this[`fileList${event.name}`][fileListLen]
						this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
							status: 'success',
							message: '',
							url: result
						}))
					} else {
						uni.hideLoading()
						uni.showToast({
							title: '上传失败,请重新上传',
							icon: "none",
							mask: true
						})
						let item = this[`fileList${event.name}`][fileListLen]
						this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
							status: 'failed',
						}))
					}
					fileListLen++
				}
			},
			confirmType(value){
				if(value.name == '续住清洁'){
					this.form.orderType = 1
				}else if( value.name == '退房清洁' ){
					this.form.orderType = 2
				}else{
					this.form.orderType = 3
				}
			},
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			},
			uploadFilePromise(url, index) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: 'https://applets.xhbb.cc/file-api/upload', // 仅为示例，非真实的接口地址
						filePath: url,
						name: 'file',
						formData: {
							user: 'test'
						},
						success: (res) => {
							let onlineImage = JSON.parse(res.data)
							setTimeout(() => {
								resolve(onlineImage.data.url)
							}, 1000)
						}
					});
				})
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
