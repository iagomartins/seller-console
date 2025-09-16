// Lead and Opportunity type definitions

export enum LeadStatus {
  NEW = "new",
  CONTACTED = "contacted",
  QUALIFIED = "qualified",
  UNQUALIFIED = "unqualified",
  CONVERTED = "converted",
}

export enum OpportunityStage {
  PROSPECTING = "prospecting",
  QUALIFICATION = "qualification",
  PROPOSAL = "proposal",
  NEGOTIATION = "negotiation",
  CLOSED_WON = "closed-won",
  CLOSED_LOST = "closed-lost",
}

export enum LeadSource {
  WEBSITE = "website",
  REFERRAL = "referral",
  SOCIAL_MEDIA = "social-media",
  EMAIL_CAMPAIGN = "email-campaign",
  COLD_CALL = "cold-call",
  TRADE_SHOW = "trade-show",
  OTHER = "other",
}

// Type definitions
export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  source: LeadSource;
  score: number;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Opportunity {
  id: string;
  name: string;
  stage: OpportunityStage;
  amount: number | null;
  accountName: string;
  leadId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFilters {
  status: string;
  source: string;
}

export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Factory functions
export const createLead = (data: Partial<Lead>): Lead => ({
  id: data.id || Date.now().toString(),
  name: data.name || "",
  company: data.company || "",
  email: data.email || "",
  source: data.source || LeadSource.OTHER,
  score: data.score || 0,
  status: data.status || LeadStatus.NEW,
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: data.updatedAt || new Date().toISOString(),
});

export const createOpportunity = (
  lead: Lead,
  data: Partial<Opportunity> = {}
): Opportunity => ({
  id: data.id || Date.now().toString(),
  name: data.name || lead.name,
  stage: data.stage || OpportunityStage.PROSPECTING,
  amount: data.amount || null,
  accountName: data.accountName || lead.company,
  leadId: lead.id,
  createdAt: data.createdAt || new Date().toISOString(),
  updatedAt: data.updatedAt || new Date().toISOString(),
});

// Validation functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateLead = (lead: Partial<Lead>): ValidationResult => {
  const errors: string[] = [];

  if (!lead.name?.trim()) {
    errors.push("Name is required");
  }

  if (!lead.company?.trim()) {
    errors.push("Company is required");
  }

  if (!lead.email?.trim()) {
    errors.push("Email is required");
  } else if (!validateEmail(lead.email)) {
    errors.push("Email format is invalid");
  }

  if (lead.score !== undefined && (lead.score < 0 || lead.score > 100)) {
    errors.push("Score must be between 0 and 100");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateOpportunity = (
  opportunity: Partial<Opportunity>
): ValidationResult => {
  const errors: string[] = [];

  if (!opportunity.name?.trim()) {
    errors.push("Name is required");
  }

  if (!opportunity.accountName?.trim()) {
    errors.push("Account name is required");
  }

  if (
    opportunity.amount !== null &&
    opportunity.amount !== undefined &&
    (isNaN(opportunity.amount) || opportunity.amount < 0)
  ) {
    errors.push("Amount must be a positive number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
