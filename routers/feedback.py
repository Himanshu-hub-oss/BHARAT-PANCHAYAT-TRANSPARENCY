from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
import crud
from database import get_db
from models import Feedback
from schemas import ProblematicFeedbackResponse
import os, shutil
from typing import List

router = APIRouter(prefix="/feedback", tags=["Feedback"])

UPLOAD_DIR = "uploads/"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/add/{project_id}")
async def add_feedback(
    project_id: int,
    rating: int = Form(...),
    comment: str = Form(""),
    latitude: float = Form(None),
    longitude: float = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    image_path = None
    image_hash = None
    is_flagged = 0
    flag_reason = None

    if image:
        # Pre-process Step: Hash Calculation
        import hashlib
        from PIL import Image, ImageDraw, ImageFont
        from datetime import datetime
        from routers.ai import analyze_fake_image

        contents = await image.read()
        image_hash = hashlib.sha256(contents).hexdigest()

        # Check Duplicate
        existing = db.query(Feedback).filter(Feedback.image_hash == image_hash).first()
        if existing:
            is_flagged = 1
            flag_reason = "Duplicate Photo Detected"

        # Save File
        save_location = os.path.join(UPLOAD_DIR, image.filename)
        with open(save_location, "wb") as buffer:
            buffer.write(contents)
        image_path = image.filename

        # AI Fake Detection (if not already duplicate)
        if not is_flagged:
            fake_detected, reason = analyze_fake_image(save_location)
            if fake_detected:
                is_flagged = 1
                flag_reason = f"AI Flag: {reason}"

        # 🌍 GEOFENCING CHECK (User Request)
        if not is_flagged and latitude and longitude:
            project = db.query(Project).get(project_id)
            if project and project.village and project.village.latitude:
                from math import radians, cos, sin, asin, sqrt
                
                def haversine(lon1, lat1, lon2, lat2):
                    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
                    dlon = lon2 - lon1 
                    dlat = lat2 - lat1 
                    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
                    c = 2 * asin(sqrt(a)) 
                    r = 6371 # Radius of earth in km. Use 3956 for miles
                    return c * r

                v_lat = project.village.latitude
                v_lng = project.village.longitude
                dist = haversine(longitude, latitude, v_lng, v_lat)
                
                # If further than 0.5km (500 meters) from village center
                if dist > 0.5:
                    is_flagged = 1
                    flag_reason = f"Out of Bounds: Photo taken {dist:.2f}km away from {project.village.name}"

        # Metadata Overlay
        try:
            img = Image.open(save_location)
            draw = ImageDraw.Draw(img)
            
            # Simple timestamp & location text
            text = f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n"
            if latitude and longitude:
                text += f"Lat: {latitude:.4f}, Long: {longitude:.4f}"
            
            # Draw text (Top-left, Red color for visibility)
            # Find a font or use default
            try:
                # Try standard fonts if available, else default
                font = ImageFont.truetype("arial.ttf", 20)
            except:
                font = ImageFont.load_default()

            draw.text((10, 10), text, fill="red", font=font)
            
            # Overwrite original
            img.save(save_location)
        
        except Exception as e:
            print(f"Overlay Failed: {e}")

    fb = Feedback(
        project_id=project_id,
        rating=rating,
        comment=comment,
        image_path=image_path,
        latitude=latitude,
        longitude=longitude,
        image_hash=image_hash,
        is_flagged=is_flagged,
        flag_reason=flag_reason
    )

    db.add(fb)
    db.commit()
    db.refresh(fb)

    return {"success": True, "feedback": fb}


@router.get("/problematic/{village_id}", response_model=List[ProblematicFeedbackResponse])
def get_problematic_feedbacks(village_id: int, db: Session = Depends(get_db)):
    results = crud.list_problematic_feedback(db, village_id)
    response = []
    for feedback, project in results:
        # Pydantic requires dict or object matching schema
        # We manually construct response object matching ProblematicFeedbackResponse
        item = ProblematicFeedbackResponse(
            id=feedback.id,
            project_id=feedback.project_id,
            rating=feedback.rating,
            comment=feedback.comment,
            image_path=feedback.image_path,
            is_flagged=bool(feedback.is_flagged),
            flag_reason=feedback.flag_reason,
            project_name=project.name  # from the joined Project model
        )
        response.append(item)
    return response
