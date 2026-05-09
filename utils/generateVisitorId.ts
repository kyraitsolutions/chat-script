const VISITOR_ID_KEY = "chatbot_visitor_id";

type GenerateVisitorIdOptions = {
  prefix?: string;
};

export const generateVisitorId = (
  options?: GenerateVisitorIdOptions,
): string => {
  if (typeof window === "undefined") {
    return "";
  }

  const prefix = options?.prefix || "vst";

  const visitorId = [
    prefix,
    Date.now().toString(36),
    crypto.randomUUID().replace(/-/g, ""),
  ].join("_");

  return visitorId;
};
