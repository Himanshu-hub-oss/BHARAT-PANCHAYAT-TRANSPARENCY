from database import Base, engine

print("⏳ Creating DB Schema...")
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
print("✔ Database Schema Created Successfully!")
