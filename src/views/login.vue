<template>
	<div :style="{ height: clientHeight + 'px' }">
		<div class="body">
			<div class="title_section">Hi~ 欢迎使用</div>
			<div class="section">
				<div class="logo_section">
					<img src="@/assets/login/logo.png" class="logo" />
				</div>
				<div class="name">
					<img src="@/assets/login/account.png" class="account" />
					<input v-model="account" placeholder="请输入账号" />
				</div>
				<div class="name">
					<img src="@/assets/login/password.png" class="account" />
					<input v-model="password" placeholder="请输入密码" type="password" />
				</div>
			</div>
			<div class="submit">
				<button @click="submit">登陆</button>
			</div>
		</div>
	</div>
</template>

<script>
import { Toast } from 'vant'
export default {
	components: {
		[Toast.name]: Toast
	},
	data() {
		return {
			account: '',
			password: ''
		}
	},
	computed: {
		clientHeight() {
			return this.$store.state.clientHeight
		}
	},
	created() {
		localStorage.clear()
		this.loginByOpenid()
		this.queryRegions()
	},
	methods: {
		loginByOpenid() {
			if (this.$route.query.openid) {
				this.$axios.get('auth/loginByOpenid/' + this.$route.query.openid).then(res => {
					if (res.data.code == 200) {
						localStorage.setItem('company', JSON.stringify(res.data.data.company))
						localStorage.setItem('companyId', res.data.data.company[0].id)
						localStorage.setItem('logo', res.data.data.logo)
						localStorage.setItem('companyName', res.data.data.company[0].name)

						localStorage.setItem('departmentId', res.data.data.departmentId)
						localStorage.setItem('departmentName', res.data.data.departmentName || '')

						localStorage.setItem('userId', res.data.data.userId)
						localStorage.setItem('name', res.data.data.name)
						localStorage.setItem('avatar', res.data.data.avatar || '')
						localStorage.setItem('phone', res.data.data.phone || '')
						localStorage.setItem('position', res.data.data.position || '')
						localStorage.setItem('sex', res.data.data.sex)

						localStorage.setItem('Authorization', res.data.data.tokenType + res.data.data.accessToken)
						if (res.data.data.permissions) {
							localStorage.setItem('permissions', res.data.data.permissions.split(','))
						} else {
							localStorage.setItem('permissions', 'no')
						}

						this.$router.replace({
							path: this.$route.query.redirect || '/home'
						})
					}
				})
			}
		},
		async queryRegions() {
			let res = await this.$axios.get('auth/queryRegions')
			if (res.data.code == 200) {
				localStorage.setItem('regions', JSON.stringify(res.data.data))
			}
		},
		submit() {
			if (!this.account) {
				this.$toast('账号不能为空')
				return
			}
			if (!this.password) {
				this.$toast('密码不能为空')
				return
			}
			let that = this
			var params = {
				account: this.account,
				password: this.password,
				openid: this.$route.query.openid,
				avatar: this.$route.query.avatarUrl
			}
			that.$axios.post('auth/login', params).then(res => {
				if (res.data.code == 200) {
					localStorage.setItem('company', JSON.stringify(res.data.data.company))
					localStorage.setItem('companyId', res.data.data.company[0].id)
					localStorage.setItem('logo', res.data.data.logo)
					localStorage.setItem('companyName', res.data.data.company[0].name)

					localStorage.setItem('departmentId', res.data.data.departmentId)
					localStorage.setItem('departmentName', res.data.data.departmentName || '')

					localStorage.setItem('userId', res.data.data.userId)
					localStorage.setItem('name', res.data.data.name)
					localStorage.setItem('avatar', res.data.data.avatar || '')
					localStorage.setItem('phone', res.data.data.phone || '')
					localStorage.setItem('position', res.data.data.position || '')
					localStorage.setItem('sex', res.data.data.sex)

					localStorage.setItem('Authorization', res.data.data.tokenType + res.data.data.accessToken)
					if (res.data.data.permissions) {
						localStorage.setItem('permissions', res.data.data.permissions.split(','))
					} else {
						localStorage.setItem('permissions', 'no')
					}

					that.$router.replace({
						path: that.$route.query.redirect || '/home'
					})
				} else {
					that.$toast(res.data.message)
				}
			})
		}
	}
}
</script>
<style scoped>
::-webkit-input-placeholder {
	color: #969799;
}
::-moz-placeholder {
	color: #969799;
}
:-ms-input-placeholder {
	color: #969799;
}
:-moz-placeholder {
	color: #969799;
}
.body {
	width: 100%;
}
.title_section {
	height: 220px;
	background: url('../assets/login/login-back.png') no-repeat;
	background-size: 100%;
	display: flex;
	justify-content: center;
	color: #fff;
	font-size: 22px;
	text-align: center;
	line-height: 220px;
}
.section {
	background-color: #fff;
	border-top-left-radius: 36px;
	border-top-right-radius: 36px;
	margin-top: -30px;
}
.logo_section {
	text-align: center;
	position: relative;
	top: -30px;
}
.logo {
	width: 60px;
	height: 60px;
	border-radius: 60px;
	background-color: #fff;
	padding: 5px;
}
.name {
	background-color: #f5f6fa;
	border-radius: 10px;
	margin: 0px 25px 25px 25px;
	color: #333;
	font-size: 14px;
	padding: 0px 9.5px;
	display: flex;
	align-items: center;
	height: 50px;
}
.account {
	width: 26px;
	height: 26px;
	margin-right: 7.5px;
}
input {
	background-color: #f5f6fa;
	border: none;
	width: 100%;
	height: 32px;
}
.submit {
	margin: 30px 25px 0px 25px;
}
.submit button {
	border-radius: 10px;
	background: #4684ff;
	color: #fff;
	font-size: 16px;
	width: 100%;
	height: 46px;
	line-height: 46px;
	border: none;
}
</style>
