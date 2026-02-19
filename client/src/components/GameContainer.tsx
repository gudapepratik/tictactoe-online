import { useState, type ReactNode } from "react";

type props = {
  children: ReactNode
  title: string
  isCollapsable: boolean
  width: string
  height: string
  styleClasses: {
    titleStyles?: string
    containerStyles?: string
    titleContainerStyles?: string
  }
}

function GameContainer({children, title = "Title", isCollapsable = false, width, height, styleClasses}: props) {
  const [showChild, setShowChild] = useState<boolean>(true);

  const handleCollapse = () => {
    if(!isCollapsable) return;
    setShowChild(prev => !prev);
  }

  return (
    <div style={{width, height}} className={`border-4 flex flex-col ${width} ${height} `}>
      <div 
      onClick={handleCollapse}
      className={`flex w-full items-center justify-center ${showChild && "border-b-4"} ${styleClasses?.titleContainerStyles}`}
      >
        <h3 className={`text-xl md:text-2xl p-3 ${styleClasses?.titleStyles}`}>{title}</h3>
      </div>
        {showChild && children}
    </div>
  )
}

export default GameContainer;