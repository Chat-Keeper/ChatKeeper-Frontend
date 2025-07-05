<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SideMenu',
  props: {
    groupList: Array,
  },
  data() {
    return {
      displaySideMenu: true,
    }
  },
  methods: {
    toggleSideMenu() {
      this.displaySideMenu = !this.displaySideMenu
    }
  },
})
</script>

<template>
  <div class="flex">
    <div class="flex-col h-[calc(100vh-4rem)] w-12 p-1.5 border-r border-surface-200 dark:border-surface-700 shadow-xs">
      <Button icon="pi pi-align-justify" severity="secondary" size="small" class="my-2" @click="toggleSideMenu()"></Button>
      <Button icon="pi pi-search" severity="secondary" size="small" class="my-2" @click=""></Button>
    </div>
    <div class="transition-all duration-200 ease-in-out overflow-hidden" :style="displaySideMenu ? 'width: 20rem' : 'width: 0'">
      <div class="w-80 h-[calc(100vh-4rem)] overflow-auto border-r border-surface-200 dark:border-surface-700 shadow-xs">
        <template v-for="item in groupList">
          <router-link :to="'/home/groups/' + item.group_id ">
            <Card
              class="mx-1 my-2"
              :class="item.group_id === $route.params.group_id
                ? 'bg-primary-100! dark:bg-primary-900!'
                : 'dark:bg-surface-900! hover:bg-surface-50! dark:hover:bg-surface-800!'"
            >
              <template #title>
                <div class="flex items-center gap-5 h-12 pt-1">
                  <div>
                    <Avatar
                      :label="item.group_name[0]"
                      size="xlarge"
                      shape="circle"
                      :class="item.group_id === $route.params.group_id
                        ? 'bg-primary-200! dark:bg-primary-700!'
                        : ''"
                    />
                  </div>
                  <div class="flex-col gap-2">
                    <div class="text-lg w-45">
                      {{ item.group_name.length > 10 ? item.group_name.slice(0,9) + '...' : item.group_name }}
                    </div>
                    <div class="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-300 mt-2.5">
                      <div class="flex items-center gap-2 mr-3 w-12">
                        <i class="pi pi-users"></i>
                        <p>{{ item.speaker_num }}</p>
                      </div>
                      <div class="flex items-center gap-2">
                        <i class="pi pi-calendar"></i>
                        <p>{{ item.end_time.slice(0,10) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </Card>
          </router-link>
        </template>
      </div>
    </div>
  </div>
  <div>

  </div>
</template>

<style scoped></style>
