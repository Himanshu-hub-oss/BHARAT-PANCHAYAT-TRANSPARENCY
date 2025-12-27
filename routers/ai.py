from fastapi import APIRouter, HTTPException
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from models import Contractor, Project, ContractorUpdate
from datetime import datetime, timedelta

router = APIRouter(prefix="/ai", tags=["AI Risk Prediction"])


class RiskRequest(BaseModel):
    progress_percent: float
    budget: float
    spent: float


@router.post("/risk")
def compute_risk(payload: RiskRequest):
    try:
        # Basic rule-based risk
        budget = payload.budget
        spent = payload.spent
        progress = payload.progress_percent

        if budget <= 0:
            raise HTTPException(status_code=400, detail="Invalid budget")

        spent_ratio = spent / budget

        risk_score = 50

        if spent_ratio > (progress / 100) + 0.1:
            risk_score += 25  # overspending > 10% deviation

        if progress < 50 and spent_ratio > 0.8:
            risk_score += 25  # heavy risk
        
        # Reward for efficiency (Low Risk)
        if spent_ratio < (progress / 100) - 0.05:
            risk_score -= 20   # Under budget / efficient

        risk_score = min(max(risk_score, 0), 100)

        level = (
            "Low" if risk_score <= 40 else
            "Medium" if risk_score <= 70 else
            "High"
        )

        return {
            "risk_score": risk_score,
            "risk_level": level,
            "details": {
                "spent_ratio": round(spent_ratio, 2),
                "progress": progress,
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def analyze_fake_image(image_path: str):
    """
    Heuristic check for potential manipulation.
    """
    from PIL import Image, ExifTags
    import os

    flags = []
    
    try:
        img = Image.open(image_path)
        
        # 1. Metadata Strip Check
        # Most modern phones leave EXIF data. AI/Edited images often strip it.
        exif_data = img._getexif()
        if not exif_data:
            flags.append("Missing EXIF Metadata (Possible Edit/AI)")
        
        # 2. Dimensions Check
        # AI generators often use standard squares (1024x1024, 512x512)
        w, h = img.size
        if w == h and w in [512, 1024]:
             flags.append(f"Suspicious Dimensions ({w}x{h})")

        # 3. Software Signature
        if exif_data:
            for tag_id, value in exif_data.items():
                tag = ExifTags.TAGS.get(tag_id, tag_id)
                if tag == "Software":
                    if "adobe" in str(value).lower() or "gimp" in str(value).lower():
                        flags.append(f"Edited with {value}")

        if flags:
            return True, ", ".join(flags)
        
        return False, None

    except Exception as e:
        print(f"AI Check Failed: {e}")
        return False, None



def send_alert_sms(phone: str, message: str):
    """
    Simulates sending an SMS.
    In production, this would use Twilio, SNS, or Fast2SMS.
    """
    if not phone:
        return "No phone number linked."
    
    # SIMULATION
    print(f"--------[SMS ALERT]--------")
    print(f"To: {phone}")
    print(f"Message: {message}")
    print(f"---------------------------")
    return "Sent"


@router.get("/alerts")
def check_alerts(db: Session = Depends(get_db)):
    """
    Identify contractors who haven't submitted updates for > 30 days.
    """
    alerts = []
    
    # Get all ongoing projects with contractors
    projects = db.query(Project).filter(Project.contractor_id != None, Project.status == "ongoing").all()
    
    now = datetime.now()
    
    for p in projects:
        # Get last update
        last_update = db.query(ContractorUpdate)\
            .filter(ContractorUpdate.project_id == p.id)\
            .order_by(ContractorUpdate.id.desc())\
            .first()
            
        contractor_name = p.contractor.name if p.contractor else "Unknown"
        contractor_phone = p.contractor.phone if p.contractor else None
        
        # Helper to construct alert and possibly send SMS
        def add_alert(msg, days):
            # Send SMS
            sms_status = send_alert_sms(contractor_phone, f"URGENT: {msg} for Project {p.name}")
            
            alerts.append({
                "contractor": contractor_name,
                "project": p.name,
                "message": msg,
                "days_overdue": days,
                "sms_status": sms_status
            })

        if not last_update:
            # Check project start date if no updates... simplified logic
            add_alert("No updates submitted yet.", "N/A")
            continue

        try:
            # Parse date "YYYY-MM-DD HH:MM"
            submitted_at = datetime.strptime(last_update.submission_date, "%Y-%m-%d %H:%M")
            delta = now - submitted_at
            
            if delta.days > 30:
                add_alert(f"Last update was {delta.days} days ago.", delta.days)

        except:
             pass # Date parsing error or something
             
    return alerts
