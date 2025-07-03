<script>
import { defineComponent } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import SideMenu from '@/components/SideMenu.vue'
import request from '@/utils/request.js'

export default defineComponent({
  name: 'GroupsView',
  components: { SideMenu },
  data() {
    return {
      authStore: null,
      groupNum: 0,
      groupList: [],
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
})
</script>

<template>
  <div class="flex gap-5">
        <SideMenu :group-list="groupList" class="h-[calc(100vh-4rem)]"></SideMenu>
    <div class="p-2">

    </div>
  </div>
</template>

<style scoped></style>
