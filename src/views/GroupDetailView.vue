<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GroupDetailView',
  props: {
    currentGroup: Object,
  },
  data() {
    return {
      searchKey: "",
    }
  },
  methods: {
    upload(event) {
      this.$toast.add({
        severity: 'info',
        summary: 'Success',
        detail: 'File Uploaded',
        life: 3000
      });
    }
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
                <p>时间范围：{{ currentGroup.start_time.slice(0,10) }} ~ {{ currentGroup.end_time.slice(0,10) }}</p>
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
            <IconField >
              <InputIcon class="pi pi-search" />
              <InputText v-model="searchKey" placeholder="搜索群成员" size="small" />
            </IconField>
          </div>
        </template>
        <template #content>
          <div v-for="speaker in currentGroup.speaker_list" class="flex-col">
            <router-link :to="'/home/speakers/' + speaker.speaker_id" v-if="searchKey === '' || speaker.speaker_name.includes(searchKey)">
              <Card
                class="my-2 shadow-none!"
                :class="speaker.analyzed
                  ? 'bg-primary-50! hover:bg-primary-100! dark:bg-primary-950! dark:hover:bg-primary-900! text-primary-500! dark:text-primary-300!'
                  : 'bg-surface-100! hover:bg-surface-200! dark:bg-surface-800! dark:hover:bg-surface-700! text-surface-400! dark:text-surface-400!'"
              >
                <template #title>
                  <div class="flex gap-4 items-center text-lg -m-2">
                    <Badge
                      size="xlarge"
                      class="min-w-5/12! mr-2"
                      :class="speaker.analyzed
                        ? ''
                        : 'bg-surface-400! dark:bg-surface-400!'"
                    >
                      <p>{{ speaker.speaker_name }}</p>
                    </Badge>
                    <div class="flex gap-2 items-center">
                      <i class="pi pi-tag"></i>
                      <p size="large" class=" font-bold" >
                        {{ speaker.speaker_qq }}
                      </p>
                    </div>

                  </div>
                </template>
                <template #content>
                  <div class="-m-2 mt-3">
                    <div class="flex items-center gap-3 mr-2">
                      <i class="pi pi-send"></i>
                      <MeterGroup
                        :value="[{
                          label: '',
                          value: (speaker.speaker_msg_freq / currentGroup.max_msg_freq * 100),
                          color: speaker.analyzed ? 'var(--p-primary-color)' : 'var(--p-surface-400)'
                        }]"
                        class="w-9/12"
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
            <InputText v-model="value" placeholder="兴趣关键词" class=" w-[calc(100%-100px)]"/>
            <Button @click="">
              <i class="pi pi-lightbulb"></i>
              <p>发现</p>
            </Button>
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
              choose-label="选择"
              upload-label="上传"
              cancel-label="取消"
              name="demo[]"
              url="/api/upload"
              @upload="upload($event)"
              accept=".txt"
              :maxFileSize="1000000"
              :pt="{
                root: { class: 'w-full!' },
                content: { class: 'min-h-15' },
                pcChooseButton: { root: { class: 'p-button-outlined p-button-info' } },
                pcUploadButton: { root: { class: 'p-button-outlined p-button-success' } },
                pcCancelButton: { root: { class: 'p-button-outlined p-button-danger' } },
                fileThumbnail: { class: 'hidden!' },
                pcFileBadge: { root: { variant: 'outlined' } },
              }"
            >
              <template #empty>
                <p class="text-surface-500! dark:text-surface-300!">请点击按钮或者将文件拖动到这里</p>
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