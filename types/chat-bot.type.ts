import { z } from "zod";

// NODES TYPES
const NodeTypesSchema = z.enum([
  "send_message",
  "button",
  "list",
  "question",
  "carousel",
]);

// NODE DATA BASE SCHEMA
export type TBaseNodeData<TType extends typeof NodeTypesSchema, TPayload> = {
  label: string;
  type: TType;
  payload: TPayload;
};

// MESSAGES TYPES
const HeaderTypes = z.enum(["text", "image", "video", "document"]);

// INTERACTIVE HEADER SCHEMA
export const HeaderSchema = z.object({
  type: HeaderTypes,
  text: z.string().optional(),
  image: z
    .object({
      link: z.string().optional(),

      id: z.string().optional(),
    })
    .optional(),
  video: z
    .object({
      link: z.string().optional(),
      id: z.string().optional(),
    })
    .optional(),
  document: z
    .object({
      link: z.string().optional(),
      id: z.string().optional(),
    })
    .optional(),
});

// INTERACTIVE FOOTER SCHEMA
export const FooterSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
});

// BUTTON NODE TYPES
const ChatbotQuickReplyButtonSchema = z.object({
  type: z.literal("quick_reply"),
  quick_reply: z.object({
    id: z.string(),
    title: z.string(),
  }),
});

const ChatbotReplyButtonSchema = z.object({
  type: z.literal("reply"),
  reply: z.object({
    id: z.string(),
    title: z.string(),
  }),
});

export const ChatbotQuickReplyUnionSchema = z.union([
  ChatbotQuickReplyButtonSchema,
  ChatbotReplyButtonSchema,
]);

export const ChatbotReplyButtonsActionSchema = z.object({
  buttons: z.array(ChatbotQuickReplyUnionSchema),
});

const ChatbotUrlButtonSchema = z.object({
  name: z.literal("cta_url"),
  parameters: z.object({
    display_text: z.string(),
    url: z.string(),
  }),
});

export const ActionSchema = z.union([
  ChatbotUrlButtonSchema,
  ChatbotReplyButtonsActionSchema,
]);

export const ButtonNodeDataPayloadSchema = z.object({
  type: z.literal("interactive"),
  interactive: z.object({
    type: z.literal("button"),
    header: HeaderSchema,
    body: z.object({
      text: z.string(),
    }),
    footer: FooterSchema,
    action: ActionSchema,
  }),
});

// LIST NODE TYPES
export const ListRowSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
});

// LIST SECTION
export const ListSectionSchema = z.object({
  title: z.string(),
  rows: z.array(ListRowSchema),
});

// LIST ACTION
export const ListActionSchema = z.object({
  button: z.string(),
  sections: z.array(ListSectionSchema),
});

// LIST NODE PAYLOAD
export const ListNodeDataPayloadSchema = z.object({
  type: z.literal("interactive"),
  interactive: z.object({
    type: z.literal("list"),
    header: HeaderSchema,
    body: z.object({
      text: z.string(),
    }),
    footer: FooterSchema,
    action: ListActionSchema,
  }),
});

// QUESTION NODE PAYLOAD
export const QuestionNodeDataPayloadSchema = z.object({
  type: z.literal("question"),
  question: z.object({
    inputType: z.enum(["text", "email", "phone", "date"]),
    text: z.string(),
  }),
});

// SEND MESSAGE NODE TYPES
export const SendMessageTextSchema = z.object({
  id: z.string(),
  type: z.literal("text"),
  content: z.string(),
});

export const SendMessageImageSchema = z.object({
  id: z.string().optional(),
  type: z.literal("image"),
  image: z.object({
    link: z.string(),
    caption: z.string().optional(),
  }),
});

export const SendMessageVideoSchema = z.object({
  id: z.string().optional(),
  type: z.literal("video"),
  video: z.object({
    link: z.string(),
  }),
});

