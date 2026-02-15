// Shopify customer verification client
// Verifies that an email belongs to an active Shopify customer
// with a membership product/tag

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN; // e.g., "rifugio.kceadventures.com"
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN; // Admin API token

interface ShopifyCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  tags: string;
  state: string;
  orders_count: number;
}

export async function verifyShopifyMember(email: string): Promise<{
  isValid: boolean;
  customer?: ShopifyCustomer;
  membershipTier?: string;
}> {
  if (!SHOPIFY_STORE || !SHOPIFY_ACCESS_TOKEN) {
    console.warn("Shopify credentials not configured — skipping verification");
    return { isValid: true }; // Allow in demo mode
  }

  try {
    const response = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/2024-01/customers/search.json?query=email:${encodeURIComponent(email)}`,
      {
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Shopify API error:", response.status);
      return { isValid: false };
    }

    const data = await response.json();
    const customers = data.customers || [];

    if (customers.length === 0) {
      return { isValid: false };
    }

    const customer = customers[0];
    const tags = customer.tags.toLowerCase().split(",").map((t: string) => t.trim());

    // Check for membership tags
    // Adjust these tag names to match what you use in Shopify
    const membershipTags = [
      "community-member",
      "clubhouse-member",
      "all-access-member",
      "rifugio-plus",
      "member",
    ];

    const membershipTag = membershipTags.find(tag => tags.includes(tag));

    if (membershipTag || customer.orders_count > 0) {
      return {
        isValid: true,
        customer,
        membershipTier: membershipTag || "community",
      };
    }

    return { isValid: false };
  } catch (error) {
    console.error("Shopify verification error:", error);
    return { isValid: false };
  }
}
