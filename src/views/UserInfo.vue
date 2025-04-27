<script setup lang="ts">
import { ref, watch } from 'vue'
import type { User } from './types'
import { Field, ErrorMessage, useForm } from 'vee-validate'
import * as yup from 'yup'

const schema = yup.object({
  name: yup.string().required('This field is required'),
  email: yup.string().required('This field is required'),
  phoneNumber: yup.string().required('This field is required'),
})

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

const { validate, setFieldTouched } = useForm({
  validationSchema: schema,
})

const validateForm = async () => {
  const { valid } = await validate()
  if (!valid) {
    setFieldTouched('name', true)
    setFieldTouched('email', true)
    setFieldTouched('phoneNumber', true)
  }
  return valid
}
defineExpose({
  validateForm,
})
</script>

<template>
  <div class="user">
    <div class="user__item">
      <div class="user__item-label">
        <label for="name">Name</label>
        <ErrorMessage name="name" class="error-msg" />
      </div>

      <Field v-model="user.name" name="name" v-slot="{ field, meta, errors }">
        <input
          v-bind="field"
          class="user__item-input"
          type="text"
          id="name"
          placeholder="e.g.Stephen King"
          :class="['user__item-input', { 'error-border': meta.touched && errors[0] }]"
        />
      </Field>
    </div>
    <div class="user__item">
      <div class="user__item-label">
        <label for="email">Email Address</label>
        <ErrorMessage name="email" class="error-msg" />
      </div>
      <Field v-model="user.email" name="email" v-slot="{ field, meta, errors }">
        <input
          v-bind="field"
          class="user__item-input"
          type="email"
          id="email"
          placeholder="e.g.Stephenking@lorem.com"
          :class="['user__item-input', { 'error-border': meta.touched && errors[0] }]"
        />
      </Field>
    </div>
    <div class="user__item">
      <div class="user__item-label">
        <label for="phoneNumber">Phone Number</label>
        <ErrorMessage name="phoneNumber" class="error-msg" />
      </div>
      <Field v-model="user.phoneNumber" name="phoneNumber" v-slot="{ field, meta, errors }">
        <input
          v-bind="field"
          class="user__item-input"
          type="tel"
          id="phoneNumber"
          placeholder="e.g.+1234567890"
          :class="['user__item-input', { 'error-border': meta.touched && errors[0] }]"
        />
      </Field>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user {
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__item {
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex-wrap: wrap;
    width: 100%; /* 确保容器足够宽 */
    // justify-content: space-between;

    &-label {
      display: flex;
      justify-content: space-between;
    }

    &-input {
      border-radius: 8px;
      height: 50px;
      border: 1px solid var(--color-light-gray);
      padding: 15px;
    }
  }

  .error-msg {
    color: #dc3545;
    font-size: 14px;
    font-weight: bold;
  }

  .error-border {
    border-color: #dc3545;
  }
}
</style>