export const SendMessageDocumentSchema = z.object({
  id: z.string().optional(),
  type: z.literal("document"),
  document: z.object({
    link: z.string(),
  }),
});

export const SendMessageNodeDataPayloadSchema = z.array(
  z.union([
    SendMessageTextSchema,
    SendMessageImageSchema,
    SendMessageVideoSchema,
    SendMessageDocumentSchema,
  ]),
);

// export const ChatbotNodePayloadSchema = z.union([
//   SendMessageNodeDataPayloadSchema,
//   ButtonNodeDataPayloadSchema,
// ]);

/* -------------------------
   Node data schema
   ------------------------- */
const SendMessageNodeDataSchema = z.object({
  label: z.string(),
  type: z.literal("send_message"),
  payload: SendMessageNodeDataPayloadSchema,
});

const ButtonNodeDataSchema = z.object({
  label: z.string(),
  type: z.literal("button"),
  payload: ButtonNodeDataPayloadSchema,
});

const listNodeDataSchema = z.object({
  label: z.string(),
  type: z.literal("list"),
  payload: ListNodeDataPayloadSchema,
});

const questionNodeDataSchema = z.object({
  label: z.string(),
  type: z.literal("question"),
  payload: QuestionNodeDataPayloadSchema,
});

export const CarouselHeaderSchema = z.union([
  z.object({
    type: z.literal("image"),
    image: z.object({
      link: z.string(),
    }),
  }),

  z.object({
    type: z.literal("video"),
    video: z.object({
      link: z.string(),
    }),
  }),
]);

export const CarouselCardSchema = z.object({
  card_index: z.number(),

  header: CarouselHeaderSchema,

  body: z.object({
    text: z.string(),
  }),

  action: ActionSchema,
});

export const CarouselNodeDataPayloadSchema = z.object({
  type: z.literal("interactive"),
  interactive: z.object({
    type: z.literal("carousel"),

    body: z.object({
      text: z.string(),
    }),

    action: z.object({
      cards: z.array(CarouselCardSchema),
    }),
  }),
});

export const CarouselNodeDataSchema = z.object({
  label: z.string(),
  type: z.literal("carousel"),
  payload: CarouselNodeDataPayloadSchema,
});

export const ChatbotNodeDataSchema = z.discriminatedUnion("type", [
  SendMessageNodeDataSchema,
  ButtonNodeDataSchema,
  listNodeDataSchema,
  questionNodeDataSchema,
  CarouselNodeDataSchema,
]);

/* -------------------------
   Node schema
  ------------------------- */
export const ChatbotNodeSchema = z.object({
  id: z.string(), // use UUID from frontend
  type: z.enum(["send_message", "button", "list", "question", "carousel"]),
  position: z
    .object({
      x: z.number().default(0),
      y: z.number().default(0),
    })
    .default({ x: 0, y: 0 }),
  width: z.number().optional().default(250),
  height: z.number().optional().default(100),
  selected: z.boolean().optional().default(false),
  dragging: z.boolean().optional().default(false),
  data: ChatbotNodeDataSchema,
});

/* -------------------------
   Edge schema   ------------------------- */
export const ChatbotEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  animated: z.boolean().optional().default(false),
  sourceHandle: z.string().nullable().optional().default(null),
  targetHandle: z.string().nullable().optional().default(null),
});

// chatbot flow types
export const ChatbotFlowSchema = z.object({
  nodes: z.array(ChatbotNodeSchema).default([]),
  edges: z.array(ChatbotEdgeSchema).default([]),
});

