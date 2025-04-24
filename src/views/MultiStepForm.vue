<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import StepOne from './StepOne.vue'
import StepTwo from './StepTwo.vue'
import StepThree from './StepThree.vue'
import StepFour from './StepFour.vue'
import ThankYou from './ThankYou.vue'
import { useImageUrl } from '@/composables/useImageUrl'

interface Step {
  no: number
  stepName: string
  stepTitle: string
  contentTitle: string
  contentDesc: string
}

interface PlanItem {
  id: string
  icon: Ref
  yearly: {
    price: string
    free: string
  }
  monthly: {
    price: string
  }
}

interface OnsItem {
  id: string
  desc: string
  yearly: {
    price: string
  }
  monthly: {
    price: string
  }
  // isChecked: boolean
}

// const multiStepFormData = ref<Record<string, unknown>>({})

interface Data {
  cycle: string
  plan: string
  ons: Array<string>
}

interface FinishData extends Data {
  planPrice: string
  onsPrice?: Array<{
    id: string
    price: string
  }>
  totalTitle: string
  totalPrice: string
}

const isPlanChecked = ref(false)

const billingCycle = computed(() => (isPlanChecked.value ? 'Yearly' : 'Monthly'))

const data = ref<Data>({
  cycle: billingCycle.value,
  plan: '', // 类型，arcade advanced pro
  ons: [],
})

// data.value.cycle = computed(() => (isPlanChecked.value ? 'yearly' : 'monthly')).value

const stepsList = ref<Step[]>([
  {
    no: 1,
    stepName: 'STEP 1',
    stepTitle: 'YOUR INFO',
    contentTitle: 'Personal info',
    contentDesc: 'Please provide your name, email address, and phone number.',
  },
  {
    no: 2,
    stepName: 'STEP 2',
    stepTitle: 'SELECT PLAN',
    contentTitle: 'Select your plan',
    contentDesc: 'You have the option of monthly or yearly billing.',
  },
  {
    no: 3,
    stepName: 'STEP 3',
    stepTitle: 'ADD-ONS',
    contentTitle: 'Pick add-ons',
    contentDesc: 'Add-ons help enhance your gaming experience.',
  },
  {
    no: 4,
    stepName: 'STEP 4',
    stepTitle: 'SUMMARY',
    contentTitle: 'Finishing up',
    contentDesc: 'Double-check everything looks OK before confirming.',
  },
])

const selectStep = ref<Step>(stepsList.value[0])

// const useImageUrl = (iconName: string) => {
//   console.log(iconName)
//   return new URL(`/src/assets/images/icon-${iconName}.svg`, import.meta.url).href
// }

const billingOptions: PlanItem[] = [
  {
    id: 'Arcade',
    icon: useImageUrl('icon-arcade'),
    monthly: {
      price: '$9/mo',
    },
    yearly: {
      price: '$90/yr',
      free: '2 months free',
    },
  },
  {
    id: 'Advanced',
    icon: useImageUrl('icon-advanced'),
    monthly: {
      price: '$12/mo',
    },
    yearly: {
      price: '$120/yr',
      free: '2 months free',
    },
  },
  {
    id: 'Pro',
    icon: useImageUrl('icon-pro'),
    monthly: {
      price: '$15/mo',
    },
    yearly: {
      price: '$150/yr',
      free: '2 months free',
    },
  },
]

// const handlePlanSelect = (item: PlanItem) => {
//   data.value.plan.type = item.id
//   data.value.plan.price = data.value.plan.cycle === 0 ? item.monthlyPrice : item.yearlyPrice
// }

const handlePlanCrycleChange = () => {
  data.value.cycle = billingCycle.value
  data.value.plan = ''
  data.value.ons = []
}

const onsList: OnsItem[] = [
  {
    id: 'Online service',
    desc: 'Access to multiplayer games',
    monthly: {
      price: '+$1/mo',
    },
    yearly: {
      price: '+$10/yr',
    },
    // isChecked: false,
  },
  {
    id: 'Larger storage',
    desc: 'Extra 1TB of cloud save',
    monthly: {
      price: '+$2/mo',
    },
    yearly: {
      price: '+$20/yr',
    },
    // isChecked: false,
  },
  {
    id: 'Customizable Profile',
    desc: 'Custom theme on your profile',
    monthly: {
      price: '+$2/mo',
    },
    yearly: {
      price: '+$20/yr',
    },
    // isChecked: false,
  },
]

const finishData = ref<FinishData>({
  cycle: billingCycle.value,
  ons: [],
  plan: '',
  planPrice: '',
  onsPrice: [],
  totalTitle: '',
  totalPrice: '',
})

