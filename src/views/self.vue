<template>
	<div class="tabbar_bottom" :style="{ height: clientHeight + 'px' }">
		<van-list v-model="loading" :finished="finished" @load="onLoad" :finished-text="tableData.length === 0 ? '' : '没有更多了'">
			<div class="card" v-for="(item, index) in tableData" :key="index" @click="handleItem(item)">
				<div class="card-title">{{ item.name }}</div>
				<div class="card-assignee">{{ item.assigneeName }}</div>
				<div class="card-createTime">{{ item.createTime }}</div>
			</div>
		</van-list>
		<van-empty
			:style="{ height: clientHeight + 'px' }"
			description="暂无数据"
			v-if="!loading && tableData.length === 0"
		/>
	</div>
</template>

<script>
import { Empty, List } from 'vant'
export default {
	components: {
		[Empty.name]: Empty,
		[List.name]: List
	},
	data() {
		return {
			pageNo: 0,
			tableData: [],
			loading: false,
			finished: false
		}
	},
	computed: {
		clientHeight() {
			return this.$store.state.clientHeight
		}
	},
	methods: {
		async querySelfItem() {
			if (this.$route.query.formId) {
				let res = await this.$axios.get('flow/querySelfItem?formId=' + this.$route.query.formId + '&pageNo=' + this.pageNo)
				if (res.data.code == 200) {
					this.loading = false
					this.finished = res.data.data.isLastPage
					this.tableData = this.tableData.concat(res.data.data.list)
				}
			} else {
				let res = await this.$axios.get('flow/querySelfItem?pageNo=' + this.pageNo)
				if (res.data.code == 200) {
					this.loading = false
					this.finished = res.data.data.isLastPage
					this.tableData = this.tableData.concat(res.data.data.list)
				}
			}
		},
		onLoad() {
			this.pageNo = this.pageNo + 1
			this.querySelfItem()
		},
		handleItem(item) {
			this.$router.push({
				path: '/handleApproval',
				query: {
					id: item.businessKey,
					type: item.type,
					formId: item.businessType,
					title: item.name
				}
			})
		}
	}
}
</script>
<style scoped>
.tabbar_bottom {
	background: #f2f3f7;
	overflow: auto;
}
.card {
	background: #FFFFFF;
	border-radius: 20px;
	margin: 15px;
	padding: 15px;
}
.card-title {
	font-size: 15px;
	font-weight: bold;
	color: #333333;
	text-overflow: -o-ellipsis-lastline;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
}
.card-assignee {
	font-size: 12px;
	color: #666666;
	margin-top: 15px;
	margin-bottom: 15px;
}
.card-createTime {
	font-size: 12px;
	color: #666666;
}
</style>
