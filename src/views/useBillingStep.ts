import { ref } from 'vue'
import type { Billing } from './types'

interface StepOptions {
  totalStep: number
}

export const useBillingStep = (options: StepOptions) => {
  const currentStep = ref(1)

  const getDefaultBilling = () => ({
    name: '',
    email: '',
    phoneNumber: '',
    isYearly: false,
    planId: '',
    planPrice: '',
    onsPrice: [],
    totalTitle: '',
    totalPrice: '',
  })

  // const setDefaultValue = () => {

  // }

  const billing = ref<Billing>(getDefaultBilling())

  const updateBilling = (newData: unknown) => {
    billing.value = { ...billing.value, ...(newData as Billing) }
    billing.value = { ...billing.value, ...getTotalPrice() }
  }

  const emptyOnsPrice = () => {
    billing.value = { ...billing.value, ...{ onsPrice: [] } }
  }

  const nextStep = () => {
    if (currentStep.value < options.totalStep) {
      currentStep.value++
    }
  }

  const prevStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  const goToStep = (step: number) => {
    currentStep.value = step
  }

  const getTotalPrice = () => {
    const allPrice = [
      billing.value.planPrice,
      ...(billing.value.onsPrice?.map((ons) => ons.price) || []),
    ]
    let sum = 0
    let suffix = ''
    allPrice?.forEach((price) => {
      const match = price?.match(/\$(\d+)\/(mo|yr)$/)
      if (match) {
        sum += parseInt(match[1], 10)
        suffix = match[2]
      }
    })

    return {
      totalTitle: billing.value.isYearly ? 'Total(per year)' : 'Total(per month)',
      totalPrice: `+$${sum}/${suffix}`,
    }
  }

  return {
    getDefaultBilling,
    billing,
    currentStep,
    updateBilling,
    emptyOnsPrice,
    nextStep,
    prevStep,
    goToStep,
    getTotalPrice,
  }
}
