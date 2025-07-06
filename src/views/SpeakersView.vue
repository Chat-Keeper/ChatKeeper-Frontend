<script>
import { defineComponent } from 'vue'
import SpeakersSideMenu from '@/components/SpeakersSideMenu.vue'
import request from '@/utils/request.js'

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
    this.getSpeakers()
    this.$router.push('/home/speakers')
  },

  watch: {
    $route(to, from) {
      console.log(to.params.speaker_id)
      this.currentSpeaker = this.speakerList.find((speaker) => speaker.speaker_id === to.params.speaker_id)
      if (!this.currentSpeaker) {
        this.$router.push('/home/speakers')
        console.log('not found')
      }
    },
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