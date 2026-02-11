"""
OKTrix Media Control Module
Translates gestures into media player commands (YouTube, Spotify, VLC, etc.)
"""

import pyautogui
import psutil
import time
from ctypes import cast, POINTER
from comtypes import CLSCTX_ALL
from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume

# Windows API
try:
    import win32gui
    import win32con
    WINDOWS_API_AVAILABLE = True
except ImportError:
    WINDOWS_API_AVAILABLE = False
    print("Warning: pywin32 not available")


class MediaController:
    def __init__(self):
        """Initialize media controller"""
        pyautogui.FAILSAFE = False
        pyautogui.PAUSE = 0.1
        
        self.volume_interface = self._init_volume_control()
        
        self.active_player = None
        self.last_detection_time = 0
        self.detection_cooldown = 2.0
        
        # Track real play/pause state per player
        self.player_states = {
            'spotify': 'PAUSED',
            'vlc': 'PAUSED',
            'youtube': 'PAUSED',
            'windows_media': 'PAUSED'
        }
        
    def _init_volume_control(self):
        """Initialize Windows volume control interface"""
        try:
            import pythoncom
            pythoncom.CoInitialize()
        
            devices = AudioUtilities.GetSpeakers()
            interface = devices.Activate(
                IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
            volume = cast(interface, POINTER(IAudioEndpointVolume))
            return volume
        except Exception as e:
            print(f"Warning: Could not initialize volume control: {e}")
            return None
    
    def _activate_window(self, window_title_contains):
        """Activate window containing title"""
        if not WINDOWS_API_AVAILABLE:
            return False
        
        def callback(hwnd, windows):
            if win32gui.IsWindowVisible(hwnd):
                title = win32gui.GetWindowText(hwnd)
                if window_title_contains.lower() in title.lower():
                    windows.append(hwnd)
            return True
        
        windows = []
        win32gui.EnumWindows(callback, windows)
        
        if windows:
            hwnd = windows[0]
            try:
                if win32gui.IsIconic(hwnd):
                    win32gui.ShowWindow(hwnd, win32con.SW_RESTORE)
                
                win32gui.SetForegroundWindow(hwnd)
                time.sleep(0.15)
                return True
            except Exception as e:
                print(f"Error activating window: {e}")
                return False
        
        return False
    
    def detect_active_media_player(self):
        """Detect which media player is currently active"""
        current_time = time.time()
        
        if current_time - self.last_detection_time < self.detection_cooldown:
            return self.active_player
        
        self.last_detection_time = current_time
        
        process_names = [proc.name().lower() for proc in psutil.process_iter(['name'])]
        
        
        
        if 'spotify.exe' in process_names:
            self.active_player = 'spotify'
            return 'spotify'
        
        if 'vlc.exe' in process_names:
            self.active_player = 'vlc'
            return 'vlc'
        
        if 'wmplayer.exe' in process_names:
            self.active_player = 'windows_media'
            return 'windows_media'
        
        browsers = ['chrome.exe', 'firefox.exe', 'msedge.exe', 'opera.exe', 'brave.exe']
        if any(browser in process_names for browser in browsers):
            self.active_player = 'youtube'
            return 'youtube'
        
        self.active_player = None
        return None
    
    def execute_gesture(self, gesture_name):
        """Execute media command based on gesture"""
        player = self.detect_active_media_player()
        
        if player is None:
            print(f"No media player detected for gesture: {gesture_name}")
            return False
        
        if gesture_name == 'play_pause':
            return self._play_pause(player)
        elif gesture_name == 'swipe_left':
            return self._previous(player)
        elif gesture_name == 'swipe_right':
            return self._next(player)
        elif gesture_name == 'swipe_up':
            return self._volume_up()
        elif gesture_name == 'swipe_down':
            return self._volume_down()
        else:
            print(f"Unknown gesture: {gesture_name}")
            return False
    
    def get_next_play_pause_display(self):
        """Get current play/pause state to display"""
        player = self.active_player
        if player and player in self.player_states:
            current_state = self.player_states[player]
            
            return "PAUSE" if current_state == "PLAYING" else "PLAY"
        return "PLAY"

    def _play_pause(self, player):
        """Play/Pause based on active player"""
        
        if player == 'spotify':
            self._activate_window('spotify')
        elif player == 'vlc':
            self._activate_window('vlc')
        elif player == 'windows_media':
            self._activate_window('windows media player')
        
        commands = {
            'youtube': lambda: pyautogui.press('k'),
            'spotify': lambda: pyautogui.press('space'),
            'vlc': lambda: pyautogui.press('space'),
            'windows_media': lambda: pyautogui.hotkey('ctrl', 'p')
        }
        
        if player in commands:
            
            current_state = self.player_states.get(player, 'PAUSED')
            action = "PAUSE" if current_state == "PLAYING" else "PLAY"
            
            # Execute command
            commands[player]()
            
            # Update state
            self.player_states[player] = "PAUSED" if current_state == "PLAYING" else "PLAYING"
            
            print(f"{action} -> {player.upper()}")
            return True
        return False
    
    def _previous(self, player):
        """Previous track/video"""
        if player == 'spotify':
            self._activate_window('spotify')
        elif player == 'vlc':
            self._activate_window('vlc')
        elif player == 'windows_media':
            self._activate_window('windows media player')
        
        commands = {
            'youtube': lambda: pyautogui.hotkey('shift', 'p'),
            'spotify': lambda: pyautogui.hotkey('ctrl', 'left'),
            'vlc': lambda: pyautogui.press('p'),
            'windows_media': lambda: pyautogui.hotkey('ctrl', 'b')
        }
        
        if player in commands:
            commands[player]()
            print(f"PREVIOUS -> {player.upper()}")
            return True
        return False
    
    def _next(self, player):
        """Next track/video"""
        if player == 'spotify':
            self._activate_window('spotify')
        elif player == 'vlc':
            self._activate_window('vlc')
        elif player == 'windows_media':
            self._activate_window('windows media player')
        
        commands = {
            'youtube': lambda: pyautogui.hotkey('shift', 'n'),
            'spotify': lambda: pyautogui.hotkey('ctrl', 'right'),
            'vlc': lambda: pyautogui.press('n'),
            'windows_media': lambda: pyautogui.hotkey('ctrl', 'f')
        }
        
        if player in commands:
            commands[player]()
            print(f"NEXT -> {player.upper()}")
            return True
        return False
    
    def _volume_up(self):
        """Increase system volume - Shows OSD bar"""
        
        pyautogui.press('volumeup')
        print(f"VOLUME UP")
        return True
    
    def _volume_down(self):
        """Decrease system volume - Shows OSD bar"""
        
        pyautogui.press('volumedown')
        print(f"VOLUME DOWN")
        return True
    
    def get_current_volume(self):
        """Get current system volume percentage"""
        if self.volume_interface:
            try:
                volume = self.volume_interface.GetMasterVolumeLevelScalar()
                return int(volume * 100)
            except:
                pass
        return None