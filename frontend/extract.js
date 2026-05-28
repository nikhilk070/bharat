const fs = require('fs');

const lines = fs.readFileSync('../demo.html', 'utf8').split('\n');
let svgLines = lines.slice(1161, 1341); // line 1162 to 1341

let svgText = svgLines.join('\n');
svgText = svgText.replace(/class=/g, 'className=');
svgText = svgText.replace(/stroke-width/g, 'strokeWidth');
svgText = svgText.replace(/stroke-dasharray/g, 'strokeDasharray');
svgText = svgText.replace(/stroke-dashoffset/g, 'strokeDashoffset');
svgText = svgText.replace(/font-family/g, 'fontFamily');
svgText = svgText.replace(/font-size/g, 'fontSize');
svgText = svgText.replace(/font-weight/g, 'fontWeight');
svgText = svgText.replace(/letter-spacing/g, 'letterSpacing');
svgText = svgText.replace(/stop-color/g, 'stopColor');
svgText = svgText.replace(/stop-opacity/g, 'stopOpacity');

const componentCode = `export default function IndiaMapSvg() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 mix-blend-screen scale-[1.3] md:scale-[1.6] translate-y-[10%]">
      ${svgText.trim()}
    </div>
  );
}`;

fs.writeFileSync('src/components/IndiaMapSvg.tsx', componentCode);
console.log('Saved to src/components/IndiaMapSvg.tsx');
