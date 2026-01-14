(function () {
  const iframe = document.createElement("iframe");
  // iframe.src = "http://localhost:3001"; // for local testing
  iframe.src = "https://chatbot.kyraitsolutions.com"; // for local testing
  // iframe.sandbox = "allow-scripts allow-same-origin allow-popups";
  iframe.title = "Chatbot";
  iframe.id = "chatbot-iframe";

  const isMobile = window.innerWidth <= 768;

  document.body.appendChild(iframe);

  const parentDoc = window.parent.document;
  const parentBody = parentDoc.body;

  window.addEventListener("message", (event) => {
    if (event.data?.type === "CHATBOT_READY") {
      if (event?.data?.payload?.active) {
        if (event?.data?.payload?.chatbotOpen) {
          if (isMobile) {
            // Mobile-specific styles
            // iframe.style.position = "fixed";
            iframe.style.width = "100vw";
            iframe.style.height = `${window.visualViewport.height}px`;
            // iframe.style.height = "100%";

            iframe.style.top = "0px";
            iframe.style.right = "0";
            iframe.style.left = "0";
            // iframe.style.borderRadius = "0";
            iframe.style.paddingTop = "env(safe-area-inset-top)";
            parentBody.style.overflow = "hidden";
          } else {
            // Desktop styles
            iframe.style.width = "360px";
            iframe.style.height = "540px";
            iframe.style.bottom = "8px";
            iframe.style.right = "12px";
          }
        } else {
          iframe.setAttribute(
            "style",
            "position: fixed; right:30px; bottom:50px; z-index:99999999; width: 78px; height: 88px; display:flex; justify-content: center; align-items: center;"
          );
          parentBody.style.overflow = "auto";
        }
      } else {
        iframe.style.display = "none";
      }

      try {
        const remarkUrl = encodeURI(window.location.href);
        iframe.contentWindow?.postMessage(
          {
            type: "CHATBOT_INIT",
            payload: { remarkUrl, ...window.eazbotConfig } || {},
          },
          "*"
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      iframe.style.right = "20px";
    }
  });
})();
