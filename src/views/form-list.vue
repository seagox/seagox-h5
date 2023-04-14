<template>
	<div class="tabbar_bottom" :style="{ 'min-height': clientHeight + 'px' }">
		<van-list v-model="loading" :finished="finished" @load="onLoad" style="padding-top:15px;padding-bottom:15px;">
			<div class="card" v-for="(item, index) in tableData" :key="index" @click="handleItem(item)">
				<div
					class="card-content"
					v-for="(tableHeaderItem, tableHeaderIndex) in tableHeaderJson"
					:key="tableHeaderIndex"
				>
					{{ tableHeaderItem.label }} : {{ item[tableHeaderItem.prop] }}
				</div>
			</div>
		</van-list>
		<van-empty
			:style="{ height: (clientHeight - 30) + 'px' }"
			description="暂无数据"
			v-if="!loading && tableData.length === 0"
		/>
		<div class="plus"><van-icon name="plus" @click="handleAdd" /></div>
	</div>
</template>

<script>
import { Empty, Icon, List } from 'vant'
export default {
	components: {
		[Empty.name]: Empty,
		[Icon.name]: Icon,
		[List.name]: List
	},
	data() {
		return {
			pageNo: 0,
			pageSize: 20,
			tableData: [],
			tableHeaderJson: [],
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
		async queryListById() {
			const params = {
				id: this.$route.query.formId,
				pageNo: this.pageNo,
				pageSize: this.pageSize,
				search: '{}'
			}
			let res = await this.$axios.post('jellyForm/queryListById', params)
			if (res.data.code == 200) {
				this.loading = false
				this.finished = res.data.data.tableData.isLastPage

				let tableHeaderJson = res.data.data.tableHeaderJson
				let tableHeaderMap = {}
				for(let i=0;i<tableHeaderJson.length;i++) {
					let tableHeader = tableHeaderJson[i]
					let options = {}
					if(tableHeader.options) {
						let optionsJson = JSON.parse(tableHeader.options)
						for(let j=0;j<optionsJson.length;j++) {
							options[optionsJson[j].code] = optionsJson[j].name
						}
					}
					tableHeaderMap[tableHeader.prop] = {
						label: tableHeader.label,
						formatter: tableHeader.formatter,
						options: options
					}
				}
				let tableData = []
				for(let i=0;i<res.data.data.tableData.list.length;i++) {
					let detail = res.data.data.tableData.list[i]
					let item = {
						id: detail.id
					}
					for (let key in tableHeaderMap) {
						if(tableHeaderMap[key].formatter) {
							item[key] = tableHeaderMap[key].options[detail[key]]
						} else {
							item[key] = detail[key]
						}
					}
					tableData.push(item)
				}
				this.tableData = this.tableData.concat(tableData)
				if (this.pageNo === 1) {
					if (res.data.data.tableHeaderJson.length > 4) {
						this.tableHeaderJson = res.data.data.tableHeaderJson.slice(0, 4)
					} else {
						this.tableHeaderJson = res.data.data.tableHeaderJson
					}
				}
			}
		},
		onLoad() {
			this.pageNo = this.pageNo + 1
			this.queryListById()
		},
		handleAdd() {
			this.$router.push({
				path: '/submitView',
				query: {
					formId: this.$route.query.formId
				}
			})
		},
		handleItem(item) {
			this.$router.push({
				path: '/formEdit',
				query: {
					id: item.id,
					formId: this.$route.query.formId
				}
			})
		}
	}
}
</script>
<style scoped>
.tabbar_bottom {
	background: #f2f3f7;
}
.plus {
	position: fixed;
	right: 20px;
	bottom: 45px;
	width: 48px;
	height: 48px;
	border-radius: 48px;
	background-color: #4684ff;
	line-height: 48px;
	text-align: center;
	color: #fff;
	font-size: 20px;
}
.card {
	background-color: #fff;
	margin: 0px 10px 10px;
	padding: 2px 10px 12px 10px;
	border-radius: 8px;
	box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.14);
}
.card-content {
	margin-top: 10px;
}
</style>
