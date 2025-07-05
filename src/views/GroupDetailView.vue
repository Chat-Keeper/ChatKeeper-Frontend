<script lang="ts">
import { defineComponent } from 'vue'
import request from '@/utils/request.js'

export default defineComponent({
  name: 'GroupDetailView',
  props: {
    currentGroup: Object,
  },

  data() {
    return {
      findStr: '',
      keyword: '',
      uploadFile: null,
      uploadProgress: 0,
      uploadStatus: 'pending',
      interestingSpeakers: []
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

    onUpload(event) {
      this.uploadStatus = 'uploading'
      this.uploadProgress = 0

      const formData = new FormData()
      formData.append('group_id', this.$route.params.group_id)
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
        })
        .catch((error) => {
          console.log(error)
          this.uploadStatus = 'error'
        })
    },

    uploadSuccessToast() {
      this.$toast.add({
        severity: 'success',
        summary: '上传成功',
        detail: '文件已经上传至数据库，请等待页面刷新……',
        life: 3000,
      })
    },

    searchInterest() {
      request
        .post('/analysis/search', {
          keyword: this.keyword,
        })
        .then((response) => {
          console.log(response)
          if (response.data.code === 200) {
            console.log(response.data.msg)
            if (response.data.data.speaker_info) {
              this.interestingSpeakers = response.data.data.speaker_info
              this.interestingSpeakers.sort((a, b) => b.relativity - a.relativity)
            }
            this.keyword = ''
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },

  watch: {
    $route() {
      this.findStr = ''
      this.keyword = ''
      this.uploadFile = null
      this.uploadProgress = 0
      this.uploadStatus = 'pending'
      this.interestingSpeakers = []
      this.$refs.fileUploadRef.clear()
    },
  },
})
</script>

<template>
  <div class="lg:flex items-start p-5">
    <div class="lg:w-7/12 w-11/12 flex-col">
      <Card class="dark:bg-surface-900! m-3">
        <template #title>
          <div class="flex items-center gap-3 mb-1">
            <Avatar icon="pi pi-address-book" size="large" shape="circle"></Avatar>
            <p class="text-2xl">{{ currentGroup.group_name }}</p>
          </div>
        </template>
        <template #content>
          <div class="flex-col items-center m-2">
            <div class="flex items-center gap-2 mt-2">
              <div class="flex items-center gap-2 mr-5">
                <i class="pi pi-users"></i>
                <p>成员数量：{{ currentGroup.speaker_num }}</p>
              </div>
              <div class="flex items-center gap-2 mr-5">
                <i class="pi pi-users"></i>
                <p>聊天记录条数：{{ currentGroup.message_num }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 mt-2">
              <div class="flex items-center gap-2">
                <i class="pi pi-calendar"></i>
                <p>
                  时间范围：{{ currentGroup.start_time.slice(0, 10) }} ~
                  {{ currentGroup.end_time.slice(0, 10) }}
                </p>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card class="m-3">
        <template #title>
          <div class="flex justify-between">
            <div class="flex items-center gap-3 mb-1">
              <Avatar icon="pi pi-user" shape="circle"></Avatar>
              <p>群聊成员</p>
            </div>
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText v-model="findStr" placeholder="搜索群成员" size="small" />
            </IconField>
          </div>
        </template>
        <template #content>
          <div v-for="speaker in currentGroup.speaker_list" class="flex-col">
            <router-link
              :to="'/home/speakers/' + speaker.speaker_id"
              v-if="
                findStr === '' ||
                speaker.speaker_name.includes(findStr) ||
                speaker.speaker_qq.includes(findStr)
              "
            >
              <Card
                class="my-2 shadow-none!"
                :class="
                  speaker.analyzed
                    ? 'bg-primary-50! hover:bg-primary-100! dark:bg-primary-950! dark:hover:bg-primary-900! text-primary-500! dark:text-primary-300!'
                    : 'bg-surface-100! hover:bg-surface-200! dark:bg-surface-800! dark:hover:bg-surface-700! text-surface-400! dark:text-surface-400!'
                "
              >
                <template #title>
                  <div class="flex gap-4 items-center text-lg -m-2">
                    <Badge
                      size="xlarge"
                      class="min-w-5/12! mr-2"
                      :class="speaker.analyzed ? '' : 'bg-surface-400! dark:bg-surface-400!'"
                    >
                      <p>{{ speaker.speaker_name }}</p>
                    </Badge>
                    <div class="flex gap-2 items-center">
                      <i class="pi pi-tag"></i>
                      <p size="large" class="font-bold">
                        {{ speaker.speaker_qq }}
                      </p>
                    </div>
                  </div>
                </template>
                <template #content>
                  <div class="-m-2 mt-3">
                    <div class="flex items-center gap-3 m-1">
                      <div class="flex items-center gap-2">
                        <i class="pi pi-send"></i>
                        <p>消息数量</p>
                      </div>
                      <MeterGroup
                        :value="[
                          {
                            label: '',
                            value: (speaker.speaker_msg_freq / currentGroup.max_msg_freq) * 100,
                            color: speaker.analyzed
                              ? 'var(--p-primary-color)'
                              : 'var(--p-surface-400)',
                          },
                        ]"
                        class="w-8/12"
                        :pt="{
                          labelList: { class: 'hidden!' },
                        }"
                      >
                      </MeterGroup>
                      <p class="font-bold text-sm">{{ speaker.speaker_msg_freq }}</p>
                    </div>
                  </div>
                </template>
              </Card>
            </router-link>
          </div>
        </template>
      </Card>
    </div>

    <div class="lg:w-5/12 w-11/12 flex-col">
      <Card class="dark:bg-surface-900! m-3">
        <template #title>
          <div class="flex items-center gap-3 mb-1">
            <Avatar icon="pi pi-lightbulb" shape="circle"></Avatar>
            <p>发现群成员</p>
          </div>
        </template>
        <template #content>
          <div class="text-surface-500! dark:text-surface-300! mt-2">
            在搜索框中输入你的“兴趣关键词”，我们将为你发现你可能感兴趣的群聊成员，快来试试吧！
          </div>
          <div class="flex items-start justify-between mt-3">
            <InputText v-model="keyword" placeholder="兴趣关键词" class="w-[calc(100%-100px)]" />
            <Button @click="searchInterest()">
              <i class="pi pi-lightbulb"></i>
              <p>发现</p>
            </Button>
          </div>

          <div v-for="speaker in interestingSpeakers" class="flex-col mt-5">
            <router-link :to="'/home/speakers/' + speaker.speaker_id">
              <Card
                class="my-2 shadow-none!"
                :class="
                  speaker.analyzed
                    ? 'bg-primary-50! hover:bg-primary-100! dark:bg-primary-950! dark:hover:bg-primary-900! text-primary-500! dark:text-primary-300!'
                    : 'bg-surface-100! hover:bg-surface-200! dark:bg-surface-800! dark:hover:bg-surface-700! text-surface-400! dark:text-surface-400!'
                "
              >
                <template #title>
                  <div class="flex gap-4 items-center text-lg -m-2">
                    <Badge
                      size="xlarge"
                      class="min-w-5/12! mr-2"
                      :class="speaker.analyzed ? '' : 'bg-surface-400! dark:bg-surface-400!'"
                    >
                      <p>{{ speaker.speaker_name }}</p>
                    </Badge>
                    <div class="flex gap-2 items-center">
                      <i class="pi pi-tag"></i>
                      <p size="large" class="font-bold">
                        {{ speaker.speaker_qq }}
                      </p>
                    </div>
                  </div>
                </template>
                <template #content>
                  <div class="-m-2 mt-3">
                    <div class="flex items-center gap-3 m-1">
                      <div class="flex items-center gap-2">
                        <i class="pi pi-thumbs-up"></i>
                        <p>兴趣度</p>
                      </div>
                      <MeterGroup
                        :value="[
                          {
                            label: '',
                            value: speaker.relativity,
                            color: speaker.analyzed
                              ? 'var(--p-primary-color)'
                              : 'var(--p-surface-400)',
                          },
                        ]"
                        class="w-7/12"
                        :pt="{
                          labelList: { class: 'hidden!' },
                        }"
                      >
                      </MeterGroup>
                      <p class="font-bold text-sm">{{ speaker.relativity }}</p>
                    </div>
                  </div>
                </template>
              </Card>
            </router-link>
          </div>

        </template>
      </Card>

      <Card class="dark:bg-surface-900! m-3">
        <template #title>
          <div class="flex items-center gap-3 mb-1">
            <Avatar icon="pi pi-upload" shape="circle"></Avatar>
            <p>上传聊天记录</p>
          </div>
        </template>
        <template #content>
          <div class="flex items-start mt-2">
            <FileUpload
              ref="fileUploadRef"
              custom-upload
              name="chat_log"
              @select="onSelect"
              @remove="onClear"
              @clear="onClear"
              @uploader="onUpload($event)"
              accept=".txt"
              :max-file-size="100 * 1024 * 1024"
              :multiple="false"
              choose-label="选择"
              upload-label="上传"
              cancel-label="取消"
              :pt="{
                root: { class: 'w-full!' },
                content: { class: 'min-h-15' },
                pcChooseButton: { root: { class: 'p-button-outlined p-button-info' } },
                pcUploadButton: { root: { class: 'p-button-outlined p-button-success' } },
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
                <p class="text-surface-500! dark:text-surface-300!">
                  请点击按钮或者将文件拖动到这里
                </p>
              </template>
            </FileUpload>
          </div>
        </template>
      </Card>

      <Card class="dark:bg-surface-900! m-3">
        <template #title>
          <div class="flex items-center gap-3 mb-1">
            <Avatar icon="pi pi-sliders-h" shape="circle"></Avatar>
            <p>群聊设置</p>
          </div>
        </template>
        <template #content>
          <div class="flex-col items-center">
            <div class="flex items-center gap-4 mt-2">
              <Button label="设置群聊" severity="secondary" variant="outlined" />
              <Button label=" 删除群聊" severity="danger" variant="outlined" />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped></style>