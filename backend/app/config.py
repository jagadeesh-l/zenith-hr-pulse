import os
import yaml
from typing import Dict, Any

class Config:
    _instance = None
    _config_data = {}
    _feature_flags = {}
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Config, cls).__new__(cls)
            cls._instance._load_configs()
        return cls._instance
    
    def _load_configs(self):
        # Get the base path for config files
        base_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'config')
        
        # Load main configuration
        config_path = os.path.join(base_path, 'config.yaml')
        if os.path.exists(config_path):
            with open(config_path, 'r') as file:
                self._config_data = yaml.safe_load(file)
                
        # Load feature flags
        flags_path = os.path.join(base_path, 'feature_flags.yaml')
        if os.path.exists(flags_path):
            with open(flags_path, 'r') as file:
                self._feature_flags = yaml.safe_load(file)
    
    def get(self, path: str, default=None) -> Any:
        """
        Get configuration value using dot notation path.
        Example: config.get('database.uri')
        """
        parts = path.split('.')
        current = self._config_data
        
        for part in parts:
            if isinstance(current, dict) and part in current:
                current = current[part]
            else:
                return default
                
        return current
    
    def get_feature_flag(self, feature_name: str) -> bool:
        """Get the status of a feature flag"""
        features = self._feature_flags.get('features', {})
        return features.get(feature_name, False)
    
    def get_role_permissions(self, role: str) -> Dict[str, bool]:
        """Get permissions for a specific role"""
        roles = self._feature_flags.get('roles', {})
        return roles.get(role, {})
    
    def all_feature_flags(self) -> Dict[str, bool]:
        """Get all feature flags"""
        return self._feature_flags.get('features', {})

# Create a singleton instance
config = Config() 