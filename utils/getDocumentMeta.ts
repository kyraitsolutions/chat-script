import { FileSpreadsheet, FileText } from "lucide-react";
import { FaFilePdf } from "react-icons/fa";
export const getDocumentMeta = (url: string) => {
  const extension = url.split(".").pop()?.toLowerCase() || "";

  switch (extension.toLowerCase()) {
    case "pdf":
      return {
        label: "PDF",
        icon: FaFilePdf,
        cardClass: "file-card pdf",
        accentColor: "#E24B4A",
        iconColor: "#E24B4A",
        badgeBg: "#FCEBEB",
        badgeText: "#A32D2D",
      };

    case "doc":
    case "docx":
      return {
        label: "WORD",
        icon: FileText,
        iconColor: "#378ADD",
        badgeBg: "#E6F1FB",
        badgeText: "#185FA5",
      };

    case "xls":
    case "xlsx":
    case "csv":
      return {
        label: "SHEET",
        icon: FileSpreadsheet,
        cardClass: "file-card sheet",
        accentColor: "#1D9E75",
        iconColor: "#1D9E75",
        badgeBg: "#E1F5EE",
        badgeText: "#0F6E56",
      };

      return {
        label: "CODE",
        cardClass: "file-card code",
        accentColor: "#D4537E",
        iconColor: "#D4537E",
        badgeBg: "#FBEAF0",
        badgeText: "#72243E",
      };

    default:
      return {
        label: "FILE",
        cardClass: "file-card generic",
        accentColor: "#888780",
        iconColor: "#888780",
        badgeBg: "#F1EFE8",
        badgeText: "#5F5E5A",
      };
  }
};
