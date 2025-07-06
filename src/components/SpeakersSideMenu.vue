<script>
import { defineComponent } from 'vue'
import { useWindowSize } from "@vueuse/core"

export default defineComponent({
  name: 'SpeakersSideMenu',
  props: {
    speakerList: Array,
  },
  data() {
    return {
      displaySideMenu: true,
      findStr: '',
      filterAnalyzed: false,
    }
  },
  methods: {
    toggleSideMenu() {
      this.displaySideMenu = !this.displaySideMenu
    },

    toggleFilterAnalyzed() {
      this.filterAnalyzed = !this.filterAnalyzed
    }
  },

  setup() {
    const { width } = useWindowSize()
    return {
      width
    }
  },

  watch: {
    width(newWidth) {
      this.displaySideMenu = newWidth >= 1280;
    },
    $route(to, from) {
      if (this.width < 1280 && to.path !== '/home/speakers') {
        this.displaySideMenu = false;
      }
    },
    displaySideMenu() {
      this.$emit('toggle', this.displaySideMenu);
    }
  }
})
</script>

<template>
  <div class="flex shadow-xs">
    <div class="flex-col h-[calc(100vh-4rem)] w-12 p-1.5 border-r border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-950 z-100!">
      <Button icon="pi pi-align-justify" severity="secondary" size="small" class="my-2" @click="toggleSideMenu()"></Button>
      <Button icon="pi pi-question-circle" severity="secondary" size="small" class="my-2" @click="" disabled></Button>
    </div>
    <div
      class="transition-all duration-200 ease-in-out overflow-hidden backdrop-blur-lg! bg-surface-0/75 dark:bg-surface-950/75 z-50! overflow-x-hidden!"
      :class="displaySideMenu ? 'xl:w-80 translate-x-0' : 'xl:w-0 -translate-x-full'"
    >
      <div class="w-80 h-[calc(100vh-4rem)] overflow-auto border-r border-surface-200 dark:border-surface-700 shadow-xs z-50!">

        <div class="flex items-center justify-center gap-1 h-18 -mb-2">
          <IconField class="w-9/12">
            <InputIcon class="pi pi-search" />
            <InputText v-model="findStr" placeholder="搜索对象" class="w-full rounded-full!" />
          </IconField>
          <Button
            @click="toggleFilterAnalyzed"
            icon="pi pi-filter"
            :severity="filterAnalyzed ? '' : 'secondary'"
            variant="text"
            rounded
            class="-mr-2"
            v-tooltip.top="{ value: '筛选分析过的对象', showDelay: 1000, pt: { root: { class: 'text-sm!' } } }"
          />
        </div>

        <template v-for="item in speakerList">
          <router-link
            :to="'/home/speakers/' + item.speaker_id"
            v-if="(item.analyzed || !filterAnalyzed)
              && (findStr === ''
              || item.speaker_name.includes(findStr)
              || item.speaker_qq.includes(findStr))"
          >
            <Card
              class="mx-1 my-2"
              :class="item.speaker_id === $route.params.speaker_id
                ? 'bg-primary-100/60! dark:bg-primary-900/60!'
                : 'dark:bg-surface-900/60! hover:bg-surface-50/60! dark:hover:bg-surface-800/60!'"
            >
              <template #title>
                <div class="flex items-center gap-5 h-12 pt-1">
                  <div>
                    <Avatar
                      :label="item.speaker_name[0]"
                      size="xlarge"
                      shape="circle"
                      :class="item.speaker_id === $route.params.speaker_id
                        ? 'bg-primary-200! dark:bg-primary-700!'
                        : ''"
                    />
                  </div>
                  <div class="flex-col gap-2">
                    <div class="text-lg w-45">
                      {{ item.speaker_name.length > 10 ? item.speaker_name.slice(0,9) + '...' : item.speaker_name }}
                    </div>
                    <div class="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-300 mt-2.5">
                      <div class="flex items-center gap-2 mr-3 w-12">
                        <i class="pi pi-inbox"></i>
                        <p>{{ item.speaker_qq }}</p>
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
