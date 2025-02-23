const colorSquare = document.getElementById('colorSquare');
const colorPicker = document.getElementById('colorPicker');
const hexInput = document.getElementById('hex');
const rgbInput = document.getElementById('rgb');
const hslInput = document.getElementById('hsl');
const cmykInput = document.getElementById('cmyk');
const copyButtons = document.querySelectorAll('.copy-btn');
const notification = document.getElementById('notification');

// Update color display
colorPicker.addEventListener('input', (e) => {
  const color = e.target.value;
  colorSquare.style.backgroundColor = color;
  updateColorFormats(color);
});

// Convert HEX to RGB, HSL, and CMYK
function updateColorFormats(hex) {
  hexInput.value = hex;

  // HEX to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  rgbInput.value = `rgb(${r}, ${g}, ${b})`;

  // HEX to HSL
  const hsl = rgbToHsl(r, g, b);
  hslInput.value = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;

  // HEX to CMYK
  const cmyk = rgbToCmyk(r, g, b);
  cmykInput.value = `cmyk(${cmyk[0]}%, ${cmyk[1]}%, ${cmyk[2]}%, ${cmyk[3]}%)`;
}

// RGB to HSL conversion
function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

// RGB to CMYK conversion
function rgbToCmyk(r, g, b) {
  if (r === 0 && g === 0 && b === 0) return [0, 0, 0, 100];
  const c = 1 - (r / 255);
  const m = 1 - (g / 255);
  const y = 1 - (b / 255);
  const k = Math.min(c, m, y);
  return [
    Math.round((c - k) / (1 - k) * 100),
    Math.round((m - k) / (1 - k) * 100),
    Math.round((y - k) / (1 - k) * 100),
    Math.round(k * 100)
  ];
}

// Copy to clipboard
copyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = document.querySelector(button.getAttribute('data-clipboard-target'));
      target.select();
      document.execCommand('copy');
      showNotification(`${target.value} copied to clipboard!`);
    });
  });
  
  // Show notification
  function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
    }, 2000);
  }