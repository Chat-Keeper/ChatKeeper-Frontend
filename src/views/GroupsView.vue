<script>
import { defineComponent } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import request from '@/utils/request.js'
import verify from '@/utils/verification.js'
import GroupsSideMenu from '@/components/GroupsSideMenu.vue'

/**
 * **GroupsView.vue**
 * 群聊主视图
 * - 功能：
 *   - 布局群聊页面
 *   - 管理群聊列表数据
 * - 引用：`auth.js`, `request.js`, `verification.js`, `GroupsSideMenu.vue`
 */
export default defineComponent({
  name: 'GroupsView',

  components: { GroupsSideMenu },

  data() {
    return {
      groupNum: 0,
      groupList: [], // 群聊列表
      currentGroup: null, // 当前选中的群聊
      displaySideMenu: true,
    }
  },

  methods: {
    /* 获取群聊列表 */
    getGroups() {
      request
        .get('/data/group/list')
        .then((response) => {
          console.log(response)
          if (response.data.code === 200) {
            this.groupNum = response.data.data.group_num
            this.groupList = response.data.data.group_list
            console.log(response.data.msg)
          } else if (response.data.code === 400) {
            this.$toast.add({
              severity: 'info',
              summary: '群聊列表为空',
              detail: '你目前没有管理任何群聊，请新建并上传聊天记录',
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
          this.$toast.add({
            severity: 'error',
            summary: '服务器响应异常',
            detail: '请联系管理人员',
            life: 3000,
          })
        })
    },

    /* 群聊发生更新时动态更新路由 */
    updateGroup(groupInfo) {
      let index = this.groupList.findIndex((group) => group.group_id === this.$route.params.group_id)
      if (index !== -1) {
        this.groupList[index] = groupInfo
        this.$router.push('/home/groups/' + this.groupList[index].group_id)
      } else {
        this.groupList.push(groupInfo)
        this.$router.push('/home/groups/' + groupInfo.group_id)
      }
    },

    /* 重命名群聊时动态更新信息 */
    renameGroup(groupName) {
      let index = this.groupList.findIndex((group) => group.group_id === this.$route.params.group_id)
      if (index !== -1) {
        this.groupList[index].group_name = groupName
      }
    },

    /* 删除群聊时路由跳转 */
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
        this.getGroups()
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
   * - 更新`currentGroup`
   * - 根据消息数量排序群聊用户
   * 监听`groupList`更新
   * - 更新`currentGroup`
   */
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
          } else {
            this.currentGroup.speaker_list.sort((a, b) => b.speaker_msg_freq - a.speaker_msg_freq)
            this.currentGroup['max_msg_freq'] = this.currentGroup.speaker_list[0].speaker_msg_freq
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

    groupList() {
      if (this.$route.params.group_id) {
        this.currentGroup = this.groupList.find((group) => group.group_id === this.$route.params.group_id)
        this.currentGroup.speaker_list.sort((a, b) => b.speaker_msg_freq - a.speaker_msg_freq)
        this.currentGroup['max_msg_freq'] = this.currentGroup.speaker_list[0].speaker_msg_freq
      }
    },
  },
})
</script>

<template>
  <div class="xl:flex xl:items-start bg-surface-50 dark:bg-surface-950">
    <!--群聊侧边栏-->
    <div class="fixed xl:sticky top-16" :class="displaySideMenu ? 'z-100!' : ''">
      <GroupsSideMenu :group-list="groupList" @toggle="toggleSideMenu" class="h-[calc(100vh-4rem)] absolute"></GroupsSideMenu>
    </div>
    <!--群聊内容区-->
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
