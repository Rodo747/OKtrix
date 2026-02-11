# OKTRIX
OKTrix turns your body into your computer's remote control.

No extra hardware. No cloud. No friction.

Oktrix is ​​an alternative input application that uses computer vision and artificial intelligence to enable human-computer interaction through natural gestures. The system processes video input in real time to control multimedia functions of the operating system without the need for specialized hardware, ensuring privacy through local processing.

## Installation

To set up the development environment and run the application, you need to install the dependencies for both the backend (Python) and the frontend (Node.js/Electron).

### System Requirements

Run the following commands in your terminal to install the necessary libraries:

**Backend (Python):**
```bash
pip install -r requirements.txt --break-system-packages
```

**Frontend (Node.js):**
```bash
npm install
```

## Architecture and Technologies

The Oktrix core is based on the integration of **MediaPipe** for hand landmark extraction and **OpenCV** for image processing. The system uses a **Flask** server with **Socket.IO** to transmit telemetry data and control statuses to the user interface in real time.

## Main Components

The source code is structured modularly to separate detection, analysis, and command execution.

#### 1. Tracking Engine (`core/hand_tracker.py`)
This module implements MediaPipe's *Machine Learning* solution. Its main function is to process each camera frame to detect the presence of hands and extract the 3D coordinates of 21 key points. It includes geometric algorithms to calculate Euclidean distances between fingers, allowing the identification of static states such as an open hand or the "👌" activation gesture.

#### 2. Motion Analyzer (`core/motion_analyzer.py`)
This class is responsible for the temporal analysis of gestures. It maintains a circular buffer of recent hand positions to calculate motion vectors.

* **Vector Calculation**: Determines the direction (dx, dy) and magnitude of the displacement between frames.

* **Filtering**: Applies sensitivity thresholds to distinguish between intentional movements (swipes) and noise or involuntary tremors.

#### 3. Gesture Engine (`core/gesture_engine.py`)
Acts as the system's state machine. It coordinates information from the *Hand Tracker* and the *Motion Analyzer* to:
* Manage the system's activation state (Active/Inactive) by sustained detection of the "👌" gesture.

* Interpret movement patterns and translate them into semantic events (e.g., `swipe_up`, `swipe_left`).

* Implement cooldown mechanisms to prevent accidental, repetitive command execution.

#### 4. Multimedia Control (`modules/media_control.py`)
An abstraction layer that interacts with the operating system's APIs. It uses libraries such as `pycaw` for controlling the Windows audio mixer and `pyautogui` for keyboard event injection, enabling universal control of media players.

## Functionality

The system operates under an explicit interaction model to minimize false positives.

* **Activation/Deactivation**: Activated by holding the "👌" gesture for 3 seconds.

* **Volume Control**: Vertical swipe gestures (Up/Down).

* **Track Navigation**: Horizontal swipe gestures (Left/Right).

* **Playback**: Closed palm gesture with the thumb pressed against the palm and a small forward movement to toggle between Play and Pause.

## Privacy and Performance

Oktrix follows a *Privacy-First* design. All computer vision computation is performed locally on the user's device using the CPU/GPU. No video streams are stored or transmitted to external servers. The processing pipeline is optimized to maintain low latency (<50ms), ensuring a smooth interface response.