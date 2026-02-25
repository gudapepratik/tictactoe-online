import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import JoinPrivateGame from "../components/ui/JoinPrivateGame";
import { useSearchParams } from "react-router-dom";

function JoinPrivate() {
  const [joinCode, setJoinCode] = useState<string>("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("join");
    if (code) setJoinCode(code);
  }, []);

  return (
    <div className="w-full h-screen bg-primaryBG crt flex items-center justify-center">
        <Modal
          setCloseModal={null}
          title="JOIN PRIVATE GAME"
          height="auto"
          width='70%'
        >
          <JoinPrivateGame joinCode={joinCode} />
        </Modal>
    </div>
  );
}

export default JoinPrivate;