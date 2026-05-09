"use client";

import { BookOpen, MessageCircle, Newspaper, Sparkles } from "lucide-react";

import { useChatbotContext } from "@/context/ChatbotContext";

const suggestions = [
  "How does pricing work?",
  "Latest product updates",
  "Talk to support",
  "Read documentation",
];

const features = [
  {
    title: "Docs",
    icon: BookOpen,
    description: "Explore guides & APIs",
  },
  {
    title: "News",
    icon: Newspaper,
    description: "Latest updates",
  },
  {
    title: "Chat",
    icon: MessageCircle,
    description: "Ask anything instantly",
  },
];

const ChatHome = () => {
  const { chatbotData } = useChatbotContext();

  return (
    <div className="h-full overflow-y-auto px-4 py-5 space-y-6 hide-scrollbar">
      {/* HERO */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div
            style={{
              backgroundColor: chatbotData?.theme?.backgroundColor || "#1b181b",
            }}
            className="size-10 rounded-full flex items-center justify-center text-white"
          >
            <Sparkles size={18} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">Hi there 👋</h2>

            <p className="text-sm text-gray-500">How can we help you today?</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        style={{
          backgroundColor: chatbotData?.theme?.backgroundColor || "#1b181b",
        }}
        className="
          w-full text-white py-3.5 rounded-2xl
          font-medium shadow-sm
          hover:opacity-90 transition
        "
      >
        Ask a question
      </button>

      {/* QUICK SUGGESTIONS */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">
          Suggested questions
        </h3>

        <div className="grid gap-2">
          {suggestions.map((item) => (
            <button
              key={item}
              className="
                text-left px-4 py-3 rounded-xl
                border border-gray-200
                bg-white
                hover:bg-gray-50
                transition
                text-sm text-gray-700
              "
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      {/* <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Explore</h3>

        <div className="grid grid-cols-3 gap-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <button
                key={feature.title}
                className="
                  bg-white border border-gray-200
                  rounded-2xl p-3
                  flex flex-col items-start gap-2
                  hover:bg-gray-50
                  transition
                "
              >
                <div
                  style={{
                    backgroundColor:
                      chatbotData?.theme?.backgroundColor || "#1b181b",
                  }}
                  className="
                    size-9 rounded-xl
                    flex items-center justify-center
                    text-white
                  "
                >
                  <Icon size={16} />
                </div>

                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800">
                    {feature.title}
                  </p>

                  <p className="text-xs text-gray-500 line-clamp-2">
                    {feature.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div> */}

      {/* FOOTER CARD */}
      <div
        className="
          rounded-2xl border border-gray-200
          bg-linear-to-br from-gray-50 to-white
          p-4
        "
      >
        <p className="text-sm font-medium text-gray-800">Need quick help?</p>

        <p className="text-xs text-gray-500 mt-1">
          Ask anything about products, pricing, integrations, or support.
        </p>
      </div>
    </div>
  );
};

export default ChatHome;

// "use client";

// import { useChatbotContext } from "@/context/ChatbotContext";

// const ChatHome = () => {
//   const { chatbotData } = useChatbotContext();

//   return (
//     <div className="p-4 space-y-4">
//       <h2 className="text-lg font-semibold">Hi there 👋</h2>

//       <p className="text-sm text-gray-600">
//         Explore Docs, News or Chat with us
//       </p>

//       <button
//         style={{
//           backgroundColor: chatbotData?.theme?.backgroundColor || "#1b181b",
//         }}
//         // onClick={() => setView("CHAT")}
//         className="w-full text-white py-3 rounded-md font-medium"
//       >
//         Ask a question
//       </button>
//     </div>
//   );
// };

// export default ChatHome;
