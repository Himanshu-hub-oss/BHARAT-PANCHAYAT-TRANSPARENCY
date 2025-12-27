from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from database import Base


class State(Base):
    __tablename__ = "states"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    districts = relationship("District", back_populates="state")


class District(Base):
    __tablename__ = "districts"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    state_id = Column(Integer, ForeignKey("states.id"))
    state = relationship("State", back_populates="districts")
    blocks = relationship("Block", back_populates="district")


class Block(Base):
    __tablename__ = "blocks"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    district_id = Column(Integer, ForeignKey("districts.id"))
    district = relationship("District", back_populates="blocks")
    villages = relationship("Village", back_populates="block")


class Village(Base):
    __tablename__ = "villages"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    block_id = Column(Integer, ForeignKey("blocks.id"))
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    block = relationship("Block", back_populates="villages")
    projects = relationship("Project", back_populates="village")


class Contractor(Base):
    __tablename__ = "contractors"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    company = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    performance = Column(Float, default=0.0)
    pin = Column(String, default="0000") # Security PIN

    projects = relationship("Project", back_populates="contractor")
    updates = relationship("ContractorUpdate", back_populates="contractor")


class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)

    village_id = Column(Integer, ForeignKey("villages.id"))
    contractor_id = Column(Integer, ForeignKey("contractors.id"), nullable=True)

    budget = Column(Float, default=0)
    spent = Column(Float, default=0)
    status = Column(String, default="ongoing")
    progress_percent = Column(Float, default=0)
    risk_score = Column(Float, default=0)
    risk_level = Column(String, default="Low")

    start_year = Column(Integer)
    duration_months = Column(Integer)

    village = relationship("Village", back_populates="projects")
    contractor = relationship(
    "Contractor",
    back_populates="projects",
    lazy="joined"   # 🔥 auto join contractor on fetch
)

    feedbacks = relationship("Feedback", back_populates="project")
    updates = relationship("ContractorUpdate", back_populates="project")


class Feedback(Base):
    __tablename__ = "feedbacks"
    id = Column(Integer, primary_key=True)
    rating = Column(Integer, default=3)
    comment = Column(String)
    image_path = Column(String, nullable=True)

    image_hash = Column(String, nullable=True)     # For duplicate detection
    is_flagged = Column(Integer, default=0)        # 0=Clean, 1=Flagged (SQLite has no Boolean)
    flag_reason = Column(String, nullable=True)    # e.g. "Duplicate", "Fake"

    latitude = Column(Float, nullable=True)  # 🌍 Geo coordinates
    longitude = Column(Float, nullable=True)

    project_id = Column(Integer, ForeignKey("projects.id"))
    project = relationship("Project", back_populates="feedbacks")


class ContractorUpdate(Base):
    __tablename__ = "contractor_updates"
    
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    contractor_id = Column(Integer, ForeignKey("contractors.id"))
    
    amount_spent = Column(Float, default=0)
    description = Column(String, nullable=True)
    
    bill_image_path = Column(String, nullable=True)
    work_image_path = Column(String, nullable=True)
    
    expected_completion_date = Column(String, nullable=True) # Storing as String for simplicity (YYYY-MM-DD)
    submission_date = Column(String, nullable=True) # Storing as String (YYYY-MM-DD HH:MM)
    
    project = relationship("Project", back_populates="updates")
    contractor = relationship("Contractor", back_populates="updates")
