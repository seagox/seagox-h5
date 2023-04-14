<template>
	<div id="app">
		<router-view />
		<van-tabbar
			route
			v-model="active"
			active-color="#4684FF"
			inactive-color="#C7C8CD"
			:border="false"
			v-if="tabbarShow"
			ref="tabbar"
			safe-area-inset-bottom
		>
			<van-tabbar-item to="/home">
				<span>工作区</span>
				<img slot="icon" slot-scope="props" :src="props.active ? icons[0].active : icons[0].inactive" />
			</van-tabbar-item>
			<!-- <van-tabbar-item to="/workspace">
				<span>工作区</span>
				<img slot="icon" slot-scope="props" :src="props.active ? icons[1].active : icons[1].inactive" />
			</van-tabbar-item> -->
			<van-tabbar-item to="/mine">
				<span>我的</span>
				<img slot="icon" slot-scope="props" :src="props.active ? icons[2].active : icons[2].inactive" />
			</van-tabbar-item>
		</van-tabbar>
		<van-tabbar
			v-model="active"
			active-color="#4684FF"
			inactive-color="#C7C8CD"
			:border="false"
			v-if="applyTabbarShow"
			ref="applyTabbar"
			@change="handleApplyRabbar"
			safe-area-inset-bottom
		>
			<van-tabbar-item>
				<span>待我处理</span>
				<img
					slot="icon"
					slot-scope="props"
					:src="props.active ? applyIcons[0].active : applyIcons[0].inactive"
				/>
			</van-tabbar-item>
			<van-tabbar-item replace>
				<span>新申请</span>
				<img
					slot="icon"
					slot-scope="props"
					:src="props.active ? applyIcons[1].active : applyIcons[1].inactive"
				/>
			</van-tabbar-item>
			<van-tabbar-item>
				<span>我的申请</span>
				<img
					slot="icon"
					slot-scope="props"
					:src="props.active ? applyIcons[2].active : applyIcons[2].inactive"
				/>
			</van-tabbar-item>
		</van-tabbar>
	</div>
</template>
<script>
window.onload = function() {
	document.addEventListener('touchstart', function(event) {
		if (event.touches.length > 1) {
			event.preventDefault()
		}
	})
	document.addEventListener('gesturestart', function(event) {
		event.preventDefault()
	})
}
import { Tabbar, TabbarItem } from 'vant'
export default {
	components: {
		[Tabbar.name]: Tabbar,
		[TabbarItem.name]: TabbarItem
	},
	data() {
		return {
			active: 0,
			icons: [
				{
					active: require('@/assets/navigation/workspace-active.png'),
					inactive: require('@/assets/navigation/workspace-inactive.png')
				},
				{
					active: require('@/assets/navigation/workspace-active.png'),
					inactive: require('@/assets/navigation/workspace-inactive.png')
				},
				{
					active: require('@/assets/navigation/my-active.png'),
					inactive: require('@/assets/navigation/my-inactive.png')
				}
			],
			applyIcons: [
				{
					active: require('@/assets/navigation/todo-active.svg'),
					inactive: require('@/assets/navigation/todo-inactive.svg')
				},
				{
					active: require('@/assets/navigation/apply-active.svg'),
					inactive: require('@/assets/navigation/apply-inactive.svg')
				},
				{
					active: require('@/assets/navigation/self-active.svg'),
					inactive: require('@/assets/navigation/self-inactive.svg')
				}
			]
		}
	},
	mounted() {
		this.$store.dispatch('updateClientWidth', document.documentElement.clientWidth || document.body.clientWidth)
		this.$store.dispatch('updateClientHeight', document.documentElement.clientHeight || document.body.clientHeight)

		if (this.$refs.tabbar) {
			this.$store.dispatch('updateOffsetTop', this.$refs.tabbar.$el.offsetTop)
			this.$store.dispatch('updateTabBarHeight', this.$refs.tabbar.$el.offsetHeight)
		}

		if (this.$refs.applyTabbar) {
			this.$store.dispatch('updateOffsetTop', this.$refs.tabbar.$el.offsetTop)
			this.$store.dispatch('updateTabBarHeight', this.$refs.tabbar.$el.offsetHeight)
		}

		let that = this
		window.onresize = function() {
			that.$store.dispatch('updateClientWidth', document.documentElement.clientWidth || document.body.clientWidth)
			that.$store.dispatch(
				'updateClientHeight',
				document.documentElement.clientHeight || document.body.clientHeight
			)
			if (that.$refs.tabbar) {
				that.$store.dispatch('updateOffsetTop', that.$refs.tabbar.$el.offsetTop)
				that.$store.dispatch('updateTabBarHeight', that.$refs.tabbar.$el.offsetHeight)
			}
		}
	},
	computed: {
		tabbarShow() {
			return this.$store.state.tabbarShow
		},
		applyTabbarShow() {
			return this.$store.state.applyTabbarShow
		}
	},
	watch: {
		$route(to, from) {
			if (to.path == '/home' || to.path == '/workspace' || to.path == '/mine') {
				this.$store.dispatch('updateTabbarShow', true)
				this.$store.dispatch('updateApplyTabbarShow', false)
				if (this.$refs.tabbar) {
					this.$store.dispatch('updateOffsetTop', this.$refs.tabbar.$el.offsetTop)
					this.$store.dispatch('updateTabBarHeight', this.$refs.tabbar.$el.offsetHeight)
				}
			} else if (to.path == '/todo' || to.path === '/self') {
				if (to.path == '/todo') {
					this.active = 0
				} else if (to.path === '/self') {
					this.active = 2
				}
				this.$store.dispatch('updateTabbarShow', false)
				if (to.query.tabbarShow) {
					this.$store.dispatch('updateApplyTabbarShow', true)
				} else {
					this.$store.dispatch('updateApplyTabbarShow', false)
				}
				if (this.$refs.tabbar) {
					this.$store.dispatch('updateOffsetTop', this.$refs.tabbar.$el.offsetTop)
					this.$store.dispatch('updateTabBarHeight', this.$refs.tabbar.$el.offsetHeight)
				}
			} else {
				this.$store.dispatch('updateTabbarShow', false)
				this.$store.dispatch('updateApplyTabbarShow', false)
			}
		}
	},
	methods: {
		handleApplyRabbar(value) {
			if (value === 0) {
				this.$router.replace({
					path: '/todo',
					query: {
						tabbarShow: true,
						formId: this.$route.query.formId
					}
				})
			} else if (value === 1) {
				this.$router.push({
					path: '/submitView',
					query: {
						formId: this.$route.query.formId
					}
				})
			} else if (value === 2) {
				this.$router.replace({
					path: '/self',
					query: {
						tabbarShow: true,
						formId: this.$route.query.formId
					}
				})
			}
		}
	}
}
</script>
