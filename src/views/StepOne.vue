<script setup lang="ts">
import { ref, watch } from 'vue'
import type { User } from './types'

const emit = defineEmits<{
  update: [data: User]
}>()

const user = ref<User>({
  name: '',
  email: '',
  phoneNumber: '',
})

watch(user, (newData: User) => {
  emit('update', newData)
})
</script>

<template>
  <div class="one">
    <div class="one__item">
      <label for="name">Name</label>
      <input
        v-model="user.name"
        class="one__item-input"
        type="text"
        id="name"
        placeholder="e.g.Stephen King"
      />
    </div>
    <div class="one__item">
      <label for="emailAddress">Email Address</label>
      <input
        v-model="user.email"
        class="one__item-input"
        type="email"
        id="emailAddress"
        placeholder="e.g.Stephenking@lorem.com"
        required
      />
    </div>
    <div class="one__item">
      <label for="phoneNumber">Phone Number</label>
      <input
        v-model="user.phoneNumber"
        class="one__item-input"
        type="tel"
        id="phoneNumber"
        placeholder="e.g.+1234567890"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.one {
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__item {
    display: flex;
    flex-direction: column;
    gap: 5px;

    &-input {
      border-radius: 8px;
      height: 50px;
      border: 1px solid var(--color-light-gray);
      padding: 15px;
    }
  }
}
</style>
