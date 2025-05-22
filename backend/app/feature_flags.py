from .config import config

class FeatureFlags:
    @staticmethod
    def is_enabled(feature_name: str) -> bool:
        """Check if a feature is enabled"""
        return config.get_feature_flag(feature_name)
    
    @staticmethod
    def get_role_permissions(role: str) -> dict:
        """Get permissions for a specific role"""
        return config.get_role_permissions(role)
    
    @staticmethod
    def can_user_perform_action(role: str, action: str) -> bool:
        """
        Check if a user with the given role can perform an action
        Actions like: can_create, can_edit, can_delete, etc.
        """
        permissions = config.get_role_permissions(role)
        return permissions.get(action, False)
    
    @staticmethod
    def all_features() -> dict:
        """Get all feature flags"""
        return config.all_feature_flags() 