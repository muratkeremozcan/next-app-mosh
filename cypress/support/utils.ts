import {faker} from '@faker-js/faker'
import type {User} from '@/app/api/users/schema'
import type {Product} from '@/app/api/products/schema'

export const createRandomUser = (): User => ({
  name: faker.internet.userName(),
  email: faker.internet.email(),
})

export const createRandomProduct = (): Product => ({
  name: faker.commerce.productName(),
  price: parseFloat(faker.commerce.price()),
})
