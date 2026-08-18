// ─────────────────────────────────────────────────────────────────────────
// Business & legal details shown across the policy / about / contact pages.
// Single source of truth — edit here, every page updates.
//
// These documents are a solid, tailored starting point — have a qualified
// Indian lawyer review them before you fully rely on them.
// ─────────────────────────────────────────────────────────────────────────

export const LEGAL = {
  brandName: "Under ₹999",
  websiteName: "naidoolife.com",
  websiteUrl: "https://naidoolife.com",

  // Operating company
  businessName: "NAIDOO LIFEWAYS PRIVATE LIMITED",
  tradeName: "NAIDOO LIFEWAYS",
  gstNumber: "24AALCN5795M1ZN",
  registeredAddress:
    "401, Magnus Saptarsinh, Saptarsinh Society, Alkapuri, Vadodara, Gujarat – 390007, India",

  // Public support contact
  supportEmail: "baliram2506yadav@gmail.com",
  supportPhone: "+91 99253 32228",
  supportHours: "Monday–Saturday, 10:00 AM – 6:00 PM IST",

  // Grievance Officer (mandatory under IT Rules & DPDP Act).
  grievanceOfficerName: "Harsh Pandey",
  grievanceEmail: "baliram2506yadav@gmail.com",

  // Dispute jurisdiction
  governingCity: "Vadodara",
  governingState: "Gujarat",

  lastUpdated: "20 July 2026",

  // ── Fulfilment specifics (aligned with the group's policy) ──
  dispatchHours: 48, // orders dispatched within this many hours if in stock
  deliveryMetro: "1–3 working days",
  deliveryOther: "3–5 working days",
  deliveryEstimate: "1–5 working days",
  defectReportHours: 48, // report damaged/defective within this window
  wrongItemReturnDays: 2, // wrong-item return window
  companyCancelRefundDays: "10 working days",
  freeShippingThreshold: 399,

  // ── Data retention ──
  dataRetentionYears: 8, // order/tax records kept up to this many years
} as const;