const getTotalPrice = (planPrice: string, onsPrice?: { id: string; price: string }[]): string => {
  const allPrice = [planPrice, ...(onsPrice?.map((ons) => ons.price) || [])]
  let sum = 0
  let suffix = ''
  allPrice.forEach((price) => {
    const match = price.match(/\$(\d+)\/(mo|yr)$/)
    if (match) {
      sum += parseInt(match[1], 10)
      suffix = match[2]
    }
  })

  return `+$${sum}/${suffix}`
}

const getFinishData = () => {
  if (selectStep.value.no === stepsList.value.length) {
    // finishData.value = data.value
    const planPrice = billingOptions.find((plan: PlanItem) => plan.id === data.value.plan)
    const onsPrice = onsList
      ?.filter((ons) => data.value.ons.includes(ons.id))
      .map((ons) => ({
        id: ons.id,
        price: isPlanChecked.value ? ons.yearly.price : ons.monthly.price,
      }))

    finishData.value = {
      ...data.value,
      planPrice: (isPlanChecked.value ? planPrice?.yearly.price : planPrice?.monthly.price) ?? '',
      onsPrice: onsPrice,
      totalTitle: '',
      totalPrice: '',
    }

    finishData.value.totalTitle = isPlanChecked.value ? 'Total(per year)' : 'Total(per month)'
    finishData.value.totalPrice = getTotalPrice(
      finishData.value.planPrice,
      finishData.value.onsPrice,
    )
  }
}

const handleStepSelect = (no: number) => {
  const step = stepsList.value.find((step) => step.no === no)
  selectStep.value = step ?? selectStep.value
  isShowThankYou.value = false
  getFinishData()
  resetError()
}

const handlePlanChange = () => {
  const step = stepsList.value.find((step) => step.no === 2)
  selectStep.value = step ?? selectStep.value
  isShowThankYou.value = false
}

const handleGoBack = () => {
  const step = stepsList.value.find((step) => step.no === selectStep.value.no - 1)
  selectStep.value = step ?? selectStep.value
  isShowThankYou.value = false
  resetError()
}

const handleNextStep = () => {
  const step = stepsList.value.find((step) => step.no === selectStep.value.no + 1)
  selectStep.value = step ?? selectStep.value
  isShowThankYou.value = false
  getFinishData()
}
const isShowThankYou = ref(false)

const isShowError = ref(false)

const erroMessage = ref('')

const resetError = () => {
  isShowError.value = false
  erroMessage.value = ''
}

const handleConfirm = () => {
  console.log(finishData.value.plan)
  if (!finishData.value.plan) {
    isShowError.value = true
    erroMessage.value = 'Please return to step 2 to select at least one plan option'
  } else {
    isShowThankYou.value = true
    resetError()
  }
}
</script>

