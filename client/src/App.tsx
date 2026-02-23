import { useEffect, useState } from "react";
import { useSocket } from "./hooks/useSocket"
import Modal from "./components/Modal";
import CreatePrivateGame from "./components/ui/CreatePrivateGame";
import PopupGameUpdate from "./components/PopupGameUpdate";

function App() {
  const {isSocketConnected} = useSocket();
  const [showCreatePrivateModal, setShowCreatePrivateModal] = useState(false);

  const [close ,setClose] = useState<boolean>(false);
  return (
    <>
      {!close && 
        <PopupGameUpdate
          type="notification"
          notification={{
            title: "You won the game",
            message: "Hey, you really won the game, congratulations !!!"
          }}
          close={setClose}
      />}
      {showCreatePrivateModal && <Modal children={<CreatePrivateGame/>} setCloseModal={setShowCreatePrivateModal} title="Private Game" width='70%' height="" extraStyles={{titleStyles: "text-zinc-800", containerStyles: "bg-white", closeBtnStyles: "text-zinc-900"}}/>}
      <div className={`absolute font-pressStart2P top-5 left-5 ${isSocketConnected ? "text-green-500": "text-red-500"}  z-50`}>{isSocketConnected ? "Connected" : "Not Connected"}</div>
      <div className="w-full h-screen crt font-luckyGuy flex items-center justify-center bg-primaryBG">
        <div className="flex gap-5 flex-col items-center">
            {/* <h1 className="text-5xl md:text-8xl flex "><p className=" text-red-500 animate-bounce">Tic</p> <p className="text-green-500 animate-bounce">Tac</p> <p className="text-blue-500 animate-bounce">Toe</p></h1> */}
          <h1 className="text-4xl md:text-6xl flex font-pressStart2P"><p className="text-red-500 animate-bounce">Tic</p><p className="text-green-500 animate-bounce">Tac</p><p className="text-fuchsia-500 animate-bounce">Toe</p></h1>
          <div className="flex items-center gap-6">
            <button 
            className="text-base md:text-xl font-pressStart2P border-4 rounded-2xl px-6 py-3 hover:scale-110 hover:bg-green-500 hover:-skew-x-3 transition-all font-pixel border-white shadow-[4px_4px_0px_0px_white] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
            >Public</button>
            <button onClick={() => setShowCreatePrivateModal(prev => !prev)} 
            className="text-base md:text-xl font-pressStart2P border-4 rounded-2xl px-6 py-3 hover:scale-110 hover:bg-fuchsia-500 hover:skew-x-3 transition-all font-pixel border-white shadow-[4px_4px_0px_0px_white] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
            >Private</button>
          </div>
        </div>
      </div>  
    </>
  )
}

export default App
