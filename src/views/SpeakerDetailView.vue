<script>
import { defineComponent } from 'vue'
import request from '@/utils/request.js'
import MbtiChart from '@/components/MbtiChart.vue'

/**
 * **SpeakerDetailView.vue**
 * 对象详情视图
 * - 功能：
 *   - 展示对象基本信息
 *   - 展示对象MBTI分值图表
 *   - 展示对象MBTI人格图片
 *   - 展示对象性格标签
 *   - 展示对象性格分析结果文本
 *   - 操作分析对象
 * - 引用：`request.js`, `MbtiChart.vue`
 * - 特性：响应式设计
 */
export default defineComponent({
  name: 'SpeakerDetailView',

  components: { MbtiChart },

  props: {
    currentSpeaker: Object,
  },

  data() {
    return {
      ready: false,
      speakerDetails: null,
      mbti: '',
      mbtiDict: {
        INTP: '逻辑学家',
        INTJ: '架构师',
        ENTP: '辩论家',
        ENTJ: '指挥官',
        INFP: '调停者',
        INFJ: '提倡者',
        ENFP: '活动家',
        ENFJ: '主人公',
        ISTJ: '物流师',
        ISFJ: '守护者',
        ESTJ: '管理者',
        ESFJ: '执政官',
        ISTP: '鉴赏家',
        ISFP: '冒险家',
        ESTP: '企业家',
        ESFP: '表演者',
      },
    }
  },

  methods: {
    /* 获取对象详细信息（分析报告） */
    getSpeaker() {
      this.ready = false
      request
        .get('/data/speaker/details', {
          params: {
            speaker_id: this.currentSpeaker.speaker_id,
          },
        })
        .then((response) => {
          console.log(response)
          if (response.data.code === 200) {
            console.log(response.data.msg)
            this.speakerDetails = response.data.data
            this.mbti = this.parseMbti(this.speakerDetails.identity)
            setTimeout(() => {
              this.ready = true
            }, 200)
          } else if (response.data.code === 400) {
            this.$toast.add({
              severity: 'info',
              summary: '对象未分析',
              detail: '你还没有分析过这个对象，请先点击分析按钮运行分析',
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

    /* 分析对象方法 */
    analyzeSpeaker() {
      request
        .post('/analysis/speaker', {
          speaker_id: this.currentSpeaker.speaker_id,
        })
        .then((response) => {
          console.log(response)
          if (response.data.code === 200) {
            this.speakerDetails = response.data.data
            this.mbti = this.parseMbti(this.speakerDetails.identity)
            this.currentSpeaker.analyzed = true
            setTimeout(() => {
              this.ready = true
            }, 200)
            this.$toast.add({
              severity: 'success',
              summary: '分析完成',
              detail: '请等待页面刷新',
              life: 3000,
            })
          } else if (response.data.code === 400 || response.data.code === 404 || response.data.code === 405) {
            this.$toast.add({
              severity: 'error',
              summary: '分析失败',
              detail: '错误信息：' + response.data.msg,
              life: 3000,
            })
          } else {
            this.$toast.add({
              severity: 'error',
              summary: '分析失败',
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

    /* 分析对象确认弹窗 */
    analyzeConfirm() {
      this.$confirm.require({
        message: '你确定要分析对象\"' + this.currentSpeaker.speaker_name + '\"吗？新的分析结果将会覆盖之前的内容',
        header: '分析对象',
        icon: 'pi pi-info-circle',
        rejectProps: {
          label: '取消',
          severity: 'secondary',
          outlined: true,
        },
        acceptProps: {
          label: '分析',
        },
        accept: () => {
          this.ready = false
          this.analyzeSpeaker()
        },
      })
    },

    /* 根据MBTI分值解析出性格类型 */
    parseMbti(identity) {
      const IE = identity.i_e > 50 ? 'E' : 'I'
      const NS = identity.n_s > 50 ? 'S' : 'N'
      const TF = identity.t_f > 50 ? 'F' : 'T'
      const PJ = identity.p_j > 50 ? 'J' : 'P'
      return IE + NS + TF + PJ
    },
  },

  /* 创建时获取对象详情 */
  created() {
    if (this.currentSpeaker.analyzed) {
      this.getSpeaker()
    }
  },

  /* 监听当前对象变化：实时发出请求获取对象详情 */
  watch: {
    currentSpeaker() {
      console.log('currentSpeaker', this.currentSpeaker)
      this.ready = false
      if (this.currentSpeaker.analyzed) {
        this.getSpeaker()
      }
    },
  },
})
</script>

<template>
  <div class="lg:flex items-start p-5">
    <!--纵列1-->
    <div class="lg:w-7/12 w-10/12 max-lg:place-self-center lg flex-col">
      <!--对象基本信息卡片-->
      <Card class="dark:bg-surface-900! m-3">
        <template #title>
          <div class="flex items-center justify-between mt-2 ml-2">
            <div class="flex items-center gap-3">
              <Avatar icon="pi pi-user" size="large" shape="circle"></Avatar>
              <p class="text-2xl">{{ currentSpeaker.speaker_name }}</p>
            </div>
            <Tag v-if="currentSpeaker.analyzed" value="已分析" rounded class="mr-3 text-lg!"></Tag>
            <Tag v-else severity="secondary" value="未分析" rounded class="mr-3 text-lg!"></Tag>
          </div>
        </template>
        <template #content>
          <div class="flex-col items-center m-2">
            <div class="flex items-center gap-2 mt-2 ml-2">
              <div class="flex items-center gap-2 mr-5">
                <i class="pi pi-inbox"></i>
                <p>QQ号/邮箱：{{ currentSpeaker.speaker_qq }}</p>
              </div>
            </div>
          </div>
        </template>
      </Card>
      <!--对象性格模型图表卡片-->
      <Card v-if="currentSpeaker.analyzed" class="dark:bg-surface-900! m-3">
        <template #title>
          <div class="flex items-center justify-between gap-3 mt-2 ml-2">
            <div class="flex items-center gap-4">
              <Avatar icon="pi pi-chart-bar" shape="circle"></Avatar>
              <p>性格模型</p>
            </div>
          </div>
        </template>
        <template #content>
          <!--性格图表-->
          <div v-if="ready">
            <div class="lg:hidden">
              <p class="flex justify-center items-center mt-8 text-6xl">{{ mbti }}</p>
              <p class="flex justify-center items-center mt-3 text-3xl">{{ mbtiDict[mbti] }}</p>
            </div>
            <MbtiChart v-if="ready" :identity="speakerDetails.identity"></MbtiChart>
          </div>
          <!--加载状态占位-->
          <div v-else>
            <ul class="m-0 p-8 list-none">
              <li class="mb-8">
                <div class="flex">
                  <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                  <div class="self-center" style="flex: 1">
                    <Skeleton width="100%" class="mb-2"></Skeleton>
                    <Skeleton width="75%"></Skeleton>
                  </div>
                </div>
              </li>
              <li class="mb-8">
                <div class="flex">
                  <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                  <div class="self-center" style="flex: 1">
                    <Skeleton width="100%" class="mb-2"></Skeleton>
                    <Skeleton width="75%"></Skeleton>
                  </div>
                </div>
              </li>
              <li class="mb-8">
                <div class="flex">
                  <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                  <div class="self-center" style="flex: 1">
                    <Skeleton width="100%" class="mb-2"></Skeleton>
                    <Skeleton width="75%"></Skeleton>
                  </div>
                </div>
              </li>
              <li>
                <div class="flex">
                  <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
                  <div class="self-center" style="flex: 1">
                    <Skeleton width="100%" class="mb-2"></Skeleton>
                    <Skeleton width="75%"></Skeleton>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </template>
      </Card>
      <!--性格分析报告卡片-->
      <Card v-if="currentSpeaker.analyzed" class="dark:bg-surface-900! m-3">
        <template #title>
          <div class="flex items-center justify-between gap-3 mt-2 ml-2">
            <div class="flex items-center gap-4">
              <Avatar icon="pi pi-file" shape="circle"></Avatar>
              <p>分析报告</p>
            </div>
          </div>
        </template>
        <template #content>
          <!--分析报告文本-->
          <div v-if="ready" class="m-4">
            {{ speakerDetails.description }}
          </div>
          <!--加载状态占位-->
          <div v-else>
            <ul class="m-0 p-5 list-none">
              <li class="mb-8">
                <div class="flex">
                  <div class="self-center" style="flex: 1">
                    <Skeleton width="100%" class="mb-2"></Skeleton>
                    <Skeleton width="75%"></Skeleton>
                  </div>
                </div>
              </li>
              <li class="mb-8">
                <div class="flex">
                  <div class="self-center" style="flex: 1">
                    <Skeleton width="100%" class="mb-2"></Skeleton>
                    <Skeleton width="75%"></Skeleton>
                  </div>
                </div>
              </li>
              <li class="mb-8">
                <div class="flex">
                  <div class="self-center" style="flex: 1">
                    <Skeleton width="100%" class="mb-2"></Skeleton>
                    <Skeleton width="75%"></Skeleton>
                  </div>
                </div>
              </li>
              <li>
                <div class="flex">
                  <div class="self-center" style="flex: 1">
                    <Skeleton width="100%" class="mb-2"></Skeleton>
                    <Skeleton width="75%"></Skeleton>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </template>
      </Card>
    </div>
    <!--纵列2-->
    <div class="lg:w-5/12 w-10/12 max-lg:place-self-center flex-col">
      <!--对象人格图片卡片-->
      <Card v-if="currentSpeaker.analyzed" class="dark:bg-surface-900! m-3 max-lg:hidden!">
        <template #title>
          <!--人格图片-->
          <div v-if="ready" class="p-2">
            <div class="flex justify-center items-center mt-5">
              <img src="@/assets/intp.svg" v-if="mbti === 'INTP'" class="w-full transform -scale-x-100" alt="MBTI" />
              <img src="@/assets/intj.svg" v-if="mbti === 'INTJ'" class="w-full transform -scale-x-100" alt="MBTI" />
              <img src="@/assets/entp.svg" v-if="mbti === 'ENTP'" class="w-full transform -scale-x-100" alt="MBTI" />
              <img src="@/assets/entj.svg" v-if="mbti === 'ENTJ'" class="w-full transform -scale-x-100" alt="MBTI" />
              <img src="@/assets/infp.svg" v-if="mbti === 'INFP'" class="w-full transform -scale-x-100" alt="MBTI" />
              <img src="@/assets/infj.svg" v-if="mbti === 'INFJ'" class="w-full transform -scale-x-100" alt="MBTI" />
              <img src="@/assets/enfp.svg" v-if="mbti === 'ENFP'" class="w-full transform -scale-x-100" alt="MBTI" />
              <img src="@/assets/enfj.svg" v-if="mbti === 'ENFJ'" class="w-full transform -scale-x-100" alt="MBTI" />
              <img src="@/assets/istj.svg" v-if="mbti === 'ISTJ'" class="w-full transform -scale-x-100" alt="MBTI" />
              <img src="@/assets/isfj.svg" v-if="mbti === 'ISFJ'" class="w-full transform -scale-x-100" alt="MBTI" />
              <img src="@/assets/estj.svg" v-if="mbti === 'ESTJ'" class="w-full transform -scale-x-100" alt="MBTI" />
              <img src="@/assets/esfj.svg" v-if="mbti === 'ESFJ'" class="w-full transform -scale-x-100" alt="MBTI" />
              <img src="@/assets/istp.svg" v-if="mbti === 'ISTP'" class="w-full transform -scale-x-100" alt="MBTI" />
              <img src="@/assets/isfp.svg" v-if="mbti === 'ISFP'" class="w-full transform -scale-x-100" alt="MBTI" />
              <img src="@/assets/estp.svg" v-if="mbti === 'ESTP'" class="w-full transform -scale-x-100" alt="MBTI" />
              <img src="@/assets/esfp.svg" v-if="mbti === 'ESFP'" class="w-full transform -scale-x-100" alt="MBTI" />
            </div>
            <p class="flex justify-center items-center mt-5 text-6xl">{{ mbti }}</p>
            <p class="flex justify-center items-center mt-3 text-3xl">{{ mbtiDict[mbti] }}</p>
          </div>
          <!--加载状态占位-->
          <div v-else>
            <div class="flex-col justify-center rounded p-6 bg-surface-0 dark:bg-surface-900">
              <Skeleton width="100%" height="40vh" border-radius="4rem"></Skeleton>
              <Skeleton width="15rem" height="2rem" border-radius="1rem" class="my-4 place-self-center"></Skeleton>
              <Skeleton width="90%" height="3rem" border-radius="2rem" class="my-4 place-self-center"></Skeleton>
              <Skeleton width="10rem" height="1.5rem" border-radius="1rem" class="place-self-center"></Skeleton>
            </div>
          </div>
        </template>
      </Card>
      <!--对象性格标签卡片-->
      <Card v-if="currentSpeaker.analyzed" class="dark:bg-surface-900! m-3">
        <template #title>
          <div class="flex items-center justify-between gap-3 mt-2 ml-2">
            <div class="flex items-center gap-4">
              <Avatar icon="pi pi-hashtag" shape="circle"></Avatar>
              <p>性格标签</p>
            </div>
          </div>
        </template>
        <template #content>
          <!--性格标签-->
          <div v-if="ready" class="flex flex-wrap items-center gap-3 m-4 mb-2">
            <div v-if="ready" v-for="tag in speakerDetails.tags">
              <Tag icon="pi pi-hashtag" :value="tag" rounded class="mb-1 text-lg! font-medium! min-w-10!"></Tag>
            </div>
          </div>
          <!--加载状态占位-->
          <div v-else class="flex flex-wrap items-center gap-3 m-4 mb-2">
            <Skeleton v-for="i in 10" height="2rem" :width="i % 3 ? '4rem' : '6rem'" class="mb-1"></Skeleton>
          </div>
        </template>
      </Card>
      <!--分析按钮卡片-->
      <Card class="dark:bg-surface-900! m-3">
        <template #title>
          <div class="flex items-center justify-between gap-3 mt-2 ml-2">
            <div class="flex items-center gap-4">
              <Avatar icon="pi pi-chart-line" shape="circle"></Avatar>
              <p>分析对象</p>
            </div>
            <div class="flex items-center gap-4 mr-2">
              <!--确认弹窗-->
              <ConfirmDialog class="w-100 backdrop-blur-lg! bg-white/95! dark:bg-surface-900/80!"></ConfirmDialog>
              <Button @click="analyzeConfirm()" label="进行分析" />
            </div>
          </div>
        </template>
        <template #content>
          <p v-if="!currentSpeaker.analyzed" class="mt-2 mb-3 ml-2">你尚未分析过这个对象，请先进行分析</p>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped></style>
