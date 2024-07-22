import '../css/index.css';
import details from '../assets/punt-frontend-assignment (1).json';
import { useEffect, useState } from 'react';


interface fontvar {
  [weight: string]: string;
}

interface fontdet {
  [fontName: string]: fontvar;
}

interface fontvart {
  weight: number;
  italic: boolean;
}

const closevarient = (
  weightclose: number,
  italicnot: boolean,
  varientlist: fontvart[]
): fontvart => {
  const italicvart = varientlist.filter(variant => variant.italic);
  const nonitalicvart = varientlist.filter(variant => !variant.italic);

  const closeweight = (weight: number, variants: fontvart[]): fontvart => {
    return variants.reduce((prev, curr) => 
      Math.abs(curr.weight - weight) < Math.abs(prev.weight - weight) ? curr : prev
    );
  };

  if (italicnot) {
    if (italicvart.length > 0) {
      return closeweight(weightclose, italicvart);
    }
    return closeweight(weightclose, nonitalicvart);
  } else {
    if (nonitalicvart.length > 0) {
      return closeweight(weightclose, nonitalicvart);
    }
    return closeweight(weightclose, italicvart);
  }
};

export const Index = () => {
  const fontdet: fontdet = details;
  const [text, setText] = useState('');
  const [toggle, setToggle] = useState(false);
  const [font, setFont] = useState<string>('');
  const [width, setWeidth] = useState<string>('');
  const [fontWeights, setFontWeights] = useState<fontvar>({});
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const head = document.head;
    if (width && font) {
      let url = fontdet[font][width];
      if (!url) {
        const varientlist = Object.entries(fontdet[font]).map(([variant]) => {
          const weight = parseInt(variant, 10);
          const italic = variant.includes('italic');
          return { weight, italic };
        });

        const closestVariant = closevarient(parseInt(width), toggle, varientlist);
        setWeidth(closestVariant.weight.toString());
        setToggle(closestVariant.italic);
        url = fontdet[font][closestVariant.weight + (closestVariant.italic ? 'italic' : '')];
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.setAttribute('data-font', font);
      head.appendChild(link);

      const style = document.createElement('style');
      style.textContent = `
        @font-face {
          font-family: '${font}';
          font-weight: ${width};
          src: url(${url}) format('woff2');
        }
      `;
      head.appendChild(style);
    }
  }, [font, width, toggle]);

  useEffect(() => {
    if (font) {
      const newFontWeights: fontvar = {};
      Object.entries(fontdet[font]).forEach(([weight, url]) => {
        if (weight.length === 3) {
          newFontWeights[weight] = url;
        }
      });
      setFontWeights(newFontWeights);
    } else {
      setFontWeights({});
    }
  }, [font]);

  useEffect(() => {}, [text]);

  useEffect(() => {
    const savedText = localStorage.getItem('text');
    const savedFont = localStorage.getItem('font');
    const savedWeight = localStorage.getItem('weight');
    const savedItalic = localStorage.getItem('toggle');
    if (savedText) setText(savedText);
    if (savedFont) setFont(savedFont);
    if (savedWeight) setWeidth(savedWeight);
    if (savedItalic) setToggle(JSON.parse(savedItalic));
  }, []);

  const savecond = () => {
    localStorage.setItem('text', text);
    localStorage.setItem('font', font);
    localStorage.setItem('weight', width);
    localStorage.setItem('toggle', JSON.stringify(toggle));
    window.alert('Data saved to local storage');
  };

  const resetcond = () => {
    setText('');
    setFont('');
    setWeidth('');
    setToggle(false);
    localStorage.removeItem('text');
    localStorage.removeItem('font');
    localStorage.removeItem('weight');
    localStorage.removeItem('toggle');
    window.alert('Data is reset');
  };
  const handleDisplayPanel = () => {
    setShowPanel(!showPanel);
  };

  const fontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFont = e.target.value;
    setFont(selectedFont);

    const varientlist = Object.entries(fontdet[selectedFont]).map(([variant]) => {
      const weight = parseInt(variant, 10);
      const italic = variant.includes('italic');
      return { weight, italic };
    });

    const closestVariant = closevarient(parseInt(width) || 400, toggle, varientlist);
    setWeidth(closestVariant.weight.toString());
    setToggle(closestVariant.italic);
  };

  const weightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedWeight = e.target.value;
    setWeidth(selectedWeight);
  };

  return (
    <>
      <div className='text-box'>
        <h1>Text   Editor </h1>
        <div className="container">
          <div className="desc-sec">
            <div className="font-family-sec">
            <h2>Font family</h2>
            <div className="custom-select">
              <select name="" id="" value={font} onChange={fontChange}>
                <option value="">Select Font</option>
                {Object.keys(details).map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select></div>
            </div>
            
            <div className="varient-sec">
            <div className="custom-select">
              <h2>Varient</h2>
              <select name="" id="" value={width} onChange={weightChange}>
                <option value="">Select Weight</option>
                {!font ? '' : Object.keys(fontWeights).map((width) => (
                  <option key={width} value={width}>{width}</option>
                ))}
              </select>
              </div>
            </div>
            <div className="toggle">
              <h2>Italic toggle</h2>
              <label >Italic</label>
              
              <button className='toggle-btn' onClick={() => setToggle(!toggle)} disabled={fontdet[font] === undefined || fontdet[font][width + 'italic'] === undefined}>{toggle ? 'OFF' : 'ON'}</button>
            </div>
          </div>
          <div className="text-sec">
            <textarea name="" id="" style={{ fontFamily: font, fontWeight: width, fontStyle: toggle ? 'italic' : 'normal' }} value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div className="reset-save">
            <button className="toggle-btn" onClick={resetcond}>Reset</button>
            <button className="toggle-btn" onClick={savecond}>Save</button>
            <button className="toggle-btn" onClick={handleDisplayPanel}>
              {showPanel ? 'Display' : 'Display'} Panel
            </button>
          </div>
          <div className="side-panel">
          <h2>Stored Content</h2>
          <div>
            <p><strong>Text:</strong> {localStorage.getItem('text')}</p>
            <p><strong>Font:</strong> {localStorage.getItem('font')}</p>
            <p><strong>Weight:</strong> {localStorage.getItem('weight')}</p>
            <p><strong>Italic:</strong> {JSON.parse(localStorage.getItem('toggle') || 'false') ? 'Yes' : 'No'}</p>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};