<template>
  <div class="service">
    <div class="step-container">
      <picture>
        <!-- 在屏幕宽度大于或等于 768px 时，加载桌面尺寸的图片 -->
        <source media="(min-width: 768px)" srcset="@/assets/images/bg-sidebar-desktop.svg" />
        <!-- 在屏幕宽度小于 768px 时，加载手机尺寸的图片 -->
        <source media="(max-width: 767px)" srcset="@/assets/images/bg-sidebar-mobile.svg" />
        <!-- 如果上面的 media 查询不匹配，加载默认图片 -->
        <img src="@/assets/images/bg-sidebar-desktop.svg" alt="sidebar" />
      </picture>

      <div class="steps">
        <div
          class="step"
          v-for="item in stepsList"
          :key="item.no"
          @click="handleStepSelect(item.no)"
        >
          <div :class="['step__number', { step__select: selectStep.no === item.no }]">
            {{ item.no }}
          </div>
          <div>
            <p class="step__name">{{ item.stepName }}</p>
            <h4 class="step__title">{{ item.stepTitle }}</h4>
          </div>
        </div>
      </div>
    </div>
    <div class="session">
      <div class="content">
        <div v-show="!isShowThankYou">
          <h2 class="content__title">{{ selectStep.contentTitle }}</h2>
          <p class="content__desc">{{ selectStep?.contentDesc }}</p>
        </div>

        <!-- step 1 -->
        <StepOne v-show="!isShowThankYou && selectStep.no === 1"></StepOne>

        <!-- step 2 -->
        <StepTwo
          :data="billingOptions"
          @change="handlePlanCrycleChange"
          v-show="!isShowThankYou && selectStep.no === 2"
        ></StepTwo>

        <!-- step 3 -->
        <StepThree
          :data="onsList"
          :is-yearly="isPlanChecked"
          v-show="!isShowThankYou && selectStep.no === 3"
        ></StepThree>

        <!-- step 4 -->
        <StepFour
          :data="finishData"
          @change="handlePlanChange"
          v-show="!isShowThankYou && selectStep.no === 4"
        ></StepFour>

        <!-- thank you -->
        <ThankYou v-show="isShowThankYou"></ThankYou>
      </div>

      <div class="button" v-show="!isShowThankYou">
        <button
          class="go-back"
          v-show="selectStep.no !== 1"
          @click="handleGoBack"
          aria-label="Go Back"
        >
          Go Back
        </button>
        <button
          class="next-step"
          v-show="selectStep.no !== stepsList.length"
          @click="handleNextStep"
          aria-label="Next Step"
        >
          Next Step
        </button>

        <button
          class="confirm"
          v-show="selectStep.no === stepsList.length"
          @click="handleConfirm"
          aria-label="Confirm"
        >
          Confirm
        </button>
      </div>

      <div class="error" v-show="!isShowThankYou && isShowError">
        {{ erroMessage }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.service {
  display: flex;
  background-color: white;
  padding: 15px;
  position: relative;
  border-radius: 10px;
  width: 900px;
}
.steps {
  position: absolute;
  top: 45px;
  left: 40px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.step {
  display: flex;
  gap: 15px;
  cursor: pointer;
  align-items: center;

  &__number {
    border-radius: 50%;
    border: 1px solid white;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    // background-color: var(--color-light-blue);
  }

  &__select {
    background-color: var(--color-light-blue);
    color: black;
    border: none;
  }

  &__name {
    color: var(--color-cool-gray);
    // font-size: 12px;
  }

  &__title {
    color: white;
  }
}

.session {
  display: flex;
  flex-direction: column;
  padding: 25px 80px;
  flex: 1;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 25px;

  &__title {
    font-weight: bold;
    color: var(--color-marine-blue);
  }

  &__desc {
    color: var(--color-cool-gray);
  }
}

.button {
  display: flex;
  margin-top: auto;

  .go-back {
    align-self: flex-start;
    padding: 15px;
    border: none;
    background: none;
    font-weight: bold;
    cursor: pointer;
    color: var(--color-cool-gray);

    &:hover {
      color: var(--color-marine-blue);
    }
  }

  .next-step {
    background-color: var(--color-marine-blue);
    color: white;
    padding: 15px;
    border-radius: 5px;
    margin-left: auto;
    cursor: pointer;
    border: none;

    &:hover {
      background-color: var(--color-pastel-blue);
    }
  }

  .confirm {
    background-color: var(--color-purplish-blue);
    padding: 15px;
    border-radius: 5px;
    margin-left: auto;
    color: white;
    cursor: pointer;
    border: none;
  }
}

.error {
  color: red;
  font-weight: bold;
  font-size: 12px;
  padding: 15px;
}

@media (max-width: 767px) {
  .service {
    flex-direction: column;
    position: relative;
    // min-height: 100vh;
    padding: 0;
    width: 100vw;
    border-radius: 0;
    height: 100vh;
    // align-items: stretch;
    // justify-content: stretch;
    // height: calc(100vh + 160px);
    // min-height: 50vh;
    // justify-content: space-between;
    // .step-img {
    //   img {
    //     width: 100%;
    //     height: 100%;
    //     object-fit: cover; /* 保证图片铺满并裁剪多余部分 */
    //   }
    // }
    .step-container {
      height: 160px;
      width: 100%;
      img {
        width: 100%;
      }
      .steps {
        // width: 100%;
        flex-direction: row;
        left: 25%;
        right: 25%;
        gap: 0;
        justify-content: center;

        .step {
          &__name,
          &__title {
            display: none;
          }
        }
        .step:nth-of-type(1) {
          padding-left: 15px;
        }
      }
    }

    .session {
      background-color: var(--color-light-gray);
      // position: relative;
      padding: 0;
    }

    .content {
      position: absolute;
      top: 85px;
      background-color: white;
      // width: 100%;
      left: 0;
      right: 0;
      // bottom: 120px;
      margin: 15px;
      padding: 25px;
      border-radius: 10px;

      // flex-grow: 0;
      // margin-bottom: 100px;
    }
    .thank-you {
      p {
        font-size: 16px;
      }
    }

    .button {
      background-color: white;
      padding: 15px;
      // align-items: stretch;
      // justify-content: flex-end;
      // margin: 0;
      // flex-grow: 1;
      // margin-top: auto;
      // margin-top: 400px;??
      @media (max-height: 450px) {
        margin-top: 380px;
      }
    }
  }
}
</style>
