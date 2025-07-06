<script>
import { defineComponent } from 'vue'
import request from '@/utils/request.js'

export default defineComponent({
  name: 'CreateGroupView',
  data() {
    return {
      groupName: '',
      confirmName: false,
      uploadFile: null,
      uploadProgress: 0,
      uploadStatus: 'pending',
      groupId: '',
    }
  },

  methods: {
    onSelect(event) {
      this.uploadFile = event.files[0]
      this.uploadProgress = 0
      this.uploadStatus = 'pending'
    },

    onClear() {
      this.uploadFile = null
      this.uploadProgress = 0
      this.uploadStatus = 'pending'
    },

    onUpload() {
      this.uploadStatus = 'uploading'
      this.uploadProgress = 0

      const formData = new FormData()
      formData.append('group_id', this.groupId)
      formData.append('chat_log', this.uploadFile)

      request
        .post('/data/upload', formData, {
          onUploadProgress: (progressEvent) => {
            this.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          },
        })
        .then((response) => {
          console.log(response)
          if (response.data.code === 200) {
            console.log(response.data.msg)
            this.uploadStatus = 'success'
            this.uploadSuccessToast()
            setTimeout(() => this.$refs.fileUploadRef.clear(), 3000)
            this.$emit('updateGroup', response.data.data)
          }
          else {
            this.deleteGroup()
          }
        })
        .catch((error) => {
          console.log(error)
          this.uploadStatus = 'error'
          this.deleteGroup()
        })
    },

    createGroup() {
      request
        .post('/data/group/new', {
          group_name: this.groupName
        })
        .then((response) => {
          console.log(response)
          if (response.data.code === 200) {
            this.createSuccessToast()
            this.groupId = response.data.data.group_id
            this.onUpload()
            this.groupName = ''
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },

    deleteGroup() {
      request
        .post('/data/group/delete', {
          group_id: this.groupId
        })
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })
    },

    createSuccessToast() {
      this.$toast.add({
        severity: 'success',
        summary: '群聊创建成功',
        detail: '群聊创建成功，正在上传聊天记录……',
        life: 3000,
      })
    },

    uploadSuccessToast() {
      this.$toast.add({
        severity: 'success',
        summary: '上传成功',
        detail: '聊天记录已经上传至数据库，请等待页面刷新！',
        life: 3000,
      })
    },
  },

  watch: {
    $route() {
      this.groupName = ''
      this.groupId = ''
      this.confirmName = false
      this.uploadFile = null
      this.uploadProgress = 0
      this.uploadStatus = 'pending'
      this.$refs.fileUploadRef.clear()
    },
  },

})
</script>

<template>
  <div class="lg:w-full lg:flex w-11/12 p-5">

    <Card class="dark:bg-surface-900! m-3 lg:w-1/2 w-full">
      <template #title>
        <div class="flex items-center gap-3 mb-1">
          <Avatar icon="pi pi-address-book" shape="circle"></Avatar>
          <p>新建群聊</p>
        </div>
      </template>
      <template #content>
        <div class="text-surface-500! dark:text-surface-300! mt-2">
          第1步：在输入框中自定义新群聊的名称，它将帮助我们标识这个群聊，请尽量不要让长度超过10个字符
        </div>
        <div class="flex items-start justify-between mt-4">
          <InputText v-model="groupName" placeholder="群聊名称" class="w-[calc(100%-100px)]" :disabled="confirmName" />
          <Button v-if="!confirmName" @click="confirmName = !confirmName" severity="success" outlined>
            <i class="pi pi-check"></i>
            <p>确认</p>
          </Button>
          <Button v-if="confirmName" @click="confirmName = !confirmName" severity="danger" outlined>
            <i class="pi pi-times"></i>
            <p>取消</p>
          </Button>
        </div>
        <div v-if="confirmName && uploadFile" @click="createGroup" class="w-full flex items-end justify-center mt-15">
          <Button class="text-xl!">
            <i class="pi pi-plus text-xl!"></i>
            <p>新建群聊</p>
          </Button>
        </div>
      </template>
    </Card>

    <Card class="dark:bg-surface-900! m-3 lg:w-1/2 w-full">
      <template #title>
        <div class="flex items-center gap-3 mb-1">
          <Avatar icon="pi pi-upload" shape="circle"></Avatar>
          <p>上传聊天记录</p>
        </div>
      </template>
      <template #content>
        <div class="text-surface-500! dark:text-surface-300! mt-2">
          第2步：选择 .txt 格式的聊天记录并上传
        </div>
        <div class="flex items-start mt-2">
          <FileUpload
            ref="fileUploadRef"
            custom-upload
            name="chat_log"
            @select="onSelect"
            @remove="onClear"
            @clear="onClear"
            accept=".txt"
            :max-file-size="100 * 1024 * 1024"
            :multiple="false"
            choose-label="选择"
            cancel-label="取消"
            :pt="{
              root: { class: 'w-full!' },
              content: { class: 'min-h-15' },
              pcChooseButton: { root: { class: 'p-button-outlined p-button-info' } },
              pcUploadButton: { root: { class: 'hidden!' } },
              pcCancelButton: { root: { class: 'p-button-outlined p-button-danger' } },
              fileThumbnail: { class: 'hidden!' },
              pcFileRemoveButton: { root: { class: 'hidden!' } },
              pcProgressBar: {
                value: () => ({ style: { width: uploadProgress + '%' } }),
              },
              file: {
                class:
                  uploadStatus === 'success'
                    ? 'border-l-3 border-green-500'
                    : uploadStatus === 'error'
                      ? 'border-l-3 border-red-500'
                      : 'border-l-3 border-yellow-500',
              },
              pcFileBadge: { root: { class: 'hidden!' } },
            }"
          >
            <template #empty>
              <p class="text-surface-500! dark:text-surface-300!">请点击按钮或者将文件拖动到这里</p>
            </template>
          </FileUpload>
        </div>
      </template>
    </Card>
  </div>

</template>

<style scoped></style>
