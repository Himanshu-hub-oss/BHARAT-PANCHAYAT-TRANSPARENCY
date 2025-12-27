from sqlalchemy.orm import Session
from models import State, District, Block, Village, Project, Contractor, Feedback, ContractorUpdate
import schemas


# ----------------------------
# LOCATION QUERIES
# ----------------------------
def get_states(db: Session):
    return db.query(State).all()


def get_districts_by_state(db: Session, state_id: int):
    return db.query(District).filter(District.state_id == state_id).all()


def get_blocks_by_district(db: Session, district_id: int):
    return db.query(Block).filter(Block.district_id == district_id).all()


def get_villages_by_block(db: Session, block_id: int):
    return db.query(Village).filter(Village.block_id == block_id).all()


# ----------------------------
# PROJECT QUERIES
# ----------------------------
def get_projects_by_village(db: Session, village_id: int):
    return (
        db.query(Project)
        .filter(Project.village_id == village_id)
        .outerjoin(Project.contractor)   # IMPORTANT JOIN
        .all()
    )


def get_project(db: Session, project_id: int):
    return (
        db.query(Project)
        .filter(Project.id == project_id)
        .outerjoin(Project.contractor)
        .first()
    )


def create_project(db: Session, payload: schemas.ProjectCreate):
    # Fix: Convert Pydantic model to SQLAlchemy model
    db_project = Project(**payload.dict()) 
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


def update_project(db: Session, project_id: int, data: dict):
    project = db.query(Project).get(project_id)
    for k, v in data.items():
        setattr(project, k, v)
    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project_id: int):
    project = db.query(Project).get(project_id)
    if project:
        db.delete(project)
        db.commit()
    return {"deleted": True}


# ----------------------------
# FEEDBACK
# ----------------------------
def add_feedback(db: Session, feedback: Feedback):
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback


def list_feedback(db: Session, project_id: int):
    return db.query(Feedback).filter(Feedback.project_id == project_id).all()


def list_problematic_feedback(db: Session, village_id: int):
    from sqlalchemy import or_
    return (
        db.query(Feedback, Project)
        .join(Project, Feedback.project_id == Project.id)
        .filter(Project.village_id == village_id)
        .filter(or_(Feedback.rating <= 3, Feedback.is_flagged == 1))
        .all()
    )


# ----------------------------
# DASHBOARD SUMMARY
# ----------------------------
def get_officer_dashboard_stats(
    db: Session, 
    state_id: int = None, 
    district_id: int = None, 
    block_id: int = None, 
    village_id: int = None
):
    # Base query for Projects
    p_query = db.query(Project).join(Village).join(Block).join(District)

    if village_id:
        p_query = p_query.filter(Project.village_id == village_id)
    elif block_id:
        p_query = p_query.filter(Village.block_id == block_id)
    elif district_id:
        p_query = p_query.filter(Block.district_id == district_id)
    elif state_id:
        p_query = p_query.filter(District.state_id == state_id)

    total_projects = p_query.count()
    completed_projects = p_query.filter(Project.status.ilike("completed")).count()

    # Base query for Feedback (Complaints)
    # Join path: Feedback -> Project -> Village -> Block -> District -> State
    f_query = db.query(Feedback).join(Project).join(Village).join(Block).join(District)

    if village_id:
        f_query = f_query.filter(Project.village_id == village_id)
    elif block_id:
        f_query = f_query.filter(Village.block_id == block_id)
    elif district_id:
        f_query = f_query.filter(Block.district_id == district_id)
    elif state_id:
        f_query = f_query.filter(District.state_id == state_id)
    
    from sqlalchemy import or_
    complaints = f_query.filter(
        or_(
            Feedback.rating <= 3, 
            Feedback.is_flagged == 1
        )
    ).count()

    return {
        "total_projects": total_projects,
        "completed_projects": completed_projects,
        "complaints": complaints
    }

from sqlalchemy.orm import Session
from models import Project, Feedback


def get_village_dashboard(db: Session, village_id: int):
    projects = db.query(Project).filter(Project.village_id == village_id).all()

    feedback_count = (
        db.query(Feedback)
        .join(Project)
        .filter(Project.village_id == village_id, Feedback.rating <= 3)
        .count()
    )

    if not projects:
        return {
            "total_projects": 0,
            "completed_projects": 0,
            "ongoing_projects": 0,
            "delayed_projects": 0,
            "total_budget": 0,
            "total_spent": 0,
            "avg_progress": 0,
            "complaints": feedback_count,
            "project_list": []
        }

    total = len(projects)
    completed = len([p for p in projects if p.status.lower() == "completed"])
    ongoing = len([p for p in projects if p.status.lower() == "ongoing"])
    delayed = len([p for p in projects if p.status.lower() == "delayed"])

    total_budget = sum(p.budget for p in projects)
    total_spent = sum(p.spent for p in projects)
    avg_progress = round(sum(p.progress_percent for p in projects) / total, 1)

    return {
        "total_projects": total,
        "completed_projects": completed,
        "ongoing_projects": ongoing,
        "delayed_projects": delayed,
        "total_budget": total_budget,
        "total_spent": total_spent,
        "avg_progress": avg_progress,
        "complaints": feedback_count,
        "project_list": projects
    }


# ----------------------------
# CONTRACTOR UPDATES
# ----------------------------
from models import ContractorUpdate
from datetime import datetime

def create_contractor_update(
    db: Session, 
    update_data: schemas.ContractorUpdateCreate, 
    bill_path: str = None, 
    work_path: str = None
):
    # 1. Create Update Record
    new_update = ContractorUpdate(
        **update_data.dict(),
        bill_image_path=bill_path,
        work_image_path=work_path,
        submission_date=datetime.now().strftime("%Y-%m-%d %H:%M")
    )
    db.add(new_update)
    
    # 2. Update Project Spent Amount Automatically
    project = db.query(Project).get(update_data.project_id)
    if project:
        project.spent += update_data.amount_spent
    
    db.commit()
    db.refresh(new_update)
    return new_update


from sqlalchemy.orm import joinedload

def get_contractor_projects(db: Session, contractor_id: int):
    return (
        db.query(Project)
        .filter(Project.contractor_id == contractor_id)
        .options(
            joinedload(Project.village)
            .joinedload(Village.block)
            .joinedload(Block.district)
            .joinedload(District.state)
        )
        .all()
    )


def get_contractor_updates(db: Session, project_id: int):
    return db.query(ContractorUpdate).filter(ContractorUpdate.project_id == project_id).order_by(ContractorUpdate.id.desc()).all()

def get_all_contractor_updates(
    db: Session,
    state_id: int = None,
    district_id: int = None,
    block_id: int = None,
    village_id: int = None
):
    query = db.query(ContractorUpdate).join(Project).join(Village).join(Block).join(District)

    if village_id:
        query = query.filter(Project.village_id == village_id)
    elif block_id:
        query = query.filter(Village.block_id == block_id)
    elif district_id:
        query = query.filter(Block.district_id == district_id)
    elif state_id:
        query = query.filter(District.state_id == state_id)

    return query.order_by(ContractorUpdate.id.desc()).limit(50).all()
