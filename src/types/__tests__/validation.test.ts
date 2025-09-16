import {
  validateEmail,
  validateLead,
  validateOpportunity,
  createLead,
  createOpportunity,
  LeadStatus,
  LeadSource,
  OpportunityStage,
} from "../index";

describe("validation functions", () => {
  describe("validateEmail", () => {
    it("should validate correct email formats", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user.name@domain.co.uk")).toBe(true);
      expect(validateEmail("test+tag@example.org")).toBe(true);
    });

    it("should reject invalid email formats", () => {
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
      expect(validateEmail("test@")).toBe(false);
      expect(validateEmail("")).toBe(false);
      expect(validateEmail("test@.com")).toBe(false);
      expect(validateEmail("test.example.com")).toBe(false);
    });
  });

  describe("validateLead", () => {
    it("should validate a complete lead", () => {
      const lead = {
        name: "John Doe",
        company: "Acme Corp",
        email: "john@acme.com",
        score: 85,
      };

      const result = validateLead(lead);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should require name", () => {
      const lead = {
        company: "Acme Corp",
        email: "john@acme.com",
        score: 85,
      };

      const result = validateLead(lead);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Name is required");
    });

    it("should require company", () => {
      const lead = {
        name: "John Doe",
        email: "john@acme.com",
        score: 85,
      };

      const result = validateLead(lead);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Company is required");
    });

    it("should require email", () => {
      const lead = {
        name: "John Doe",
        company: "Acme Corp",
        score: 85,
      };

      const result = validateLead(lead);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Email is required");
    });

    it("should validate email format", () => {
      const lead = {
        name: "John Doe",
        company: "Acme Corp",
        email: "invalid-email",
        score: 85,
      };

      const result = validateLead(lead);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Email format is invalid");
    });

    it("should validate score range", () => {
      const lead = {
        name: "John Doe",
        company: "Acme Corp",
        email: "john@acme.com",
        score: 150,
      };

      const result = validateLead(lead);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Score must be between 0 and 100");
    });

    it("should accept score of 0", () => {
      const lead = {
        name: "John Doe",
        company: "Acme Corp",
        email: "john@acme.com",
        score: 0,
      };

      const result = validateLead(lead);
      expect(result.isValid).toBe(true);
    });

    it("should accept score of 100", () => {
      const lead = {
        name: "John Doe",
        company: "Acme Corp",
        email: "john@acme.com",
        score: 100,
      };

      const result = validateLead(lead);
      expect(result.isValid).toBe(true);
    });

    it("should handle multiple validation errors", () => {
      const lead = {
        name: "",
        company: "",
        email: "invalid",
        score: 150,
      };

      const result = validateLead(lead);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(4);
      expect(result.errors).toContain("Name is required");
      expect(result.errors).toContain("Company is required");
      expect(result.errors).toContain("Email format is invalid");
      expect(result.errors).toContain("Score must be between 0 and 100");
    });
  });

  describe("validateOpportunity", () => {
    it("should validate a complete opportunity", () => {
      const opportunity = {
        name: "Deal with Acme Corp",
        accountName: "Acme Corp",
        amount: 50000,
      };

      const result = validateOpportunity(opportunity);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should require name", () => {
      const opportunity = {
        accountName: "Acme Corp",
        amount: 50000,
      };

      const result = validateOpportunity(opportunity);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Name is required");
    });

    it("should require account name", () => {
      const opportunity = {
        name: "Deal with Acme Corp",
        amount: 50000,
      };

      const result = validateOpportunity(opportunity);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Account name is required");
    });

    it("should validate amount as positive number", () => {
      const opportunity = {
        name: "Deal with Acme Corp",
        accountName: "Acme Corp",
        amount: -1000,
      };

      const result = validateOpportunity(opportunity);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Amount must be a positive number");
    });

    it("should accept null amount", () => {
      const opportunity = {
        name: "Deal with Acme Corp",
        accountName: "Acme Corp",
        amount: null,
      };

      const result = validateOpportunity(opportunity);
      expect(result.isValid).toBe(true);
    });

    it("should accept undefined amount", () => {
      const opportunity = {
        name: "Deal with Acme Corp",
        accountName: "Acme Corp",
      };

      const result = validateOpportunity(opportunity);
      expect(result.isValid).toBe(true);
    });
  });

  describe("createLead", () => {
    it("should create a lead with default values", () => {
      const lead = createLead({});

      expect(lead.id).toBeDefined();
      expect(lead.name).toBe("");
      expect(lead.company).toBe("");
      expect(lead.email).toBe("");
      expect(lead.source).toBe(LeadSource.OTHER);
      expect(lead.score).toBe(0);
      expect(lead.status).toBe(LeadStatus.NEW);
      expect(lead.createdAt).toBeDefined();
      expect(lead.updatedAt).toBeDefined();
    });

    it("should create a lead with provided values", () => {
      const data = {
        id: "123",
        name: "John Doe",
        company: "Acme Corp",
        email: "john@acme.com",
        source: LeadSource.WEBSITE,
        score: 85,
        status: LeadStatus.QUALIFIED,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z",
      };

      const lead = createLead(data);
      expect(lead).toEqual(data);
    });
  });

  describe("createOpportunity", () => {
    const mockLead = {
      id: "lead-123",
      name: "John Doe",
      company: "Acme Corp",
      email: "john@acme.com",
      source: LeadSource.WEBSITE,
      score: 85,
      status: LeadStatus.QUALIFIED,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-02T00:00:00Z",
    };

    it("should create an opportunity with default values from lead", () => {
      const opportunity = createOpportunity(mockLead);

      expect(opportunity.id).toBeDefined();
      expect(opportunity.name).toBe(mockLead.name);
      expect(opportunity.stage).toBe(OpportunityStage.PROSPECTING);
      expect(opportunity.amount).toBe(null);
      expect(opportunity.accountName).toBe(mockLead.company);
      expect(opportunity.leadId).toBe(mockLead.id);
      expect(opportunity.createdAt).toBeDefined();
      expect(opportunity.updatedAt).toBeDefined();
    });

    it("should create an opportunity with provided values", () => {
      const data = {
        id: "opp-123",
        name: "Custom Deal Name",
        stage: OpportunityStage.PROPOSAL,
        amount: 100000,
        accountName: "Custom Account",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z",
      };

      const opportunity = createOpportunity(mockLead, data);
      expect(opportunity).toEqual({
        ...data,
        leadId: mockLead.id,
      });
    });
  });
});
