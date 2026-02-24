import { useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  title: string;
  isCollapsable?: boolean;
  width?: string;
  styleClasses?: {
    titleStyles?: string;
    containerStyles?: string;
    titleContainerStyles?: string;
  };
};

function GameContainer({
  children,
  title = "Title",
  isCollapsable = false,
  width,
  styleClasses,
}: Props) {
  const [showChild, setShowChild] = useState<boolean>(true);

  return (
    <div
      style={{ width }}
      className={`border-2 border-gray-700 flex flex-col bg-[#0a0a1a] ${styleClasses?.containerStyles ?? ""}`}
    >
      {/* Header */}
      <div
        onClick={() => isCollapsable && setShowChild((p) => !p)}
        className={`flex w-full items-center justify-between px-4 py-2 bg-[#0d0d24] border-b-2 border-gray-700 ${isCollapsable ? "cursor-pointer select-none hover:bg-[#111130]" : ""
          } ${styleClasses?.titleContainerStyles ?? ""}`}
      >
        <h3
          className={`font-pressStart2P text-[11px] md:text-sm text-gray-300 ${styleClasses?.titleStyles ?? ""}`}
        >
          <span className="text-cyan-500 mr-2">■</span>
          {title}
        </h3>
        {isCollapsable && (
          <span className="font-pressStart2P text-gray-500 text-xs">
            {showChild ? "▲" : "▼"}
          </span>
        )}
      </div>

      {showChild && (
        <div className="flex flex-col">{children}</div>
      )}
    </div>
  );
}

export default GameContainer;