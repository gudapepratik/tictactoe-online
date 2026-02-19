import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import JoinPrivateGame from "../components/ui/JoinPrivateGame";
import { useSearchParams } from "react-router-dom";

function JoinPrivate() {
  const [closeModal, setCloseModal] = useState<boolean>(false);
  const [joinCode, setJoinCode] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const joinCode = searchParams.get("join");
    if(joinCode)
      setJoinCode(joinCode);
  }, []);

  return (
    <div className="w-full h-screen bg-primaryBG">
      <Modal
        children = {
        <JoinPrivateGame 
          joinCode={joinCode}
        />
        }
        setCloseModal={setCloseModal}
        title="Join Private"
        height=""
        width='70%'
        extraStyles={{
          containerStyles: "bg-zinc-100",
          titleStyles: "text-zinc-800"
        }}
      />
    </div>
  )
};

export default JoinPrivate;