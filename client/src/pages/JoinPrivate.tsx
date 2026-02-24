import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import JoinPrivateGame from "../components/ui/JoinPrivateGame";
import { useSearchParams } from "react-router-dom";

function JoinPrivate() {
  const [closeModal, setCloseModal] = useState<boolean>(true);
  const [joinCode, setJoinCode] = useState<string>("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("join");
    if (code) setJoinCode(code);
  }, []);

  return (
    <div className="w-full h-screen bg-primaryBG crt flex items-center justify-center">
      {/* Retro title */}
      <div className="absolute top-6 left-0 right-0 flex justify-center">
        <h1 className="font-pressStart2P text-xl md:text-3xl flex">
          <span className="neon-blue flicker">TIC</span>
          <span className="neon-pink flicker" style={{ animationDelay: "0.3s" }}>TAC</span>
          <span className="neon-yellow flicker" style={{ animationDelay: "0.6s" }}>TOE</span>
        </h1>
      </div>

      {closeModal && (
        <Modal
          setCloseModal={setCloseModal}
          title="JOIN PRIVATE GAME"
          height="auto"
          width="min(90vw, 560px)"
        >
          <JoinPrivateGame joinCode={joinCode} />
        </Modal>
      )}

      {/* Footer */}
      <div className="absolute bottom-4 font-pressStart2P text-[8px] text-gray-700">
        INSERT COIN TO CONTINUE
      </div>
    </div>
  );
}

export default JoinPrivate;