"""
OKTrix Motion Analyzer
Detects directional movement of hand gestures (left, right, up, down)
"""

import numpy as np
from collections import deque


class MotionAnalyzer:
    def __init__(self, buffer_size=5):
        """
        Initialize motion tracking
        
        Args:
            buffer_size: Number of frames to analyze for motion
        """
        self.buffer_size = buffer_size
        self.position_buffer = deque(maxlen=buffer_size)
        
    def add_position(self, landmarks):
        """
        Add current hand position to buffer
        
        Args:
            landmarks: list of 21 landmarks from HandTracker
        """
        if not landmarks:
            return
        

        wrist = landmarks[0]
        self.position_buffer.append(wrist)
    
    def get_motion_vector(self):
        """
        Calculate motion vector from recent positions
        
        Returns:
            tuple (dx, dy) representing movement direction
            or None if insufficient data
        """
        if len(self.position_buffer) < 2:
            return None
        
        # Get first and last position in buffer
        start_pos = self.position_buffer[0]
        end_pos = self.position_buffer[-1]
        
        # Calculate displacement
        dx = end_pos[0] - start_pos[0]
        dy = end_pos[1] - start_pos[1]
        
        return (dx, dy)
    
    def get_motion_direction(self, threshold=0.05):
        """
        Determine primary motion direction
        
        Args:
            threshold: Minimum displacement to register as motion
        
        Returns:
            str: "left", "right", "up", "down", "stationary", or None
        """
        vector = self.get_motion_vector()
        
        if vector is None:
            return None
        
        dx, dy = vector
        
        # Calculate magnitude of movement
        magnitude = np.sqrt(dx**2 + dy**2)
        
        if magnitude < threshold:
            return "stationary"
        
        # Determine primary direction based on which component is larger
        if abs(dx) > abs(dy):
            # Horizontal movement
            return "right" if dx > 0 else "left"
        else:
            # Vertical movement
            # Note: In image coordinates, Y increases downward
            return "down" if dy > 0 else "up"
    
    def clear_buffer(self):
        """
        Clear position buffer (call when gesture is recognized)
        """
        self.position_buffer.clear()
    
    def is_motion_stable(self, min_frames=3):
        """
        Check if we have enough frames for reliable motion detection
        
        Returns:
            bool
        """
        return len(self.position_buffer) >= min_frames
