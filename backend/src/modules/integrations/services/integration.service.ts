type IntegrationStatus = {
  key: string;
  name: string;
  category: string;
  configured: boolean;
  requiredEnv: string[];
  optionalEnv?: string[];
  notes?: string;
};

const hasAll = (keys: string[]) => keys.every((key) => Boolean(process.env[key]));

const status = (
  key: string,
  name: string,
  category: string,
  requiredEnv: string[],
  notes?: string,
  optionalEnv?: string[]
): IntegrationStatus => ({
  key,
  name,
  category,
  configured: hasAll(requiredEnv),
  requiredEnv,
  optionalEnv,
  notes
});

export class IntegrationService {
  getStatuses() {
    return [
      status("stripe", "Stripe", "payments", [
        "STRIPE_SECRET_KEY",
        "STRIPE_WEBHOOK_SECRET"
      ]),
      status("paypal", "PayPal", "payments", [
        "PAYPAL_CLIENT_ID",
        "PAYPAL_CLIENT_SECRET"
      ], "Foundation endpoint exists; live capture flow can be added when credentials are ready."),
      status("sendgrid", "SendGrid", "email", [
        "SENDGRID_API_KEY",
        "EMAIL_FROM"
      ]),
      status("mailgun", "Mailgun", "email", [
        "MAILGUN_API_KEY",
        "MAILGUN_DOMAIN"
      ], "Alternative provider foundation only."),
      status("mailchimp", "Mailchimp", "marketing", [
        "MAILCHIMP_API_KEY",
        "MAILCHIMP_AUDIENCE_ID"
      ]),
      status("klaviyo", "Klaviyo", "marketing", ["KLAVIYO_API_KEY"]),
      status("meta_pixel", "Meta Pixel", "analytics", ["META_PIXEL_ID"]),
      status("instagram_graph", "Instagram Graph API", "social", [
        "INSTAGRAM_ACCESS_TOKEN",
        "INSTAGRAM_BUSINESS_ACCOUNT_ID"
      ]),
      status("ga4", "Google Analytics 4", "analytics", ["GA4_MEASUREMENT_ID"]),
      status("gtm", "Google Tag Manager", "analytics", ["GTM_CONTAINER_ID"]),
      status("google_maps", "Google Maps", "maps", ["GOOGLE_MAPS_API_KEY"]),
      status("dhl", "DHL Shipping", "shipping", [
        "DHL_API_KEY",
        "DHL_ACCOUNT_NUMBER"
      ]),
      status("ups", "UPS Shipping", "shipping", [
        "UPS_CLIENT_ID",
        "UPS_CLIENT_SECRET",
        "UPS_ACCOUNT_NUMBER"
      ]),
      status("fedex", "FedEx Shipping", "shipping", [
        "FEDEX_CLIENT_ID",
        "FEDEX_CLIENT_SECRET",
        "FEDEX_ACCOUNT_NUMBER"
      ]),
      status("local_shipping", "Local Shipping API", "shipping", [
        "LOCAL_SHIPPING_API_URL"
      ], "Used as a fallback foundation for local carriers.", ["LOCAL_SHIPPING_API_KEY"]),
      status("recaptcha", "reCAPTCHA v3", "security", [
        "RECAPTCHA_SECRET_KEY"
      ]),
      status("whatsapp", "WhatsApp Chat Widget", "support", [
        "WHATSAPP_PHONE_NUMBER"
      ]),
      status("reviews", "Reviews API", "reviews", ["REVIEWS_API_URL"], undefined, [
        "REVIEWS_API_KEY"
      ])
    ];
  }

  getClientConfig() {
    return {
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY || null,
      paypalClientId: process.env.PAYPAL_CLIENT_ID || null,
      metaPixelId: process.env.META_PIXEL_ID || null,
      ga4MeasurementId: process.env.GA4_MEASUREMENT_ID || null,
      gtmContainerId: process.env.GTM_CONTAINER_ID || null,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || null,
      recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY || null,
      whatsappPhoneNumber: process.env.WHATSAPP_PHONE_NUMBER || null
    };
  }

  async verifyRecaptcha(token: string, action?: string) {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) {
      return { configured: false, success: true, skipped: true };
    }
    if (!token) throw new Error("reCAPTCHA token is required");

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token
      })
    });
    const result = (await response.json()) as any;
    const minScore = Number(process.env.RECAPTCHA_MIN_SCORE || 0.5);
    return {
      configured: true,
      success:
        Boolean(result.success) &&
        Number(result.score || 0) >= minScore &&
        (!action || result.action === action),
      score: result.score,
      action: result.action,
      errors: result["error-codes"] || []
    };
  }

  async getShippingRateQuote(input: {
    provider?: string;
    destinationCountry?: string;
    destinationPostalCode?: string;
    weightKg?: number;
    subtotal?: number;
  }) {
    const provider = input.provider || "local_shipping";
    return {
      provider,
      configured: this.getStatuses().find((item) => item.key === provider)?.configured || false,
      destinationCountry: input.destinationCountry,
      destinationPostalCode: input.destinationPostalCode,
      weightKg: Number(input.weightKg || 0),
      subtotal: Number(input.subtotal || 0),
      estimatedAmount: 0,
      message: "Shipping API foundation is configured. Replace this placeholder with live carrier rate calls."
    };
  }
}
