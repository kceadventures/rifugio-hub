import { NextRequest, NextResponse } from "next/server";
import { verifyShopifyMember } from "@/lib/shopify/client";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const result = await verifyShopifyMember(email.toLowerCase().trim());

    if (!result.isValid) {
      return NextResponse.json(
        {
          error: "No active membership found",
          message: "This email isn't associated with an active Rifugio membership. Visit rifugio.kceadventures.com to join.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      verified: true,
      membershipTier: result.membershipTier,
      name: result.customer
        ? `${result.customer.first_name} ${result.customer.last_name}`
        : undefined,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
