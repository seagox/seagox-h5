<template>
	<div class="tabbar_bottom">
		<div v-for="(item, index) in fieldOptions" :key="index">
			<!-- 单行文本 -->
			<van-field
				v-if="!item.hidden && item.type === 'text'"
				v-model="formModel[item.field]"
				input-align="right"
				:readonly="flowFlag"
				:label="item.label"
				:required="item.required"
				:clearable="item.clearable"
				:maxlength="item.maxlength ? item.maxlength : null"
			/>
			<!-- 多行文本 -->
			<van-field
				v-if="!item.hidden && item.type === 'textarea'"
				v-model="formModel[item.field]"
				input-align="right"
				type="textarea"
				:readonly="flowFlag"
				:label="item.label"
				:required="item.required"
				:clearable="item.clearable"
				autosize
				show-word-limit
				:maxlength="item.maxlength ? item.maxlength : null"
			/>
			<!-- 密码 -->
			<van-field
				v-if="!item.hidden && item.type === 'password'"
				v-model="formModel[item.field + '_label']"
				type="password"
				input-align="right"
				:readonly="flowFlag"
				:label="item.label"
				:required="item.required"
				:placeholder="item.placeholder"
				:clearable="item.clearable"
				autocomplete
			/>
			<!-- 数字 -->
			<van-field
				v-if="!item.hidden && item.type === 'number'"
				v-model="formModel[item.field]"
				input-align="right"
				:readonly="flowFlag"
				:type="item.decimal ? 'number' : 'digit'"
				:label="item.label"
				:required="item.required"
				:clearable="item.clearable"
			/>
			<!-- 单选框 -->
			<van-field v-if="!item.hidden && item.type === 'radio'" :label="item.label" :required="item.required">
				<template #input>
					<van-radio-group v-model="formModel[item.field]" direction="horizontal" :disabled="item.disabled">
						<van-radio :name="option.value" v-for="(option, index) in item.options" :key="index">{{
							option.label
						}}</van-radio>
					</van-radio-group>
				</template>
			</van-field>
			<!-- 多选框 -->
			<van-field v-if="!item.hidden && item.type === 'checkbox'" :label="item.label" :required="item.required">
				<template #input>
					<van-checkbox-group
						v-model="formModel[item.field]"
						direction="horizontal"
						:disabled="item.disabled"
					>
						<van-checkbox
							:name="option.value"
							shape="square"
							v-for="(option, index) in item.options"
							:key="index"
							>{{ option.label }}</van-checkbox
						>
					</van-checkbox-group>
				</template>
			</van-field>
			<!-- 选择框 -->
			<van-field
				v-if="!item.hidden && item.type === 'select'"
				input-align="right"
				:readonly="flowFlag"
				clickable
				v-model="formModel[item.field + '_label']"
				:label="item.label"
				:required="item.required"
			/>
			<van-popup v-model="item.showPicker" position="bottom" v-if="!item.hidden && item.type === 'select'">
				<van-picker
					show-toolbar
					:columns="item.options"
					value-key="label"
					@confirm="onSelectConfirm($event, item)"
					@cancel="item.showPicker = false"
				/>
			</van-popup>
			<!-- 开关 -->
			<van-field v-if="!item.hidden && item.type === 'switch'" :label="item.label" :required="item.required">
				<van-switch v-model="formModel[item.field]" :disabled="item.disabled" />
			</van-field>
			<!-- 日期选择器 -->
			<van-field
				v-if="!item.hidden && item.type === 'datePicker'"
				input-align="right"
				:readonly="flowFlag"
				clickable
				v-model="formModel[item.field]"
				:label="item.label"
				:required="item.required"
			/>
			<van-popup v-model="item.showPicker" position="bottom" v-if="!item.hidden && item.type === 'datePicker'">
				<van-datetime-picker
					type="date"
					@confirm="onDatePickerConfirm($event, item)"
					@cancel="item.showPicker = false"
				/>
			</van-popup>
			<!-- 时间选择器 -->
			<van-field
				v-if="!item.hidden && item.type === 'timePicker'"
				input-align="right"
				:readonly="flowFlag"
				clickable
				v-model="formModel[item.field]"
				:label="item.label"
				:required="item.required"
				:placeholder="item.placeholder"
				@click="item.showPicker = true"
			/>
			<van-popup v-model="item.showPicker" position="bottom" v-if="!item.hidden && item.type === 'timePicker'">
				<van-datetime-picker
					type="time"
					@confirm="onTimePickerConfirm($event, item)"
					@cancel="item.showPicker = false"
				/>
			</van-popup>
			<!-- 图片上传 -->
			<van-field
				v-if="!item.hidden && item.type === 'upload'"
				input-align="right"
				:label="item.label"
				:required="item.required"
			>
				<template #input>
					<van-uploader
						v-model="formModel[item.field + '_label']"
						:multiple="item.multiple"
						readonly
						:deletable="false"
						:before-read="file => beforePictureRead(file, item)"
						:after-read="file => afterPictureRead(file, item)"
						class="upload-disabled"
					/>
				</template>
			</van-field>
			<!-- 地区选择 -->
			<van-field
				v-if="!item.hidden && item.type === 'area'"
				input-align="right"
				:readonly="flowFlag"
				v-model="formModel[item.field + '_label']"
				:label="item.label"
				:required="item.required"
			/>
			<van-popup v-model="item.showPicker" position="bottom" v-if="!item.hidden && item.type === 'area'">
				<van-picker
					show-toolbar
					:columns="item.options"
					value-key="name"
					@confirm="onAreaConfirm($event, item)"
					@cancel="item.showPicker = false"
				/>
			</van-popup>
			<!-- 流水号 -->
			<van-field
				v-if="!item.hidden && item.type === 'bill'"
				v-model="formModel[item.field]"
				input-align="right"
				readonly
				:label="item.label"
				:required="item.required"
			/>
		</div>
		<div class="footer van-hairline--top safe-area-bottom" v-if="!flowFlag">
			<van-button round block type="info" @click="onSubmit">提交</van-button>
		</div>
	</div>
