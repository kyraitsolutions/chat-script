export const FIELD_PATTERNS = [
  {
    key: "name",
    regex: /(your name|full name|may i know your name|what is your name)/i,
  },
  {
    key: "email",
    regex: /(your email|email address|what is your email)/i,
  },
  {
    key: "phone",
    regex: /(phone|contact number|mobile number|what is your phone)/i,
  },
];

export const detectFieldFromQuestion = (question: string) => {
  for (const fp of FIELD_PATTERNS) {
    if (fp.regex.test(question)) return fp.key;
  }
  return null; // this is a custom field question
};
