import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import Stripe from "npm:stripe@17.5.0";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();

// Initialize Stripe
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-12-18.acacia',
});

// Initialize Supabase client for auth
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-b0ab3817/health", (c) => {
  return c.json({ status: "ok" });
});

// Get user rewards state
app.get("/make-server-b0ab3817/rewards/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    
    // Get user's completed programs count
    const userProgressKey = `user:${userId}:progress`;
    const progressData = await kv.get(userProgressKey);
    const completedPrograms = progressData ? JSON.parse(progressData).completedPrograms || 0 : 0;
    
    // Get user's reward states (unlocked, claimed, used)
    const rewardsKey = `user:${userId}:rewards`;
    const rewardsData = await kv.get(rewardsKey);
    const rewards = rewardsData ? JSON.parse(rewardsData) : {};
    
    return c.json({
      completedPrograms,
      rewards
    });
  } catch (error) {
    console.log(`Error fetching rewards for user: ${error}`);
    return c.json({ error: 'Failed to fetch rewards' }, 500);
  }
});

// Claim a reward and generate Stripe promotion code
app.post("/make-server-b0ab3817/rewards/claim", async (c) => {
  try {
    const { userId, rewardId, discountPercent } = await c.req.json();
    
    if (!userId || !rewardId || !discountPercent) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Check if user has already claimed this reward
    const rewardsKey = `user:${userId}:rewards`;
    const rewardsData = await kv.get(rewardsKey);
    const rewards = rewardsData ? JSON.parse(rewardsData) : {};
    
    if (rewards[rewardId]?.claimed) {
      return c.json({ 
        error: 'Reward already claimed',
        code: rewards[rewardId].code 
      }, 400);
    }
    
    // Verify user has completed enough programs
    const userProgressKey = `user:${userId}:progress`;
    const progressData = await kv.get(userProgressKey);
    const completedPrograms = progressData ? JSON.parse(progressData).completedPrograms || 0 : 0;
    
    // Map reward requirements
    const requirements = {
      'reward-2-programs': 2,
      'reward-5-programs': 5,
      'reward-9-programs': 9,
      'reward-10-programs': 10
    };
    
    const requiredPrograms = requirements[rewardId as keyof typeof requirements];
    if (!requiredPrograms || completedPrograms < requiredPrograms) {
      return c.json({ error: 'Not enough completed programs' }, 400);
    }
    
    // Create a Stripe coupon
    const coupon = await stripe.coupons.create({
      percent_off: discountPercent,
      duration: 'once',
      name: `${discountPercent}% OFF - ${requiredPrograms} Programs Reward`,
      metadata: {
        userId,
        rewardId
      }
    });
    
    // Create a unique promotion code
    const promoCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: `PK${userId.substring(0, 4).toUpperCase()}${rewardId.substring(7, 9).toUpperCase()}${Date.now().toString(36).toUpperCase()}`,
      max_redemptions: 1,
      metadata: {
        userId,
        rewardId
      }
    });
    
    // Update user's rewards state
    rewards[rewardId] = {
      claimed: true,
      claimedAt: new Date().toISOString(),
      code: promoCode.code,
      stripePromotionCodeId: promoCode.id,
      stripeCouponId: coupon.id,
      used: false
    };
    
    await kv.set(rewardsKey, JSON.stringify(rewards));
    
    return c.json({
      success: true,
      code: promoCode.code
    });
  } catch (error) {
    console.log(`Error claiming reward: ${error}`);
    return c.json({ error: 'Failed to claim reward', details: String(error) }, 500);
  }
});

// Validate discount code at checkout
app.post("/make-server-b0ab3817/rewards/validate", async (c) => {
  try {
    const { code, userId } = await c.req.json();
    
    if (!code) {
      return c.json({ error: 'Code is required' }, 400);
    }
    
    // Fetch promotion code from Stripe
    const promoCodes = await stripe.promotionCodes.list({
      code: code,
      limit: 1
    });
    
    if (promoCodes.data.length === 0) {
      return c.json({ error: 'Invalid code' }, 400);
    }
    
    const promoCode = promoCodes.data[0];
    
    // Check if code is still active
    if (!promoCode.active) {
      return c.json({ error: 'Code has expired or been deactivated' }, 400);
    }
    
    // Check if code has been used
    if (promoCode.times_redeemed >= (promoCode.max_redemptions || 1)) {
      return c.json({ error: 'Code has already been used' }, 400);
    }
    
    // Verify code belongs to this user
    if (userId && promoCode.metadata.userId !== userId) {
      return c.json({ error: 'This code is not valid for your account' }, 400);
    }
    
    // Get coupon details
    const coupon = await stripe.coupons.retrieve(promoCode.coupon as string);
    
    return c.json({
      valid: true,
      discountPercent: coupon.percent_off,
      stripePromotionCodeId: promoCode.id
    });
  } catch (error) {
    console.log(`Error validating discount code: ${error}`);
    return c.json({ error: 'Failed to validate code', details: String(error) }, 500);
  }
});

