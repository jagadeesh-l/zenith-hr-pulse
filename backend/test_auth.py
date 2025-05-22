from passlib.context import CryptContext
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Test password
test_password = "user123"

# Generate a new hash
new_hash = pwd_context.hash(test_password)
logger.debug(f"Generated new hash: {new_hash}")

# Verify the password
verify_result = pwd_context.verify(test_password, new_hash)
logger.debug(f"Verification result: {verify_result}")

# Test with the hash from our models.py
stored_hash = "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW"
verify_stored = pwd_context.verify(test_password, stored_hash)
logger.debug(f"Verification with stored hash: {verify_stored}")

# Generate a new hash for both users
admin_hash = pwd_context.hash("admin123")
user_hash = pwd_context.hash("user123")

print("\nNew hashes to use in models.py:")
print(f"Admin hash: {admin_hash}")
print(f"User hash: {user_hash}") 