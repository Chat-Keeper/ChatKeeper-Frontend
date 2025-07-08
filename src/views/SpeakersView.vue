<script>
import { defineComponent } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import request from '@/utils/request.js'
import verify from '@/utils/verification.js'
import SpeakersSideMenu from '@/components/SpeakersSideMenu.vue'

/**
 * **SpeakersView.vue**
 * 对象主视图
 * - 功能：
 *   - 布局对象页面
 *   - 管理对象列表数据
 * - 引用：`auth.js`, `request.js`, `verification.js`, `SpeakersSideMenu.vue`
 */
export default defineComponent({
  name: 'SpeakersView',

  components: { SpeakersSideMenu },

  data() {
    return {
      speakerNum: 0,
      speakerList: [],
      currentSpeaker: null,
      displaySideMenu: true,
    }
  },

  methods: {
    /* 获取对象列表 */
    getSpeakers() {
      request
        .get('/data/speaker/list')
        .then((response) => {
          console.log(response)
          if (response.data.code === 200) {
            this.speakerNum = response.data.data.speaker_num
            this.speakerList = response.data.data.speaker_list
            console.log(response.data.msg)
          } else if (response.data.code === 400) {
            this.$toast.add({
              severity: 'info',
              summary: '对象列表为空',
              detail: '你可能还没有上传聊天记录，请先前往群聊管理页面上传',
              life: 3000,
            })
          } else {
            this.$toast.add({
              severity: 'error',
              summary: '未知错误',
              detail: '请联系管理人员',
              life: 3000,
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },

    toggleSideMenu(status) {
      this.displaySideMenu = status
    },
  },

  /**
   * 页面创建时：
   * - 验证用户登录有效性
   * - 获取群聊列表
   */
  created() {
    verify().then((status) => {
      if (status) {
        this.getSpeakers()
      } else {
        useAuthStore().logout()
        setTimeout(() => this.$router.push('/login'), 500)
        this.$toast.add({
          severity: 'info',
          summary: '你尚未登录',
          detail: '即将跳转登录页面……',
          life: 3000,
        })
      }
    })
  },

  /**
   * 监听路由跳转：
   * - 验证用户登录有效性
   * - 更新`currentSpeaker`
   * - 根据消息数量排序群聊用户
   * 监听`speakerList`更新
   * - 更新`currentSpeaker`
   */
  watch: {
    $route(to, from) {
      verify().then((status) => {
        if (status) {
          this.getSpeakers()
          console.log(to.params.speaker_id)
          this.currentSpeaker = this.speakerList.find((speaker) => speaker.speaker_id === to.params.speaker_id)
          if (!this.currentSpeaker) {
            this.$router.push('/home/speakers')
            console.log('not found')
          }
        } else {
          useAuthStore().logout()
          setTimeout(() => this.$router.push('/login'), 500)
          this.$toast.add({
            severity: 'info',
            summary: '你尚未登录',
            detail: '即将跳转登录页面……',
            life: 3000,
          })
        }
      })
    },

    speakerList() {
      if (this.$route.params.speaker_id) {
        this.currentSpeaker = this.speakerList.find((speaker) => speaker.speaker_id === this.$route.params.speaker_id)
      }
    },
  },
})
</script>

<template>
  <div class="xl:flex xl:items-start bg-surface-50 dark:bg-surface-950">
    <!--对象侧边栏-->
    <div class="fixed xl:sticky top-16" :class="displaySideMenu ? 'z-100!' : ''">
      <SpeakersSideMenu :speaker-list="speakerList" @toggle="toggleSideMenu" class="h-[calc(100vh-4rem)] absolute"></SpeakersSideMenu>
    </div>
    <!--对象内容区-->
    <div class="flex-grow min-h-[calc(100vh-4rem)] bg-surface-50 dark:bg-surface-950 ml-12 xl:ml-0">
      <router-view :current-speaker="currentSpeaker" v-if="currentSpeaker"> </router-view>
    </div>
  </div>
</template>

<style scoped></style>
