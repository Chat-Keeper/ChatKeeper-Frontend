<script>
import { defineComponent } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import request from '@/utils/request.js'

/**
 * **Topbar.vue**
 * 顶栏组件
 * - 功能：
 *   - 放置Logo
 *   - 提供功能页面切换导肮
 *   - 提供登录登出按钮
 *   - 提供明暗模式切换按钮
 * - 引用：`auth.js`, `request.js`
 */
export default defineComponent({
  name: 'Topbar',

  data() {
    return {
      tabStatus: '0',
      // 用户头像菜单
      userOps: [
        {
          label: () => useAuthStore().username,
          icon: 'pi pi-user',
        },
        {
          separator: true,
        },
        {
          label: '账户信息',
          icon: 'pi pi-book',
          disabled: true,
        },
        {
          label: '设置',
          icon: 'pi pi-cog',
          disabled: true,
        },
        {
          separator: true,
        },
        {
          label: '登出',
          icon: 'pi pi-sign-out',
          command: this.logout,
        },
      ],
    }
  },

  methods: {
    useAuthStore,

    toggleDarkMode() {
      document.documentElement.classList.toggle('dark-mode-selector')
    },

    toggleUserMenu(event) {
      this.$refs.userMenu.toggle(event)
    },

    /* 用户登出方法 */
    logout() {
      request
        .post('/auth/logout')
        .then((response) => {
          console.log(response)
          if (response.data.code === 200) {
            console.log(response.data.msg)
            this.$router.push('/')
            this.tabStatus = '0'
            this.$toast.add({
              severity: 'success',
              summary: '登出成功',
              detail: '下次再见，' + useAuthStore().username + '！',
              life: 3000,
            })
            useAuthStore().logout()
          } else {
            this.password = ''
            this.$toast.add({
              severity: 'error',
              summary: '登出失败',
              detail: '未知错误，请重试',
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

    toggleTab(value) {
      this.tabStatus = value
    },
  },

  /* 页面创建时根据路由设置导航栏状态 */
  created() {
    this.tabStatus = this.$route.path === '/home' ? '0' : this.$route.path.slice(0, 12) === '/home/groups' ? '1' : '2'
  },

  /* 监听路由变化，更新导航栏状态 */
  watch: {
    $route(to, from) {
      this.tabStatus = to.path === '/home' ? '0' : to.path.slice(0, 12) === '/home/groups' ? '1' : '2'
    },
  },
})
</script>

<template>
  <Menubar class="flex h-16 rounded-none! border-x-0! backdrop-blur-lg! bg-surface-0/75! dark:bg-surface-900/75! shadow-xs">
    <!--顶栏左侧-->
    <template #start>
      <div class="flex items-center gap-5">
        <router-link :to="useAuthStore().loginStatus ? '/home' : '/'" @click="toggleTab('0')">
          <div class="flex items-center">
            <!--            <Avatar image="/src/assets/logo.svg" class="mx-2" size="middle"/>-->
            <div class="text-primary font-bold text-2xl leading-tight mr-1">ChatKeeper</div>
          </div>
        </router-link>
      </div>
    </template>
    <!--顶栏右侧 -->
    <template #end>
      <div class="flex items-center gap-5">
        <!--导航栏-->
        <div v-if="useAuthStore().loginStatus">
          <Tabs :value="tabStatus" class="border-0! -mb-0.5! mr-3" style="--p-tabs-tab-border-width: 0; --p-tabs-tablist-background: none">
            <TabList>
              <router-link to="/home" @click="toggleTab('0')">
                <Tab class="mb-0.25!" value="0">
                  <a class="flex items-center gap-2 mt-1">
                    <i class="pi pi-home" style="font-size: 1.2rem" />
                    <span class="mr-1">主页</span>
                  </a>
                </Tab>
              </router-link>
              <router-link to="/home/groups" @click="toggleTab('1')">
                <Tab class="mb-0.25!" value="1">
                  <a class="flex items-center gap-2 mt-1">
                    <i class="pi pi-comments" style="font-size: 1.2rem" />
                    <span class="mr-1">群聊</span>
                  </a>
                </Tab>
              </router-link>
              <router-link to="/home/speakers" @click="toggleTab('2')">
                <Tab class="mb-0.25!" value="2">
                  <a class="flex items-center gap-2 mt-1">
                    <i class="pi pi-users" style="font-size: 1.4rem" />
                    <span class="mr-1">对象</span>
                  </a>
                </Tab>
              </router-link>
            </TabList>
          </Tabs>
        </div>
        <!--明暗模式按钮-->
        <Button :icon="'pi pi-sun'" severity="secondary" rounded size="small" @click="toggleDarkMode()" />
        <!--登录按钮或者用户头像-->
        <div class="mr-2">
          <div v-if="useAuthStore().loginStatus">
            <Button @click="toggleUserMenu" icon="pi pi-user" class="" rounded />
            <TieredMenu ref="userMenu" id="user-menu" :model="userOps" class="mt-6!" popup />
          </div>
          <div v-else>
            <router-link to="/login">
              <Button label="登录" size="small" />
            </router-link>
          </div>
        </div>
      </div>
    </template>
  </Menubar>
</template>

<style scoped></style>
