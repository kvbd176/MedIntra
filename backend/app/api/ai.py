from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.services.gemini_router import route_query
from app.agents.orchestrator import PharmacyOrchestrator

router=APIRouter(
    prefix="/ai",
    tags=["AI"]
)

@router.post("/chat")
def chat(
    data: dict,
    db: Session=Depends(get_db),
    current_user=Depends(get_current_user)
):
    user=db.query(User).filter(User.email==current_user["sub"]).first()
    query=data["query"]
    route=route_query(query)
    orchestrator=PharmacyOrchestrator(db,user.id)
    intent=route.get("intent")
    if intent=="low_stock":
        return orchestrator.inventory_agent.low_stock()
    if intent=="expiry_risk":
        return orchestrator.inventory_agent.expiry_risk()
    if intent=="inventory_value":
        return orchestrator.inventory_agent.inventory_value()
    if intent=="total_revenue":
        return orchestrator.sales_agent.total_revenue()
    if intent=="investment":
        return orchestrator.sales_agent.total_investment()
    if intent=="profit":
        return orchestrator.sales_agent.estimated_profit()
    if intent=="best_selling":
        return orchestrator.sales_agent.best_selling_medicines()
    if intent=="manufacturer_sales":
        return orchestrator.sales_agent.manufacturer_sales()
    if intent=="top_customers":
        return orchestrator.customer_agent.top_customers()
    if intent=="frequent_customers":
        return orchestrator.customer_agent.frequent_customers()
    if intent=="top_distributor":
        return orchestrator.distributor_agent.top_distributor()
    if intent=="distributor_spending":
        return orchestrator.distributor_agent.distributor_spending()
    if intent=="reorder":
        return orchestrator.demand_agent.reorder_suggestions()
    if intent=="forecast":
        return orchestrator.demand_agent.demand_forecast()
    if intent=="fast_moving":
        return orchestrator.demand_agent.fast_moving_medicines()
    if intent=="slow_moving":
        return orchestrator.demand_agent.slow_moving_medicines()
    if intent=="customer_summary":
        return orchestrator.customer_agent.customer_summary(route["phone"])
    if intent=="distributor_medicines":
        return orchestrator.distributor_agent.distributor_medicines(route["name"])
    return {"message":"Unable to process query"}