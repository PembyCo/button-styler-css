import React, { useState, useMemo, useEffect } from "react";

interface ButtonStyle {
  backgroundColor: string;
  color: string;
  borderRadius: number;
  boxShadow: string;
  padding: string;
  width: string;
  height: string;
  gradient: boolean;
  gradientColors: [string, string];
  gradientType: "linear" | "radial";
  gradientDirection: "to right" | "to bottom" | "to bottom right" | "to bottom left";
  hoverScale: boolean;
  clickAnimation: boolean;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
  letterSpacing: string;
  buttonText: string;
}

const defaultStyle: ButtonStyle = {
  backgroundColor: "#3b82f6",
  color: "#ffffff",
  borderRadius: 8,
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  padding: "12px 24px",
  width: "auto",
  height: "auto",
  gradient: false,
  gradientColors: ["#3b82f6", "#60a5fa"],
  gradientType: "linear",
  gradientDirection: "to right",
  hoverScale: true,
  clickAnimation: true,
  fontFamily: "sans-serif",
  fontSize: "16px",
  fontWeight: "500",
  textTransform: "none",
  letterSpacing: "normal",
  buttonText: "Preview Button",
};

const presetStyles: Record<string, ButtonStyle> = {
  default: defaultStyle,
  primary: {
    ...defaultStyle,
    backgroundColor: "#3b82f6", // Blue
  },
  success: {
    ...defaultStyle,
    backgroundColor: "#10b981", // Green
  },
  danger: {
    ...defaultStyle,
    backgroundColor: "#ef4444", // Red
  },
  warning: {
    ...defaultStyle,
    backgroundColor: "#f59e0b", // Yellow
    color: "#000000",
  },
  info: {
    ...defaultStyle,
    backgroundColor: "#06b6d4", // Cyan
  },
  dark: {
    ...defaultStyle,
    backgroundColor: "#1f2937", // Dark gray
  },
  light: {
    ...defaultStyle,
    backgroundColor: "#f3f4f6", // Light gray
    color: "#000000",
  },
  gradient: {
    ...defaultStyle,
    gradient: true,
    gradientColors: ["#8b5cf6", "#ec4899"], // Purple to pink
    gradientType: "linear",
    gradientDirection: "to right",
  },
  glassmorphism: {
    ...defaultStyle,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
    borderRadius: 16,
  },
  rounded: {
    ...defaultStyle,
    borderRadius: 50,
  },
};

type CodeType = "css" | "tailwind";

