import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const COIN_PACKS: Record<string, { priceId: string; coins: number }> = {
  starter: { priceId: "price_1T3i4PBMaPNDCmKBDMtEVNpk", coins: 500 },
  popular: { priceId: "price_1T3i4lBMaPNDCmKBmKqbQv1g", coins: 1500 },
  mega: { priceId: "price_1T3i4zBMaPNDCmKBY8Kmj6ea", coins: 5000 },
  ultimate: { priceId: "price_1T3i5CBMaPNDCmKBuo9enOQa", coins: 15000 },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { packId } = await req.json();
    const pack = COIN_PACKS[packId];
    if (!pack) {
      throw new Error(`Invalid pack: ${packId}`);
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: pack.priceId, quantity: 1 }],
      mode: "payment",
      success_url: `${origin}/?purchase=success&coins=${pack.coins}`,
      cancel_url: `${origin}/?purchase=cancelled`,
      metadata: {
        coins: pack.coins.toString(),
        packId,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Error creating checkout:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
