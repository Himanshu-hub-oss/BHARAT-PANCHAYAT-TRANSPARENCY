from fastapi import APIRouter, Depends, Form, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from models import Contractor, Project

router = APIRouter(prefix="/contractors", tags=["Contractors"])

@router.post("/add")
def add_contractor(name: str, company: str = "", phone: str = "", db: Session = Depends(get_db)):
    c = Contractor(name=name, company=company, phone=phone)
    db.add(c)
    db.commit()
    db.refresh(c)
    return c

@router.get("/list")
def list_contractors(db: Session = Depends(get_db)):
    return db.query(Contractor).all()

@router.put("/{contractor_id}/pin")
def set_contractor_pin(contractor_id: int, pin: str = Form(...), db: Session = Depends(get_db)):
    c = db.query(Contractor).get(contractor_id)
    if c:
        c.pin = pin
        db.commit()
    return {"message": "PIN updated"}

@router.post("/verify-pin")
def verify_contractor_pin(
    contractor_id: int = Form(...),
    pin: str = Form(...),
    db: Session = Depends(get_db)
):
    c = db.query(Contractor).get(contractor_id)
    if not c or c.pin != pin:
         return {"success": False}
    return {"success": True}

@router.put("/assign/{project_id}")
def assign_contractor(project_id: int, contractor_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    project.contractor_id = contractor_id
    db.commit()
    return {"message": "Assigned Successfully"}



# ---------------------
# NEW ENDPOINTS
# ---------------------
import shutil
import os
import crud
import schemas

UPLOAD_DIR = "uploads"

@router.get("/projects/{contractor_id}")
def get_my_projects(contractor_id: int, db: Session = Depends(get_db)):
    return crud.get_contractor_projects(db, contractor_id)


@router.post("/update")
def submit_update(
    project_id: int = Form(...),
    contractor_id: int = Form(...),
    amount_spent: float = Form(...),
    description: str = Form(None),
    expected_completion_date: str = Form(None),
    bill_image: UploadFile = File(None),
    work_image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    bill_path = None
    work_path = None

    if bill_image:
        bill_path = f"bill_{project_id}_{contractor_id}_{bill_image.filename}"
        with open(f"{UPLOAD_DIR}/{bill_path}", "wb") as buffer:
            shutil.copyfileobj(bill_image.file, buffer)

    if work_image:
        work_path = f"work_{project_id}_{contractor_id}_{work_image.filename}"
        with open(f"{UPLOAD_DIR}/{work_path}", "wb") as buffer:
            shutil.copyfileobj(work_image.file, buffer)

    update_data = schemas.ContractorUpdateCreate(
        project_id=project_id,
        contractor_id=contractor_id,
        amount_spent=amount_spent,
        description=description,
        expected_completion_date=expected_completion_date
    )

    return crud.create_contractor_update(db, update_data, bill_path, work_path)


@router.get("/updates/all")
def get_all_updates(
    state_id: int = None,
    district_id: int = None,
    block_id: int = None,
    village_id: int = None,
    db: Session = Depends(get_db)
):
    return crud.get_all_contractor_updates(db, state_id, district_id, block_id, village_id)

@router.delete("/{contractor_id}")
def delete_contractor(contractor_id: int, db: Session = Depends(get_db)):
    c = db.query(Contractor).get(contractor_id)
    if c:
        # Unlink from projects
        db.query(Project).filter(Project.contractor_id == contractor_id).update({"contractor_id": None})
        # Delete updates
        from models import ContractorUpdate
        db.query(ContractorUpdate).filter(ContractorUpdate.contractor_id == contractor_id).delete()
        
        db.delete(c)
        db.commit()
        return {"message": "Contractor removed Successfully"}
    return {"message": "Contractor not found"}, 404
