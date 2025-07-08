<script>
import { defineComponent } from 'vue'
import { useWindowSize } from '@vueuse/core'

/**
 * **GroupsSideMenu.vue**
 * 群聊侧边栏组件
 * - 功能：
 *   - 显示群聊列表和新建群聊选项
 *   - 在用户点击时跳转到群聊对应的路由
 * - 特性：响应式设计
 */
export default defineComponent({
  name: 'GroupsSideMenu',

  props: {
    groupList: Array, // 父组件传入的群聊列表
  },

  data() {
    return {
      displaySideMenu: true,
    }
  },

  methods: {
    toggleSideMenu() {
      this.displaySideMenu = !this.displaySideMenu
    },
  },

  /* 创建时响应式选择侧边栏开合状态 */
  created() {
    if (this.width < 1280 && this.$route.path !== '/home/groups') {
      this.displaySideMenu = false
    }
  },

  /* 定义页面宽度监听 */
  setup() {
    const { width } = useWindowSize()
    return {
      width,
    }
  },

  /**
   * 监听页面宽度变化和路由：
   * - 响应式调整侧边栏显示状态
   * 监听侧边栏显示状态变化：
   * - 触发事件，通知父组件侧边栏状态
   */
  watch: {
    width(newWidth) {
      this.displaySideMenu = newWidth >= 1280
    },
    $route(to, from) {
      if (this.width < 1280 && to.path !== '/home/groups') {
        this.displaySideMenu = false
      }
    },
    displaySideMenu() {
      this.$emit('toggle', this.displaySideMenu)
    },
  },
})
</script>

<template>
  <div class="flex shadow-xs">
    <!--常显示侧边栏，放置控制按钮-->
    <div class="flex-col h-[calc(100vh-4rem)] w-12 p-1.5 border-r border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-950 z-100!">
      <Button icon="pi pi-align-justify" severity="secondary" size="small" class="my-2" @click="toggleSideMenu()"></Button>
      <Button icon="pi pi-question-circle" severity="secondary" size="small" class="my-2" @click="" disabled></Button>
    </div>
    <!--动态显示侧边栏，显示群聊列表-->
    <div
      class="transition-all duration-200 ease-in-out overflow-hidden backdrop-blur-lg! bg-surface-0/75 dark:bg-surface-950/75 z-50!"
      :class="displaySideMenu ? 'xl:w-80 translate-x-0' : 'xl:w-0 -translate-x-full'"
    >
      <div class="w-80 h-[calc(100vh-4rem)] overflow-auto border-r border-surface-200 dark:border-surface-700 shadow-xs z-50!">
        <!--群聊列表，卡片形式-->
        <template v-for="item in groupList">
          <router-link :to="'/home/groups/' + item.group_id">
            <Card
              class="mx-1 my-2"
              :class="
                item.group_id === $route.params.group_id
                  ? 'bg-primary-100/60! dark:bg-primary-900/60!'
                  : 'dark:bg-surface-900/60! hover:bg-surface-50/60! dark:hover:bg-surface-800/60!'
              "
            >
              <template #title>
                <div class="flex items-center gap-5 h-12 pt-1">
                  <div>
                    <Avatar
                      :label="item.group_name[0]"
                      size="xlarge"
                      shape="circle"
                      :class="item.group_id === $route.params.group_id ? 'bg-primary-200! dark:bg-primary-700!' : ''"
                    />
                  </div>
                  <div class="flex-col gap-2">
                    <div class="text-lg w-45">
                      {{ item.group_name.length > 10 ? item.group_name.slice(0, 9) + '...' : item.group_name }}
                    </div>
                    <div class="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-300 mt-2.5">
                      <div class="flex items-center gap-2 mr-3 w-12">
                        <i class="pi pi-users"></i>
                        <p>{{ item.speaker_num }}</p>
                      </div>
                      <div class="flex items-center gap-2">
                        <i class="pi pi-calendar"></i>
                        <p>{{ item.end_time.slice(0, 10) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </Card>
          </router-link>
        </template>
        <!--新建群聊按钮-->
        <router-link to="/home/groups/new">
          <Card
            class="mx-1 my-2 mb-5"
            :class="
              $route.path.includes('new')
                ? 'bg-primary-100/60! dark:bg-primary-900/60!'
                : 'dark:bg-surface-900/60! hover:bg-surface-50/60! dark:hover:bg-surface-800/60!'
            "
          >
            <template #title>
              <div
                class="flex items-center justify-center h-12 text-6xl font-extralight p-4"
                :class="$route.path.includes('new') ? 'text-primary-500 dark:text-primary-300' : 'text-surface-500 dark:text-surface-300'"
              >
                <div
                  class="flex justify-center rounded-2xl w-full pb-2 mt-2"
                  :class="$route.path.includes('new') ? 'bg-primary-200/60 dark:bg-primary-800/60' : 'bg-surface-200/60 dark:bg-surface-800/60'"
                >
                  +
                </div>
              </div>
            </template>
          </Card>
        </router-link>
      </div>
    </div>
  </div>
  <!--占位符，不可删除-->
  <div></div>
</template>

<style scoped></style>
