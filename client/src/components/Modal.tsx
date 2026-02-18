import { FaCross } from "react-icons/fa"
import { FaX } from "react-icons/fa6"

type props = {
  title: string
  children: React.ReactNode
  setCloseModal: React.Dispatch<React.SetStateAction<boolean>>
  width: string
  height: string
  extraStyles?: {
    titleStyles?: string
    closeBtnStyles?: string
    containerStyles?: string
  }
}

function Modal({title, children, width, height, setCloseModal, extraStyles}: props) {
  return (
    <div className="font-luckyGuy absolute flex font-grandstander bg-black/45 transition-opacity items-center justify-center z-50 w-full h-full">
      <div style={{width, height}} className={`flex flex-col p-3 md:p-5 ${extraStyles?.containerStyles}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl md:text-3xl  ${extraStyles?.titleStyles}`}>{title}</h3>
          <button onClick={() => setCloseModal(false)} className={`${extraStyles?.closeBtnStyles}`}><FaX style={{color: "red", backgroundColor: "black", padding: "2px"}} size={22} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal;