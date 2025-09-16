import {
  formatCurrency,
  formatDate,
  formatRelativeDate,
  formatScore,
  getScoreColor,
  getStatusColor,
  getSourceColor,
  capitalizeFirst,
  formatSource,
} from "../format";

describe("format utilities", () => {
  describe("formatCurrency", () => {
    it("should format positive numbers correctly", () => {
      expect(formatCurrency(1000)).toBe("$1,000");
      expect(formatCurrency(50000)).toBe("$50,000");
      expect(formatCurrency(1234567)).toBe("$1,234,567");
    });

    it("should format zero correctly", () => {
      expect(formatCurrency(0)).toBe("$0");
    });

    it("should handle null and undefined", () => {
      expect(formatCurrency(null)).toBe("N/A");
      expect(formatCurrency(undefined)).toBe("N/A");
    });

    it("should handle decimal numbers by rounding", () => {
      expect(formatCurrency(1000.99)).toBe("$1,001");
      expect(formatCurrency(1000.49)).toBe("$1,000");
    });
  });

  describe("formatDate", () => {
    it("should format valid date strings", () => {
      const dateString = "2024-01-15T10:30:00Z";
      const result = formatDate(dateString);
      expect(result).toMatch(/Jan 15, 2024, \d{2}:\d{2} (AM|PM)/);
    });

    it("should handle null and undefined", () => {
      expect(formatDate(null)).toBe("N/A");
      expect(formatDate(undefined)).toBe("N/A");
    });

    it("should handle empty string", () => {
      expect(formatDate("")).toBe("N/A");
    });
  });

  describe("formatRelativeDate", () => {
    beforeEach(() => {
      // Mock current date to 2024-01-15
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2024-01-15T12:00:00Z"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return "Today" for same day', () => {
      const today = "2024-01-15T10:00:00Z";
      expect(formatRelativeDate(today)).toBe("Today");
    });

    it('should return "Yesterday" for previous day', () => {
      const yesterday = "2024-01-14T10:00:00Z";
      expect(formatRelativeDate(yesterday)).toBe("Yesterday");
    });

    it("should return days ago for recent dates", () => {
      const threeDaysAgo = "2024-01-12T10:00:00Z";
      expect(formatRelativeDate(threeDaysAgo)).toBe("3 days ago");
    });

    it("should return weeks ago for dates within a month", () => {
      const twoWeeksAgo = "2024-01-01T10:00:00Z";
      expect(formatRelativeDate(twoWeeksAgo)).toBe("2 weeks ago");
    });

    it("should return months ago for dates within a year", () => {
      const twoMonthsAgo = "2023-11-15T10:00:00Z";
      expect(formatRelativeDate(twoMonthsAgo)).toBe("2 months ago");
    });

    it("should return years ago for older dates", () => {
      const twoYearsAgo = "2022-01-15T10:00:00Z";
      expect(formatRelativeDate(twoYearsAgo)).toBe("2 years ago");
    });

    it("should handle null and undefined", () => {
      expect(formatRelativeDate(null)).toBe("N/A");
      expect(formatRelativeDate(undefined)).toBe("N/A");
    });
  });

  describe("formatScore", () => {
    it("should format valid scores", () => {
      expect(formatScore(85)).toBe("85/100");
      expect(formatScore(0)).toBe("0/100");
      expect(formatScore(100)).toBe("100/100");
    });

    it("should handle null and undefined", () => {
      expect(formatScore(null)).toBe("N/A");
      expect(formatScore(undefined)).toBe("N/A");
    });
  });

  describe("getScoreColor", () => {
    it("should return correct colors for different score ranges", () => {
      expect(getScoreColor(95)).toBe("text-green-600 bg-green-100");
      expect(getScoreColor(85)).toBe("text-blue-600 bg-blue-100");
      expect(getScoreColor(75)).toBe("text-yellow-600 bg-yellow-100");
      expect(getScoreColor(65)).toBe("text-orange-600 bg-orange-100");
      expect(getScoreColor(55)).toBe("text-red-600 bg-red-100");
    });

    it("should handle null and undefined", () => {
      expect(getScoreColor(null)).toBe("text-gray-600 bg-gray-100");
      expect(getScoreColor(undefined)).toBe("text-gray-600 bg-gray-100");
    });
  });

  describe("getStatusColor", () => {
    it("should return correct colors for different statuses", () => {
      expect(getStatusColor("new")).toBe("text-blue-600 bg-blue-100");
      expect(getStatusColor("contacted")).toBe("text-purple-600 bg-purple-100");
      expect(getStatusColor("qualified")).toBe("text-green-600 bg-green-100");
      expect(getStatusColor("unqualified")).toBe("text-red-600 bg-red-100");
      expect(getStatusColor("converted")).toBe(
        "text-emerald-600 bg-emerald-100"
      );
    });

    it("should return default color for unknown status", () => {
      expect(getStatusColor("unknown")).toBe("text-gray-600 bg-gray-100");
    });
  });

  describe("getSourceColor", () => {
    it("should return correct colors for different sources", () => {
      expect(getSourceColor("website")).toBe("text-blue-600 bg-blue-100");
      expect(getSourceColor("referral")).toBe("text-green-600 bg-green-100");
      expect(getSourceColor("social-media")).toBe("text-pink-600 bg-pink-100");
      expect(getSourceColor("email-campaign")).toBe(
        "text-purple-600 bg-purple-100"
      );
      expect(getSourceColor("cold-call")).toBe("text-orange-600 bg-orange-100");
      expect(getSourceColor("trade-show")).toBe(
        "text-indigo-600 bg-indigo-100"
      );
      expect(getSourceColor("other")).toBe("text-gray-600 bg-gray-100");
    });

    it("should return default color for unknown source", () => {
      expect(getSourceColor("unknown")).toBe("text-gray-600 bg-gray-100");
    });
  });

  describe("capitalizeFirst", () => {
    it("should capitalize first letter", () => {
      expect(capitalizeFirst("hello")).toBe("Hello");
      expect(capitalizeFirst("world")).toBe("World");
    });

    it("should handle empty string", () => {
      expect(capitalizeFirst("")).toBe("");
    });

    it("should handle single character", () => {
      expect(capitalizeFirst("a")).toBe("A");
    });
  });

  describe("formatSource", () => {
    it("should format source strings correctly", () => {
      expect(formatSource("social-media")).toBe("Social Media");
      expect(formatSource("email-campaign")).toBe("Email Campaign");
      expect(formatSource("trade-show")).toBe("Trade Show");
      expect(formatSource("cold-call")).toBe("Cold Call");
    });

    it("should handle single words", () => {
      expect(formatSource("website")).toBe("Website");
      expect(formatSource("referral")).toBe("Referral");
    });
  });
});
