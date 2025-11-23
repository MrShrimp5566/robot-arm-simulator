# 🤖 Robot Arm Physics Simulator

An interactive 2D robot arm physics simulator built with React and HTML5 Canvas. Features inverse kinematics, real-time physics simulation, and an intuitive drag-and-drop interface.

![Robot Arm Simulator](https://img.shields.io/badge/React-18.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.4-purple)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **Inverse Kinematics**: Click anywhere to move the arm automatically
- **Physics Simulation**: Gravity, collisions, friction, and bounce dynamics
- **Interactive Controls**: Drag joints or use sliders for precise positioning
- **Box Stacking**: Grab and stack boxes with the gripper
- **Visual Feedback**: Real-time joint angles and stack height tracking

## 🎮 How to Use

1. **Click** anywhere on the canvas to move the arm tip to that position
2. **Drag** the blue shoulder joint or green elbow joint for manual control
3. **Use sliders** for precise angle adjustments
4. **Grab** boxes by positioning the arm near them and clicking "Grab"
5. **Stack** boxes to achieve higher stacks (get the 🏆 trophy!)

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
│   └── robot.svg          # Favicon
├── src/
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles
├── index.html             # HTML entry point
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS config
└── README.md              # This file
```

## 🛠️ Technologies

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **HTML5 Canvas** - Graphics rendering

## 🎯 Technical Highlights

- **2-Link IK Solver**: Analytical inverse kinematics solution
- **Physics Engine**: Custom gravity, collision detection, and response
- **Animation Loop**: RequestAnimationFrame for smooth 60fps rendering
- **State Management**: useRef for high-performance state in animation loop

## 📝 License

MIT License - feel free to use this project for learning or your own projects!

## 🤝 Contributing

Contributions welcome! Feel free to open issues or submit PRs.

## 🌟 Acknowledgments

Inspired by robotics simulators and educational tools for teaching inverse kinematics.
