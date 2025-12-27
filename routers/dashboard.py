from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import crud
import schemas
from database import get_db

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/village/{village_id}", response_model=schemas.DashboardVillageResponse)
def get_dashboard(village_id: int, db: Session = Depends(get_db)):
    return crud.get_village_dashboard(db, village_id)


@router.get("/officer/stats", response_model=schemas.OfficerStatsResponse)
def get_officer_stats(
    state_id: int = None,
    district_id: int = None,
    block_id: int = None,
    village_id: int = None,
    db: Session = Depends(get_db)
):
    return crud.get_officer_dashboard_stats(db, state_id, district_id, block_id, village_id)