</template>

<script>
import {
	Toast,
	Field,
	Button,
	Popup,
	Picker,
	DatetimePicker,
	Uploader,
	Checkbox,
	CheckboxGroup,
	RadioGroup,
	Radio,
	Switch,
	Icon
} from 'vant'
export default {
	components: {
		[Toast.name]: Toast,
		[Field.name]: Field,
		[Button.name]: Button,
		[Popup.name]: Popup,
		[Picker.name]: Picker,
		[DatetimePicker.name]: DatetimePicker,
		[Uploader.name]: Uploader,
		[Checkbox.name]: Checkbox,
		[CheckboxGroup.name]: CheckboxGroup,
		[RadioGroup.name]: RadioGroup,
		[Radio.name]: Radio,
		[Switch.name]: Switch,
		[Icon.name]: Icon
	},
	data() {
		return {
			fieldOptions: [],
			formModel: {},
			rules: {},
			property: {},
			flowFlag: true
		}
	},
	created() {
		this.reportDetail()
	},
	computed: {
		regions() {
			return JSON.parse(localStorage.getItem('regions'))
		}
	},
	methods: {
		async reportDetail() {
			var params = {
				id: this.$route.query.id,
				formId: this.$route.query.formId
			}
			let res = await this.$axios.get('jellyForm/queryDetail', { params })
			if (res.data.code == 200) {
				this.formModel = res.data.data
				if(this.formModel.form.flowId) {
					this.flowFlag = true
				} else {
					this.flowFlag = false
				}
				Object.keys(this.formModel).forEach((field, index) => {
					if (field.indexOf('.') > -1) {
						this.$set(
							this.formModel,
							field.split('.')[0] + '|' + field.split('.')[1],
							this.formModel[field]
						)
						delete this.formModel[field]
					}
				})
				for (let i = 0; i < res.data.data.form.formDesignList.length; i++) {
					let formDesign = res.data.data.form.formDesignList[i]
					let fieldOptions = JSON.parse(formDesign.excelJson).fieldOptions
					for (let i = 0; i < fieldOptions.length; i++) {
						let item = fieldOptions[i]
						item.index = i
						if (item.type === 'text' || item.type === 'textarea') {
							if (!this.formModel.hasOwnProperty(item.field)) {
								if (item.defaultValue) {
									this.$set(this.formModel, item.field, item.defaultValue)
								} else {
									this.$set(this.formModel, item.field, '')
								}
							}
							if (item.required) {
								this.$set(this.rules, item.field, [{ required: true, message: item.placeholder }])
							}
						} else if (item.type === 'password') {
							if (item.required) {
								this.$set(this.rules, item.field, [{ required: true, message: item.placeholder }])
							}
						} else if (item.type === 'number') {
							if (!this.formModel.hasOwnProperty(item.field)) {
								if (item.defaultValue) {
									this.$set(this.formModel, item.field, item.defaultValue)
								} else {
									if (item.defaultValue === 0) {
										this.$set(this.formModel, item.field, 0)
									} else {
										this.$set(this.formModel, item.field, undefined)
									}
								}
							}
							if (item.required) {
								this.$set(this.rules, item.field, [{ required: true, message: item.placeholder }])
							}
						} else if (item.type === 'radio') {
							if (!this.formModel.hasOwnProperty(item.field)) {
								if (item.defaultValue) {
									this.$set(this.formModel, item.field, String(item.defaultValue))
									this.handleChangeRule(item)
								} else {
									this.$set(this.formModel, item.field, '')
								}
							}
							if (item.required) {
								this.$set(this.rules, item.field, [{ required: true, message: item.placeholder }])
							}
							this.queryDicDetail(item, i)
						} else if (item.type === 'checkbox') {
							if (!this.formModel.hasOwnProperty(item.field)) {
								if (item.defaultValue) {
									this.$set(this.formModel, item.field, item.defaultValue)
									this.handleChangeRule(item)
								} else {
									this.$set(this.formModel, item.field, [])
								}
							} else {
								this.$set(this.formModel, item.field, JSON.parse(this.formModel[item.field]))
							}
							if (item.required) {
								this.$set(this.rules, item.field, [
									{ type: 'array', required: true, message: item.placeholder }
								])
							}
							this.queryDicDetail(item, i)
						} else if (item.type === 'select') {
							item.showPicker = false
							if (!this.formModel.hasOwnProperty(item.field)) {
								if (item.defaultValue) {
									this.$set(this.formModel, item.field, item.defaultValue)
									this.handleChangeRule(item)
								} else {
									if (item.multiple) {
										this.$set(this.formModel, item.field, [])
									} else {
										this.$set(this.formModel, item.field, '')
									}
								}
							} else {
								this.$set(this.formModel, item.field, String(this.formModel[item.field]))
							}
							if (item.required) {
								if (item.multiple) {
									this.$set(this.rules, item.field, [
										{ type: 'array', required: true, message: item.placeholder }
									])
								} else {
									this.$set(this.rules, item.field, [{ required: true, message: item.placeholder }])
								}
							}
							this.queryDicDetail(item, i)
						} else if (item.type === 'switch') {
							if (!this.formModel.hasOwnProperty(item.field)) {
								if (item.defaultValue) {
									this.$set(this.formModel, item.field, item.defaultValue)
									this.handleChangeRule(item)
								} else {
									if (item.defaultValue === 0) {
										this.$set(this.formModel, item.field, item.defaultValue)
									}
								}
							}
						} else if (item.type === 'datePicker') {
							item.showPicker = false
							if (item.dateType === 'year') {
								item.dateType = 'year'
							} else if (item.dateType === 'month') {
								item.dateType = 'year-month'
							} else if (item.dateType === 'date') {
								item.dateType = 'date'
							} else if (item.dateType === 'datetime') {
								item.dateType = 'datetime'
							}
							if (!this.formModel.hasOwnProperty(item.field)) {
								if (item.defaultValue) {
									this.$set(this.formModel, item.field, item.defaultValue)
								} else {
									this.$set(this.formModel, item.field, '')
								}
							} else {
								if (item.valueFormat === 'yyyy-MM-dd HH:mm') {
									this.$set(
										this.formModel,
										item.field,
										this.formModel[item.field].substring(0, 16).replace('T', ' ')
									)
								}
							}
							if (item.required) {
								this.$set(this.rules, item.field, [{ required: true, message: item.placeholder }])
							}
						} else if (item.type === 'timePicker') {
							item.showPicker = false
							if (!this.formModel.hasOwnProperty(item.field)) {
								if (item.defaultValue) {
									this.$set(this.formModel, item.field, item.defaultValue)
								} else {
									this.$set(this.formModel, item.field, '')
								}
							}
							if (item.required) {
								this.$set(this.rules, item.field, [{ required: true, message: item.placeholder }])
							}
						} else if (item.type === 'dateRangePicker') {
							item.showPicker = false
							if (!this.formModel.hasOwnProperty(item.field)) {
								if (item.defaultValue) {
									this.$set(this.formModel, item.field, item.defaultValue)
								} else {
									this.$set(this.formModel, item.field, '')
								}
							}
							if (item.required) {
								this.$set(this.rules, item.field, [{ required: true, message: item.placeholder }])
							}
						} else if (item.type === 'timeRangePicker') {
							item.showPicker = false
							if (!this.formModel.hasOwnProperty(item.field)) {
								if (item.defaultValue) {
									this.$set(this.formModel, item.field, item.defaultValue)
								} else {
									this.$set(this.formModel, item.field, '')
								}
							}
							if (item.required) {
								this.$set(this.rules, item.field, [{ required: true, message: item.placeholder }])
							}
						} else if (item.type === 'editor') {
							if (this.formModel.hasOwnProperty(item.field)) {
								if (this.formModel[item.field]) {
									this.$set(this.formModel, item.field, JSON.parse(this.formModel[item.field]))
								} else {
									this.$set(this.formModel, item.field, { ops: [{ insert: ' \n' }] })
								}
							}
							if (item.required) {
								this.$set(this.rules, item.field, [{ required: true, message: item.placeholder }])
							}
						} else if (item.type === 'area') {
							item.showPicker = false
							if (!this.formModel.hasOwnProperty(item.field)) {
								this.$set(this.formModel, item.field, '')
							}
							if (item.required) {
								this.$set(this.rules, item.field, [
									{ type: 'array', required: true, message: item.placeholder }
								])
							}
							this.queryRegions(item, i)
						} else if (item.type === 'upload') {
							if (!this.formModel.hasOwnProperty(item.field)) {
								this.$set(this.formModel, item.field, [])
							} else {
								if (this.formModel[item.field] instanceof Array) {
									this.$set(this.formModel, item.field, this.formModel[item.field])
								} else {
									this.$set(
										this.formModel,
										item.field + '_label',
										JSON.parse(this.formModel[item.field])
									)
									this.$set(
										this.formModel,
										item.field + '_label',
										JSON.parse(this.formModel[item.field])
									)
								}
							}
							if (item.required) {
								this.$set(this.rules, item.field, [
									{ type: 'array', required: true, message: item.placeholder }
								])
							}
						} else if (item.type === 'bill') {
							if (!this.formModel.hasOwnProperty(item.field)) {
								this.queryBill(item.field, item.prefix, item.format, item.digit)
							}
							if (item.required) {
								this.$set(this.rules, item.field, [{ required: true, message: item.placeholder }])
							}
						} else if (item.type === 'calculate') {
							if (!this.formModel.hasOwnProperty(item.field)) {
							}
							if (item.required) {
								this.$set(this.rules, item.field, [{ required: true, message: item.placeholder }])
							}
						} else if (item.type === 'department') {
							if (this.formModel.hasOwnProperty(item.field)) {
								if (item.multiple) {
									this.$set(this.formModel, item.field, String(this.formModel[item.field]).split(','))
								}
							} else {
								if (item.multiple) {
									if (item.defaultValue) {
										this.$set(this.formModel, item.field, [
											String(localStorage.getItem('departmentId'))
										])
									} else {
										this.$set(this.formModel, item.field, [])
									}
								} else {
									if (item.defaultValue) {
										this.$set(
											this.formModel,
											item.field,
											String(localStorage.getItem('departmentId'))
										)
									}
								}
							}
							if (item.required) {
								if (item.multiple) {
									this.$set(this.rules, item.field, [
										{ type: 'array', required: true, message: item.placeholder }
									])
								} else {
									this.$set(this.rules, item.field, [{ required: true, message: item.placeholder }])
								}
							}
							//this.queryDynamic(item, i)
						} else if (item.type === 'member') {
							if (this.formModel.hasOwnProperty(item.field)) {
								if (item.multiple) {
									this.$set(this.formModel, item.field, String(this.formModel[item.field]).split(','))
								}
							} else {
								if (item.multiple) {
									if (item.defaultValue) {
										this.$set(this.formModel, item.field, [String(localStorage.getItem('userId'))])
									} else {
										this.$set(this.formModel, item.field, [])
									}
								} else {
									if (item.defaultValue) {
										this.$set(this.formModel, item.field, String(localStorage.getItem('userId')))
									}
								}
							}
							if (item.required) {
								if (item.multiple) {
									this.$set(this.rules, item.field, [
										{ type: 'array', required: true, message: item.placeholder }
									])
								} else {
									this.$set(this.rules, item.field, [{ required: true, message: item.placeholder }])
								}
							}
							//this.queryDynamic(item, i)
						} else if (item.type === 'table') {
							if (!this.formModel.hasOwnProperty(item.field)) {
								this.$set(this.formModel, item.field, [])
							}
						} else if (item.type === 'business') {
							item.options = []
							if (this.formModel.hasOwnProperty(item.field)) {
								if (item.multiple) {
									this.$set(this.formModel, item.field, String(this.formModel[item.field]).split(','))
								}
								this.queryBusinessData(item, i)
							} else {
								if (item.multiple) {
									this.$set(this.formModel, item.field, [])
								}
							}
							if (item.required) {
								if (item.multiple) {
									this.$set(this.rules, item.field, [
										{ type: 'array', required: true, message: item.placeholder }
									])
								} else {
									this.$set(this.rules, item.field, [{ required: true, message: item.placeholder }])
								}
							}
						}
						this.$set(this.property, item.field, item)
					}
					this.fieldOptions = fieldOptions
				}
			}
		},
		//单据编号
		async queryBill(field, prefix, billDate, digit) {
			if (this.$route.query.id) {
				let params = {
					id: this.$route.query.id,
					field: field.split('|')[1],
					prefix: prefix,
					billDate: billDate,
					digit: digit
				}

				let res = await this.$axios.post('jellyForm/queryBill', params)
				if (res.data.code === 200) {
					this.$set(this.formModel, field, res.data.data)
				}
			}
		},
		//字典详情
		async queryDicDetail(obj, index) {
			let res = await this.$axios.get('dictionaryDetail/queryDisplay?classifyId=' + obj.source)
			if (res.data.code === 200) {
				let item = this.fieldOptions[index]
				var options = []
				for (var i = 0; i < res.data.data.length; i++) {
					options.push({
						label: res.data.data[i].name,
						value: String(res.data.data[i].code)
					})
					if (this.formModel[item.field] == res.data.data[i].code) {
						this.formModel[item.field + '_label'] = res.data.data[i].name
					}
				}
				item.options = options
				this.$set(this.fieldOptions, index, item)
			}
		},
		//地区数据
		async queryRegions(obj, index) {
			let res = await this.$axios.get('jellyForm/queryRegions/' + obj.format)
			if (res.data.code === 200) {
				let item = this.fieldOptions[index]
				item.options = res.data.data
				this.$set(this.fieldOptions, index, item)
			}
		},
		//选择框确认
		onSelectConfirm(value, item) {
			this.formModel[item.field + '_label'] = value.label
			this.formModel[item.field] = value.value
			item.showPicker = false
		},
		//地区选择确认
		onAreaConfirm(value, item) {
			let area = ''
			for (let i = 0; i < value.length; i++) {
				if (i != value.length - 1) {
					area += value[i] + '/'
				} else {
					area += value[i]
				}
			}
			this.formModel[item.field] = area
			item.showPicker = false
		},
		//日期选择确认
		onDatePickerConfirm(value, item) {
			let year = value.getFullYear()
			let month = Number(value.getMonth()) + 1
			let day = value.getDate()
			if (month >= 1 && month <= 9) {
				month = '0' + month
			}
			if (day >= 0 && day <= 9) {
				day = '0' + day
			}
			let hour = value.getHours()
			if (hour >= 0 && hour <= 9) {
				hour = '0' + hour
			}
			let minute = value.getMinutes()
			if (minute >= 0 && minute <= 9) {
				minute = '0' + minute
			}
			if (item.dateType === 'year') {
				this.formModel[item.field] = year
			} else if (item.dateType === 'month') {
				this.formModel[item.field] = year + '-' + month
			} else if (item.dateType === 'date') {
				this.formModel[item.field] = year + '-' + month + '-' + day
			} else if (item.dateType === 'datetime') {
				this.formModel[item.field] = year + '-' + month + '-' + day + ' ' + hour + ':' + minute
			}
			item.showPicker = false
		},
		//时间选择确认
		onTimePickerConfirm(value, item) {
			this.formModel[item.field] = value
			item.showPicker = false
		},
		//文件大小格式化
		sizeUnit(capacity) {
			var unitArr = new Array('B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB')
			var index = 0
			var srcsize = parseFloat(capacity)
			index = Math.floor(Math.log(srcsize) / Math.log(1024))
			var size = srcsize / Math.pow(1024, index)
			return size + unitArr[index]
		},
		//附件上传前
		beforePictureRead(file, data) {
			const suffix = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
			// 图片格式
			const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
			// 进行图片匹配
			let imgResult = imglist.find(item => item === suffix)
			if (imgResult) {
				if (data.minValue) {
					if (file.size < data.minValue) {
						this.$toast('图片大小至少要' + this.sizeUnit(data.minValue))
						return false
					}
				}
				if (data.maxValue) {
					if (file.size > data.maxValue) {
						this.$toast('图片大小不能超过' + this.sizeUnit(data.maxValue))
						return false
					}
				}
			} else {
				const fileSize = file.size / 1024 / 1024 < 10
				if (!fileSize) {
					this.$toast('文档大小不能超过10MB')
					return false
				}
			}
			const filelist = [
				'png',
				'jpg',
				'jpeg',
				'bmp',
				'gif',
				'tiff',
				'tif',
				'txt',
				'xls',
				'xlsx',
				'doc',
				'docx',
				'pdf',
				'ppt',
				'pptx'
			]
			let result = filelist.find(item => item === suffix)
			if (!result) {
				this.$toast('请上传图片或者文档类型')
				return false
			}
			return true
		},
		//获取文件类型
		getFileType(suffix) {
			let result = ''
			// 图片格式
			const imglist = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
			// 进行图片匹配
			result = imglist.find(item => item === suffix)
			if (result) {
				return 'image'
			}
			// 图片格式
			const tiflist = ['tiff', 'tif']
			// 进行图片匹配
			result = tiflist.find(item => item === suffix)
			if (result) {
				return 'tiff'
			}
			// 匹配txt
			const txtlist = ['txt']
			result = txtlist.find(item => item === suffix)
			if (result) {
				return 'txt'
			}
			// 匹配 excel
			const excelist = ['xls', 'xlsx']
			result = excelist.find(item => item === suffix)
			if (result) {
				return 'excel'
			}
			// 匹配 word
			const wordlist = ['doc', 'docx']
			result = wordlist.find(item => item === suffix)
			if (result) {
				return 'word'
			}
			// 匹配 pdf
			const pdflist = ['pdf']
			result = pdflist.find(item => item === suffix)
			if (result) {
				return 'pdf'
			}
			// 匹配 ppt
			const pptlist = ['ppt', 'pptx']
			result = pptlist.find(item => item === suffix)
			if (result) {
				return 'ppt'
			}
			// 匹配 视频
			const videolist = ['mp4', 'm2v', 'mkv', 'rmvb', 'wmv', 'avi', 'flv', 'mov', 'm4v']
			result = videolist.find(item => item === suffix)
			if (result) {
				return 'video'
			}
			// 匹配 音频
			const radiolist = ['mp3', 'wav', 'wmv']
			result = radiolist.find(item => item === suffix)
			if (result) {
				return 'radio'
			}
			// 匹配 压缩
			const ziplist = ['zip', 'rar']
			result = ziplist.find(item => item === suffix)
			if (result) {
				return 'zip'
			}
			// 其他 文件类型
			return 'other'
		},
		//附件上传后
		afterPictureRead(file, item) {
			// 创建form对象
			let formdata = new FormData()
			formdata.append('file', file.file, file.name)
			//设置请求头
			let config = {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
			let suffix = file.file.name.substring(file.file.name.lastIndexOf('.') + 1, file.file.name.length)
			let fileType = this.getFileType(suffix.toLocaleLowerCase())
			this.$axios.post('upload/putObject/oss', formdata, config).then(res => {
				if (res.data.code == 200) {
					let fileData = this.formModel[item.field]
					let resource = {
						name: file.file.name,
						size: file.file.size,
						type: file.file.fileType,
						url: res.data.data
					}
					if (fileData) {
						this.formModel[item.field].push(resource)
					} else {
						this.formModel[item.field] = [resource]
					}
				}
			})
		},
		//处理开关、单选框、多选框、选择器逻辑
		handleChangeRule(element) {
			if (element.logic) {
				for (var i = 0; i < element.logic.length; i++) {
					let item = element.logic[i]
					if (element.multiple) {
						if (this.formModel[element.field].indexOf(item.value) > -1) {
							for (let j = 0; j < this.fieldOptions.length; j++) {
								let formItem = this.fieldOptions[j]
								if (item.target.indexOf(formItem.field) > -1) {
									if (item.type === 'show') {
										formItem.hidden = false
									} else if (item.type === 'hidden') {
										formItem.hidden = true
									}
									this.$set(this.fieldOptions, j, formItem)
								}
							}
						}
					} else {
						if (item.value == this.formModel[element.field]) {
							for (let j = 0; j < this.fieldOptions.length; j++) {
								let formItem = this.fieldOptions[j]
								if (item.target.indexOf(formItem.field) > -1) {
									if (item.type === 'show') {
										formItem.hidden = false
									} else if (item.type === 'hidden') {
										formItem.hidden = true
									}
									this.$set(this.fieldOptions, j, formItem)
								}
							}
						}
					}
				}
			}
		},
		//提交
		onSubmit() {
			var params = {
				businessType: this.$route.query.formId,
				businessKey: this.$route.query.id
			}

			for (let key in this.formModel) {
				if (key.lastIndexOf('_label') === -1 && key != 'form') {
					if (this.formModel[key] instanceof Array || this.formModel[key] instanceof Object) {
						params[key] = JSON.stringify(this.formModel[key])
					} else {
						params[key] = this.formModel[key]
					}
				}

				if (key.indexOf('|') > -1) {
					params[key.split('|')[0] + '.' + key.split('|')[1]] = params[key]
					delete params[key]
				}
			}

			this.$axios.post('jellyForm/updateCustom', params).then(res => {
				if (res.data.code == 200) {
					this.$toast('提交成功')
					this.$router.go(-1)
				} else {
					this.$toast({
						message: res.data.message,
						icon: 'info-o'
					})
				}
			})
		}
	}
}
</script>
<style scoped>
::v-deep .van-field__label {
	color: #000;
}
::v-deep .upload-disabled .van-uploader__upload--readonly {
	display: none;
}
.van-cell {
	border-bottom: 0.5px solid #ebedf0;
}
.van-cell::after {
	border-bottom: none;
}
.van-radio--horizontal {
	margin-bottom: 15px;
}
.van-checkbox--horizontal {
	margin-bottom: 15px;
}
.tabbar_bottom {
	padding-bottom: 60px;
}
.footer {
	display: flex;
	justify-content: space-around;
	position: fixed;
	bottom: 0;
	left: 0;
	background-color: #fff;
	width: 100%;
}
.footer button {
	margin: 10px;
}
</style>
