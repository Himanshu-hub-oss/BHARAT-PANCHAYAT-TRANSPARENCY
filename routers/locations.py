from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import crud
import schemas

router = APIRouter(prefix="/locations", tags=["Locations"])


@router.get("/states")
def list_states(db: Session = Depends(get_db)):
     states = crud.get_states(db)
     return [{"id": s.id, "name": s.name} for s in states]

@router.get("/districts/{state_id}")
def list_districts(state_id: int, db: Session = Depends(get_db)):
    districts = crud.get_districts_by_state(db, state_id)
    return [{"id": d.id, "name": d.name} for d in districts]

@router.get("/blocks/{district_id}")
def list_blocks(district_id: int, db: Session = Depends(get_db)):
    blocks = crud.get_blocks_by_district(db, district_id)
    return [{"id": b.id, "name": b.name} for b in blocks]

@router.get("/villages/{block_id}")
def list_villages(block_id: int, db: Session = Depends(get_db)):
    villages = crud.get_villages_by_block(db, block_id)
    return [{"id": v.id, "name": v.name} for v in villages]