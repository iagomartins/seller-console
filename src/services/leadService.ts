import {
  validateLead,
  Lead,
  Opportunity,
  LeadFilters,
  OpportunityStage,
  LeadStatus,
  SortOptions,
} from "../types";
import { generateMockLeads } from "../data/generateMockData";

// Simulate API delay
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

class LeadService {
  private leads: Lead[];
  private opportunities: Opportunity[];

  constructor() {
    this.leads = generateMockLeads(100);
    this.opportunities = this.leads
      .filter((lead: Lead) => lead.status === LeadStatus.CONVERTED)
      .map((lead: Lead) => ({
        id: `${lead.id}-opp`,
        name: lead.name,
        stage: OpportunityStage.PROSPECTING,
        amount: null,
        accountName: lead.company,
        leadId: lead.id,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
      }));
  }

  async getLeads(): Promise<Lead[]> {
    await delay(300); // Simulate network delay
    return [...this.leads];
  }

  async getLeadById(id: string): Promise<Lead | null> {
    await delay(200);
    return this.leads.find((lead) => lead.id === id) || null;
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    await delay(500); // Simulate network delay

    const leadIndex = this.leads.findIndex((lead) => lead.id === id);
    if (leadIndex === -1) {
      throw new Error("Lead not found");
    }

    const updatedLead = {
      ...this.leads[leadIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Validate the complete lead after update
    const validation = validateLead(updatedLead);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    this.leads[leadIndex] = updatedLead;
    return updatedLead;
  }

  async convertToOpportunity(
    leadId: string,
    opportunityData: Partial<Opportunity> = {}
  ): Promise<Opportunity> {
    await delay(800); // Simulate longer processing time

    const lead = this.leads.find((l) => l.id === leadId);
    if (!lead) {
      throw new Error("Lead not found");
    }

    const opportunity: Opportunity = {
      id: Date.now().toString(),
      name: opportunityData.name || lead.name,
      stage: opportunityData.stage || ("prospecting" as any),
      amount: opportunityData.amount || null,
      accountName: opportunityData.accountName || lead.company,
      leadId: lead.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.opportunities.push(opportunity);

    // Update lead status to converted
    await this.updateLead(leadId, { status: "converted" as any });

    return opportunity;
  }

  async getOpportunities(): Promise<Opportunity[]> {
    await delay(200);
    return [...this.opportunities];
  }

  async searchLeads(
    query: string,
    filters: LeadFilters = { status: "", source: "" },
    sortOptions: SortOptions
  ): Promise<Lead[]> {
    await delay(300);

    let filteredLeads = [...this.leads];

    // Apply search query
    if (query) {
      const searchTerm = query.toLowerCase();
      filteredLeads = filteredLeads.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm) ||
          lead.company.toLowerCase().includes(searchTerm) ||
          lead.email.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    if (filters.status) {
      filteredLeads = filteredLeads.filter(
        (lead) => lead.status === filters.status
      );
    }

    // Apply source filter
    if (filters.source) {
      filteredLeads = filteredLeads.filter(
        (lead) => lead.source === filters.source
      );
    }

    // Dynamic sorting based on sortOptions
    filteredLeads.sort((a, b) => {
      let aValue: any = a[sortOptions.field as keyof Lead];
      let bValue: any = b[sortOptions.field as keyof Lead];

      // Handle null/undefined values
      if (aValue == null) aValue = sortOptions.field === "score" ? 0 : "";
      if (bValue == null) bValue = sortOptions.field === "score" ? 0 : "";

      // Convert to strings for comparison if not numbers
      if (sortOptions.field !== "score") {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (sortOptions.direction === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filteredLeads;
  }

  // Simulate random failures for testing error handling
  async simulateFailure(): Promise<void> {
    await delay(200);
    if (Math.random() < 0.3) {
      // 30% chance of failure
      throw new Error("Simulated network error");
    }
  }
}

export const leadService = new LeadService();
