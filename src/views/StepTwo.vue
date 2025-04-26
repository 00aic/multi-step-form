<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import type { Plan } from './types'

export interface Item {
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

const props = defineProps<{
  data: Item[]
}>()

const plan = ref<Plan>({
  isYearly: false,
  planId: '',
  planPrice: '',
})

const emit = defineEmits<{ change: []; update: [plan: Plan] }>()

watch(
  () => plan.value.planId,
  (newPlanId) => {
    const selectedPlan = props.data.find((item) => item.id === newPlanId)
    plan.value.planPrice = selectedPlan
      ? plan.value.isYearly
        ? selectedPlan.yearly.price
        : selectedPlan.monthly.price
      : ''
    emit('update', plan.value)
  },
  { immediate: true },
)

watch(
  () => plan.value.isYearly,
  () => {
    plan.value.planId = ''
    plan.value.planPrice = ''
    emit('change')
  },
)
</script>

<template>
  <div class="two">
    <div class="billing">
      <label class="option" v-for="item in data" :key="item.id">
        <input type="radio" :value="item.id" v-model="plan.planId" />
        <div class="option__img">
          <img :src="item.icon.value" :alt="item.id" />
        </div>
        <div class="option__title">{{ item.id }}</div>
        <div class="option__price">
          {{ plan.isYearly ? item.yearly.price : item.monthly.price }}
        </div>
        <div class="option__free" v-show="plan.isYearly">{{ item.yearly.free }}</div>
      </label>
    </div>
    <div class="switch-container">
      <span>Monthly</span>
      <label class="switch">
        <input type="checkbox" v-model="plan.isYearly" />
        <span class="slider"></span>
      </label>
      <span>Yearly</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.two {
  display: flex;
  flex-direction: column;
  gap: 25px;

  .billing {
    display: flex;
    gap: 10px;

    .option {
      display: flex;
      flex-direction: column;
      // gap: 5px;
      border: 1px solid var(--color-light-gray);
      border-radius: 10px;
      padding: 15px;
      flex: 1;
      cursor: pointer;

      &:hover {
        border-color: var(--color-purplish-blue);
      }

      input {
        opacity: 0;
      }
      &:has(input[type='radio']:checked) {
        background-color: var(--color-purplish-blue-2);
        border-color: var(--color-purplish-blue);
      }

      &__img {
        margin-bottom: 20px;
      }

      &__title {
        color: var(--color-marine-blue);
        font-weight: bold;
      }

      &__price {
        color: var(--color-cool-gray);
      }

      &__free {
        color: var(--color-marine-blue);
        font-size: 14px;
      }
    }
  }

  .switch-container {
    display: flex;
    gap: 20px;
    background-color: var(--color-magnolia);
    border-radius: 10px;
    padding: 10px;
    justify-content: center;

    .switch {
      width: 50px;
      height: 26px;
      position: relative;
      display: inline-block;

      input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .slider {
        border-radius: 9999px;
        position: absolute;
        background-color: var(--color-cool-gray);
        cursor: pointer;
        transition: 0.3s;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        &:before {
          content: ' ';
          border-radius: 50%;
          height: 20px;
          width: 20px;
          background-color: white;
          position: absolute;
          top: 3px;
          left: 5px;
          transition: 0.3s;
        }
      }

      input:checked + .slider {
        background-color: var(--color-marine-blue);
      }
      input:checked + .slider::before {
        transform: translateX(20px);
      }
    }
  }
}
</style>