export default function ButtonBuilder() {
  const [style, setStyle] = useState<ButtonStyle>(() => {
    // Load from localStorage if available
    const savedStyle = localStorage.getItem("buttonStyle");
    return savedStyle ? JSON.parse(savedStyle) : defaultStyle;
  });
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<CodeType>(() => {
    // Load active tab from localStorage if available
    const savedTab = localStorage.getItem("activeTab");
    return (savedTab as CodeType) || "css";
  });
  const [presetName, setPresetName] = useState("");
  const [userPresets, setUserPresets] = useState<Record<string, ButtonStyle>>(() => {
    // Load user presets from localStorage
    const savedPresets = localStorage.getItem("userPresets");
    return savedPresets ? JSON.parse(savedPresets) : {};
  });
  const [darkMode, setDarkMode] = useState(() => {
    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem("darkMode");
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });

  // Save style to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("buttonStyle", JSON.stringify(style));
  }, [style]);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // Save user presets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("userPresets", JSON.stringify(userPresets));
  }, [userPresets]);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const buttonStyles = useMemo(() => {
    let bg = style.backgroundColor;
    
    if (style.gradient) {
      if (style.gradientType === "linear") {
        bg = `linear-gradient(${style.gradientDirection}, ${style.gradientColors[0]}, ${style.gradientColors[1]})`;
      } else if (style.gradientType === "radial") {
        bg = `radial-gradient(circle, ${style.gradientColors[0]}, ${style.gradientColors[1]})`;
      }
    }
    
    return {
      base: `
        background: ${bg};
        color: ${style.color};
        border-radius: ${style.borderRadius}px;
        box-shadow: ${style.boxShadow};
        padding: ${style.padding};
        width: ${style.width};
        height: ${style.height};
        border: none;
        font-family: ${style.fontFamily};
        font-size: ${style.fontSize};
        font-weight: ${style.fontWeight};
        text-transform: ${style.textTransform};
        letter-spacing: ${style.letterSpacing};
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

  // Generate Tailwind CSS classes
  const tailwindCode = useMemo(() => {
    const bgColor = style.backgroundColor.toLowerCase();
    const textColor = style.color.toLowerCase();
    
    // Map common background colors to Tailwind classes
    let bgClass = "bg-blue-500"; // Default
    if (bgColor === "#3b82f6") bgClass = "bg-blue-500";
    else if (bgColor === "#ef4444") bgClass = "bg-red-500";
    else if (bgColor === "#10b981") bgClass = "bg-green-500";
    else if (bgColor === "#f59e0b") bgClass = "bg-yellow-500";
    else if (bgColor === "#8b5cf6") bgClass = "bg-purple-500";
    else if (bgColor === "#ec4899") bgClass = "bg-pink-500";
    else if (bgColor === "#6b7280") bgClass = "bg-gray-500";
    else bgClass = `bg-[${bgColor}]`;
    
    // Map common text colors to Tailwind classes
    let textClass = "text-white"; // Default
    if (textColor === "#ffffff") textClass = "text-white";
    else if (textColor === "#000000") textClass = "text-black";
    else textClass = `text-[${textColor}]`;
    
    // Rounded corners
    let roundedClass = "rounded";
    if (style.borderRadius === 0) roundedClass = "rounded-none";
    else if (style.borderRadius <= 4) roundedClass = "rounded-sm";
    else if (style.borderRadius <= 8) roundedClass = "rounded";
    else if (style.borderRadius <= 12) roundedClass = "rounded-md";
    else if (style.borderRadius <= 16) roundedClass = "rounded-lg";
    else if (style.borderRadius <= 24) roundedClass = "rounded-xl";
    else if (style.borderRadius <= 32) roundedClass = "rounded-2xl";
    else roundedClass = "rounded-full";
    
    // Shadow
    let shadowClass = "";
    if (style.boxShadow === "none") shadowClass = "";
    else if (style.boxShadow === "0 2px 4px rgba(0, 0, 0, 0.1)") shadowClass = "shadow-sm";
    else if (style.boxShadow === "0 4px 6px rgba(0, 0, 0, 0.1)") shadowClass = "shadow";
    else if (style.boxShadow === "0 6px 8px rgba(0, 0, 0, 0.15)") shadowClass = "shadow-md";
    
    // Padding
    let paddingClass = "px-6 py-3"; // Default medium
    if (style.padding === "8px 16px") paddingClass = "px-4 py-2";
    else if (style.padding === "12px 24px") paddingClass = "px-6 py-3";
    else if (style.padding === "16px 32px") paddingClass = "px-8 py-4";
    
    // Width
    let widthClass = "";
    if (style.width === "100%") widthClass = "w-full";
    else if (style.width === "150px") widthClass = "w-[150px]";
    else if (style.width === "200px") widthClass = "w-[200px]";
    else if (style.width === "250px") widthClass = "w-[250px]";
    
    // Height
    let heightClass = "";
    if (style.height === "40px") heightClass = "h-10";
    else if (style.height === "50px") heightClass = "h-[50px]";
    else if (style.height === "60px") heightClass = "h-[60px]";
    
    // Hover and active effects
    let hoverClass = style.hoverScale ? "hover:scale-105 hover:shadow-lg" : "";
    let activeClass = style.clickAnimation ? "active:scale-95 active:shadow-sm" : "";
    
    // Gradient
    let gradientClass = "";
    if (style.gradient) {
      const fromColor = style.gradientColors[0].toLowerCase();
      const toColor = style.gradientColors[1].toLowerCase();
      
      if (style.gradientType === "linear") {
        let direction = "bg-gradient-to-r";
        
        if (style.gradientDirection === "to bottom") {
          direction = "bg-gradient-to-b";
        } else if (style.gradientDirection === "to bottom right") {
          direction = "bg-gradient-to-br";
        } else if (style.gradientDirection === "to bottom left") {
          direction = "bg-gradient-to-bl";
        }
        
        gradientClass = `${direction} from-[${fromColor}] to-[${toColor}]`;
        bgClass = ""; // Remove the solid background when using gradient
      } else {
        // Radial gradients aren't directly supported in Tailwind
        gradientClass = `bg-[radial-gradient(circle,_${fromColor},_${toColor})]`;
        bgClass = ""; // Remove the solid background when using gradient
      }
    }
    
    // Typography
    let fontFamilyClass = "";
    if (style.fontFamily === "sans-serif") fontFamilyClass = "font-sans";
    else if (style.fontFamily === "serif") fontFamilyClass = "font-serif";
    else if (style.fontFamily === "monospace") fontFamilyClass = "font-mono";
    
    let fontSizeClass = "";
    if (style.fontSize === "12px") fontSizeClass = "text-xs";
    else if (style.fontSize === "14px") fontSizeClass = "text-sm";
    else if (style.fontSize === "16px") fontSizeClass = "text-base";
    else if (style.fontSize === "18px") fontSizeClass = "text-lg";
    else if (style.fontSize === "20px") fontSizeClass = "text-xl";
    else if (style.fontSize === "24px") fontSizeClass = "text-2xl";
    
    let fontWeightClass = "";
    if (style.fontWeight === "300") fontWeightClass = "font-light";
    else if (style.fontWeight === "400") fontWeightClass = "font-normal";
    else if (style.fontWeight === "500") fontWeightClass = "font-medium";
    else if (style.fontWeight === "600") fontWeightClass = "font-semibold";
    else if (style.fontWeight === "700") fontWeightClass = "font-bold";
    
    let textTransformClass = "";
    if (style.textTransform === "uppercase") textTransformClass = "uppercase";
    else if (style.textTransform === "lowercase") textTransformClass = "lowercase";
    else if (style.textTransform === "capitalize") textTransformClass = "capitalize";
    
    // Letter spacing
    let letterSpacingClass = "";
    if (style.letterSpacing === "normal") letterSpacingClass = "";
    else if (style.letterSpacing === "-0.05em") letterSpacingClass = "tracking-tighter";
    else if (style.letterSpacing === "-0.025em") letterSpacingClass = "tracking-tight";
    else if (style.letterSpacing === "0.025em") letterSpacingClass = "tracking-wide";
    else if (style.letterSpacing === "0.05em") letterSpacingClass = "tracking-wider";
    else if (style.letterSpacing === "0.1em") letterSpacingClass = "tracking-widest";
    
    // Combine all classes, filtering out empty ones
    const allClasses = [
      bgClass,
      textClass,
      roundedClass,
      shadowClass,
      paddingClass,
      widthClass,
      heightClass,
      hoverClass,
      activeClass,
      gradientClass,
      fontFamilyClass,
      fontSizeClass,
      fontWeightClass,
      textTransformClass,
      letterSpacingClass,
      "cursor-pointer transition-all duration-200 border-0"
    ].filter(Boolean).join(" ");
    
    return `<button class="${allClasses}">
  ${style.buttonText}
</button>`;
  }, [style]);

  const handleCopy = () => {
    const codeToCopy = activeTab === "css" ? cssCode : tailwindCode;
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const codeToCopy = activeTab === "css" ? cssCode : tailwindCode;
    const fileName = activeTab === "css" ? "button-style.css" : "button-style-tailwind.txt";
    const mimeType = activeTab === "css" ? "text/css" : "text/plain";
    
    // Create a blob from the code
    const blob = new Blob([codeToCopy], { type: mimeType });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a link element and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };

  const updateStyle = <K extends keyof ButtonStyle>(
    key: K,
    value: ButtonStyle[K]
  ) => setStyle((prev) => ({ ...prev, [key]: value }));

  const savePreset = () => {
    if (presetName.trim() === "") return;
    setUserPresets((prev) => ({
      ...prev,
      [presetName]: { ...style },
    }));
    setPresetName("");
  };

  const loadPreset = (name: string, preset: ButtonStyle) => {
    setStyle({ ...preset });
  };

  const deleteUserPreset = (name: string) => {
    setUserPresets((prev) => {
      const newPresets = { ...prev };
      delete newPresets[name];
      return newPresets;
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply dark mode classes to the entire app
  const appClasses = darkMode
    ? "min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 md:p-6"
    : "min-h-screen bg-gray-100 flex flex-col items-center p-4 md:p-6";

  const cardClasses = darkMode
    ? "bg-gray-800 shadow-lg"
    : "bg-white shadow-md";

  const headingClasses = darkMode
    ? "text-white"
    : "text-gray-800";

  const labelClasses = darkMode
    ? "text-gray-300"
    : "text-gray-700";

  const inputBgClasses = darkMode
    ? "bg-gray-700 border-gray-600 text-white"
    : "bg-white border-gray-300";

  const buttonClasses = darkMode
    ? "bg-blue-600 hover:bg-blue-700"
    : "bg-blue-500 hover:bg-blue-600";

  const presetButtonClasses = darkMode
    ? "bg-gray-700 hover:bg-gray-600"
    : "bg-gray-200 hover:bg-gray-300";

  const codeAreaClasses = darkMode
    ? "bg-gray-900 text-gray-100"
    : "bg-gray-100 text-gray-800";

  return (
    <div className={appClasses}>
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h1 className="relative py-2">
          <span className={`text-3xl md:text-4xl font-extrabold ${
            darkMode 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500' 
              : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600'
          } drop-shadow-sm`}>
            Button<span className="text-xl align-top">✨</span>Styler
          </span>
          <span className={`block text-sm ${darkMode ? 'text-blue-300' : 'text-blue-600'} font-medium ml-1`}>
            CSS Generator
          </span>
          <span className={`absolute -bottom-1 left-0 w-1/2 h-1 ${
            darkMode ? 'bg-gradient-to-r from-purple-500 to-transparent' : 'bg-gradient-to-r from-purple-600 to-transparent'
          } rounded-full`}></span>
        </h1>
      </div>

      {/* Fixed preview for all screen sizes */}
      <div className="w-full sticky top-0 z-10 p-4 flex justify-center" style={{
        backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.9)' : 'rgba(243, 244, 246, 0.9)',
        backdropFilter: 'blur(8px)',
      }}>
        <div className="flex flex-col items-center">
          <h2 className={`text-lg font-semibold ${labelClasses} mb-2`}>
            Preview
          </h2>
          <button
            className="custom-button"
            style={{
              background: style.gradient
                ? style.gradientType === "linear"
                  ? `linear-gradient(${style.gradientDirection}, ${style.gradientColors[0]}, ${style.gradientColors[1]})`
                  : `radial-gradient(circle, ${style.gradientColors[0]}, ${style.gradientColors[1]})`
                : style.backgroundColor,
              color: style.color,
              borderRadius: style.borderRadius,
              boxShadow: style.boxShadow,
              padding: style.padding,
              width: style.width,
              height: style.height,
              border: "none",
              fontFamily: style.fontFamily,
              fontSize: style.fontSize,
              fontWeight: style.fontWeight,
              textTransform: style.textTransform,
              letterSpacing: style.letterSpacing,
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
            {style.buttonText}
          </button>
        </div>
      </div>

      <div className={`w-full max-w-4xl ${cardClasses} rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6`}>
        {/* Controls Section - Left */}
        <div className="space-y-6">
          {/* Dark Mode Toggle */}
          <div className="flex justify-between items-center">
            <label className={`block text-sm font-medium ${labelClasses}`}>
              Theme
            </label>
            <div className="flex items-center">
              <span className={`mr-2 text-sm ${labelClasses}`}>
                {darkMode ? "Dark" : "Light"}
              </span>
              <button
                onClick={toggleDarkMode}
                className={`w-12 h-6 rounded-full p-1 ${
                  darkMode ? "bg-blue-600" : "bg-gray-300"
                } transition-colors duration-200 focus:outline-none`}
                aria-label={`Toggle ${darkMode ? "light" : "dark"} mode`}
              >
                <div 
                  className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ${
                    darkMode ? "translate-x-6" : "translate-x-0"
                  }`} 
                />
              </button>
            </div>
          </div>

          {/* Presets Section */}
          <div>
            <label className={`block text-sm font-medium ${labelClasses} mb-2`}>
              Presets
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {Object.entries(presetStyles).map(([name, preset]) => (
                <button
                  key={name}
                  onClick={() => loadPreset(name, preset)}
                  className={`px-3 py-1 text-xs ${presetButtonClasses} rounded-md`}
                  title={name}
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </button>
              ))}
            </div>
            
            {Object.keys(userPresets).length > 0 && (
              <div className="mb-3">
                <p className={`text-sm font-medium ${labelClasses} mb-1`}>User Presets</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(userPresets).map(([name, preset]) => (
                    <div key={name} className="flex items-center">
                      <button
                        onClick={() => loadPreset(name, preset)}
                        className={`px-3 py-1 text-xs ${
                          darkMode ? "bg-blue-900 hover:bg-blue-800" : "bg-blue-100 hover:bg-blue-200"
                        } rounded-l-md`}
                      >
                        {name}
                      </button>
                      <button
                        onClick={() => deleteUserPreset(name)}
                        className={`px-2 py-1 text-xs ${
                          darkMode ? "bg-red-900 hover:bg-red-800" : "bg-red-100 hover:bg-red-200"
                        } rounded-r-md`}
                        title="Delete preset"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex">
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="Preset name"
                className={`flex-1 p-2 border rounded-l-md text-sm ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                }`}
              />
              <button
                onClick={savePreset}
                disabled={presetName.trim() === ""}
                className={`px-3 py-2 ${buttonClasses} text-white rounded-r-md disabled:bg-gray-400 disabled:cursor-not-allowed text-sm`}
              >
                Save
              </button>
            </div>
          </div>

          {/* Color Controls */}
          <div>
            <label className={`block text-sm font-medium ${labelClasses} mb-1`}>
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
            <label className={`block text-sm font-medium ${labelClasses} mb-1`}>
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
            <label className={`block text-sm font-medium ${labelClasses} mb-1`}>
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
            <label className={`block text-sm font-medium ${labelClasses} mb-1`}>
              Box Shadow
            </label>
            <select
              value={style.boxShadow}
              onChange={(e) => updateStyle("boxShadow", e.target.value)}
              className={`w-full p-2 border rounded-md ${inputBgClasses}`}
              aria-label="Select box shadow"
            >
              <option value="none">None</option>
              <option value="0 2px 4px rgba(0, 0, 0, 0.1)">Small</option>
              <option value="0 4px 6px rgba(0, 0, 0, 0.1)">Medium</option>
              <option value="0 6px 8px rgba(0, 0, 0, 0.15)">Large</option>
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
            <label htmlFor="gradient" className={`text-sm ${labelClasses}`}>
              Use Gradient
            </label>
          </div>

          {style.gradient && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div>
                  <label className={`block text-sm ${labelClasses} mb-1`}>
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
                  <label className={`block text-sm ${labelClasses} mb-1`}>
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

              <div>
                <label className={`block text-sm font-medium ${labelClasses} mb-1`}>
                  Gradient Type
                </label>
                <select
                  value={style.gradientType}
                  onChange={(e) => updateStyle("gradientType", e.target.value as "linear" | "radial")}
                  className={`w-full p-2 border rounded-md ${inputBgClasses}`}
                  aria-label="Select gradient type"
                >
                  <option value="linear">Linear</option>
                  <option value="radial">Radial</option>
                </select>
              </div>

              {style.gradientType === "linear" && (
                <div>
                  <label className={`block text-sm font-medium ${labelClasses} mb-1`}>
                    Gradient Direction
                  </label>
                  <select
                    value={style.gradientDirection}
                    onChange={(e) => 
                      updateStyle(
                        "gradientDirection", 
                        e.target.value as "to right" | "to bottom" | "to bottom right" | "to bottom left"
                      )
                    }
                    className={`w-full p-2 border rounded-md ${inputBgClasses}`}
                    aria-label="Select gradient direction"
                  >
                    <option value="to right">Horizontal (Left to Right)</option>
                    <option value="to bottom">Vertical (Top to Bottom)</option>
                    <option value="to bottom right">Diagonal (Top-Left to Bottom-Right)</option>
                    <option value="to bottom left">Diagonal (Top-Right to Bottom-Left)</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side Controls */}
        <div className="space-y-6">
          {/* Dimension Controls */}
          <div>
            <h3 className={`font-medium ${labelClasses} mb-2`}>Dimensions</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${labelClasses} mb-1`}>
                  Width
                </label>
                <select
                  value={style.width}
                  onChange={(e) => updateStyle("width", e.target.value)}
                  className={`w-full p-2 border rounded-md ${inputBgClasses}`}
                  aria-label="Select button width"
                >
                  <option value="auto">Auto (fit content)</option>
                  <option value="100%">Full width</option>
                  <option value="150px">Small (150px)</option>
                  <option value="200px">Medium (200px)</option>
                  <option value="250px">Large (250px)</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${labelClasses} mb-1`}>
                  Height
                </label>
                <select
                  value={style.height}
                  onChange={(e) => updateStyle("height", e.target.value)}
                  className={`w-full p-2 border rounded-md ${inputBgClasses}`}
                  aria-label="Select button height"
                >
                  <option value="auto">Auto (fit content)</option>
                  <option value="40px">Small (40px)</option>
                  <option value="50px">Medium (50px)</option>
                  <option value="60px">Large (60px)</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${labelClasses} mb-1`}>
                  Padding
                </label>
                <select
                  value={style.padding}
                  onChange={(e) => updateStyle("padding", e.target.value)}
                  className={`w-full p-2 border rounded-md ${inputBgClasses}`}
                  aria-label="Select padding"
                >
                  <option value="8px 16px">Small</option>
                  <option value="12px 24px">Medium</option>
                  <option value="16px 32px">Large</option>
                </select>
              </div>
            </div>
          </div>

          {/* Animation Controls */}
          <div>
            <h3 className={`font-medium ${labelClasses} mb-2`}>Animations</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={style.hoverScale}
                  onChange={(e) => updateStyle("hoverScale", e.target.checked)}
                  className="mr-2"
                  id="hoverScale"
                />
                <label htmlFor="hoverScale" className={`text-sm ${labelClasses}`}>
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
                <label htmlFor="clickAnimation" className={`text-sm ${labelClasses}`}>
                  Click Animation
                </label>
              </div>
            </div>
          </div>

          {/* Typography Controls */}
          <div>
            <h3 className={`font-medium ${labelClasses} mb-2`}>Typography</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${labelClasses} mb-1`}>
                  Button Text
                </label>
                <input
                  type="text"
                  value={style.buttonText}
                  onChange={(e) => updateStyle("buttonText", e.target.value)}
                  className={`w-full p-2 border rounded-md ${inputBgClasses}`}
                  aria-label="Set button text"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${labelClasses} mb-1`}>
                  Font Family
                </label>
                <select
                  value={style.fontFamily}
                  onChange={(e) => updateStyle("fontFamily", e.target.value)}
                  className={`w-full p-2 border rounded-md ${inputBgClasses}`}
                  aria-label="Select font family"
                >
                  <option value="sans-serif">Sans-serif</option>
                  <option value="serif">Serif</option>
                  <option value="monospace">Monospace</option>
                  <option value="'Roboto', sans-serif">Roboto</option>
                  <option value="'Open Sans', sans-serif">Open Sans</option>
                  <option value="'Poppins', sans-serif">Poppins</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${labelClasses} mb-1`}>
                  Font Size
                </label>
                <select
                  value={style.fontSize}
                  onChange={(e) => updateStyle("fontSize", e.target.value)}
                  className={`w-full p-2 border rounded-md ${inputBgClasses}`}
                  aria-label="Select font size"
                >
                  <option value="12px">Small (12px)</option>
                  <option value="14px">Medium (14px)</option>
                  <option value="16px">Default (16px)</option>
                  <option value="18px">Large (18px)</option>
                  <option value="20px">XL (20px)</option>
                  <option value="24px">2XL (24px)</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${labelClasses} mb-1`}>
                  Font Weight
                </label>
                <select
                  value={style.fontWeight}
                  onChange={(e) => updateStyle("fontWeight", e.target.value)}
                  className={`w-full p-2 border rounded-md ${inputBgClasses}`}
                  aria-label="Select font weight"
                >
                  <option value="300">Light (300)</option>
                  <option value="400">Regular (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semibold (600)</option>
                  <option value="700">Bold (700)</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${labelClasses} mb-1`}>
                  Text Transform
                </label>
                <select
                  value={style.textTransform}
                  onChange={(e) => 
                    updateStyle(
                      "textTransform", 
                      e.target.value as "none" | "uppercase" | "lowercase" | "capitalize"
                    )
                  }
                  className={`w-full p-2 border rounded-md ${inputBgClasses}`}
                  aria-label="Select text transform"
                >
                  <option value="none">None</option>
                  <option value="uppercase">UPPERCASE</option>
                  <option value="lowercase">lowercase</option>
                  <option value="capitalize">Capitalize</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${labelClasses} mb-1`}>
                  Letter Spacing
                </label>
                <select
                  value={style.letterSpacing}
                  onChange={(e) => updateStyle("letterSpacing", e.target.value)}
                  className={`w-full p-2 border rounded-md ${inputBgClasses}`}
                  aria-label="Select letter spacing"
                >
                  <option value="normal">Normal</option>
                  <option value="-0.05em">Tighter (-0.05em)</option>
                  <option value="-0.025em">Tight (-0.025em)</option>
                  <option value="0.025em">Wide (0.025em)</option>
                  <option value="0.05em">Wider (0.05em)</option>
                  <option value="0.1em">Widest (0.1em)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Output with Tabs */}
      <div className={`w-full max-w-4xl mt-6 ${cardClasses} rounded-lg p-4`}>
        <div className="flex border-b mb-4">
          <button 
            className={`px-4 py-2 ${activeTab === "css" 
              ? `border-b-2 border-blue-500 text-blue-500 font-medium` 
              : darkMode ? "text-gray-400" : "text-gray-500"}`}
            onClick={() => setActiveTab("css")}
          >
            CSS
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === "tailwind" 
              ? `border-b-2 border-blue-500 text-blue-500 font-medium` 
              : darkMode ? "text-gray-400" : "text-gray-500"}`}
            onClick={() => setActiveTab("tailwind")}
          >
            Tailwind CSS
          </button>
        </div>
        
        <h2 className={`text-lg font-semibold ${labelClasses} mb-2`}>
          {activeTab === "css" ? "CSS Code" : "Tailwind CSS Code"}
        </h2>
        <pre className={`${codeAreaClasses} p-4 rounded-md text-sm overflow-auto`}>
          <code>{activeTab === "css" ? cssCode : tailwindCode}</code>
        </pre>
        <div className="flex mt-2 gap-2">
          <button
            onClick={handleCopy}
            className={`px-4 py-2 ${buttonClasses} text-white rounded-md`}
            aria-label={`Copy ${activeTab === "css" ? "CSS" : "Tailwind CSS"} code to clipboard`}
          >
            {copied ? "Copied!" : `Copy ${activeTab === "css" ? "CSS" : "Tailwind CSS"}`}
          </button>
          
          <button
            onClick={handleDownload}
            className={`px-4 py-2 ${
              darkMode 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-green-500 hover:bg-green-600"
            } text-white rounded-md`}
            aria-label={`Download ${activeTab === "css" ? "CSS" : "Tailwind CSS"} file`}
          >
            Download {activeTab === "css" ? ".css" : "Tailwind"}
          </button>
        </div>
      </div>
    </div>
  );
}
