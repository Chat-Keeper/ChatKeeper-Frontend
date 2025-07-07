<script>
import { defineComponent } from 'vue'
import SpeakersSideMenu from '@/components/SpeakersSideMenu.vue'
import request from '@/utils/request.js'
import verify from '@/utils/verification.js'
import { useAuthStore } from '@/store/auth.js'

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
    getSpeakers() {
      request
        .get('/data/speaker/list')
        .then((response) => {
          console.log(response)
          if (response.data.code === 200) {
            this.speakerNum = response.data.data.speaker_num
            this.speakerList = response.data.data.speaker_list
            console.log(response.data.msg)
          }
          else if (response.data.code === 400) {
            this.$toast.add({
              severity: 'info',
              summary: '对象列表为空',
              detail: '你可能还没有上传聊天记录，请先前往群聊管理页面上传',
              life: 3000
            })
          }
          else {
            this.$toast.add({
              severity: 'error',
              summary: '未知错误',
              detail: '请联系管理人员',
              life: 3000
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

  created() {
    verify().then((status) => {
      if (status) {
        this.getSpeakers()
      }
      else {
        useAuthStore().logout()
        setTimeout(() =>  this.$router.push('/login'), 500)
        this.$toast.add({
          severity: 'info',
          summary: '你尚未登录',
          detail: '即将跳转登录页面……',
          life: 3000
        })
      }
    })
  },

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
        }
        else {
          useAuthStore().logout()
          setTimeout(() =>  this.$router.push('/login'), 500)
          this.$toast.add({
            severity: 'info',
            summary: '你尚未登录',
            detail: '即将跳转登录页面……',
            life: 3000
          })
        }
      })
    },

    speakerList() {
      if (this.$route.params.speaker_id) {
        this.currentSpeaker = this.speakerList.find((speaker) => speaker.speaker_id === this.$route.params.speaker_id)
      }
    }
  },

})
</script>

<template>
  <div class="xl:flex xl:items-start bg-surface-50 dark:bg-surface-950">
    <div class="fixed xl:sticky top-16" :class="displaySideMenu ? 'z-100!' : ''">
      <SpeakersSideMenu
        :speaker-list="speakerList"
        @toggle="toggleSideMenu"
        class="h-[calc(100vh-4rem)] absolute"
      ></SpeakersSideMenu>
    </div>
    <div class="flex-grow min-h-[calc(100vh-4rem)] bg-surface-50 dark:bg-surface-950 ml-12 xl:ml-0">
      <router-view
        :current-speaker="currentSpeaker"
        v-if="currentSpeaker"
      > </router-view>
    </div>
  </div>
</template>

<style scoped></style>