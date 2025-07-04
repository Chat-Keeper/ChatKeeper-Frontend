<script>
import { defineComponent } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import SideMenu from '@/components/SideMenu.vue'
import request from '@/utils/request.js'
import GroupDetailView from '@/views/GroupDetailView.vue'

export default defineComponent({
  name: 'GroupsView',
  components: { GroupDetailView, SideMenu },
  data() {
    return {
      authStore: null,
      groupNum: 0,
      groupList: [],
      currentGroup: null,
    }
  },
  methods: {
    getGroups() {
      request.get('/data/group/list', {
        user_id: this.authStore.userId,
        token: this.authStore.token,
      })
      .then((response) => {
        console.log(response)
        if (response.data.code === 200) {
          this.groupNum = response.data.data.group_num
          this.groupList = response.data.data.group_list
          console.log(response.data.msg)
        }
      })
      .catch((error) => {
        console.log(error)
      })
    }
  },
  created() {
    this.authStore = useAuthStore()
    this.getGroups()
  },
  watch: {
    '$route'(to, from) {
      console.log(to.params.group_id)
      this.currentGroup = this.groupList.find(group => group.group_id === to.params.group_id)
      if (!this.currentGroup) {
        this.$router.push('/home/groups')
        console.log('not found')
      }
      this.currentGroup.speaker_list.sort((a, b) => b.speaker_msg_freq - a.speaker_msg_freq)
      this.currentGroup['max_msg_freq'] = this.currentGroup.speaker_list[0].speaker_msg_freq
    }
  }
})
</script>

<template>
  <div class="flex items-start">
    <div class="flex-shrink-0 sticky top-16">
      <SideMenu :group-list="groupList" class="h-[calc(100vh-4rem)]"></SideMenu>
    </div>
    <div class="flex-grow min-h-[calc(100vh-4rem)] bg-surface-50 dark:bg-surface-950">
      <router-view :current-group="currentGroup"></router-view>
    </div>
  </div>
</template>

<style scoped></style>
