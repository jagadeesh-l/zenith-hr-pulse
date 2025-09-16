#!/usr/bin/env python3
"""
Script to seed feature flags for HR modules
"""

import asyncio
import sys
import os
from datetime import datetime

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.database_dynamodb import get_feature_flags_table, parse_dynamodb_item
from app.models.feature_flag import FeatureFlagStatus

async def seed_feature_flags():
    """Seed the feature flags table with default HR modules"""
    
    # Default feature flags for HR modules
    default_flags = [
        # HR Modules
        {
            "name": "directory_module",
            "display_name": "Directory",
            "description": "Employee directory and organization chart",
            "status": FeatureFlagStatus.ENABLED,
            "module": "directory",
            "category": "hr_modules",
            "is_core_feature": True
        },
        {
            "name": "performance_module",
            "display_name": "Performance",
            "description": "Performance management and reviews",
            "status": FeatureFlagStatus.ENABLED,
            "module": "performance",
            "category": "hr_modules",
            "is_core_feature": False
        },
        {
            "name": "leave_module",
            "display_name": "Leave Management",
            "description": "Leave requests and time off management",
            "status": FeatureFlagStatus.ENABLED,
            "module": "leave",
            "category": "hr_modules",
            "is_core_feature": False
        },
        {
            "name": "compensation_module",
            "display_name": "Compensation",
            "description": "Salary and benefits management",
            "status": FeatureFlagStatus.ENABLED,
            "module": "compensation",
            "category": "hr_modules",
            "is_core_feature": False
        },
        {
            "name": "recruitment_module",
            "display_name": "Recruitment",
            "description": "Job postings and candidate management",
            "status": FeatureFlagStatus.ENABLED,
            "module": "recruitment",
            "category": "hr_modules",
            "is_core_feature": False
        },
        {
            "name": "engagement_module",
            "display_name": "Engagement",
            "description": "Employee engagement and surveys",
            "status": FeatureFlagStatus.ENABLED,
            "module": "engagement",
            "category": "hr_modules",
            "is_core_feature": False
        },
        {
            "name": "resource_hub_module",
            "display_name": "Resource Hub",
            "description": "Company resources and documents",
            "status": FeatureFlagStatus.ENABLED,
            "module": "resource_hub",
            "category": "hr_modules",
            "is_core_feature": False
        },
        {
            "name": "dashboard_module",
            "display_name": "Dashboard",
            "description": "Analytics and reporting dashboard",
            "status": FeatureFlagStatus.ENABLED,
            "module": "dashboard",
            "category": "hr_modules",
            "is_core_feature": False
        },
        {
            "name": "home_module",
            "display_name": "Home",
            "description": "Main dashboard and overview",
            "status": FeatureFlagStatus.ENABLED,
            "module": "home",
            "category": "hr_modules",
            "is_core_feature": True
        },
        {
            "name": "helpdesk_module",
            "display_name": "Helpdesk",
            "description": "Support tickets and help system",
            "status": FeatureFlagStatus.ENABLED,
            "module": "helpdesk",
            "category": "hr_modules",
            "is_core_feature": False
        },
        {
            "name": "learning_module",
            "display_name": "Learning",
            "description": "Training and development programs",
            "status": FeatureFlagStatus.ENABLED,
            "module": "learning",
            "category": "hr_modules",
            "is_core_feature": False
        },
        
        # Admin Portal Features
        {
            "name": "admin_portal",
            "display_name": "Admin Portal",
            "description": "Administrative portal access",
            "status": FeatureFlagStatus.ENABLED,
            "module": "admin",
            "category": "admin_portal",
            "is_core_feature": True
        },
        {
            "name": "user_management",
            "display_name": "User Management",
            "description": "User account management",
            "status": FeatureFlagStatus.ENABLED,
            "module": "admin",
            "category": "admin_portal",
            "is_core_feature": False
        },
        {
            "name": "system_settings",
            "display_name": "System Settings",
            "description": "System configuration and settings",
            "status": FeatureFlagStatus.ENABLED,
            "module": "admin",
            "category": "admin_portal",
            "is_core_feature": False
        },
        {
            "name": "feature_flag_management",
            "display_name": "Feature Flag Management",
            "description": "Manage feature flags and module visibility",
            "status": FeatureFlagStatus.ENABLED,
            "module": "admin",
            "category": "admin_portal",
            "is_core_feature": False
        },
        {
            "name": "notifications",
            "display_name": "Notifications",
            "description": "Notification bell icon and notification system",
            "status": FeatureFlagStatus.ENABLED,
            "module": "ui",
            "category": "ui_components",
            "is_core_feature": False
        }
    ]
    
    try:
        table = await get_feature_flags_table()
        
        # Check if feature flags already exist
        response = await table.scan()
        existing_flags = [parse_dynamodb_item(item)['name'] for item in response.get('Items', [])]
        
        created_count = 0
        skipped_count = 0
        
        for flag_data in default_flags:
            if flag_data['name'] in existing_flags:
                print(f"Feature flag '{flag_data['name']}' already exists, skipping...")
                skipped_count += 1
                continue
            
            # Generate unique ID
            import uuid
            flag_id = f"ff_{uuid.uuid4().hex[:8]}"
            now = datetime.utcnow().isoformat()
            
            item = {
                'id': flag_id,
                'name': flag_data['name'],
                'display_name': flag_data['display_name'],
                'description': flag_data['description'],
                'status': flag_data['status'].value,
                'module': flag_data['module'],
                'category': flag_data['category'],
                'is_core_feature': flag_data['is_core_feature'],
                'created_by': 'system',
                'updated_by': 'system',
                'created_at': now,
                'updated_at': now
            }
            
            await table.put_item(Item=item)
            print(f"Created feature flag: {flag_data['display_name']} ({flag_data['name']})")
            created_count += 1
        
        print(f"\nSeeding completed!")
        print(f"Created: {created_count} feature flags")
        print(f"Skipped: {skipped_count} existing feature flags")
        
    except Exception as e:
        print(f"Error seeding feature flags: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(seed_feature_flags())
