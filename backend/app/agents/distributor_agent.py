from sqlalchemy.orm import Session
from app.models.distributor import Distributor
from app.models.inventory_batch import InventoryBatch
from app.models.medicine import Medicine


class DistributorAgent:
    def __init__(self,db: Session,user_id: int):
        self.db=db
        self.user_id=user_id
    # Distributor Spending
    def distributor_spending(self):
        distributors=self.db.query(Distributor).filter(
            Distributor.user_id==self.user_id
            ).all()
        result=[]
        for distributor in distributors:
            batches=self.db.query(InventoryBatch).filter(
                InventoryBatch.distributor_id==distributor.distributor_id,
                InventoryBatch.user_id==self.user_id
            ).all()
            total_spent=0
            for batch in batches:
                total_spent+=(batch.initial_quantity*batch.cost_price)
            result.append({
                "distributor_name": distributor.distributor_name,
                "phone": distributor.phone,
                "total_spent": total_spent
            })
        result.sort(
            key=lambda x: x["total_spent"],
            reverse=True
        )
        return result

    # Top Distributor
    def top_distributor(self):
        spending=self.distributor_spending()
        if not spending:
            return { "message": "No distributors found"}
        return spending[0]

    # Distributor Medicines
    def distributor_medicines(self,distributor_name: str):
        distributor=self.db.query(Distributor).filter(
            Distributor.distributor_name.ilike(
                f"%{distributor_name}%"
            ),
            Distributor.user_id==self.user_id
        ).first()

        if not distributor:
            return { "message": "Distributor not found" }
        batches=self.db.query(InventoryBatch).filter(
            InventoryBatch.distributor_id == distributor.distributor_id,
            InventoryBatch.user_id == self.user_id
        ).all()
        medicines=[]
        for batch in batches:
            medicine=self.db.query(Medicine).filter(
                Medicine.medicine_id==batch.medicine_id
            ).first()
            medicines.append({
                "medicine_name":medicine.medicine_name,
                "manufacturer":medicine.manufacturer,
                "batch_number":batch.batch_number,
                "initial_quantity":batch.initial_quantity,
                "remaining_stock":batch.quantity
            })

        return {
            "distributor_name":distributor.distributor_name,
            "medicines":medicines
        }

    # Overall Distributor Statistics
    def distributor_statistics(self):
        distributors=self.db.query(Distributor).filter(
            Distributor.user_id==self.user_id
        ).all()
        batches=self.db.query(InventoryBatch).filter(
            InventoryBatch.user_id==self.user_id
        ).all()
        return {
            "total_distributors":len(distributors),
            "total_batches":len(batches)
        }

    # Complete Distributor Report
    def distributor_report(self):
        return {
            "top_distributor":self.top_distributor(),
            "spending":self.distributor_spending(),
            "statistics":self.distributor_statistics()
        }
    
    def find_distributor_name(self, query: str):
        distributors=self.db.query(Distributor).filter(
            Distributor.user_id == self.user_id
        ).all()
        query=query.lower()
        for distributor in distributors:
            if distributor.distributor_name.lower() in query:
                return distributor.distributor_name
        return None
    
    def distributor_purchase_value(self,distributor_name:str):
        distributor=self.db.query(Distributor).filter(
            Distributor.distributor_name.ilike(f"%{distributor_name}%"),
            Distributor.user_id==self.user_id
        ).first()
        if not distributor:
            return {"message":"Distributor not found"}
        batches=self.db.query(InventoryBatch).filter(
            InventoryBatch.distributor_id==distributor.distributor_id,
            InventoryBatch.user_id==self.user_id
        ).all()
        total=0
        for batch in batches:
            total+=(batch.initial_quantity*batch.cost_price)
        return {
            "distributor":distributor.distributor_name,
            "purchase_value":total
        }