import { useState } from "react";

type UpdateTypes = "action" | "notification"

type props = {
  type: UpdateTypes;
  close: (value: React.SetStateAction<boolean>) => void
  action?: {
    title: string;
    handler: () => void
  };
  notification?: {
    title: string;
    message: string
  }
}

function PopupGameUpdate({type, close, action, notification}: props) {

  return (
    <div className="absolute w-full h-screen z-[100]  flex items-center justify-center bg-black/20">
      <div className="w-[80%] md:w-[60%] h-[60%] md:h-[50%] text-zinc-800 flex flex-col items-center bg-white">
        <button onClick={() => close(true)}>Close</button>
        {type === "action" && action && (
          <div>

          </div>
        )}

        {type === "notification" && notification && (
          <div className="text-zinc-800">
            <h3 className="text-zinc-800">{notification.title}</h3>
            <h4 className="text-zinc-800">{notification.message}</h4>
          </div>
        )}
      </div>
    </div>
  )
}

export default PopupGameUpdate;