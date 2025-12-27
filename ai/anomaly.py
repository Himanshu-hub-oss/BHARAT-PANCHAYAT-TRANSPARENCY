from models import Project
from datetime import date


def compute_risk_score(project: Project, negative_feedback_count: int) -> float:
    """
    Simple risk score between 0 and 1
    You can later replace this with ML model.
    """
    score = 0.0

    # Overspending
    if project.spent > project.budget:
        score += 0.4

    # Delayed completion
    today = date.today()
    end_date = project.actual_end_date or today
    if end_date > project.planned_end_date:
        score += 0.3

    # Multiple negative feedback (rating <= 2)
    if negative_feedback_count >= 3:
        score += 0.3
    elif negative_feedback_count > 0:
        score += 0.15

    return min(score, 1.0)
