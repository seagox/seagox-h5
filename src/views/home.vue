<template>
	<div class="tabbar_bottom" :style="{ height: offsetTop + 'px' }">
		<div class="banner"></div>
		<div class="feature">
			<div class="feature_name" @click="todo">
				<img src="@/assets/home/not-do.png" class="feature_icon" />
				<span class="feature_name_span">待办事项</span>
			</div>
			<div class="feature_name" @click="done">
				<img src="@/assets/home/done.png" class="feature_icon" />
				<span class="feature_name_span">已办事项</span>
			</div>
			<div class="feature_name" @click="self">
				<img src="@/assets/home/launch.png" class="feature_icon" />
				<span class="feature_name_span">我发起的</span>
			</div>
			<div class="feature_name" @click="copy">
				<img src="@/assets/home/copy.png" class="feature_icon" />
				<span class="feature_name_span">抄送我的</span>
			</div>
		</div>
		<div class="notice">
			<div>
				<span class="notice-text">通知</span>
				<span class="notice-aux-text">公告</span>
			</div>
			<div class="notice-title">学习时代习近平谈疫情防控：坚持asdasdasdasasdasd</div>
		</div>
		<div class="section" v-if="items.length > 0" :style="{'max-height': (offsetTop - 300)+ 'px'}">
			<div class="section-content">
				<div class="section-block" v-for="item in items" :key="item.id" @click="handleItem(item)">
					<i v-html="item.icon" :style="{
						'background': item.color || '#4684ff',
						'border-radius': '17.5px',
						'width': '48px',
						'height': '48px',
						'display': 'flex',
						'align-items': 'center',
						'justify-content': 'center'
					}"></i>
					<span class="section-block-name">{{ item.name }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { List, Toast, Icon } from 'vant'
export default {
	components: {
		[List.name]: List,
		[Toast.name]: Toast,
		[Icon.name]: Icon
	},
	data() {
		return {
			items: []
		}
	},
	computed: {
		offsetTop() {
			return this.$store.state.offsetTop
		}
	},
	created() {
		this.onLoad()
	},
	methods: {
		async onLoad() {
			let res = await this.$axios.get('jellyForm/queryByCompanyId')
			if (res.data.code == 200) {
				let items = []
				for(let i=0;i<res.data.data.length;i++) {
					let item =  res.data.data[i]
					item.icon = item.icon.replace(new RegExp('fill="#000000"', "gm"), 'fill="#fff"').replace(new RegExp('width="16"', "gm"), 'width="20"').replace(new RegExp('height="16"', "gm"), 'height="20"')
					items.push(item)
				}
				this.items = items
			}
		},
		todo() {
			this.$router.push('/todo')
		},
		done() {
			this.$router.push('/done')
		},
		self() {
			this.$router.push('/self')
		},
		copy() {
			this.$router.push('/copy')
		},
		handleItem(item) {
			if(item.name === '全部') {

			} else {
				if (item.flow === 1) {
					//有流程
					this.$router.push({
						path: '/todo',
						query: {
							tabbarShow: true,
							formId: item.id
						}
					})
				} else {
					//无流程
					this.$router.push({
						path: '/formList',
						query: {
							formId: item.id
						}
					})
				}
			}
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
.banner {
	height: 201px;
	background: url('../assets/home/banner.png') no-repeat;
	background-size: 100%;
}
.feature {
	background: #fff;
	height: 98px;
	display: flex;
	justify-content: space-around;
	border-radius: 10px;
	margin: -28px 15px 15px 15px;
	box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.14);
}
.feature_icon {
	width: 40px;
	height: 40px;
}
.feature_name {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.feature_name_span {
	margin-top: 8px;
	font-size: 14px;
	color: #333;
}
.notice {
	background: #fff;
	border-radius: 10px;
	margin: 15px;
	padding: 22.5px 15px;
	box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.14);
	display: flex;
	align-items: center;
}
.notice-text {
	color: #333;
	font-size: 18px;
	font-weight: bold;
}
.notice-aux-text {
	color: #2C6CFC;
	font-size: 18px;
	font-weight: bold;
}
.notice-title {
	width: 228px;
	margin-left: 10px;
	color: #454957;
	font-size: 14px;
	overflow: hidden;
 	white-space: nowrap;
  	text-overflow: ellipsis;
  	-o-text-overflow: ellipsis;
}
.section {
	background: #fff;
	border-radius: 10px;
	margin: 15px;
	box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.14);
	padding-top: 5px;
	padding-bottom: 10px;
	overflow: auto;
}
.section-content {
	display: flex;
	flex-wrap: wrap;
	padding-bottom: 10px;
}
.section-block {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: 15px;
}
.section-block-name {
	margin-top: 6px;
	font-size: 14px;
	color: #333;
	width: 86.25px;
	text-align: center;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	word-break: break-all;
}
</style>
