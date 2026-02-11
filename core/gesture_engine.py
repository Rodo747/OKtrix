"""
OKTrix Gesture Engine
Main gesture recognition system combining hand tracking and motion analysis
"""

import time
import threading
from .hand_tracker import HandTracker
from .motion_analyzer import MotionAnalyzer

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from modules.media_control import MediaController


class GestureEngine:
    def __init__(self):
        """
        Initialize the gesture recognition engine
        """
        self.hand_tracker = HandTracker(
            max_hands=1,
            detection_confidence=0.7,
            tracking_confidence=0.7
        )
        self.motion_analyzer = MotionAnalyzer(buffer_size=5)

        self.media_controller = MediaController()

        # System state
        self.is_active = False
        self.ok_gesture_start_time = None
        self.ok_gesture_hold_duration = 3.0  
        
        # Gesture detection state
        self.last_gesture = None
        self.last_gesture_time = 0
        self.gesture_cooldown = 0.7  
        
        # Hand warmup
        self.hand_detected_since = None
        self.hand_warmup_delay = 0.6  
        
    def process_frame(self, frame):
        """
        Process a single frame for gesture recognition
        
        Args:
            frame: BGR image from webcam
        
        Returns:
            dict with:
                - hand_detected: bool
                - system_active: bool
                - current_gesture: str or None
                - environment_quality: dict
                - annotated_frame: frame with visual feedback
        """
        # Track hand in frame
        hand_data = self.hand_tracker.process_frame(frame)
        
        # Check environment quality
        env_quality = self.hand_tracker.check_environment(frame)
        
        # Prepare response
        response = {
            'hand_detected': hand_data['detected'],
            'system_active': self.is_active,
            'current_gesture': None,
            'environment_quality': env_quality,
            'annotated_frame': hand_data['annotated_frame']
        }
        
        if not hand_data['detected']:
            # No hand detected - reset state
            self.ok_gesture_start_time = None
            self.hand_detected_since = None
            self.motion_analyzer.clear_buffer()
            return response
        
        landmarks = hand_data['landmarks']
        
        # Warmup
        now = time.time()
        if self.hand_detected_since is None:
            self.hand_detected_since = now
        warmup_passed = (now - self.hand_detected_since) >= self.hand_warmup_delay
        
        # Check for OK gesture 
        if self.hand_tracker.is_ok_sign(landmarks):
            if self.ok_gesture_start_time is None:
                # Start tracking hold time
                self.ok_gesture_start_time = time.time()
            else:
                # Check hold duration
                hold_duration = time.time() - self.ok_gesture_start_time
                if hold_duration >= self.ok_gesture_hold_duration:
                    # Toggle system state
                    self.is_active = not self.is_active
                    response['current_gesture'] = 'system_toggle'
                    response['system_active'] = self.is_active
                    
                    # Reset state
                    self.ok_gesture_start_time = None
                    self.motion_analyzer.clear_buffer()
                    
                    print(f"System {'ACTIVATED' if self.is_active else 'DEACTIVATED'}")
                    
        else:
            # Reset if gesture is lost
            if self.ok_gesture_start_time is not None:
                # Allow small interruptions
                time_since_start = time.time() - self.ok_gesture_start_time
                if time_since_start > 0.3:  
                    self.ok_gesture_start_time = None
        
        # Process active gestures
        if self.is_active and warmup_passed:
            # Track motion
            self.motion_analyzer.add_position(landmarks)
            
            # Check cooldown
            current_time = time.time()
            if current_time - self.last_gesture_time < self.gesture_cooldown:
                return response
            
            # Ensure motion is stable
            if not self.motion_analyzer.is_motion_stable(min_frames=3):
                return response
            
            # Check for swipe gestures
            if self.hand_tracker.is_hand_open(landmarks):
                # Analyze motion direction
                direction = self.motion_analyzer.get_motion_direction(threshold=0.12)
                
                if direction and direction != "stationary":
                    
                    gesture_map = {
                        "left": "swipe_left",
                        "right": "swipe_right",
                        "up": "swipe_up",
                        "down": "swipe_down"
                    }
                    
                    gesture_name = gesture_map.get(direction)
                    
                    if gesture_name:
                        response['current_gesture'] = gesture_name
                        self.last_gesture = gesture_name
                        self.last_gesture_time = current_time
                        
                        # Clear buffer after gesture detected
                        self.motion_analyzer.clear_buffer()
                        
                        print(f"Gesture detected: {gesture_name.upper()}")

                        # Execute media command
                        threading.Thread(
                            target=self.media_controller.execute_gesture,
                            args=(gesture_name,),
                            daemon=True
                        ).start()
            
            # Check for play/pause gesture
            if self.hand_tracker.is_play_pause_gesture(landmarks):
                # Check for downward motion
                direction = self.motion_analyzer.get_motion_direction(threshold=0.05)

                if direction == "down":
                    play_pause_label = self.media_controller.get_next_play_pause_display()
                    response['current_gesture'] = 'play_pause'
                    response['play_pause_display'] = play_pause_label
                    self.last_gesture = 'play_pause'
                    self.last_gesture_time = current_time
            
                    # Clear buffer after gesture detected
                    self.motion_analyzer.clear_buffer()
            
                    print(f"Gesture detected: {play_pause_label}")

                    # Execute media command
                    threading.Thread(
                        target=self.media_controller.execute_gesture,
                        args=('play_pause',),
                        daemon=True
                    ).start()

        return response  
    
    def get_activation_progress(self):
        """
        Get progress of OK gesture hold (0.0 to 1.0)
        
        Returns:
            float: progress percentage, or 0 if not holding OK gesture
        """
        if self.ok_gesture_start_time is None:
            return 0.0
        
        hold_duration = time.time() - self.ok_gesture_start_time
        progress = min(hold_duration / self.ok_gesture_hold_duration, 1.0)
        return progress
    
    def reset(self):
        """
        Reset all gesture engine state
        """
        self.is_active = False
        self.ok_gesture_start_time = None
        self.last_gesture = None
        self.last_gesture_time = 0
        self.motion_analyzer.clear_buffer()
    
    def release(self):
        """
        Release resources
        """
        self.hand_tracker.release()
