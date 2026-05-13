import { TChatbotNode } from "@/types/chat-bot.type";
import { generateMessageId } from "@/utils/generateMessageId";

export const parseNodeToMessages = (node: TChatbotNode) => {
  switch (node.data.type) {
    case "send_message": {
      return node?.data?.payload
        ?.map((item) => {
          switch (item.type) {
            case "text":
              return {
                messageId: generateMessageId({
                  platform: "chatbot",
                  direction: "outbound",
                  type: "text",
                }),
                from: "bot",
                type: "text",
                body: {
                  text: item.content,
                },
                status: "delivered",
                direction: "outbound",
                platform: "chatbot",
              };

            case "image":
              return {
                messageId: generateMessageId({
                  platform: "chatbot",
                  direction: "outbound",
                  type: "image",
                }),
                from: "bot",
                type: "image",
                media: {
                  type: "image",
                  image: {
                    link: item.image.link,
                    caption: item.image.caption,
                  },
                },
                status: "delivered",
                direction: "outbound",
                platform: "chatbot",
              };

            case "video":
              return {
                messageId: generateMessageId({
                  platform: "chatbot",
                  direction: "outbound",
                  type: "video",
                }),
                from: "bot",
                type: "video",
                media: {
                  type: "video",
                  video: {
                    link: item.video.link,
                  },
                },
                status: "delivered",
                direction: "outbound",
                platform: "chatbot",
              };

            case "document":
              return {
                messageId: generateMessageId({
                  platform: "chatbot",
                  direction: "outbound",
                  type: "document",
                }),
                from: "bot",
                type: "document",
                media: {
                  type: "document",
                  document: {
                    link: item.document.link,
                  },
                },
                status: "delivered",
                direction: "outbound",
                platform: "chatbot",
              };

            default:
              return undefined;
          }
        })
        .filter(
          (message): message is NonNullable<typeof message> =>
            message !== undefined,
        );
    }

    case "button": {
      const interactive = node.data.payload.interactive;
      return [
        {
          messageId: generateMessageId({
            platform: "chatbot",
            direction: "outbound",
            type: "interactive",
          }),
          from: "bot",
          type: "interactive",
          interactive: {
            type: "button",
            header: interactive.header,
            body: interactive.body,
            footer: interactive.footer,
            action: interactive.action,
          },
          status: "delivered",
          direction: "outbound",
          platform: "chatbot",
        },
      ];
    }

    case "list": {
      const interactive = node.data.payload.interactive;
      return [
        {
          messageId: generateMessageId({
            platform: "chatbot",
            direction: "outbound",
            type: "interactive",
          }),
          from: "bot",
          type: "interactive",
          interactive: {
            type: "list",
            header: interactive.header,
            body: interactive.body,
            footer: interactive.footer,
            action: interactive.action,
          },
          status: "delivered",
          direction: "outbound",
          platform: "chatbot",
        },
      ];
    }

    case "carousel": {
      const interactive = node.data.payload.interactive;
      return [
        {
          messageId: generateMessageId({
            platform: "chatbot",
            direction: "outbound",
            type: "interactive",
          }),

          from: "bot",
          type: "interactive",

          interactive: {
            type: "carousel",
            body: interactive.body,
            action: {
              cards: interactive.action.cards,
            },
          },

          status: "delivered",

          direction: "outbound",

          platform: "chatbot",
        },
      ];
    }

    case "question": {
      return [
        {
          messageId: generateMessageId({
            platform: "chatbot",
            direction: "outbound",
            type: "question",
          }),
          from: "bot",
          type: "question",
          body: { text: node.data.payload.question.text || "" },
          question: {
            text: node.data.payload.question.text || "",
            inputType: node.data.payload.question.inputType,
          },
          status: "delivered",
          direction: "outbound",
          platform: "chatbot",
        },
      ];
    }

    default:
      return [];
  }
};
