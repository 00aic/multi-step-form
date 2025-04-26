export interface User {
  name: string
  email: string
  phoneNumber: string
}

export interface Plan {
  isYearly: boolean
  planId: string
  planPrice: string
}

export interface Ons {
  id: string
  price: string
}

export interface Billing extends User, Plan {
  onsPrice: Array<Ons>
  totalTitle: string
  totalPrice: string
}
