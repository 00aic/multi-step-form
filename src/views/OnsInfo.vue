<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Ons } from './types'

interface Item {
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

const props = defineProps<{
  data: Item[]
  isYearly: boolean
}>()

const onsPrice = ref<Ons[]>([
  {
    id: '',
    price: '',
  },
])

const onsIds = ref<string[]>([])

const emit = defineEmits<{ update: [{ onsPrice: Ons[] }] }>()

watch(onsIds, (newOnsIds: string[]) => {
  onsPrice.value = newOnsIds?.map((id) => {
    const selectedOns = props.data.find((item) => item.id === id)
    if (selectedOns) {
      return {
        id: selectedOns.id,
        price: props.isYearly ? selectedOns.yearly.price : selectedOns.monthly.price,
      }
    }
    return { id: '', price: '' }
  })
  emit('update', { onsPrice: onsPrice.value })
})

const resetOns = () => {
  onsIds.value = []
}

defineExpose({
  resetOns,
})
</script>

<template>
  <div class="ons">
    <div v-for="item in data" :key="item.id" class="detail">
      <label class="checkbox-container"
        ><input type="checkbox" v-model="onsIds" :value="item.id" />
        <span class="checkmark"></span>
      </label>

      <div class="detail__title">
        <div class="detail__title-id">{{ item.id }}</div>
        <div class="detail__title-desc">{{ item.desc }}</div>
      </div>
      <div class="detail__price">
        {{ isYearly ? item.yearly.price : item.monthly.price }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ons {
  display: flex;
  flex-direction: column;
  gap: 15px;

  .detail {
    border: 1px solid var(--color-light-gray);
    display: flex;
    border-radius: 8px;
    padding: 20px;
    gap: 20px;
    align-items: center;

    .checkbox-container {
      position: relative;
      display: inline-block;
      width: 20px;
      height: 20px;
      cursor: pointer;

      input {
        opacity: 0;
      }

      .checkmark {
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
        width: 100%;
        height: 100%;
        background-color: white;
        border-radius: 5px;
        border: 1px solid var(--color-light-gray);

        &::before {
          content: ' ';
          position: absolute;
          top: 3px;
          left: 6px;
          transform: rotate(45deg);
          border: solid white;
          border-width: 0 2px 2px 0;
          width: 6px;
          height: 10px;
          display: none;
        }
      }
      input:checked + .checkmark {
        background-color: var(--color-purplish-blue);
        &::before {
          display: block;
        }
      }
    }
    &:has(input[type='checkbox']:checked) {
      border: 1px solid var(--color-purplish-blue);
      background-color: var(--color-purplish-blue-2);
    }

    &__title {
      &-id {
        color: var(--color-marine-blue);
        font-weight: bold;
      }

      &-desc {
        color: var(--color-cool-gray);
        font-size: 12px;
      }
    }

    &__price {
      color: var(--color-purplish-blue);
      margin-left: auto;
      font-size: 12px;
      font-weight: bold;
    }
  }
}
</style>
