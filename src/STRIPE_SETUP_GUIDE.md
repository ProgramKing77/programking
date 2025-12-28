# Stripe Payment Integration Setup Guide

## Overview
Your PROGRAMKING website now has **real Stripe payment processing** integrated. This guide will help you connect your Stripe account and start accepting real payments.

---

## Current Status ✅

### What's Already Implemented:
- ✅ Backend payment endpoints created (`/payment/create-intent`, `/payment/confirm`)
- ✅ Frontend payment forms updated to use real Stripe API
- ✅ Discount code validation and application via Stripe
- ✅ Automatic promotion code redemption tracking
- ✅ Secure payment processing with Stripe.js
- ✅ Error handling and user feedback

### What You Need to Do:
1. Get your Stripe API keys
2. Add your Stripe Publishable Key to the environment
3. Test with Stripe test cards
4. Activate your Stripe account for live payments

---

## Step 1: Get Your Stripe API Keys

### Create/Login to Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Sign up or log in to your account
3. Complete your business profile

### Get Your API Keys
1. Navigate to **Developers** → **API keys** in the Stripe Dashboard
2. You'll see two keys:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`) - ⚠️ Already configured as `STRIPE_SECRET_KEY`

---

## Step 2: Add Publishable Key to Your Project

### Option A: Using Environment Variables (Recommended)
Add your Stripe Publishable Key to your environment:

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

### Option B: Direct Update (Quick Test)
Update the files directly with your publishable key:

**In `/components/PaymentModal.tsx`** (Line 22):
```typescript
return (window as any).Stripe('pk_test_YOUR_ACTUAL_KEY_HERE');
```

**In `/components/CheckoutPaymentModal.tsx`** (Line 127):
```typescript
return (window as any).Stripe('pk_test_YOUR_ACTUAL_KEY_HERE');
```

---

## Step 3: Test Your Integration

### Stripe Test Card Numbers
Use these test cards during development:

| Card Number | Scenario | CVV | Expiry |
|------------|----------|-----|--------|
| `4242 4242 4242 4242` | ✅ Successful payment | Any 3 digits | Any future date |
| `4000 0000 0000 0002` | ❌ Card declined | Any 3 digits | Any future date |
| `4000 0000 0000 9995` | ❌ Insufficient funds | Any 3 digits | Any future date |
| `4000 0025 0000 3155` | ✅ Requires authentication | Any 3 digits | Any future date |

### Testing Process:
1. Start your app
2. Add a program to cart
3. Proceed to checkout
4. Enter one of the test card numbers above
5. Complete the payment
6. Check your Stripe Dashboard → **Payments** to see the transaction

---

## Step 4: Enable Discount Codes (Already Working!)

Your discount/reward system is already connected to Stripe:

### How It Works:
1. Users complete programs and unlock rewards
2. When they claim a reward, a Stripe coupon + promotion code is created
3. Users can apply the code at checkout
4. The backend automatically validates and applies the discount
5. After successful payment, the code is marked as "used"

### Test a Discount Code:
1. Go to your Stripe Dashboard → **Products** → **Coupons**
2. Create a test coupon (e.g., 10% off)
3. Create a promotion code for it
4. Use that code during checkout

---

## Step 5: Go Live with Real Payments

### When You're Ready for Production:

1. **Activate Your Stripe Account**
   - Complete your business verification in Stripe Dashboard
   - Add your bank account details
   - Submit required documentation

2. **Switch to Live Keys**
   - Get your **live** publishable key (`pk_live_...`)
   - Your live secret key is already configured
   - Update `VITE_STRIPE_PUBLISHABLE_KEY` with the live key

3. **Enable Payment Methods**
   - In Stripe Dashboard → **Settings** → **Payment methods**
   - Enable: Cards, Apple Pay, Google Pay, etc.

4. **Test Live Mode**
   - Use real card details (your own card)
   - Verify the payment appears in your Stripe account
   - Refund the test payment if needed

---

