// Formatting utilities

export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
};

export const formatRelativeDate = (
  dateString: string | null | undefined
): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

export const formatScore = (score: number | null | undefined): string => {
  if (score === null || score === undefined) return "N/A";
  return `${score}/100`;
};

export const getScoreColor = (score: number | null | undefined): string => {
  if (score === null || score === undefined) return "text-gray-600 bg-gray-100";
  if (score >= 90) return "text-green-600 bg-green-100";
  if (score >= 80) return "text-blue-600 bg-blue-100";
  if (score >= 70) return "text-yellow-600 bg-yellow-100";
  if (score >= 60) return "text-orange-600 bg-orange-100";
  return "text-red-600 bg-red-100";
};

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    new: "text-blue-600 bg-blue-100",
    contacted: "text-purple-600 bg-purple-100",
    qualified: "text-green-600 bg-green-100",
    unqualified: "text-red-600 bg-red-100",
    converted: "text-emerald-600 bg-emerald-100",
  };
  return statusColors[status] || "text-gray-600 bg-gray-100";
};

export const getSourceColor = (source: string): string => {
  const sourceColors: Record<string, string> = {
    website: "text-blue-600 bg-blue-100",
    referral: "text-green-600 bg-green-100",
    "social-media": "text-pink-600 bg-pink-100",
    "email-campaign": "text-purple-600 bg-purple-100",
    "cold-call": "text-orange-600 bg-orange-100",
    "trade-show": "text-indigo-600 bg-indigo-100",
    other: "text-gray-600 bg-gray-100",
  };
  return sourceColors[source] || "text-gray-600 bg-gray-100";
};

export const capitalizeFirst = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatSource = (source: string): string => {
  return source
    .split("-")
    .map((word) => capitalizeFirst(word))
    .join(" ");
};
