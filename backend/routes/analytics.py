from fastapi import APIRouter
from typing import Dict, Any
from services.firebase_service import firebase_service

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard_metrics() -> Dict[str, Any]:
    """
    Aggregates metrics for the AI Analytics Dashboard.
    Checks complain volumes, category breakdowns, and critical surges.
    """
    try:
        complaints = firebase_service.get_all_complaints()
        
        # Compute metrics
        total = len(complaints)
        critical = 0
        categories = {}
        departments = {}
        
        for c in complaints:
            # Count severities
            if c.get("severity") == "CRITICAL" or c.get("priority") == "HIGH":
                critical += 1
                
            # Count categories
            cat = c.get("category", "General")
            categories[cat] = categories.get(cat, 0) + 1
            
            # Count departments
            dept = c.get("assignedDepartment", "Unassigned")
            departments[dept] = departments.get(dept, 0) + 1
            
        return {
            "total_complaints": total,
            "critical_cases": critical,
            "category_distribution": categories,
            "department_load": departments,
            # Mocking surge data for the dashboard UI
            "active_surges": [
                {"location": "Downtown District", "issue": "Potholes", "growth_rate": "+45% in 24h"},
                {"location": "Northside", "issue": "Water Outage", "growth_rate": "+120% in 12h"}
            ]
        }
    except Exception as e:
        print(f"Analytics error: {e}")
        return {
            "status": "error",
            "message": "Failed to aggregate dashboard metrics"
        }
