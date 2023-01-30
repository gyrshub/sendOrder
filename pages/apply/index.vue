<template>
	<!-- 业务经理-签约申请页面 -->
	<view class="hotelOccupancy">
		<view class="status_list boxshadow">
			<view :class="['status_item',{active:choosed==index}]" v-for="(item,index) in statusList" :key="index" @click="changeStatus(index)">
				{{item}}
			</view>
		</view>
		<view class="formContent boxshadow borderStyle" v-if="choosed == 0">
			<view class="form-item">
				<view class="title">酒店名称</view>
				<view class="form-input">
					<u--input placeholder="请输入酒店名称" border="none" v-model="list.hotelName" inputAlign="right">
					</u--input>
				</view>
			</view>
			<view class="form-item">
				<view class="title">酒店地址</view>
				<view class="form-input">
					<u--input placeholder="请输入酒店地址" border="none" v-model="list.address" inputAlign="right">
					</u--input>
				</view>
			</view>

			<view class="form-item">
				<view class="title">总房量</view>
				<view class="form-input">
					<u--input type="number" placeholder="请输入总房量" border="none" v-model="list.totalRoom"
						inputAlign="right">
					</u--input>
				</view>
			</view>

			<view class="form-item">
				<view class="title">公司名称</view>
				<view class="form-input">
					<u--input placeholder="请输入公司名称" border="none" v-model="list.companyName" inputAlign="right"></u--input>
				</view>
			</view>
			
			<view class="form-item">
				<view class="title">信用代码</view>
				<view class="form-input">
					<u--input placeholder="请输入信用代码" border="none" v-model="list.creditCode" inputAlign="right"></u--input>
				</view>
			</view>

			<view class="uploadImage">
				<view class="uploadImage-item">
					<view style="margin-bottom: 20rpx;">请拍摄并上传营业执照</view>
					<view style="margin-left: 60rpx;">
						<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple
							:maxCount="1">
							<image style="width: 160rpx;height: 160rpx;" src="/static/addIcon.png" v-if="!fileList1.length"></image>
							</u-upload>
					</view>
				</view>
			</view>
		</view>
		
		<view class="formContent boxshadow borderStyle" v-if="choosed == 1">
			<view class="form-item">
				<view class="title">法人姓名</view>
				<view class="form-input">
					<u--input placeholder="请输入法人姓名" border="none" v-model="list.legalPerson" inputAlign="right"></u--input>
				</view>
			</view>
		
			<view class="form-item">
				<view class="title">联系电话</view>
				<view class="form-input">
					<u--input type="number" placeholder="请输入联系电话" border="none" v-model="list.contactNumber"
						inputAlign="right">
					</u--input>
				</view>
			</view>
			
			<view class="form-item">
				<view class="title">调度电话</view>
				<view class="form-input">
					<u--input type="number" placeholder="请输入调度电话" border="none" v-model="list.dispatchCall"
						inputAlign="right">
					</u--input>
				</view>
			</view>
			<view class="uploadImage borderStyle">
				<view>请拍摄并上传法人身份复印件</view>
				<view class="imageList">
					<u-upload customStyle="flex:none;" :fileList="fileList3" @afterRead="afterRead" @delete="deletePic" name="3" multiple
						:maxCount="1" width="124" height="100" imageMode="aspectFit">
						<view class="imageItem">
							<image class="borderImage" src="/static/people.png" v-if="!fileList3.length"></image>
							<view class="imageItem-info" v-if="!fileList3.length">
								<view>请上传身份证人像面</view>
							</view>
						</view>
					</u-upload>
			
					<u-upload customStyle="flex:none;" :fileList="fileList4" @afterRead="afterRead" @delete="deletePic" name="4" multiple
						:maxCount="1" width="124" height="100" imageMode="aspectFit">
						<view class="imageItem">
							<image class="borderImage" src="/static/country.png" v-if="!fileList4.length"></image>
							<view class="imageItem-info" v-if="!fileList4.length">
								<view>请上传身份证国徽面</view>
							</view>
						</view>
					</u-upload>
				</view>
			</view>
		</view>

		<view class="loginOut boxshadow" @click="confirmApply">
			下一步
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: {
					hotelName:'',
					address: '',
					contactNumber: '',// 法人联系电话
					dispatchCall:'',// 调度电话
					legalPerson: '',
					totalRoom: '',
					address: '',
					companyName: '',
					creditCode:'',
					businessLicense: '', // 营业执照
					identityCardFront: '', // 国徽
					identityCardReverse: '', // 人像
				},
				id:0,
				type:0,
				choosed:0,
				statusList:['填写信息','法人信息','开通账号'],
				phoneRule: /^(((\d{3,4}-)?[0-9]{7,8})|(1(3|4|5|6|7|8|9)\d{9}))$/,
				fileList1: [], // 营业执照
				fileList3: [], // 人像
				fileList4: [], // 国徽
			};
		},
		onLoad(options) {
			this.id = options.id
			if(options.type){
				this.type = options.type
			}
			
		},
		methods: {
			async confirmApply() {
				if (this.list.address == "") {
					uni.showToast({
						title: '请输入酒店名称',
						icon: "none"
					})
					return
				}
				if (this.list.address == "") {
					uni.showToast({
						title: '请选择酒店地址',
						icon: "none"
					})
					return
				}
				if (this.list.totalRoom == "") {
					uni.showToast({
						title: '请输入总房量',
						icon: "none"
					})
					return
				}
				if (this.list.companyName == "") {
					uni.showToast({
						title: '请输入公司名称',
						icon: "none"
					})
					return
				}
				
				if (this.list.creditCode == "") {
					uni.showToast({
						title: '请输入信用代码',
						icon: "none"
					})
					return
				}
				
				if (this.fileList1.length == 0) {
					uni.showToast({
						title: '请上传营业执照',
						icon: "none"
					})
					return
				}
				if(this.choosed == 0){
					this.choosed = 1;
					return
				}
				if (this.list.legalPerson == "") {
					uni.showToast({
						title: '请输入法人姓名',
						icon: "none"
					})
					return
				}
				if (!(this.phoneRule.test(this.list.contactNumber))) {
					uni.showToast({
						title: '联系方式输入不规范',
						icon: "none"
					})
					return
				}
				if (!(this.phoneRule.test(this.list.dispatchCall))) {
					uni.showToast({
						title: '调度电话输入不规范',
						icon: "none"
					})
					return
				}

				if (this.fileList4.length == 0) {
					uni.showToast({
						title: '请上传身份证国徽面',
						icon: "none"
					})
					return
				}
				if (this.fileList3.length == 0) {
					uni.showToast({
						title: '请上传身份证人像面',
						icon: "none"
					})
					return
				}
				this.list.businessLicense = this.fileList1[0].url;
				this.list.identityCardReverse = this.fileList3[0].url;
				this.list.identityCardFront = this.fileList4[0].url;
				uni.showLoading({
					title: "提交申请"
				})
				// console.log('数据', this.list)
				let res = ''
				if(this.type == 1){
					this.list.id = this.id
					res = await this.$API.put('/hotel/updateHotel', this.list)
				}else{
					res = await this.$post('/hotel/addHotel', this.list)
				}
				if (res.code == 200) {
					uni.hideLoading()
					uni.showToast({
						title: '提交成功',
						icon: "none",
						mask: true,
						success: () => {
							setTimeout(() => {
								uni.redirectTo({
									url: '/pages/apply/applyResult'
								})
							}, 1000)
						}
					})
				} else {
					uni.hideLoading()
				}
			},
			changeStatus(index){
				if(index >= 2)return
				this.choosed = index
			},
			address(value) {
				this.list.address = value.value[0] + value.value[1] + value.value[2];
			},
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
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
		}
	}
