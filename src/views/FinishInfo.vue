<script setup lang="ts">
import type { Billing } from './types'

defineProps<{
  data: Billing
}>()

const emit = defineEmits<{
  change: []
}>()

const handlePlanStepChange = () => {
  emit('change')
}
</script>

<template>
  <div class="finish">
    <div class="content">
      <div class="plan">
        <div class="plan__billing">
          <div class="plan__billing-title">
            {{ data.planId }}({{ data.isYearly ? 'Yearly' : 'Monthly' }})
          </div>
          <div class="plan__billing-change" @click="handlePlanStepChange">Change</div>
        </div>
        <div class="plan__price">{{ data.planPrice }}</div>
      </div>
      <hr class="hr" />
      <div class="ons" v-for="item in data.onsPrice" :key="item.id">
        <div class="ons__title">{{ item.id }}</div>
        <div class="ons__price">{{ item.price }}</div>
      </div>
    </div>

    <div class="total">
      <div>{{ data.totalTitle }}</div>
      <div class="total__price">{{ data.totalPrice }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.finish {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: var(--color-cool-gray);

  .content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: var(--color-magnolia);
    padding: 25px;
    border-radius: 10px;
  }

  .plan {
    display: flex;

    &__billing {
      &-title {
        font-weight: bold;
        color: var(--color-marine-blue);
      }
      &-change {
        cursor: pointer;
        font-size: 14px;
        text-decoration: underline;
      }
    }

    &__price {
      margin-left: auto;
      font-weight: bold;
      color: var(--color-marine-blue);
    }
  }

  .hr {
    border: none; /* 先去掉默认边框 */
    border-top: 1px solid var(--color-light-gray); /* 设置上边框颜色和粗细 */
  }

  .ons {
    display: flex;
    font-size: 14px;

    &__price {
      margin-left: auto;
      color: var(--color-marine-blue);
    }
  }

  .total {
    display: flex;
    padding: 25px;

    &__price {
      margin-left: auto;
      font-weight: bold;
      color: var(--color-purplish-blue);
      font-size: 18px;
    }
  }
}
</style>
