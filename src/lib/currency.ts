// Currency utility for RoyalFresh - UK focused application
// Converting from INR to GBP for UK market

export const CURRENCY_CONFIG = {
  symbol: '£',
  code: 'GBP',
  name: 'British Pound',
  region: 'UK',
  // Approximate conversion rate from INR to GBP (1 INR = ~0.01 GBP)
  // This should be fetched from a real API in production
  conversionRate: 0.012, // 1 INR = 0.012 GBP
  minimumAmount: 0.30, // Stripe minimum 30 pence
} as const;

/**
 * Convert price from INR to GBP
 */
export function convertINRtoGBP(inrAmount: number): number {
  return inrAmount * CURRENCY_CONFIG.conversionRate;
}

/**
 * Format currency amount in GBP
 */
export function formatCurrency(amount: number, options?: {
  convertFromINR?: boolean;
  showSymbol?: boolean;
  decimalPlaces?: number;
}): string {
  const {
    convertFromINR = false,
    showSymbol = true,
    decimalPlaces = 2
  } = options || {};

  let finalAmount = amount;
  if (convertFromINR) {
    finalAmount = convertINRtoGBP(amount);
  }

  const formattedAmount = finalAmount.toFixed(decimalPlaces);
  return showSymbol ? `${CURRENCY_CONFIG.symbol}${formattedAmount}` : formattedAmount;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(): string {
  return CURRENCY_CONFIG.symbol;
}

/**
 * Get currency code for Stripe
 */
export function getCurrencyCode(): string {
  return CURRENCY_CONFIG.code;
}

/**
 * Convert amount to pence (smallest unit for GBP in Stripe)
 */
export function convertToPence(gbpAmount: number): number {
  return Math.round(gbpAmount * 100);
}

/**
 * Ensure minimum payment amount for Stripe
 */
export function ensureMinimumAmount(amount: number, convertFromINR = false): number {
  let gbpAmount = convertFromINR ? convertINRtoGBP(amount) : amount;
  return Math.max(gbpAmount, CURRENCY_CONFIG.minimumAmount);
}

/**
 * Convert cart total from INR to GBP and ensure minimum
 */
export function getStripeCompatibleAmount(inrTotal: number): {
  amount: number; // in GBP
  amountInPence: number; // for Stripe
  isMinimumApplied: boolean;
} {
  const gbpAmount = convertINRtoGBP(inrTotal);
  const finalAmount = ensureMinimumAmount(gbpAmount);
  const isMinimumApplied = finalAmount > gbpAmount;
  
  return {
    amount: finalAmount,
    amountInPence: convertToPence(finalAmount),
    isMinimumApplied
  };
}
