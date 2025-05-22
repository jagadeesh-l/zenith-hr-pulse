from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Generate hashes for our test passwords
admin_password = "admin123"
user_password = "user123"

admin_hash = pwd_context.hash(admin_password)
user_hash = pwd_context.hash(user_password)

print("Admin password hash:", admin_hash)
print("User password hash:", user_hash) 