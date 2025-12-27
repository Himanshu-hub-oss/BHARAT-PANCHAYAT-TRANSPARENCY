from database import SessionLocal
from models import State, District, Block, Village

db = SessionLocal()
try:
    print(f"States: {db.query(State).count()}")
    print(f"Districts: {db.query(District).count()}")
    print(f"Blocks: {db.query(Block).count()}")
    print(f"Villages: {db.query(Village).count()}")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
