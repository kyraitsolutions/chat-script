(function () {
  const iframe = document.createElement("iframe");

  iframe.src = "http://localhost:3001";
  iframe.id = "chatbot-iframe";
  iframe.title = "Chatbot";
  iframe.classList.add("hide-scrollbar");
  iframe.style.border = "none";
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  const isMobile = window.innerWidth <= 768;
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
          const positionWidget = event?.data?.payload?.position;
          iframe.style.display = "block";
          iframe.setAttribute(
            "style",
            "position: fixed; width:60px; height:60px; backgrond:transparent; box-shadow:none padding:2px; border:none; z-index:99999999;"
          );

          if (positionWidget.toLowerCase() === "bottom-right") {
            iframe.style.right = "20px";
            iframe.style.bottom = "20px";
          } else if (positionWidget.toLowerCase() === "bottom-left") {
            iframe.style.left = "20px";
            iframe.style.bottom = "20px";
          } else if (positionWidget.toLowerCase() === "top-right") {
            iframe.style.right = "20px";
            iframe.style.top = "20px";
          } else {
            iframe.style.left = "20px";
            iframe.style.top = "20px";
          }
        }
      } else {
        iframe.style.display = "none";
      }

      try {
        iframe.contentWindow?.postMessage(
          {
            type: "CHATBOT_INIT",
            payload: { ...window.eazbotConfig } || {},
          },
          "*"
        );
      } catch (error) {
        console.log(error);
      }
    }
  });
})();
