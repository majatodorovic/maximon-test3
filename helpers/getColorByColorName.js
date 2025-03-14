export const getColorByColorName = (colorName) => {
  const colorMap = {
    bela: "#FFFFFF",
    crna: "#000000",
    pink: "#FFC0CB",
    braon: "#8B4513",
    plava: "#0000FF",
    zuta: "#FFFF00",
    maslina: "#808000",
    bordo: "#800020",
    siva: "#808080",
    narandzasta: "#FFA500",
    teget: "#00008B",
    antracit: "#36454F",
    bez: "#F5F5DC",
    denim: "#1560BD",
    ekru: "#F5F5DC",
    kamel: "#C19A6B",
    karamel: "#FFD59A",
    kobalt: "#0047AB",
    koralna: "#FF7F50",
    limeta: "#32CD32",
    losos: "#FA8072",
    orange: "#FFA500",
    oranz: "#FFA500",
    silver: "#C0C0C0",
    terakot: "#E2725B",
  };

  return colorMap[colorName.toLowerCase()] || "#CCCCCC";
};
