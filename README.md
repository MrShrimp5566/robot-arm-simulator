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

```
