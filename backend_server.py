"""
OKTrix Backend Server
Flask + SocketIO server for Electron app
"""

from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import cv2
import base64
import numpy as np
import sys
import time
import threading

import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

# Import gesture engine
from core.gesture_engine import GestureEngine

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

gesture_engine = None
camera_active = False


def create_tracking_frame(result):
    """Create black frame with mint landmarks and glow"""
    h, w = 480, 640
    frame = np.zeros((h, w, 3), dtype=np.uint8)
    
    if not result['hand_detected']:
        return frame
    
    try:
        hand_data = gesture_engine.hand_tracker.process_frame(
            cv2.resize(result['annotated_frame'], (w, h))
        )
        
        if hand_data['detected'] and hand_data['landmarks']:
            landmarks = hand_data['landmarks']
            
            # Connections
            connections = [
                (0,1),(1,2),(2,3),(3,4), (0,5),(5,6),(6,7),(7,8),
                (0,9),(9,10),(10,11),(11,12), (0,13),(13,14),(14,15),(15,16),
                (0,17),(17,18),(18,19),(19,20), (5,9),(9,13),(13,17)
            ]
            
            color = (192, 211, 125)  # Mint green BGR
            
            # Draw connections with glow
            for start_idx, end_idx in connections:
                s = landmarks[start_idx]
                e = landmarks[end_idx]
                sp = (int(s[0]*w), int(s[1]*h))
                ep = (int(e[0]*w), int(e[1]*h))
                
                for thick, alpha in [(8,30), (5,60), (3,120), (2,255)]:
                    c = tuple(int(x*alpha/255) for x in color)
                    cv2.line(frame, sp, ep, c, thick)
            
            # Draw points with glow
            for idx, lm in enumerate(landmarks):
                center = (int(lm[0]*w), int(lm[1]*h))
                r = 8 if idx == 0 else 5
                
                for radius, alpha in [(r*3,20), (r*2,40), (r,255)]:
                    c = tuple(int(x*alpha/255) for x in color)
                    cv2.circle(frame, center, radius, c, -1)
    
    except Exception as e:
        print(f"Draw error: {e}")
    
    return frame


def encode_frame(frame):
    _, buf = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
    return f"data:image/jpeg;base64,{base64.b64encode(buf).decode()}"


def camera_loop():
    global camera_active, gesture_engine
    
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    
    if not cap.isOpened():
        print("Camera failed")
        return
    
    print("Camera started")
    
    while camera_active:
        try:
            ret, frame = cap.read()
            if not ret:
                continue
            frame = cv2.flip(frame, 1)
            # Process frame
            result = gesture_engine.process_frame(frame)
            
            # Create tracking frame
            tracking_frame = create_tracking_frame(result)
            
            # Get activation progress
            activation_progress = gesture_engine.get_activation_progress()
            
            # Prepare data
            data = {
                'tracking_frame': encode_frame(tracking_frame),
                'hand_detected': result['hand_detected'],
                'system_active': result['system_active'],
                'current_gesture': result['current_gesture'],
                'activation_progress': activation_progress
            }
            if result.get('play_pause_display'):
                data['play_pause_display'] = result['play_pause_display']
            

            socketio.emit('tracking_update', data)
            
        except Exception as e:
            print(f"Loop error: {e}")
            continue
    
    cap.release()
    print("Stopped")


@socketio.on('connect')
def handle_connect():
    print("Connected")


@socketio.on('start_tracking')
def handle_start():
    global camera_active, gesture_engine
    
    if not camera_active:
        if gesture_engine is None:
            gesture_engine = GestureEngine()
        
        camera_active = True
        threading.Thread(target=camera_loop, daemon=True).start()
        print("Started")


@socketio.on('stop_tracking')
def handle_stop():
    global camera_active
    camera_active = False


@socketio.on('toggle_system')
def handle_toggle(data):
    global gesture_engine
    if gesture_engine:
        new_state = data.get('active', False)
        gesture_engine.is_active = new_state
        if not new_state:
            gesture_engine.reset()
        print(f"System toggled: {'ACTIVE' if new_state else 'INACTIVE'}")


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5847
    print("Backend ready")
    socketio.run(app, host='127.0.0.1', port=port, debug=False, use_reloader=False, allow_unsafe_werkzeug=True)