// chatbot theme
export const ChatbotThemeSchema = z.object({
  brandColor: z.string().default("#3b5d50"),
  contrastColor: z.string().default("#fefefe"),
  backgroundColor: z.string().default("#ffffff"),

  messageColor: z.string().default("#f1f5f9"),
  userMessageColor: z.string().default("#3b5d50"),

  typeface: z.string().default("Inter"),
  fontSize: z.number().default(14),
  fontWeight: z.string().default("normal"),

  avatarStyle: z.string().default("bubble"),
  avatarUrl: z.string().optional(),
  showAvatar: z.boolean().default(true),

  roundedCorners: z.boolean().default(true),
  borderWidth: z.number().default(1),
  borderColor: z.string().default("#e2e8f0"),

  widgetPosition: z
    .enum(["bottom-right", "bottom-left", "top-right", "top-left"])
    .default("bottom-right"),

  showLauncher: z.boolean().default(true),
  launcherLabel: z.string().default(""),
  launcherSize: z.number().default(56),

  messageAlignment: z.enum(["left", "right"]).default("left"),
  showTimestamps: z.boolean().default(true),

  animationStyle: z.enum(["slide", "fade", "scale"]).default("slide"),
  shadowIntensity: z.number().min(0).max(100).default(20),
  opacity: z.number().min(0).max(100).default(100),

  customCSS: z.string().default(""),
});

// Chatbot Data Schema
export const ZChatBotSchema = z.object({
  name: z.string().min(3, "Name is required and must be at least 3 characters"),
  description: z.string().default("Best chatbot to generate leads."),
  status: z.boolean().default(true),
  userId: z.string(),
  accountId: z.string().nullable().optional(),

  // --- Config Section ---
  config: z.object({
    showTypingIndicator: z.boolean().default(true),
    enableWidgetMessage: z.boolean().default(true),

    widgetMessageOnline: z
      .object({
        content: z.string().default("Hey there!"),
        subHeading: z.string().default("How can we help you?"),
      })
      .default({ content: "Hey there!", subHeading: "How can we help you?" }),

    widgetMessageOffline: z
      .object({
        content: z.string().default("We're offline"),
        subHeading: z.string().default("Leave a message"),
      })
      .default({ content: "We're offline", subHeading: "Leave a message" }),

    language: z.enum(["english", "hindi"]).default("english"),
    enableRantingAndFeedback: z.boolean().default(true),

    ratingAndFeedback: z
      .object({
        rating: z.number().min(1).max(5).default(5),
        feedback: z.string().optional().default(""),
      })
      .default({ rating: 5, feedback: "" }),

    chat_transcript: z.boolean().default(true),
    enableVoiceNote: z.boolean().default(false),
    responseInterval: z
      .union([z.literal(0), z.literal(1), z.literal(2), z.number().int()])
      .default(0),
    initiateChatbot: z.enum(["immediate", "action", ""]).default("immediate"),
    showBranding: z.boolean().default(true),
  }),

  // --- Theme Section ---
  theme: ChatbotThemeSchema,

  // --- Conversation Section ---
  conversation: z.object({
    welcomeMessage: z.string().default("Hello! How can I help you today?"),
    fallbackMessage: z
      .string()
      .default(
        "I apologize, but I didn't understand that. Could you please rephrase your question?",
      ),
    showWelcomeMessage: z.boolean().default(true),
    thankyouMessage: z
      .string()
      .default(
        "It's been a pleasure chatting with you today, Please take a moment to drop us your rating",
      ),
    waitingMessage: z
      .string()
      .default(
        "Please wait while we connect you to our support representative",
      ),
  }),

  flow: ChatbotFlowSchema.default({ nodes: [], edges: [] }),
});

/* -------------------------
   Export TypeScript types   ------------------------- */
export type TChatbotTheme = z.infer<typeof ChatbotThemeSchema>;
export type TChatbotNode = z.infer<typeof ChatbotNodeSchema>;
export type TChatbotEdge = z.infer<typeof ChatbotEdgeSchema>;
export type TChatBotData = z.infer<typeof ZChatBotSchema>;
// export type TCreateChatBot = z.infer<typeof ZChatBotSchema>;
// export type TUpdateChatBot = z.infer<typeof ZChatBotSchema>;
// export type TCreateChatBotFlow = z.infer<typeof CreateChatBotFlowSchema>;
