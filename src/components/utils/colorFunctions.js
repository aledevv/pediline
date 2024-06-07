function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
  
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

function isDark(color) {
    let RGB = hexToRgb(color);
  
    // Calcola la luminosità del colore (formula corretta percepita)
    const luminance = (0.299 * RGB.r + 0.587 * RGB.g + 0.114 * RGB.b) / 255;
  
    console.log(RGB.b, RGB.g, RGB.r, luminance);
    // Restituisci true se il colore è scuro, false altrimenti
    return luminance < 0.6;
  }
  
function getContrastRatio(color1, color2) {
// Converti i colori da esadecimale a RGB
const r1 = parseInt(color1.substring(1, 3), 16);
const g1 = parseInt(color1.substring(3, 5), 16);
const b1 = parseInt(color1.substring(5, 7), 16);
const r2 = parseInt(color2.substring(1, 3), 16);
const g2 = parseInt(color2.substring(3, 5), 16);
const b2 = parseInt(color2.substring(5, 7), 16);

// Calcola la luminosità dei due colori
const L1 = (0.299 * r1 + 0.587 * g1 + 0.114 * b1) / 255;
const L2 = (0.299 * r2 + 0.587 * g2 + 0.114 * b2) / 255;

// Calcola il rapporto di contrasto
const contrastRatio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);

return contrastRatio;
}

function getTextColor(bgColor) {
// Se il colore di sfondo è scuro, restituisci il testo bianco, altrimenti nero
return isDark(bgColor) ? '#FFFFFF' : '#000000';
}
  
//   // Utilizzo:
//   const backgroundColor = '#FF0000'; // Esempio di colore di sfondo
//   const textColor = getTextColor(backgroundColor); // Colore del testo in base al colore di sfondo
//   console.log(textColor); // Stampa il colore del testo

  
export { isDark, getContrastRatio, getTextColor };