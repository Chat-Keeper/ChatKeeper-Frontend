<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MbtiChart',
  props: {
    identity: Object,
  }
})
</script>

<template>
  <div class="flex items-center justify-between m-8 text-primary-500">
    <p
      class="flex justify-center text-6xl w-15"
      :class="identity.i_e > 50 ? 'text-surface-500' : ''"
    >I</p>
    <div class="flex w-10/12 h-15 text-surface-0 dark:text-surface-950">
      <div
        class="flex items-center text-3xl p-3 rounded-l-xl"
        :class="
                    identity.i_e > 50 ? 'bg-surface-500/60' : 'bg-primary-500/70'
                  "
        :style="{ width: 110 - identity.i_e + '%' }"
      >
        {{ 100 - identity.i_e }}
      </div>
      <div
        class="flex items-center justify-end text-3xl p-3 rounded-r-xl"
        :class="
                    identity.i_e <= 50 ? 'bg-surface-500/60' : 'bg-primary-500/70'
                  "
        :style="{ width: identity.i_e + 10 + '%' }"
      >
        {{ identity.i_e }}
      </div>
    </div>
    <p
      class="flex justify-center text-6xl w-15"
      :class="identity.i_e <= 50 ? 'text-surface-500' : ''"
    >E</p>
  </div>

  <div class="flex items-center justify-between m-8 text-primary-500">
    <p
      class="flex justify-center text-[55px] w-15"
      :class="identity.n_s > 50 ? 'text-surface-500' : ''"
    >N</p>
    <div class="flex w-10/12 h-15 text-surface-0 dark:text-surface-950">
      <div
        class="flex items-center text-3xl p-3 rounded-l-xl"
        :class="
                    identity.n_s > 50 ? 'bg-surface-500/60' : 'bg-primary-500/70'
                  "
        :style="{ width: 110 - identity.n_s + '%' }"
      >
        {{ 100 - identity.n_s }}
      </div>
      <div
        class="flex items-center justify-end text-3xl p-3 rounded-r-xl"
        :class="
                    identity.n_s <= 50 ? 'bg-surface-500/60' : 'bg-primary-500/70'
                  "
        :style="{ width: identity.n_s + 10 + '%' }"
      >
        {{ identity.n_s }}
      </div>
    </div>
    <p
      class="flex justify-center text-6xl w-15"
      :class="identity.n_s <= 50 ? 'text-surface-500' : ''"
    >S</p>
  </div>

  <div class="flex items-center justify-between m-8 text-primary-500">
    <p
      class="flex justify-center text-6xl w-15"
      :class="identity.t_f > 50 ? 'text-surface-500' : ''"
    >T</p>
    <div class="flex w-10/12 h-15 text-surface-0 dark:text-surface-950">
      <div
        class="flex items-center text-3xl p-3 rounded-l-xl"
        :class="
                    identity.t_f > 50 ? 'bg-surface-500/60' : 'bg-primary-500/70'
                  "
        :style="{ width: 110 - identity.t_f + '%' }"
      >
        {{ 100 - identity.t_f }}
      </div>
      <div
        class="flex items-center justify-end text-3xl p-3 rounded-r-xl"
        :class="
                    identity.t_f <= 50 ? 'bg-surface-500/60' : 'bg-primary-500/70'
                  "
        :style="{ width: identity.t_f + 10 + '%' }"
      >
        {{ identity.t_f }}
      </div>
    </div>
    <p
      class="flex justify-center text-6xl w-15"
      :class="identity.t_f <= 50 ? 'text-surface-500' : ''"
    >F</p>
  </div>

  <div class="flex items-center justify-between m-8 mt-10 text-primary-500">
    <p
      class="flex justify-center text-6xl w-15"
      :class="identity.p_j <= 50 ? 'text-surface-500' : ''"
    >J</p>
    <div class="flex w-10/12 h-15 text-surface-0 dark:text-surface-950">
      <div
        class="flex items-center text-3xl p-3 rounded-l-xl"
        :class="
                    identity.p_j <= 50 ? 'bg-surface-500/60' : 'bg-primary-500/70'
                  "
        :style="{ width: identity.p_j + 10 + '%' }"
      >
        {{ identity.p_j }}
      </div>
      <div
        class="flex items-center justify-end text-3xl p-3 rounded-r-xl"
        :class="
                    identity.p_j > 50 ? 'bg-surface-500/60' : 'bg-primary-500/70'
                  "
        :style="{ width: 110 - identity.p_j + '%' }"
      >
        {{ 100 - identity.p_j }}
      </div>
    </div>
    <p
      class="flex justify-center text-6xl w-15"
      :class="identity.p_j > 50 ? 'text-surface-500' : ''"
    >P</p>
  </div>
</template>

<style scoped>

</style>