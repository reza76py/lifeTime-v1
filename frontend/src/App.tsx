import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { NavBar } from "./components/NavBar";

import Start from "./pages/Start";
import Level1 from "./pages/Level1";
import Level2 from "./pages/Level2";
import Level3 from "./pages/Level3";
import Total from "./pages/Total";

// import Cat1Bar from "./graphs/Cat1Bar";
import type { Level1Result } from "./api/level1";

function App() {
  const [userId, setUserId] = useState<number | null>(null);

  // ✅ GLOBAL GRAPH STATE
  const [lifeResult, setLifeResult] = useState<Level1Result | null>(null);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-zinc-100">
        <NavBar />
        {/* Top brand bar */}
        <header className="border-b border-zinc-700/50">
          <div className="max-w-5xl mx-auto px-6 py-8 flex items-center">
           
           
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-5xl mx-auto px-6 py-12">
          <div className="bg-zinc-900/60 backdrop-blur rounded-2xl shadow-xl border border-zinc-700/50 p-8 space-y-8">
            
            <Routes>
              {/* Start */}
              <Route
                path="/"
                element={
                  !userId ? (
                    <Start onCreated={setUserId} />
                  ) : (
                    <Navigate to="/level1" replace />
                  )
                }
              />

              {/* Category 1 */}
              <Route
                path="/level1"
                element={
                  userId ? (
                    <Level1
                      userId={userId}
                      onResultChange={setLifeResult}
                      hasResult={!!lifeResult}
                      result={lifeResult}
                    />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />

              {/* Category 2 */}
              <Route
                path="/maintenance"
                element={
                  userId ? (
                    <Level2 userId={userId} />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />

              {/* Category 3 */}
              <Route
                path="/level3"
                element={
                  userId ? (
                    <Level3 userId={userId} />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
              <Route
                path="/total"
                element={
                  userId ? (
                    <Total userId={userId} />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
