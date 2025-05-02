import React, { useState, useMemo } from "react";

interface ButtonStyle {
  backgroundColor: string;
  color: string;
  borderRadius: number;
  boxShadow: string;
  padding: string;
  gradient: boolean;
  gradientColors: [string, string];
  hoverScale: boolean;
  clickAnimation: boolean;
}

const defaultStyle: ButtonStyle = {
  backgroundColor: "#3b82f6",
  color: "#ffffff",
  borderRadius: 8,
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  padding: "12px 24px",
  gradient: false,
  gradientColors: ["#3b82f6", "#60a5fa"],
  hoverScale: true,
  clickAnimation: true,
};

export default function ButtonBuilder() {
  const [style, setStyle] = useState<ButtonStyle>(defaultStyle);
  const [copied, setCopied] = useState(false);

  const buttonStyles = useMemo(() => {
    const bg = style.gradient
      ? `linear-gradient(to right, ${style.gradientColors[0]}, ${style.gradientColors[1]})`
      : style.backgroundColor;
    return {
      base: `
        background: ${bg};
        color: ${style.color};
        border-radius: ${style.borderRadius}px;
        box-shadow: ${style.boxShadow};
        padding: ${style.padding};
        border: none;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
      `,
      hover: style.hoverScale
        ? `transform: scale(1.05); box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);`
        : "",
      active: style.clickAnimation
        ? `transform: scale(0.95); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);`
        : "",
    };
  }, [style]);

  const cssCode = useMemo(() => {
    return `.custom-button {
  ${buttonStyles.base}
}
.custom-button:hover {
  ${buttonStyles.hover}
}
.custom-button:active {
  ${buttonStyles.active}
}`;
  }, [buttonStyles]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateStyle = <K extends keyof ButtonStyle>(
    key: K,
    value: ButtonStyle[K]
  ) => setStyle((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Button Style Builder
      </h1>

      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preview Section */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Button Preview
          </h2>
          <button
            className="custom-button"
            style={{
              background: style.gradient
                ? `linear-gradient(to right, ${style.gradientColors[0]}, ${style.gradientColors[1]})`
                : style.backgroundColor,
              color: style.color,
              borderRadius: style.borderRadius,
              boxShadow: style.boxShadow,
              padding: style.padding,
              border: "none",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseOver={(e) =>
              style.hoverScale &&
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) =>
              style.hoverScale && (e.currentTarget.style.transform = "scale(1)")
            }
            onMouseDown={(e) =>
              style.clickAnimation &&
              (e.currentTarget.style.transform = "scale(0.95)")
            }
            onMouseUp={(e) =>
              style.clickAnimation &&
              (e.currentTarget.style.transform = "scale(1)")
            }
            aria-label="Button preview with current styles"
          >
            Preview Button
          </button>
        </div>

        {/* Controls Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <input
              type="color"
              value={style.backgroundColor}
              onChange={(e) => updateStyle("backgroundColor", e.target.value)}
              className="w-10 h-10 rounded-md cursor-pointer"
              aria-label="Select background color"
              disabled={style.gradient}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Color
            </label>
            <input
              type="color"
              value={style.color}
              onChange={(e) => updateStyle("color", e.target.value)}
              className="w-10 h-10 rounded-md cursor-pointer"
              aria-label="Select text color"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Border Radius: {style.borderRadius}px
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={style.borderRadius}
              onChange={(e) =>
                updateStyle("borderRadius", parseInt(e.target.value))
              }
              className="w-full"
              aria-label="Adjust border radius"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Box Shadow
            </label>
            <select
              value={style.boxShadow}
              onChange={(e) => updateStyle("boxShadow", e.target.value)}
              className="w-full p-2 border rounded-md"
              aria-label="Select box shadow"
            >
              <option value="none">None</option>
              <option value="0 2px 4px rgba(0, 0, 0, 0.1)">Small</option>
              <option value="0 4px 6px rgba(0, 0, 0, 0.1)">Medium</option>
              <option value="0 6px 8px rgba(0, 0, 0, 0.15)">Large</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Padding
            </label>
            <select
              value={style.padding}
              onChange={(e) => updateStyle("padding", e.target.value)}
              className="w-full p-2 border rounded-md"
              aria-label="Select padding"
            >
              <option value="8px 16px">Small</option>
              <option value="12px 24px">Medium</option>
              <option value="16px 32px">Large</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={style.gradient}
              onChange={(e) => updateStyle("gradient", e.target.checked)}
              className="mr-2"
              id="gradient"
            />
            <label htmlFor="gradient" className="text-sm text-gray-700">
              Use Gradient
            </label>
          </div>

          {style.gradient && (
            <div className="flex gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Gradient Start
                </label>
                <input
                  type="color"
                  value={style.gradientColors[0]}
                  onChange={(e) =>
                    updateStyle("gradientColors", [
                      e.target.value,
                      style.gradientColors[1],
                    ])
                  }
                  className="w-10 h-10 rounded-md cursor-pointer"
                  aria-label="Select gradient start color"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Gradient End
                </label>
                <input
                  type="color"
                  value={style.gradientColors[1]}
                  onChange={(e) =>
                    updateStyle("gradientColors", [
                      style.gradientColors[0],
                      e.target.value,
                    ])
                  }
                  className="w-10 h-10 rounded-md cursor-pointer"
                  aria-label="Select gradient end color"
                />
              </div>
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={style.hoverScale}
              onChange={(e) => updateStyle("hoverScale", e.target.checked)}
              className="mr-2"
              id="hoverScale"
            />
            <label htmlFor="hoverScale" className="text-sm text-gray-700">
              Hover Scale Effect
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={style.clickAnimation}
              onChange={(e) => updateStyle("clickAnimation", e.target.checked)}
              className="mr-2"
              id="clickAnimation"
            />
            <label htmlFor="clickAnimation" className="text-sm text-gray-700">
              Click Animation
            </label>
          </div>
        </div>
      </div>

      {/* CSS Output */}
      <div className="w-full max-w-4xl mt-6 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">CSS Code</h2>
        <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto">
          <code>{cssCode}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          aria-label="Copy CSS code to clipboard"
        >
          {copied ? "Copied!" : "Copy CSS"}
        </button>
      </div>
    </div>
  );
}
