# 🤖 Robot Arm Physics Simulator

An interactive 2D robot arm physics simulator built with React and HTML5 Canvas. Features inverse kinematics, real-time physics simulation, and an intuitive drag-and-drop interface.

![Robot Arm Simulator](https://img.shields.io/badge/React-18.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.4-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **Inverse Kinematics**: Click anywhere to move the arm automatically
- **Physics Simulation**: Gravity, collisions, friction, and bounce dynamics
- **Interactive Controls**: Drag joints or use sliders for precise positioning
- **Keyboard Shortcuts**: Fast controls with Space, C, and R keys
- **Box Stacking**: Grab and stack boxes with the gripper
- **Visual Feedback**: Real-time joint angles, stack height tracking, and success/error messages

## 🎮 How to Use

### Moving the Arm

1. **Click** anywhere on the canvas to move the arm tip to that position (inverse kinematics)
2. **Drag** the blue shoulder joint or green elbow joint for manual control
3. **Use sliders** for precise angle adjustments (-180° to 180° shoulder, -150° to 150° elbow)

### Operating the Claw

1. **Position** the arm near a box you want to grab
2. **Click "Close Claw"** button or press **Space** or **C** key
3. The claw will automatically grab any box within reach
4. **Move** the arm to your desired location
5. **Click "Open Claw"** or press **Space**/**C** again to release the box

### Stacking Challenge

- Stack boxes on top of each other to increase your stack height
- 🏆 **Get 3+ boxes stacked** for the "Nice!" trophy
- ⭐ **Get all 4 boxes stacked** for the "Perfect!" achievement

### Keyboard Shortcuts

- **Space** or **C**: Toggle claw (close/open)
- **R**: Reset simulation

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/robot-arm-simulator.git
cd robot-arm-simulator

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app.

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
robot-arm-simulator/
├── public/
│   └── robot.svg              # Favicon
├── src/
│   ├── components/
│   │   └── RobotArm.jsx       # Main robot arm component
│   ├── App.jsx                # App wrapper
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles + Tailwind
├── index.html                 # HTML entry point
├── package.json               # Dependencies
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS config
├── postcss.config.js          # PostCSS configuration
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 🛠️ Technologies

- **React 18** - UI framework with hooks
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **HTML5 Canvas** - High-performance graphics rendering

## 🎯 Technical Highlights

- **2-Link IK Solver**: Analytical inverse kinematics solution using trigonometry
- **Physics Engine**: Custom gravity, collision detection, and elastic/inelastic response
- **Animation Loop**: RequestAnimationFrame for smooth 60fps rendering
- **State Management**: useRef for high-performance state in animation loop
- **Keyboard Events**: Global keyboard listener for accessibility
- **Real-time Feedback**: Success/error messages with auto-dismiss

## 🎨 Features Breakdown

### Inverse Kinematics

The simulator uses analytical inverse kinematics to solve for joint angles given a target end-effector position. The solution uses the law of cosines and handles workspace boundaries.

### Physics Simulation

- **Gravity**: Constant downward acceleration (0.5 units/frame²)
- **Friction**: Surface friction coefficient (0.8)
- **Bounce**: Restitution coefficient (0.3)
- **Collision Detection**: AABB (Axis-Aligned Bounding Box) collision with response
- **Box-Box Collisions**: Separating axis theorem with impulse resolution

### Control Modes

1. **Click-to-Move**: IK-based automatic movement
2. **Joint Dragging**: Direct manipulation of shoulder/elbow
3. **Slider Control**: Precise angle adjustment
4. **Keyboard Control**: Fast claw operation

## 🐛 Known Limitations

- 2D simulation only (no depth/3D movement)
- Simple gripper (no force feedback or slip detection)
- Fixed workspace boundaries
- Maximum 4 boxes in simulation

## 📝 License

MIT License - feel free to use this project for learning or your own projects!

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

### Development Setup

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
