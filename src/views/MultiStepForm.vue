<script setup lang="ts">
import { ref, type Ref } from 'vue'
import UserInfo from './UserInfo.vue'
import PlanInfo from './PlanInfo.vue'
import OnsInfo from './OnsInfo.vue'
import FinishInfo from './FinishInfo.vue'
import ThankYou from './ThankYou.vue'
import { useImageUrl } from '@/composables/useImageUrl'
import { useBillingStep } from './useBillingStep'

const { billing, currentStep, nextStep, prevStep, updateBilling, emptyOnsPrice, goToStep } =
  useBillingStep({ totalStep: 4 })

interface Step {
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
}

const stepsList = ref<Step[]>([
  {
    stepName: 'STEP 1',
    stepTitle: 'YOUR INFO',
    contentTitle: 'Personal info',
    contentDesc: 'Please provide your name, email address, and phone number.',
  },
  {
    stepName: 'STEP 2',
    stepTitle: 'SELECT PLAN',
    contentTitle: 'Select your plan',
    contentDesc: 'You have the option of monthly or yearly billing.',
  },
  {
    stepName: 'STEP 3',
    stepTitle: 'ADD-ONS',
    contentTitle: 'Pick add-ons',
    contentDesc: 'Add-ons help enhance your gaming experience.',
  },
  {
    stepName: 'STEP 4',
    stepTitle: 'SUMMARY',
    contentTitle: 'Finishing up',
    contentDesc: 'Double-check everything looks OK before confirming.',
  },
])

const planOptions: PlanItem[] = [
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
  },
]

const onsInfoRef = ref<InstanceType<typeof OnsInfo>>()

const handlePlanChange = () => {
  emptyOnsPrice()
  onsInfoRef.value?.resetOns()
}

// const handleStepSelect = (step: number) => {
//   goToStep(step + 1)
//   isShowThankYou.value = false
//   resetError()
// }

const handlePlanStepChange = () => {
  goToStep(2)
}

const handleGoBack = () => {
  prevStep()
  isShowThankYou.value = false
  resetError()
}

const userInfoRef = ref<InstanceType<typeof UserInfo>>()

const handleNextStep = async () => {
  resetError()
  if (currentStep.value === 1) {
    const validate = await userInfoRef.value?.validateForm()
    if (validate) {
      nextStep()
    }
  } else if (currentStep.value === 2) {
    if (!billing.value.planId) {
      isShowError.value = true
      erroMessage.value = 'Please select at least one plan option'
    } else {
      nextStep()
    }
  } else {
    nextStep()
  }

  isShowThankYou.value = false
}
const isShowThankYou = ref(false)

const isShowError = ref(false)

const erroMessage = ref('')

const resetError = () => {
  isShowError.value = false
  erroMessage.value = ''
}

const handleConfirm = () => {
  isShowThankYou.value = true
  resetError()
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
        <div class="step" v-for="(item, index) in stepsList" :key="`step-${index}`">
          <div :class="['step__number', { step__select: currentStep === index + 1 }]">
            {{ index + 1 }}
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
          <h2 class="content__title">{{ stepsList[currentStep - 1]?.contentTitle }}</h2>
          <p class="content__desc">{{ stepsList[currentStep - 1]?.contentDesc }}</p>
        </div>

        <!-- step 1 -->
        <UserInfo
          ref="userInfoRef"
          @update="(data) => updateBilling(data)"
          v-show="!isShowThankYou && currentStep === 1"
        ></UserInfo>

        <!-- step 2 -->
        <PlanInfo
          :data="planOptions"
          @update="(data) => updateBilling(data)"
          @change="handlePlanChange"
          v-show="!isShowThankYou && currentStep === 2"
        ></PlanInfo>

        <!-- step 3 -->
        <OnsInfo
          ref="onsInfoRef"
          :data="onsList"
          :is-yearly="billing.isYearly"
          @update="(data) => updateBilling(data)"
          v-show="!isShowThankYou && currentStep === 3"
        ></OnsInfo>

        <!-- step 4 -->
        <FinishInfo
          :data="billing"
          @change="handlePlanStepChange"
          v-show="!isShowThankYou && currentStep === 4"
        ></FinishInfo>

        <!-- thank you -->
        <ThankYou v-show="isShowThankYou"></ThankYou>
      </div>
      <div class="error" v-if="!isShowThankYou && isShowError">
        {{ erroMessage }}
      </div>

      <div class="button" v-show="!isShowThankYou">
        <button
          class="go-back"
          v-show="currentStep !== 1"
          @click="handleGoBack"
          aria-label="Go Back"
        >
          Go Back
        </button>
        <button
          class="next-step"
          v-show="currentStep !== stepsList.length"
          @click="handleNextStep"
          aria-label="Next Step"
        >
          Next Step
        </button>

        <button
          class="confirm"
          v-show="currentStep === stepsList.length"
          @click="handleConfirm"
          aria-label="Confirm"
        >
          Confirm
        </button>
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
  // cursor: pointer;
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
  }

  &__select {
    background-color: var(--color-light-blue);
    color: black;
    border: none;
  }

  &__name {
    color: var(--color-cool-gray);
    font-size: 12px;
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
  flex: 1;

  &__title {
    font-weight: bold;
    color: var(--color-marine-blue);
    margin-bottom: 5px;
  }

  &__desc {
    color: var(--color-cool-gray);
    font-size: 14px;
  }
}

.error {
  color: red;
  font-weight: bold;
  font-size: 12px;
  padding: 15px;
  margin-top: auto;
}

.button {
  display: flex;
  margin-top: auto;
  flex-shrink: 0; /* 防止高度被压缩 */

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

.error + .button {
  margin-top: 0;
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
      padding: 0;
    }

    .content {
      position: absolute;
      top: 85px;
      background-color: white;
      left: 0;
      right: 0;
      margin: 15px;
      padding: 25px;
      border-radius: 10px;
    }

    .button {
      background-color: white;
      padding: 15px;
    }

    @media (max-height: 450px) {
      .error {
        margin-top: 380px;
      }
      .button {
        margin-top: 380px;
      }
      .error + .button {
        margin-top: 0;
      }
    }
  }
}
</style>
