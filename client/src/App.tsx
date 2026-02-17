function App() {

  const createPrivateGame = async () => {

  }


  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r from-slate-800 to-slate-900">

        <div className="flex items-center gap-4">
          <button className="text-4xl font-luckyGuy border-4 rounded-2xl px-6 py-3 hover:scale-110 hover:bg-rose-600 hover:-skew-x-3 transition-all">Public</button>
          <button onClick={createPrivateGame} className="text-4xl font-luckyGuy border-4 rounded-2xl px-6 py-3 hover:scale-110 hover:bg-rose-600 hover:skew-x-3 transition-all">Private</button>
        </div>
      </div>  
    </>
  )
}

export default App
