<script>
import { defineComponent } from 'vue'
import request from '@/utils/request.js'
import verify from '@/utils/verification.js'
import GroupsSideMenu from '@/components/GroupsSideMenu.vue'
import GroupDetailView from '@/views/GroupDetailView.vue'
import { useAuthStore } from '@/store/auth.js'

export default defineComponent({
  name: 'GroupsView',
  components: { GroupDetailView, GroupsSideMenu },
  data() {
    return {
      groupNum: 0,
      groupList: [],
      currentGroup: null,
      displaySideMenu: true,
    }
  },

  methods: {
    getGroups() {
      request
        .get('/data/group/list')
        .then((response) => {
          console.log(response)
          if (response.data.code === 200) {
            this.groupNum = response.data.data.group_num
            this.groupList = response.data.data.group_list
            console.log(response.data.msg)
          }
          else if (response.data.code === 400) {
            this.$toast.add({
              severity: 'info',
              summary: '群聊列表为空',
              detail: '你目前没有管理任何群聊，请新建并上传聊天记录',
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
          this.$toast.add({
            severity: 'error',
            summary: '服务器响应异常',
            detail: '请联系管理人员',
            life: 3000
          })
        })
    },

    updateGroup(groupInfo) {
      // mock返回group_id随机时的临时策略，后续修改
      let index = this.groupList.findIndex((group) => group.group_id === this.$route.params.group_id)
      if (index !== -1) {
        this.groupList[index] = groupInfo
        this.$router.push('/home/groups/' + this.groupList[index].group_id)
      }
      else {
        this.groupList.push(groupInfo)
        this.$router.push('/home/groups/' + groupInfo.group_id)
      }
    },

    renameGroup(groupName) {
      let index = this.groupList.findIndex((group) => group.group_id === this.$route.params.group_id)
      if (index !== -1) {
        this.groupList[index].group_name = groupName
      }
    },

    deleteGroup(groupId) {
      let index = this.groupList.findIndex((group) => group.group_id === groupId)
      if (index !== -1) {
        this.groupList.splice(index, 1)
        this.currentGroup = null
        this.$router.push('/home/groups/new')
      }
    },

    toggleSideMenu(status) {
      this.displaySideMenu = status
    }

  },

  created() {
    verify().then((status) => {
      if (status) {
        this.getGroups()
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
          if (to.path.includes('new')) {
            this.currentGroup = null
            return
          }
          console.log(to.params.group_id)
          this.currentGroup = this.groupList.find((group) => group.group_id === to.params.group_id)
          if (!this.currentGroup) {
            this.$router.push('/home/groups')
            console.log('not found')
          }
          else {
            this.currentGroup.speaker_list.sort((a, b) => b.speaker_msg_freq - a.speaker_msg_freq)
            this.currentGroup['max_msg_freq'] = this.currentGroup.speaker_list[0].speaker_msg_freq
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

    groupList() {
      if (this.$route.params.group_id) {
        this.currentGroup = this.groupList.find((group) => group.group_id === this.$route.params.group_id)
      }
    }
  },
})
</script>

<template>
  <div class="xl:flex xl:items-start bg-surface-50 dark:bg-surface-950">
    <div class="fixed xl:sticky top-16" :class="displaySideMenu ? 'z-100!' : ''">
      <GroupsSideMenu
        :group-list="groupList"
        @toggle="toggleSideMenu"
        class="h-[calc(100vh-4rem)] absolute"
      ></GroupsSideMenu>
    </div>
    <div class="flex-grow min-h-[calc(100vh-4rem)] bg-surface-50 dark:bg-surface-950 ml-12 xl:ml-0">
      <router-view
        v-if="currentGroup || $route.path.includes('new')"
        :current-group="currentGroup"
        @update-group="updateGroup"
        @rename-group="renameGroup"
        @delete-group="deleteGroup"
      >
      </router-view>
    </div>
  </div>
</template>

<style scoped></style>
