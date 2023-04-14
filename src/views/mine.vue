<template>
	<div class="tabbar_bottom" :style="{ height: offsetTop + 'px' }">
		<div class="top">
			<img src="@/assets/my/avatar.png" class="avatar" />
			<span class="nick_name">{{ name }}</span>
		</div>
		<div class="top_section">
			<div class="section_content van-hairline--bottom">
				<img src="@/assets/my/company.png" class="icon" />
				<span class="section_title">公司</span>
				<span class="section_subtitle">{{ companyName }}</span>
			</div>
			<div class="section_content van-hairline--bottom">
				<img src="@/assets/my/dept.png" class="icon" />
				<span class="section_title">部门</span>
				<span class="section_subtitle">{{ departmentName }}</span>
			</div>
			<div class="section_content van-hairline--bottom">
				<img src="@/assets/my/post.png" class="icon" />
				<span class="section_title">岗位</span>
				<span class="section_subtitle">{{ position }}</span>
			</div>
			<div class="section_content van-hairline--bottom" @click="changeCompany" v-if="companyList.length > 1">
				<img src="@/assets/my/switch.png" class="icon" />
				<span class="section_title">切换身份</span>
				<img src="@/assets/my/more.png" class="more" />
			</div>
		</div>
		<div class="bottom_section">
			<div class="section_content van-hairline--bottom">
				<img src="@/assets/my/sex.png" class="icon" />
				<span class="section_title">性别</span>
				<span class="section_subtitle">{{ sex }}</span>
			</div>
			<div class="section_content van-hairline--bottom">
				<img src="@/assets/my/phone.png" class="icon" />
				<span class="section_title">手机</span>
				<span class="section_subtitle">{{ phone }}</span>
			</div>
		</div>
		<div class="submit">
			<button @click="signOut">退出登陆</button>
		</div>
		<van-popup v-model="showPicker" position="bottom" v-if="showPicker">
			<van-picker
				show-toolbar
				:columns="companyList"
				value-key="name"
				@confirm="onSelectConfirm"
				@cancel="showPicker = false"
			/>
		</van-popup>
	</div>
</template>

<script>
import { Popup, Picker, Toast } from 'vant'
export default {
	components: {
		[Popup.name]: Popup,
		[Picker.name]: Picker,
		[Toast.name]: Toast
	},
	data() {
		return {
			showPicker: false,
			options: []
		}
	},
	computed: {
		offsetTop() {
			return this.$store.state.offsetTop
		},
		companyName() {
			return localStorage.getItem('companyName')
		},
		departmentName() {
			return localStorage.getItem('departmentName') || '无'
		},
		phone() {
			return localStorage.getItem('phone') || '无'
		},
		position() {
			return localStorage.getItem('position') || '无'
		},
		sex() {
			return localStorage.getItem('sex') == 1 ? '男' : '女'
		},
		avatar() {
			return localStorage.getItem('avatar') || require('@/assets/my/avatar.png')
		},
		name() {
			return localStorage.getItem('name')
		},
		companyList() {
			return JSON.parse(localStorage.getItem('company'))
		}
	},
	methods: {
		handleUserInfo() {
			this.$router.push('/userInfo')
		},
		handleCollect() {
			this.$router.push('/commodityCollect')
		},
		handleAddress() {
			this.$router.push('/address')
		},
		handleOrder(status) {
			this.$router.push({ path: '/order', query: { status: status } })
		},
		signOut() {
			this.$router.push('login')
		},
		changeCompany() {
			this.showPicker = true
		},
		onSelectConfirm(item) {
			this.$axios.post('company/change/' + item.id, {}).then(res => {
				if (res.data.code == 200) {
					this.showPicker = false
					this.$toast('切换成功')
					localStorage.setItem('alias', res.data.data.alias)
					localStorage.setItem('logo', res.data.data.logo)
					localStorage.setItem('mark', res.data.data.mark)
					localStorage.setItem('companyId', res.data.data.companyId)
					localStorage.setItem('companyName', res.data.data.companyName)
					localStorage.setItem('departmentId', res.data.data.departmentId)
					localStorage.setItem('departmentName', res.data.data.departmentName || '')
					localStorage.setItem('Authorization', res.data.data.tokenType + res.data.data.accessToken)
					if (res.data.data.permissions) {
						localStorage.setItem('permissions', res.data.data.permissions.split(','))
					} else {
						localStorage.setItem('permissions', 'no')
					}
					this.$router.go(0)
				} else {
					this.$toast(res.data.message)
				}
			})
		}
	}
}
</script>

<style scoped>
.tabbar_bottom {
	padding-bottom: 45px;
	background: #f2f3f7;
	overflow: auto;
}
.top {
	height: 200px;
	background: url('../assets/my/my-back.png') no-repeat;
	background-size: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.avatar {
	width: 72px;
	height: 72px;
	border-radius: 72px;
}
.nick_name {
	font-size: 14px;
	font-weight: 500;
	color: #fff;
	margin-top: 8px;
}
.top_section {
	margin: -15px 13px 10px 13px;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.14);
	border-radius: 12px;
}
.bottom_section {
	margin: 10px 13px 10px 13px;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.14);
	border-radius: 12px;
}
.section_content {
	display: flex;
	align-items: center;
	height: 40px;
}
.icon {
	width: 24px;
	height: 24px;
	margin-left: 9px;
	margin-right: 12px;
}
.section_title {
	color: #333333;
	font-size: 15px;
}
.section_subtitle {
	color: #999999;
	font-size: 14px;
	position: absolute;
	right: 10px;
}
.more {
	position: absolute;
	right: 10px;
	width: 12px;
	height: 12px;
}
.submit {
	margin: 10px 13px 15px 13px;
}
.submit button {
	border-radius: 10px;
	background: #fff;
	color: #0480fe;
	font-size: 16px;
	width: 100%;
	height: 46px;
	line-height: 46px;
	border: none;
	box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.14);
}
</style>
