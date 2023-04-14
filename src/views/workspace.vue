<template>
	<div class="tabbar_bottom" :style="{ height: offsetTop + 'px' }">
		<div class="home_back"></div>
		<div class="workspace_back">
			<img src="@/assets/workspace/workspace-back.png" style="width: 100%" />
		</div>
		<div class="content">
			<div class="section" v-for="item in items" :key="item.id">
				<div class="section-title">{{ item.name }}</div>
				<div class="section-content">
					<div
						class="section-block"
						v-for="detail in item.detailList"
						:key="detail.id"
						@click="handleItem(detail)"
					>
						<van-icon :name="detail.icon || 'todo-list-o'" size="32" :color="detail.color || '#4684ff'" />
						<span class="section-block-name">{{ detail.name }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Icon } from 'vant'
export default {
	components: {
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
			let res = await this.$axios.get('jellyFormClassify/queryWorkSpace')
			if (res.data.code == 200) {
				this.items = res.data.data
			}
		},
		handleItem(item) {
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
</script>

<style scoped>
.tabbar_bottom {
	padding-bottom: 45px;
	background: #f5f6fa;
	overflow: auto;
}
.home_back {
	height: 180px;
	background: #4684ff;
}
.workspace_back {
	margin: -140px 10px 0px 10px;
}
.content {
	margin: 10px 10px;
}
.section {
	width: 100%;
	background: #fff;
	border-radius: 10px;
	margin-bottom: 15px;
}
.section-title {
	height: 36px;
	line-height: 36px;
	font-size: 14px;
	padding-left: 9px;
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
	width: 88.75px;
	text-align: center;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	word-break: break-all;
}
</style>
