export const truncateText = (text, maxLength = 64) => {
  if (text?.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
};

export const truncateHTML = (html, maxChars = 160) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  const text = tempDiv.textContent || tempDiv.innerText || "";

  if (text.length <= maxChars) return text;

  let truncated = text.slice(0, maxChars);

  if (text[maxChars] !== " " && text[maxChars] !== undefined) {
    const lastSpaceIndex = truncated.lastIndexOf(" ");
    truncated = truncated.slice(0, lastSpaceIndex);
  }

  return truncated + "...";
};
