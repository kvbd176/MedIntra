from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User

from app.services.gemini_router import route_query
from app.services.gemini_answer import generate_answer

from app.agents.orchestrator import PharmacyOrchestrator

router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)

@router.post("/chat")
def chat(
    data: dict,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    user = db.query(User).filter(
        User.email == current_user["sub"]
    ).first()

    query = data["query"]

    route = route_query(query)

    orchestrator = PharmacyOrchestrator(
        db,
        user.id
    )

    intent = route.get("intent")

    result = None

    if intent == "low_stock":
        result = orchestrator.inventory_agent.low_stock()

    elif intent == "expiry_risk":
        result = orchestrator.inventory_agent.expiry_risk()

    elif intent == "inventory_value":
        result = orchestrator.inventory_agent.inventory_value()

    elif intent == "total_revenue":
        result = orchestrator.sales_agent.total_revenue()

    elif intent == "investment":
        result = orchestrator.sales_agent.total_investment()

    elif intent == "profit":
        result = orchestrator.sales_agent.estimated_profit()

    elif intent == "best_selling":
        result = orchestrator.sales_agent.best_selling_medicines()

    elif intent == "manufacturer_sales":
        result = orchestrator.sales_agent.manufacturer_sales()

    elif intent == "top_customers":
        result = orchestrator.customer_agent.top_customers()

    elif intent == "frequent_customers":
        result = orchestrator.customer_agent.frequent_customers()

    elif intent == "top_distributor":
        result = orchestrator.distributor_agent.top_distributor()

    elif intent == "distributor_spending":
        result = orchestrator.distributor_agent.distributor_spending()

    elif intent == "reorder":
        result = orchestrator.demand_agent.reorder_suggestions()

    elif intent == "forecast":
        result = orchestrator.demand_agent.demand_forecast()

    elif intent == "fast_moving":
        result = orchestrator.demand_agent.fast_moving_medicines()

    elif intent == "slow_moving":
        result = orchestrator.demand_agent.slow_moving_medicines()

    elif intent == "customer_summary":
        result = orchestrator.customer_agent.customer_summary(
            route["phone"]
        )

    elif intent == "distributor_medicines":
        result = orchestrator.distributor_agent.distributor_medicines(
            route["name"]
        )

    else:
        result = {
            "message": "Unable to process query"
        }

    answer = generate_answer(
        question=query,
        data=result
    )

    return {
        "answer": answer,
        "data": result
    }