</script>
<style>
	page {
		background-color: #FAF9FE;
	}
</style>
<style lang="less" scoped>
	.hotelOccupancy {
		position: relative;
		padding: 26rpx 32rpx;
		.status_list{
			background: #FFFFFF;
			border-radius: 10rpx;
			display: flex;
			font-size: 32rpx;
			.status_item{
				color: #2066E0;
				flex: 1;
				text-align: center;
				padding: 18rpx 0;
			}
			.active{
				background-color: #2066E0;
				color: #FFFFFF;
				border-radius: 10rpx;
			}
		}
		
		.uploadImage {
			color: #121212;
			font-size: 32rpx;
			font-weight: bold;
			margin-top: 20rpx;
			.imageList {
				display: flex;
				justify-content: space-between;
				margin-top: 32rpx;

				.imageItem {
					border-radius: 6rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					position: relative;
					.imageItem-info {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						font-size: 28rpx;
						color: #707070;
					}

					.borderImage {
						width: 248rpx;
						height: 160rpx;
					}
				}
			}
		}

		.formContent {
			color: #121212;
			font-size: 28rpx;
			padding-bottom: 180rpx;

			.form-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 32rpx 0;
				border-bottom: 2rpx solid #F5F5F5;

				.title {
					width: 30%;
					font-weight: bold;
				}

				.form-input {
					width: 68%;
					display: flex;
					align-items: center;
					justify-content: flex-end;
				}

				.form-region {
					width: 68%;
					overflow-x: auto;
					text-align: right;
					white-space: nowrap;
					color: #B2B2B2;
				}

				.active {
					color: #121212;
				}
			}
		}

		.loginOut{
			color: #7E7D80;
			width: 100%;
			margin: 40rpx 0;
			font-size: 36rpx;
			font-weight: bold;
			font-family: YouSheBiaoTiHei;
			border-radius: 40rpx;
			background-color: white;
			display: flex;
			justify-content: center;
			padding: 28rpx 0;
		}

		.borderStyle {
			border-radius: 20rpx;
			background-color: white;
			padding: 32rpx 32rpx 40rpx 32rpx;
			margin-top: 20rpx;
		}
	}
</style>
