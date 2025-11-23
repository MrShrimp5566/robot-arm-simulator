import React, { useRef, useEffect, useState } from 'react';

function RobotArm() {
  const canvasRef = useRef(null);
  const [joint1, setJoint1] = useState(45);
  const [joint2, setJoint2] = useState(-30);
  const [stackCount, setStackCount] = useState(1);
  const [clawClosed, setClawClosed] = useState(false);
  const [error, setError] = useState('');
  const [heldBox, setHeldBox] = useState(null);
  const [success, setSuccess] = useState('');
  
  // State refs for animation loop
  const stateRef = useRef({
    joint1: 45,
    joint2: -30,
    targetJ1: 45,
    targetJ2: -30,
    isAnimating: false,
    dragging: null,
    clawClosed: false,
    heldBox: null,
    targetPt: null,
    boxes: [
      { id: 1, x: 80, y: 294, vx: 0, vy: 0, color: '#ef4444', size: 26 },
      { id: 2, x: 320, y: 294, vx: 0, vy: 0, color: '#3b82f6', size: 26 },
      { id: 3, x: 140, y: 294, vx: 0, vy: 0, color: '#22c55e', size: 26 },
      { id: 4, x: 260, y: 294, vx: 0, vy: 0, color: '#a855f7', size: 26 },
    ]
  });

  const baseX = 200, baseY = 300, L1 = 100, L2 = 80, floorY = 307;
  const gravity = 0.5, friction = 0.8, bounce = 0.3;

  const getArmPos = (j1, j2) => {
    const r1 = j1 * Math.PI / 180;
    const r2 = (j1 + j2) * Math.PI / 180;
    const elbow = { x: baseX + L1 * Math.cos(-r1), y: baseY + L1 * Math.sin(-r1) };
    const end = { x: elbow.x + L2 * Math.cos(-r2), y: elbow.y + L2 * Math.sin(-r2) };
    return { elbow, end, clawAngle: -r2 };
  };

  const solveIK = (tx, ty) => {
    const x = tx - baseX, y = baseY - ty;
    const d = Math.sqrt(x*x + y*y);
    if (d > L1 + L2 - 5 || d < Math.abs(L1 - L2) + 5) return null;
    const cosT2 = Math.max(-1, Math.min(1, (d*d - L1*L1 - L2*L2) / (2*L1*L2)));
    const t2 = -Math.acos(cosT2);
    const alpha = Math.atan2(y, x);
    const beta = Math.acos((L1*L1 + d*d - L2*L2) / (2*L1*d));
    const t1 = alpha + beta;
    return { t1: t1 * 180 / Math.PI, t2: t2 * 180 / Math.PI };
  };

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 2000);
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 2000);
  };

  const updatePhysics = () => {
    const state = stateRef.current;
    const { end } = getArmPos(state.joint1, state.joint2);
    
    state.boxes.forEach(box => {
      if (box.id === state.heldBox) {
        box.x = end.x; box.y = end.y + 18; box.vx = 0; box.vy = 0;
        return;
      }
      box.vy += gravity;
      box.x += box.vx; box.y += box.vy;
      
      if (box.y + box.size/2 > floorY) {
        box.y = floorY - box.size/2;
        box.vy = -box.vy * bounce;
        box.vx *= friction;
        if (Math.abs(box.vy) < 0.5) box.vy = 0;
      }
      if (box.x - box.size/2 < 0) { box.x = box.size/2; box.vx = -box.vx * bounce; }
      if (box.x + box.size/2 > 400) { box.x = 400 - box.size/2; box.vx = -box.vx * bounce; }
    });
    
    // Box collisions
    for (let i = 0; i < state.boxes.length; i++) {
      for (let j = i + 1; j < state.boxes.length; j++) {
        const a = state.boxes[i], b = state.boxes[j];
        if (a.id === state.heldBox || b.id === state.heldBox) continue;
        const ox = (a.size/2 + b.size/2) - Math.abs(a.x - b.x);
        const oy = (a.size/2 + b.size/2) - Math.abs(a.y - b.y);
        if (ox > 0 && oy > 0) {
          if (ox < oy) {
            const px = ox / 2;
            if (a.x < b.x) { a.x -= px; b.x += px; } else { a.x += px; b.x -= px; }
            const tv = a.vx; a.vx = b.vx * bounce; b.vx = tv * bounce;
          } else {
            const py = oy / 2;
            if (a.y < b.y) { a.y -= py; b.y += py; a.vy = Math.min(a.vy, 0); b.vy = Math.max(b.vy * bounce, 0); }
            else { a.y += py; b.y -= py; b.vy = Math.min(b.vy, 0); a.vy = Math.max(a.vy * bounce, 0); }
            a.vx *= friction; b.vx *= friction;
          }
        }
      }
    }
    
    // Count stack
    let maxStack = 1;
    const sorted = state.boxes.filter(b => b.id !== state.heldBox).sort((a,b) => b.y - a.y);
    for (let i = 0; i < sorted.length; i++) {
      let stack = 1, cur = sorted[i];
      for (let j = 0; j < sorted.length; j++) {
        if (i === j) continue;
        const o = sorted[j];
        if (o.y < cur.y - 20 && Math.abs(o.x - cur.x) < cur.size) { stack++; cur = o; }
      }
      maxStack = Math.max(maxStack, stack);
    }
    setStackCount(maxStack);
  };

  const updateArm = () => {
    const state = stateRef.current;
    if (!state.isAnimating) return;
    let done = true;
    let d1 = state.targetJ1 - state.joint1, d2 = state.targetJ2 - state.joint2;
    if (Math.abs(d1) > 0.5) { state.joint1 += d1 * 0.12; done = false; } else state.joint1 = state.targetJ1;
    if (Math.abs(d2) > 0.5) { state.joint2 += d2 * 0.12; done = false; } else state.joint2 = state.targetJ2;
    setJoint1(state.joint1);
    setJoint2(state.joint2);
    if (done) { state.isAnimating = false; state.targetPt = null; }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = stateRef.current;
    
    ctx.fillStyle = '#1f2937'; ctx.fillRect(0, 0, 400, 340);
    
    // Grid
    ctx.strokeStyle = '#374151'; ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(i*50,0); ctx.lineTo(i*50,340); ctx.stroke(); }
    for (let i = 0; i <= 7; i++) { ctx.beginPath(); ctx.moveTo(0,i*50); ctx.lineTo(400,i*50); ctx.stroke(); }
    
    // Floor
    ctx.fillStyle = '#292524'; ctx.fillRect(0, floorY, 400, 40);
    ctx.strokeStyle = '#78716c'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, floorY); ctx.lineTo(400, floorY); ctx.stroke();
    
    // Workspace
    ctx.strokeStyle = '#374151'; ctx.lineWidth = 1; ctx.setLineDash([4,4]);
    ctx.beginPath(); ctx.arc(baseX, baseY, L1+L2, 0, Math.PI*2); ctx.stroke();
    ctx.setLineDash([]);
    
    // Target
    if (state.targetPt) {
      ctx.fillStyle = '#f59e0b'; ctx.globalAlpha = 0.6;
      ctx.beginPath(); ctx.arc(state.targetPt.x, state.targetPt.y, 6, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
    }
    
    // Boxes
    state.boxes.forEach(box => {
      ctx.fillStyle = box.color;
      ctx.fillRect(box.x - box.size/2, box.y - box.size/2, box.size, box.size);
      ctx.strokeStyle = box.id === state.heldBox ? '#fbbf24' : 'rgba(0,0,0,0.5)';
      ctx.lineWidth = box.id === state.heldBox ? 3 : 2;
      ctx.strokeRect(box.x - box.size/2, box.y - box.size/2, box.size, box.size);
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillRect(box.x - box.size/3, box.y - box.size/2 + 2, box.size/1.5, box.size/5);
    });
    
    const { elbow, end, clawAngle } = getArmPos(state.joint1, state.joint2);
    
    // Base
    ctx.fillStyle = '#4B5563';
    ctx.fillRect(baseX-30, baseY, 60, 20);
    ctx.fillStyle = '#374151';
    ctx.fillRect(baseX-40, baseY+20, 80, 15);
    
    // Link 1
    ctx.strokeStyle = '#3B82F6'; ctx.lineWidth = 14; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(baseX, baseY); ctx.lineTo(elbow.x, elbow.y); ctx.stroke();
    
    // Link 2
    ctx.strokeStyle = '#10B981'; ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(elbow.x, elbow.y); ctx.lineTo(end.x, end.y); ctx.stroke();
    
    // Claw
    const cLen = 18, cSpread = state.clawClosed ? 0.12 : 0.45;
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(end.x + cLen * Math.cos(clawAngle - cSpread), end.y + cLen * Math.sin(clawAngle - cSpread));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(end.x + cLen * Math.cos(clawAngle + cSpread), end.y + cLen * Math.sin(clawAngle + cSpread));
    ctx.stroke();
    ctx.fillStyle = '#b45309';
    ctx.beginPath(); ctx.arc(end.x, end.y, 7, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(end.x, end.y, 7, 0, Math.PI*2); ctx.stroke();
    
    // Joints
    ctx.fillStyle = '#1E40AF';
    ctx.beginPath(); ctx.arc(baseX, baseY, 12, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#60A5FA'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(baseX, baseY, 12, 0, Math.PI*2); ctx.stroke();
    
    ctx.fillStyle = '#065F46';
    ctx.beginPath(); ctx.arc(elbow.x, elbow.y, 9, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#34D399';
    ctx.beginPath(); ctx.arc(elbow.x, elbow.y, 9, 0, Math.PI*2); ctx.stroke();
  };

  useEffect(() => {
    const loop = () => {
      updatePhysics();
      updateArm();
      draw();
      requestAnimationFrame(loop);
    };
    const animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' || e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleClawToggle();
      } else if (e.key.toLowerCase() === 'r') {
        handleReset();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleCanvasClick = (e) => {
    const state = stateRef.current;
    if (state.dragging) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const { elbow } = getArmPos(state.joint1, state.joint2);
    
    if (Math.hypot(x - baseX, y - baseY) < 15 || Math.hypot(x - elbow.x, y - elbow.y) < 12) return;
    
    const ik = solveIK(x, y);
    if (ik) {
      state.targetJ1 = ik.t1; state.targetJ2 = ik.t2;
      state.targetPt = { x, y };
      state.isAnimating = true;
    } else {
      showError('⚠️ Out of reach!');
    }
  };

  const handleCanvasMouseDown = (e) => {
    const state = stateRef.current;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const { elbow } = getArmPos(state.joint1, state.joint2);
    
    if (Math.hypot(x - baseX, y - baseY) < 15) { state.dragging = 'j1'; state.isAnimating = false; return; }
    if (Math.hypot(x - elbow.x, y - elbow.y) < 12) { state.dragging = 'j2'; state.isAnimating = false; return; }
  };

  const handleCanvasMouseMove = (e) => {
    const state = stateRef.current;
    if (!state.dragging) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const { elbow } = getArmPos(state.joint1, state.joint2);
    
    if (state.dragging === 'j1') {
      state.joint1 = Math.max(-180, Math.min(180, Math.atan2(-(y - baseY), x - baseX) * 180 / Math.PI));
      state.targetJ1 = state.joint1;
      setJoint1(state.joint1);
    } else if (state.dragging === 'j2') {
      const ang = Math.atan2(-(y - elbow.y), x - elbow.x) * 180 / Math.PI - state.joint1;
      state.joint2 = Math.max(-150, Math.min(150, ang));
      state.targetJ2 = state.joint2;
      setJoint2(state.joint2);
    }
  };

  const handleCanvasMouseUp = () => {
    stateRef.current.dragging = null;
  };

  const handleClawToggle = () => {
    const state = stateRef.current;
    const { end } = getArmPos(state.joint1, state.joint2);
    
    if (!state.clawClosed) {
      // Closing claw - try to grab
      const near = state.boxes.find(b => Math.hypot(b.x - end.x, b.y - end.y) < 40);
      if (near) {
        state.heldBox = near.id;
        setHeldBox(near.id);
        showSuccess('✓ Grabbed box!');
      } else {
        showError('✗ No box nearby');
      }
      state.clawClosed = true;
      setClawClosed(true);
    } else {
      // Opening claw - drop
      if (state.heldBox) {
        showSuccess('✓ Dropped box!');
      }
      state.heldBox = null;
      setHeldBox(null);
      state.clawClosed = false;
      setClawClosed(false);
    }
  };

  const handleReset = () => {
    stateRef.current.boxes = [
      { id: 1, x: 80, y: 294, vx: 0, vy: 0, color: '#ef4444', size: 26 },
      { id: 2, x: 320, y: 294, vx: 0, vy: 0, color: '#3b82f6', size: 26 },
      { id: 3, x: 140, y: 294, vx: 0, vy: 0, color: '#22c55e', size: 26 },
      { id: 4, x: 260, y: 294, vx: 0, vy: 0, color: '#a855f7', size: 26 },
    ];
    stateRef.current.heldBox = null;
    stateRef.current.clawClosed = false;
    setHeldBox(null);
    setClawClosed(false);
    showSuccess('✓ Reset complete!');
  };

  const handleSlider1Change = (e) => {
    const val = +e.target.value;
    stateRef.current.joint1 = val;
    stateRef.current.targetJ1 = val;
    stateRef.current.isAnimating = false;
    setJoint1(val);
  };

  const handleSlider2Change = (e) => {
    const val = +e.target.value;
    stateRef.current.joint2 = val;
    stateRef.current.targetJ2 = val;
    stateRef.current.isAnimating = false;
    setJoint2(val);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-xs text-yellow-400 mb-2 flex items-center gap-3">
        <span>Stack: <span className="font-bold">{stackCount}</span> high</span>
        {stackCount >= 3 && <span className="text-green-400">🏆 Nice!</span>}
        {stackCount >= 4 && <span className="text-purple-400">⭐ Perfect!</span>}
      </div>
      
      {error && (
        <div className="bg-red-600 text-white px-3 py-1 rounded text-xs mb-2 animate-pulse">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-600 text-white px-3 py-1 rounded text-xs mb-2">
          {success}
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        width={400}
        height={340}
        className="bg-gray-800 rounded-lg border border-gray-700 cursor-crosshair"
        onClick={handleCanvasClick}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
      />
      
      <div className="flex gap-2 mt-2 w-full max-w-md">
        <button
          onClick={handleClawToggle}
          className={`flex-1 py-2.5 px-4 rounded-md font-semibold text-sm text-white transition-colors ${
            clawClosed 
              ? 'bg-orange-600 hover:bg-orange-700' 
              : 'bg-yellow-600 hover:bg-yellow-700'
          }`}
        >
          {clawClosed ? (
            <>🖐️ Open Claw{heldBox ? ' 📦' : ''}</>
          ) : (
            <>✊ Close Claw</>
          )}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md font-semibold text-sm transition-colors"
          title="Reset (R)"
        >
          ↻ Reset
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-2 w-full max-w-md">
        <div className="bg-gray-800 p-2.5 rounded-lg">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-blue-400 font-medium">Shoulder</span>
            <span className="text-blue-400 font-mono">{joint1.toFixed(0)}°</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            value={joint1}
            onChange={handleSlider1Change}
            className="w-full h-1.5 bg-blue-900 rounded appearance-none cursor-pointer"
          />
        </div>
        <div className="bg-gray-800 p-2.5 rounded-lg">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-green-400 font-medium">Elbow</span>
            <span className="text-green-400 font-mono">{joint2.toFixed(0)}°</span>
          </div>
          <input
            type="range"
            min="-150"
            max="150"
            value={joint2}
            onChange={handleSlider2Change}
            className="w-full h-1.5 bg-green-900 rounded appearance-none cursor-pointer"
          />
        </div>
      </div>
      
      <div className="text-gray-500 text-xs mt-2 text-center">
        <kbd className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">Space</kbd> or{' '}
        <kbd className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">C</kbd> to toggle claw •{' '}
        <kbd className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">R</kbd> to reset
      </div>
    </div>
  );
}

export default RobotArm;