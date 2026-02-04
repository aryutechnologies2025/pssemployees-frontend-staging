
import React, { useEffect, useRef, useState } from "react";

const TimeDropdown = ({ value, onChange, disabled = false }) => {
  const boxRef = useRef(null);
  const popupRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [tempHour, setTempHour] = useState("09");
  const [tempMinute, setTempMinute] = useState("00");
  const [tempAmpm, setTempAmpm] = useState("AM");
  const [pos, setPos] = useState({ top: 0, left: 0 });

  // Open dropdown
  const openDropdown = () => {
    if (disabled) return;

    if (value) {
      const parts = value.split(" ");
      if (parts.length === 2) {
        const [h, m] = parts[0].split(":");
        setTempHour(h || "09");
        setTempMinute(m || "00");
        setTempAmpm(parts[1] || "AM");
      }
    }

    const rect = boxRef.current.getBoundingClientRect();
    const popupWidth = 240; // width of the popup in px
    const popupHeight = 120; // approximate height of popup
    const padding = 10; // minimum padding from viewport

    let left = rect.left + window.scrollX;
    let top = rect.bottom + window.scrollY;

    // Adjust right overflow
    if (left + popupWidth + padding > window.scrollX + window.innerWidth) {
      left = window.scrollX + window.innerWidth - popupWidth - padding;
    }

    // Adjust left overflow
    if (left < window.scrollX + padding) {
      left = window.scrollX + padding;
    }

    // Adjust bottom overflow
    if (top + popupHeight + padding > window.scrollY + window.innerHeight) {
      top = rect.top + window.scrollY - popupHeight; // open above
    }

    // Adjust top overflow
    if (top < window.scrollY + padding) {
      top = window.scrollY + padding;
    }

    setPos({ top, left });
    setOpen(true);
  };

  // Close popup on outside click
  useEffect(() => {
    if (disabled) return;
    const handleClickOutside = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        !boxRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [disabled]);

  const handleOk = () => {
    if (disabled) return;
    onChange && onChange(`${tempHour}:${tempMinute} ${tempAmpm}`);
    setOpen(false);
  };

  return (
    <>
      <div
        ref={boxRef}
        onClick={openDropdown}
        className={`px-3 py-1  rounded-lg min-w-[120px] flex items-center justify-between gap-2
          ${disabled
            ? "border border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
            : "border border-green-600 bg-white text-green-700 cursor-pointer"
          }`}
      >
        <span>{value || "09:00 AM"}</span>
        <span
          className={`text-xs transition-transform ${
            open ? "rotate-180" : ""
          } ${disabled ? "text-gray-400" : "text-green-600"}`}
        >
          ▼
        </span>
      </div>

      {open && !disabled && (
        <div
          ref={popupRef}
          className="absolute bg-white border mt-10  border-green-500 rounded-lg shadow-xl p-3"
          style={{
            // top: pos.top,
            // left: pos.left,
            // right: "0",
            width: "240px",
            zIndex: 2000,
          }}
        >
          <div className="flex gap-2 mb-3 justify-between">
            <select
              value={tempHour}
              onChange={(e) => setTempHour(e.target.value)}
              className="border border-green-400 rounded px-2 py-1"
            >
              {Array.from({ length: 12 }, (_, i) =>
                <option key={i+1} value={String(i + 1).padStart(2, "0")}>{String(i + 1).padStart(2, "0")}</option>
              )}
            </select>
            <select
              value={tempMinute}
              onChange={(e) => setTempMinute(e.target.value)}
              className="border border-green-400 rounded px-2 py-1"
            >
              {["00", "15", "30", "45"].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select
              value={tempAmpm}
              onChange={(e) => setTempAmpm(e.target.value)}
              className="border border-green-400 rounded px-2 py-1"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
          <button
            onClick={handleOk}
            className="w-full bg-green-600 text-white py-1 rounded-md hover:bg-green-700"
          >
            OK
          </button>
        </div>
      )}
    </>
  );
};

export default TimeDropdown;
