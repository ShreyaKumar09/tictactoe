from database import SessionLocal
from models import Admin
from utils.security import hash_password

db = SessionLocal()

username = "admin"
password = "admin123"

existing_admin = (
    db.query(Admin)
    .filter(Admin.username == username)
    .first()
)

if existing_admin:
    print("Admin already exists.")

else:
    new_admin = Admin(
        username=username,
        password=hash_password(password)
    )

    db.add(new_admin)
    db.commit()

    print("Admin created successfully!")

db.close()