## Payment Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PROGRAMKING Website                      │
│                                                              │
│  User fills out payment form                                 │
│  (Card number, expiry, CVV, name)                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend Server (Supabase)                   │
│                                                              │
│  POST /payment/create-intent                                 │
│  • Validates discount code (if provided)                     │
│  • Calculates final amount                                   │
│  • Creates Stripe Payment Intent                             │
│  • Returns client_secret to frontend                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      Stripe.js (Frontend)                    │
│                                                              │
│  stripe.confirmCardPayment(client_secret, card_details)      │
│  • Tokenizes card data securely                              │
│  • Sends to Stripe servers (never to your backend)           │
│  • Handles 3D Secure authentication if required              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      Stripe (External)                       │
│                                                              │
│  • Validates card                                            │
│  • Processes payment                                         │
│  • Returns success/failure                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend Server (Supabase)                   │
│                                                              │
│  POST /payment/mark-code-used (if discount applied)          │
│  • Marks promotion code as redeemed                          │
│  • Updates user's reward status                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     PROGRAMKING Website                      │
│                                                              │
│  • Shows success message                                     │
│  • Adds program to user's library                            │
│  • Redirects to confirmation/dashboard                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Features ✅

### What's Protected:
- ✅ Card details **never** touch your servers (handled by Stripe.js)
- ✅ Secret key is server-side only (not exposed to frontend)
- ✅ Payment intents are created server-side
- ✅ Amount validation happens server-side (can't be manipulated by users)
- ✅ Discount codes are validated server-side
- ✅ HTTPS encryption for all API calls

---

## API Endpoints

### Create Payment Intent
**Endpoint:** `POST /make-server-b0ab3817/payment/create-intent`

**Request:**
```json
{
  "amount": 9999,  // Amount in pence (£99.99)
  "currency": "gbp",
  "metadata": {
    "programId": "power-strength-program",
    "userId": "user123"
  },
  "promotionCode": "PK1234DISCOUNT"  // Optional
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx",
  "amount": 8999,  // After discount
  "originalAmount": 9999,
  "discountInfo": {
    "code": "PK1234DISCOUNT",
    "percentOff": 10,
    "amountOff": 1000
  }
}
```

### Confirm Payment
**Endpoint:** `POST /make-server-b0ab3817/payment/confirm`

**Request:**
```json
{
  "paymentIntentId": "pi_xxx"
}
```

**Response:**
```json
{
  "status": "succeeded",
  "amount": 8999,
  "currency": "gbp",
  "metadata": {
    "programId": "power-strength-program",
    "userId": "user123"
  }
}
```

### Mark Code as Used
**Endpoint:** `POST /make-server-b0ab3817/payment/mark-code-used`

**Request:**
```json
{
  "userId": "user123",
  "promotionCode": "PK1234DISCOUNT"
}
```

**Response:**
```json
{
  "success": true
}
```

---

## Troubleshooting

### "Stripe is not defined" Error
- Make sure your publishable key is set correctly
- Check browser console for script loading errors
- Verify the Stripe.js script loads before payment submission

### "Invalid API Key" Error
- Verify you're using the correct publishable key (starts with `pk_`)
- Check if you're using test keys in test mode and live keys in live mode
- Make sure the key matches your Stripe account

### Payment Fails Immediately
- Check the Stripe Dashboard → Logs for detailed error messages
- Verify the card number is valid
- Ensure the amount is greater than the minimum charge amount (£0.50 for GBP)

### Discount Code Not Working
- Verify the promotion code exists in Stripe Dashboard
- Check if the code is still active
- Ensure it hasn't exceeded max redemptions
- Check browser console for validation errors

---

## Monitoring & Analytics

### View Payments in Stripe:
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Payments**
3. See all transactions, refunds, disputes

### Key Metrics to Track:
- Total revenue
- Successful vs failed payments
- Most used discount codes
- Average transaction value
- Payment method distribution

### Webhook Integration (Future Enhancement):
Set up webhooks to automatically:
- Send confirmation emails
- Update program access in real-time
- Handle failed payments
- Track refunds

---

## Next Steps

1. ✅ **Add your Stripe Publishable Key** to the project
2. ✅ **Test with test cards** to ensure everything works
3. ✅ **Activate your Stripe account** for live payments
4. ✅ **Switch to live keys** when ready for production
5. 📧 **Set up email receipts** via Stripe (optional)
6. 📊 **Configure webhooks** for automated order processing (optional)
7. 🌍 **Enable additional payment methods** (Apple Pay, Google Pay, etc.)

---

## Support

### Stripe Documentation:
- [Stripe Payment Intents](https://stripe.com/docs/payments/payment-intents)
- [Stripe.js Reference](https://stripe.com/docs/js)
- [Testing Cards](https://stripe.com/docs/testing)

### Your Implementation:
- Payment logic: `/components/PaymentModal.tsx` & `/components/CheckoutPaymentModal.tsx`
- Backend endpoints: `/supabase/functions/server/index.tsx`
- Discount system: Already integrated with rewards system

---

**🎉 Congratulations! Your payment system is ready to accept real payments!**
