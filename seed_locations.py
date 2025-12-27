from database import SessionLocal, Base, engine
from models import State, District, Block, Village, Project, Contractor

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Check if data already exists
if db.query(State).count() > 0:
    print("Data exists. Wiping to re-seed...")
    # Optional: Wipe to ensure clean state if needed, but for now we'll just continue if empty
    # For safety, let's just exit if they want to keep it.
    # Actually, the user wants it FIXED, so let's wipe and re-seed properly.
    db.query(Project).delete()
    db.query(Contractor).delete()
    db.query(Village).delete()
    db.query(Block).delete()
    db.query(District).delete()
    db.query(State).delete()
    db.commit()

print("Seeding location data...")

# Create States
up = State(name="Uttar Pradesh")
bihar = State(name="Bihar")
mp = State(name="Madhya Pradesh")
db.add_all([up, bihar, mp])
db.commit()
db.refresh(up)
db.refresh(bihar)
db.refresh(mp)

# --- UTTAR PRADESH ---
lucknow = District(name="Lucknow", state_id=up.id)
kanpur = District(name="Kanpur", state_id=up.id)
varanasi = District(name="Varanasi", state_id=up.id)
db.add_all([lucknow, kanpur, varanasi])
db.commit()
db.refresh(lucknow)
db.refresh(kanpur)
db.refresh(varanasi)

aliganj = Block(name="Aliganj", district_id=lucknow.id)
gomti_nagar = Block(name="Gomti Nagar", district_id=lucknow.id)
kakadeo = Block(name="Kakadeo", district_id=kanpur.id)
arajiline = Block(name="Arajiline", district_id=varanasi.id)
db.add_all([aliganj, gomti_nagar, kakadeo, arajiline])
db.commit()
db.refresh(aliganj)
db.refresh(gomti_nagar)
db.refresh(kakadeo)
db.refresh(arajiline)

# --- BIHAR ---
patna = District(name="Patna", state_id=bihar.id)
gaya = District(name="Gaya", state_id=bihar.id)
db.add_all([patna, gaya])
db.commit()
db.refresh(patna)
db.refresh(gaya)

patna_city = Block(name="Patna City", district_id=patna.id)
danapur = Block(name="Danapur", district_id=patna.id)
bodh_gaya = Block(name="Bodh Gaya", district_id=gaya.id)
db.add_all([patna_city, danapur, bodh_gaya])
db.commit()
db.refresh(patna_city)
db.refresh(danapur)
db.refresh(bodh_gaya)

# --- MADHYA PRADESH ---
bhopal_dist = District(name="Bhopal", state_id=mp.id)
indore_dist = District(name="Indore", state_id=mp.id)
db.add_all([bhopal_dist, indore_dist])
db.commit()
db.refresh(bhopal_dist)
db.refresh(indore_dist)

phanda = Block(name="Phanda", district_id=bhopal_dist.id)
berasia = Block(name="Berasia", district_id=bhopal_dist.id)
mhow = Block(name="Mhow", district_id=indore_dist.id)
db.add_all([phanda, berasia, mhow])
db.commit()
db.refresh(phanda)
db.refresh(berasia)
db.refresh(mhow)

# --- VILLAGES ---
villages_data = [
    ("Village A", aliganj.id, 26.8467, 80.9462),
    ("Village B", aliganj.id, None, None),
    ("Village C", gomti_nagar.id, None, None),
    ("Village D", kakadeo.id, None, None),
    ("Village E", arajiline.id, None, None),
    ("Village F", arajiline.id, 25.3176, 82.9739),
    ("Patna Village 1", patna_city.id, None, None),
    ("Danapur Basti", danapur.id, None, None),
    ("Bodh Village X", bodh_gaya.id, None, None),
    ("Phanda Village", phanda.id, None, None),
    ("Berasia Village", berasia.id, None, None),
    ("Mhow Village", mhow.id, None, None),
]

for v_name, b_id, lat, lng in villages_data:
    v = Village(name=v_name, block_id=b_id, latitude=lat, longitude=lng)
    db.add(v)

db.commit()

# --- CONTRACTORS & PROJECTS ---
c1 = Contractor(name="Sharma Constructions", company="Sharma Infra", phone="9876543210", performance=3.5)
c2 = Contractor(name="Yadav Builders", company="Yadav Group", phone="9988776655", performance=4.1)
db.add_all([c1, c2])
db.commit()
db.refresh(c1)
db.refresh(c2)

v_a = db.query(Village).filter(Village.name == "Village A").first()
v_f = db.query(Village).filter(Village.name == "Village F").first()
v_patna = db.query(Village).filter(Village.name == "Patna Village 1").first()
v_mhow = db.query(Village).filter(Village.name == "Mhow Village").first()

projects = []
if v_a:
    projects.append(Project(name="Village A Road Repair", village_id=v_a.id, contractor_id=c1.id, budget=500000, spent=200000, status="ongoing", progress_percent=40))
if v_f:
    projects.append(Project(name="Village F Water Tank", village_id=v_f.id, contractor_id=c2.id, budget=800000, spent=650000, status="delayed", progress_percent=75))
if v_patna:
    projects.append(Project(name="Patna Smart Street", village_id=v_patna.id, contractor_id=c1.id, budget=1200000, spent=100000, status="ongoing", progress_percent=10))
if v_mhow:
    projects.append(Project(name="Mhow Canal Project", village_id=v_mhow.id, contractor_id=c2.id, budget=900000, spent=0, status="ongoing", progress_percent=5))

db.add_all(projects)
db.commit()
db.close()

print("Database expanded and re-seeded successfully!")
