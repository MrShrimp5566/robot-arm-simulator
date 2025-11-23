import React from 'react';
import RobotArm from './components/RobotArm';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-3">
      <h1 className="text-xl font-bold text-white mb-1">🤖 Robot Arm Physics Sandbox</h1>
      <RobotArm />
      <p className="text-gray-500 text-xs mt-2">Click to move • Grab boxes • Stack them up! 📦</p>
    </div>
  );
}

export default App;