import { FaX } from "react-icons/fa6";

type Props = {
  title: string;
  children: React.ReactNode;
  setCloseModal: React.Dispatch<React.SetStateAction<boolean>>;
  width: string;
  height: string;
  extraStyles?: {
    titleStyles?: string;
    closeBtnStyles?: string;
    containerStyles?: string;
  };
};

function Modal({ title, children, width, height, setCloseModal, extraStyles }: Props) {
  return (
    <div className="font-pressStart2P fixed inset-0 flex bg-black/80 items-center justify-center z-50">
      <div
        style={{ width, height }}
        className={`flex flex-col p-5 md:p-8 bg-[#080818] border-2 border-cyan-900 pixel-box ${extraStyles?.containerStyles ?? ""}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3
            className={`text-sm md:text-lg neon-blue flicker ${extraStyles?.titleStyles ?? ""}`}
          >
            <span className="text-cyan-500 mr-2">■</span>
            {title}
          </h3>
          <button
            onClick={() => setCloseModal(false)}
            className={`retro-btn text-red-400 border-red-700 w-8 h-8 flex items-center justify-center ${extraStyles?.closeBtnStyles ?? ""}`}
          >
            <FaX size={14} />
          </button>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}

export default Modal;