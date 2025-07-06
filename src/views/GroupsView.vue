<script>
import { defineComponent } from 'vue'
import GroupsSideMenu from '@/components/GroupsSideMenu.vue'
import request from '@/utils/request.js'
import GroupDetailView from '@/views/GroupDetailView.vue'

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
        })
        .catch((error) => {
          console.log(error)
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
    this.getGroups()
  },

  watch: {
    $route(to, from) {
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
