import re

from app.agents.inventory_agent import InventoryAgent
from app.agents.sales_agent import SalesAgent
from app.agents.customer_agent import CustomerAgent
from app.agents.distributor_agent import DistributorAgent
from app.agents.demand_agent import DemandAgent


class PharmacyOrchestrator:

    def __init__(self, db, user_id):
        self.inventory_agent = InventoryAgent(db, user_id)
        self.sales_agent = SalesAgent(db, user_id)
        self.customer_agent = CustomerAgent(db, user_id)
        self.distributor_agent = DistributorAgent(db, user_id)
        self.demand_agent = DemandAgent(db, user_id)

    def process_query(self, query: str):

        q = query.lower()

        # =========================
        # CUSTOMER PHONE DETECTION
        # =========================

        phone_match = re.search(r"\d{10}", query)

        if phone_match:
            return self.customer_agent.customer_summary(
                phone_match.group()
            )

        # =========================
        # DISTRIBUTOR DETECTION
        # =========================

        distributor_name = (
            self.distributor_agent.find_distributor_name(query)
        )

        if distributor_name:

            if (
                "stock" in q or
                "supply" in q or
                "sent" in q or
                "medicine" in q
            ):
                return self.distributor_agent.distributor_medicines(
                    distributor_name
                )

            if (
                "value" in q or
                "purchase" in q or
                "spent" in q
            ):
                return self.distributor_agent.distributor_purchase_value(
                    distributor_name
                )

        # =========================
        # INVENTORY
        # =========================

        if (
            "low stock" in q or
            "out of stock" in q or
            "less stock" in q
        ):
            return self.inventory_agent.low_stock()

        if (
            "expiry" in q or
            "expiring" in q or
            "expire" in q
        ):
            return self.inventory_agent.expiry_risk()

        if (
            "inventory value" in q or
            "stock value" in q
        ):
            return self.inventory_agent.inventory_value()

        # =========================
        # SALES
        # =========================

        if (
            "top manufacturer" in q or
            "best manufacturer" in q or
            "highest selling manufacturer" in q or
            "most sales manufacturer" in q
        ):
            return self.sales_agent.top_manufacturer()

        if (
            "best selling medicine" in q or
            "top medicine" in q or
            "highest selling medicine" in q
        ):
            return self.sales_agent.top_medicine()

        if (
            "best selling medicines" in q
        ):
            return self.sales_agent.best_selling_medicines()

        if (
            "manufacturer sales" in q or
            "sales by manufacturer" in q
        ):
            return self.sales_agent.manufacturer_sales()

        if (
            "total revenue" in q or
            "overall revenue" in q or
            "sales amount" in q
        ):
            return self.sales_agent.total_revenue()

        if (
            "investment" in q or
            "invested" in q or
            "invest" in q
        ):
            return self.sales_agent.total_investment()

        if (
            "profit" in q or
            "loss" in q
        ):
            return self.sales_agent.estimated_profit()

        # =========================
        # CUSTOMERS
        # =========================

        if (
            "best customer" in q
        ):
            return self.customer_agent.best_customer()

        if (
            "most frequent customer" in q or
            "loyal customer" in q
        ):
            return self.customer_agent.most_frequent_customer()

        if (
            "top customers" in q or
            "top customer" in q
        ):
            return self.customer_agent.top_customers()

        if (
            "frequent customers" in q or
            "frequent customer" in q
        ):
            return self.customer_agent.frequent_customers()

        # =========================
        # DISTRIBUTORS
        # =========================

        if (
            "top distributor" in q
        ):
            return self.distributor_agent.top_distributor()

        if (
            "distributor spending" in q or
            "supplier spending" in q
        ):
            return self.distributor_agent.distributor_spending()

        # =========================
        # DEMAND
        # =========================

        if (
            "reorder" in q or
            "order again" in q
        ):
            return self.demand_agent.reorder_suggestions()

        if (
            "forecast" in q or
            "future demand" in q or
            "prediction" in q or
            "predict" in q
        ):
            return self.demand_agent.demand_forecast()

        if (
            "fast moving" in q
        ):
            return self.demand_agent.fast_moving_medicines()

        if (
            "slow moving" in q
        ):
            return self.demand_agent.slow_moving_medicines()

        # =========================
        # FALLBACK
        # =========================

        return {
            "message": "I could not understand the query."
        }