// Mark reward as used after successful payment
app.post("/make-server-b0ab3817/rewards/redeem", async (c) => {
  try {
    const { userId, code } = await c.req.json();
    
    if (!userId || !code) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Get user's rewards
    const rewardsKey = `user:${userId}:rewards`;
    const rewardsData = await kv.get(rewardsKey);
    const rewards = rewardsData ? JSON.parse(rewardsData) : {};
    
    // Find which reward this code belongs to
    let rewardId = null;
    for (const [id, reward] of Object.entries(rewards)) {
      if ((reward as any).code === code) {
        rewardId = id;
        break;
      }
    }
    
    if (!rewardId) {
      return c.json({ error: 'Code not found for this user' }, 400);
    }
    
    // Mark as used
    rewards[rewardId].used = true;
    rewards[rewardId].usedAt = new Date().toISOString();
    
    await kv.set(rewardsKey, JSON.stringify(rewards));
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error redeeming reward: ${error}`);
    return c.json({ error: 'Failed to redeem reward', details: String(error) }, 500);
  }
});

// Update user progress (complete a program)
app.post("/make-server-b0ab3817/progress/complete", async (c) => {
  try {
    const { userId, programId } = await c.req.json();
    
    if (!userId || !programId) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const userProgressKey = `user:${userId}:progress`;
    const progressData = await kv.get(userProgressKey);
    const progress = progressData ? JSON.parse(progressData) : { completedPrograms: 0, programs: [] };
    
    // Add program if not already completed
    if (!progress.programs.includes(programId)) {
      progress.programs.push(programId);
      progress.completedPrograms = progress.programs.length;
      
      await kv.set(userProgressKey, JSON.stringify(progress));
    }
    
    return c.json({ 
      success: true, 
      completedPrograms: progress.completedPrograms 
    });
  } catch (error) {
    console.log(`Error updating progress: ${error}`);
    return c.json({ error: 'Failed to update progress', details: String(error) }, 500);
  }
});

// Get user profile data
app.get("/make-server-b0ab3817/profile/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    
    const profileKey = `user:${userId}:profile`;
    const profileData = await kv.get(profileKey);
    
    if (!profileData) {
      return c.json({ error: 'Profile not found' }, 404);
    }
    
    return c.json(JSON.parse(profileData));
  } catch (error) {
    console.log(`Error fetching profile: ${error}`);
    return c.json({ error: 'Failed to fetch profile', details: String(error) }, 500);
  }
});

// Update user profile data
app.post("/make-server-b0ab3817/profile/update", async (c) => {
  try {
    const { userId, firstName, lastName, email, userImage } = await c.req.json();
    
    if (!userId) {
      return c.json({ error: 'User ID is required' }, 400);
    }
    
    const profileKey = `user:${userId}:profile`;
    const profileData = {
      firstName,
      lastName,
      email,
      userImage,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(profileKey, JSON.stringify(profileData));
    
    return c.json({ 
      success: true,
      profile: profileData
    });
  } catch (error) {
    console.log(`Error updating profile: ${error}`);
    return c.json({ error: 'Failed to update profile', details: String(error) }, 500);
  }
});

// Save program with exercises
app.post("/make-server-b0ab3817/programs", async (c) => {
  try {
    const programData = await c.req.json();
    
    if (!programData.id) {
      return c.json({ error: 'Program ID is required' }, 400);
    }
    
    const programKey = `program:${programData.id}`;
    await kv.set(programKey, JSON.stringify(programData));
    
    return c.json({ 
      success: true,
      programId: programData.id
    });
  } catch (error) {
    console.log(`Error saving program: ${error}`);
    return c.json({ error: 'Failed to save program', details: String(error) }, 500);
  }
});

// Get program by ID
app.get("/make-server-b0ab3817/programs/:programId", async (c) => {
  try {
    const programId = c.req.param('programId');
    
    const programKey = `program:${programId}`;
    const programData = await kv.get(programKey);
    
    if (!programData) {
      return c.json({ error: 'Program not found' }, 404);
    }
    
    return c.json(JSON.parse(programData));
  } catch (error) {
    console.log(`Error fetching program: ${error}`);
    return c.json({ error: 'Failed to fetch program', details: String(error) }, 500);
  }
});

// Get all programs
app.get("/make-server-b0ab3817/programs", async (c) => {
  try {
    // Get all program keys from the database
    const programs = await kv.getByPrefix('program:');
    
    // Parse and return all programs
    const parsedPrograms = programs.map(programData => JSON.parse(programData));
    
    return c.json({ programs: parsedPrograms });
  } catch (error) {
    console.log(`Error fetching all programs: ${error}`);
    return c.json({ error: 'Failed to fetch programs', details: String(error) }, 500);
  }
});

// Update program
app.put("/make-server-b0ab3817/programs/:programId", async (c) => {
  try {
    const programId = c.req.param('programId');
    const programData = await c.req.json();
    
    // Ensure the ID matches
    programData.id = programId;
    
    const programKey = `program:${programId}`;
    await kv.set(programKey, JSON.stringify(programData));
    
    return c.json({ 
      success: true,
      programId 
    });
  } catch (error) {
    console.log(`Error updating program: ${error}`);
    return c.json({ error: 'Failed to update program', details: String(error) }, 500);
  }
});

// Delete program
app.delete("/make-server-b0ab3817/programs/:programId", async (c) => {
  try {
    const programId = c.req.param('programId');
    console.log(`Attempting to delete program with ID: ${programId}`);
    
    const programKey = `program:${programId}`;
    console.log(`Using key: ${programKey}`);
    
    // First check if the program exists
    const existingProgram = await kv.get(programKey);
    if (!existingProgram) {
      console.log(`Program not found with key: ${programKey}`);
      return c.json({ error: 'Program not found' }, 404);
    }
    
    console.log(`Found program, attempting deletion...`);
    await kv.del(programKey);
    console.log(`Successfully deleted program: ${programId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting program: ${error}`);
    return c.json({ error: 'Failed to delete program', details: String(error) }, 500);
  }
});

// Send enquiry email
app.post("/make-server-b0ab3817/enquiries", async (c) => {
  try {
    const { name, email, phone, message, serviceTitle } = await c.req.json();
    
    if (!name || !email || !phone || !message || !serviceTitle) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const adminEmail = 'info@programking.com'; // Send enquiries to PROGRAMKING email
    
    if (!resendApiKey) {
      console.log('RESEND_API_KEY not found in environment');
      return c.json({ error: 'Email service not configured' }, 500);
    }
    
    console.log(`Attempting to send email to ${adminEmail} using Resend API`);
    console.log(`API Key present: ${resendApiKey ? 'Yes (length: ' + resendApiKey.length + ')' : 'No'}`);
    
    // Send email using Resend API
    const emailPayload = {
      from: 'PROGRAMKING <onboarding@resend.dev>',
      to: [adminEmail],
      reply_to: email,
      subject: `New Enquiry: ${serviceTitle}`,
      html: `
        <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #000000; color: #FFFFFF;">
          <div style="border: 1px solid #D4AF37; border-radius: 10px; padding: 30px; background-color: #000000;">
            <h1 style="color: #D4AF37; margin-bottom: 10px; font-size: 24px; letter-spacing: 0.02em;">New Enquiry Received</h1>
            <p style="color: #CCCCCC; margin-bottom: 30px; font-size: 14px;">${serviceTitle}</p>
            
            <div style="margin-bottom: 20px;">
              <h2 style="color: #D4AF37; font-size: 12px; letter-spacing: 0.15em; margin-bottom: 5px;">FULL NAME</h2>
              <p style="color: #FFFFFF; font-size: 14px; margin: 0;">${name}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h2 style="color: #D4AF37; font-size: 12px; letter-spacing: 0.15em; margin-bottom: 5px;">EMAIL ADDRESS</h2>
              <p style="color: #FFFFFF; font-size: 14px; margin: 0;"><a href="mailto:${email}" style="color: #D4AF37; text-decoration: none;">${email}</a></p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h2 style="color: #D4AF37; font-size: 12px; letter-spacing: 0.15em; margin-bottom: 5px;">PHONE NUMBER</h2>
              <p style="color: #FFFFFF; font-size: 14px; margin: 0;"><a href="tel:${phone}" style="color: #D4AF37; text-decoration: none;">${phone}</a></p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h2 style="color: #D4AF37; font-size: 12px; letter-spacing: 0.15em; margin-bottom: 5px;">MESSAGE</h2>
              <p style="color: #FFFFFF; font-size: 14px; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(212, 175, 55, 0.3);">
              <p style="color: #CCCCCC; font-size: 12px; margin: 0;">This enquiry was submitted via the PROGRAMKING website.</p>
            </div>
          </div>
        </div>
      `
    };
    
    console.log('Sending email with payload:', JSON.stringify({ ...emailPayload, html: '[HTML content]' }));
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify(emailPayload)
    });
    
    const responseText = await response.text();
    console.log(`Resend API response status: ${response.status}`);
    console.log(`Resend API response body: ${responseText}`);
    
    if (!response.ok) {
      console.log(`Error sending email via Resend: ${response.status} - ${responseText}`);
      return c.json({ 
        error: 'Failed to send email', 
        details: responseText,
        statusCode: response.status,
        hint: response.status === 401 ? 'Please verify your RESEND_API_KEY is correct. Get your API key from https://resend.com/api-keys' : undefined
      }, 500);
    }
    
    const data = JSON.parse(responseText);
    console.log('Email sent successfully:', data);
    
    return c.json({ 
      success: true,
      emailId: data.id 
    });
  } catch (error) {
    console.log(`Error processing enquiry: ${error}`);
    return c.json({ error: 'Failed to process enquiry', details: String(error) }, 500);
  }
});

// Create Payment Intent for checkout
app.post("/make-server-b0ab3817/payment/create-intent", async (c) => {
  try {
    const { amount, currency = 'gbp', metadata = {}, promotionCode } = await c.req.json();
    
    if (!amount || amount <= 0) {
      return c.json({ error: 'Invalid amount' }, 400);
    }

    // If promotion code is provided, validate and apply discount
    let finalAmount = amount;
    let discountInfo = null;

    if (promotionCode) {
      try {
        const promoCodes = await stripe.promotionCodes.list({
          code: promotionCode,
          limit: 1,
          active: true
        });

        if (promoCodes.data.length > 0) {
          const promoCode = promoCodes.data[0];
          const coupon = await stripe.coupons.retrieve(promoCode.coupon as string);
          
          if (coupon.percent_off) {
            const discountAmount = Math.round(amount * (coupon.percent_off / 100));
            finalAmount = amount - discountAmount;
            discountInfo = {
              code: promotionCode,
              percentOff: coupon.percent_off,
              amountOff: discountAmount
            };
          }
        }
      } catch (error) {
        console.log(`Error applying promotion code: ${error}`);
        // Continue without discount if code is invalid
      }
    }

    // Create the payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalAmount), // Amount in pence (smallest currency unit)
      currency: currency,
      metadata: {
        ...metadata,
        ...(discountInfo ? { promotionCode: promotionCode } : {})
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return c.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: finalAmount,
      originalAmount: amount,
      discountInfo
    });
  } catch (error) {
    console.log(`Error creating payment intent: ${error}`);
    return c.json({ error: 'Failed to create payment intent', details: String(error) }, 500);
  }
});

// Confirm payment status
app.post("/make-server-b0ab3817/payment/confirm", async (c) => {
  try {
    const { paymentIntentId } = await c.req.json();
    
    if (!paymentIntentId) {
      return c.json({ error: 'Payment Intent ID is required' }, 400);
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return c.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata
    });
  } catch (error) {
    console.log(`Error confirming payment: ${error}`);
    return c.json({ error: 'Failed to confirm payment', details: String(error) }, 500);
  }
});

// Mark promotion code as used after successful payment
app.post("/make-server-b0ab3817/payment/mark-code-used", async (c) => {
  try {
    const { userId, promotionCode } = await c.req.json();
    
    if (!userId || !promotionCode) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Update user's rewards to mark code as used
    const rewardsKey = `user:${userId}:rewards`;
    const rewardsData = await kv.get(rewardsKey);
    const rewards = rewardsData ? JSON.parse(rewardsData) : {};

    // Find the reward with this code and mark it as used
    for (const rewardId in rewards) {
      if (rewards[rewardId].code === promotionCode && rewards[rewardId].claimed) {
        rewards[rewardId].used = true;
        rewards[rewardId].usedAt = new Date().toISOString();
      }
    }

    await kv.set(rewardsKey, JSON.stringify(rewards));

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error marking code as used: ${error}`);
    return c.json({ error: 'Failed to mark code as used', details: String(error) }, 500);
  }
});

// Auth: Sign up new user
app.post("/make-server-b0ab3817/auth/signup", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Create user with Supabase Auth
    // Automatically confirm the user's email since an email server hasn't been configured
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true
    });

    if (error) {
      console.log(`Error creating user: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Generate a session token for the new user
    // Use a client with anon key to sign in
    const anonClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || ''
    );

    const { data: sessionData, error: signInError } = await anonClient.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      console.log(`Error signing in after signup: ${signInError.message}`);
      return c.json({ error: 'Account created but login failed. Please try logging in.' }, 500);
    }

    return c.json({
      success: true,
      access_token: sessionData.session?.access_token,
      user: data.user
    });
  } catch (error) {
    console.log(`Error in signup: ${error}`);
    return c.json({ error: 'Failed to create account', details: String(error) }, 500);
  }
});

Deno.serve((req) => app.fetch(req));