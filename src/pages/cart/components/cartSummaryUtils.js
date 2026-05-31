import { getCartPricing, toFiniteNumber } from '../../../utils/utils.js'

export const getSummaryTotals = (items = [], subtotal = 0) => {
  const subtotalValue = toFiniteNumber(subtotal)
  const totalMrp = items.reduce((total, item) => {
    const { compareAtPrice, price } = getCartPricing(item)
    const mrp = compareAtPrice || price

    return total + mrp * toFiniteNumber(item.quantity)
  }, 0)
  const mrpValue = Math.max(totalMrp, subtotalValue)
  const bagDiscount = Math.max(mrpValue - subtotalValue, 0)
  const couponDiscount = 0
  const shippingCharge = 0
  const totalPayable = Math.max(subtotalValue - couponDiscount + shippingCharge, 0)

  return {
    bagDiscount,
    couponDiscount,
    shippingCharge,
    subtotal: subtotalValue,
    totalMrp: mrpValue,
    totalPayable,
  }
}
