"""
OKTrix Hand Tracker
Uses MediaPipe to detect and track hand landmarks in real-time
"""

import cv2
import mediapipe as mp
import numpy as np


class HandTracker:
    def __init__(self, max_hands=1, detection_confidence=0.8, tracking_confidence=0.7):
        """
        Initialize MediaPipe Hand Tracking
        
        Args:
            max_hands: Maximum number of hands to detect
            detection_confidence: Minimum confidence for hand detection
            tracking_confidence: Minimum confidence for hand tracking
        """
        self.mp_hands = mp.solutions.hands
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_drawing_styles = mp.solutions.drawing_styles
        
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=max_hands,
            min_detection_confidence=detection_confidence,
            min_tracking_confidence=tracking_confidence
        )
        
        self.previous_landmarks = None
        
    def process_frame(self, frame):
        """
        Process a single frame to detect hands
        
        Args:
            frame: BGR image from webcam
            
        Returns:
            dict with:
                - detected: bool
                - landmarks: list of 21 landmark points (or None)
                - handedness: "Left" or "Right" (or None)
                - annotated_frame: frame with hand landmarks drawn
        """
        # Convert BGR to RGB (MediaPipe uses RGB)
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Process the frame
        results = self.hands.process(frame_rgb)
        
        # Prepare response
        response = {
            'detected': False,
            'landmarks': None,
            'handedness': None,
            'annotated_frame': frame.copy()
        }
        
        # If hand detected
        if results.multi_hand_landmarks:
            hand_landmarks = results.multi_hand_landmarks[0]  # Get first hand
            handedness = results.multi_handedness[0].classification[0].label
            
            # Draw landmarks on frame
            self.mp_drawing.draw_landmarks(
                response['annotated_frame'],
                hand_landmarks,
                self.mp_hands.HAND_CONNECTIONS,
                self.mp_drawing_styles.get_default_hand_landmarks_style(),
                self.mp_drawing_styles.get_default_hand_connections_style()
            )
            
            # Convert landmarks to list of (x, y, z) tuples
            landmarks_list = []
            for landmark in hand_landmarks.landmark:
                landmarks_list.append((landmark.x, landmark.y, landmark.z))
            
            response['detected'] = True
            response['landmarks'] = landmarks_list
            response['handedness'] = handedness
            
            # Store for motion tracking
            self.previous_landmarks = landmarks_list
        
        return response
    
    def get_landmark(self, landmarks, landmark_id):
        """
        Get specific landmark by ID
        
        Args:
            landmarks: list of landmarks from process_frame
            landmark_id: int (0-20)
                - 0: Wrist
                - 4: Thumb tip
                - 8: Index finger tip
                - 12: Middle finger tip
                - 16: Ring finger tip
                - 20: Pinky tip
        
        Returns:
            tuple (x, y, z) or None
        """
        if landmarks and 0 <= landmark_id < len(landmarks):
            return landmarks[landmark_id]
        return None
    
    def calculate_distance(self, point1, point2):
        """
        Calculate Euclidean distance between two 3D points
        
        Args:
            point1: tuple (x, y, z)
            point2: tuple (x, y, z)
        
        Returns:
            float: distance
        """
        if point1 is None or point2 is None:
            return 0
        
        return np.sqrt(
            (point1[0] - point2[0])**2 +
            (point1[1] - point2[1])**2 +
            (point1[2] - point2[2])**2
        )
    
    def is_hand_open(self, landmarks):
        """
        Detect if hand is open (palm facing camera)
        
        Logic: All fingertips should be far from wrist
        
        Returns:
            bool
        """
        if not landmarks:
            return False
        
        wrist = self.get_landmark(landmarks, 0)
        thumb_tip = self.get_landmark(landmarks, 4)
        index_tip = self.get_landmark(landmarks, 8)
        middle_tip = self.get_landmark(landmarks, 12)
        ring_tip = self.get_landmark(landmarks, 16)
        pinky_tip = self.get_landmark(landmarks, 20)
        
        # Calculate distances from wrist to fingertips
        distances = [
            self.calculate_distance(wrist, thumb_tip),
            self.calculate_distance(wrist, index_tip),
            self.calculate_distance(wrist, middle_tip),
            self.calculate_distance(wrist, ring_tip),
            self.calculate_distance(wrist, pinky_tip)
        ]
        
        # Hand is open if average distance > threshold
        avg_distance = np.mean(distances)
        return avg_distance > 0.3  
    
    def is_ok_sign(self, landmarks):
        if not landmarks:
            return False
    
        wrist = self.get_landmark(landmarks, 0)
        thumb_tip = self.get_landmark(landmarks, 4)
        index_tip = self.get_landmark(landmarks, 8)
        middle_tip = self.get_landmark(landmarks, 12)
        ring_tip = self.get_landmark(landmarks, 16)
        pinky_tip = self.get_landmark(landmarks, 20)
    
        # 1. Thumb and index distance
        thumb_index_distance = self.calculate_distance(thumb_tip, index_tip)
        
    
        if thumb_index_distance > 0.06:
            return False
    
        # 2. Count extended fingers
        fingers_extended = 0
        other_fingers = [middle_tip, ring_tip, pinky_tip]
        for finger_tip in other_fingers:
            distance = self.calculate_distance(wrist, finger_tip)
            if distance > 0.38:
                fingers_extended += 3
       
    
        return fingers_extended >= 1
    
    def is_play_pause_gesture(self, landmarks):
        """
        Detect play/pause gesture
    
        Logic: Thumb tip touching index base (landmark 5)
    
        Returns:
            bool
        """
        if not landmarks:
            return False
    
        thumb_tip = self.get_landmark(landmarks, 4)
        index_base = self.get_landmark(landmarks, 5) 
    
        # Thumb tip must be close to index base
        distance = self.calculate_distance(thumb_tip, index_base)
    
        return distance < 0.06
    def check_environment(self, frame):
        """
        Check if lighting conditions are adequate
        
        Returns:
            dict with:
                - quality: "good", "dark", "bright"
                - brightness: int (0-255)
        """
        # Convert to grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Calculate average brightness
        brightness = np.mean(gray)
        
        if brightness < 50:
            quality = "dark"
        elif brightness > 200:
            quality = "bright"
        else:
            quality = "good"
        
        return {
            'quality': quality,
            'brightness': int(brightness)
        }
    
    def release(self):
        """
        Release MediaPipe resources
        """
        self.hands.close()
