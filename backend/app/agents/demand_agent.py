from sqlalchemy.orm import Session
from app.models.medicine import Medicine
from app.models.invoice_item import InvoiceItem
from app.models.inventory_batch import InventoryBatch


class DemandAgent:
    def __init__(self,db: Session,user_id: int):
        self.db=db
        self.user_id=user_id
    # Fast Moving Medicines
    def fast_moving_medicines(self):
        medicines=self.db.query(Medicine).filter(
            Medicine.user_id == self.user_id
        ).all()
        result=[]
        for medicine in medicines:
            items=self.db.query(InvoiceItem).filter(
                InvoiceItem.medicine_id==medicine.medicine_id
            ).all()
            total_sold=0
            for item in items:
                total_sold+=item.quantity
            result.append({
                "medicine_name":medicine.medicine_name,
                "manufacturer":medicine.manufacturer,
                "units_sold":total_sold
            })
        result.sort(
            key=lambda x: x["units_sold"],
            reverse=True
        )
        return result[:10]

    # Slow Moving Medicines
    def slow_moving_medicines(self):
        medicines=self.db.query(Medicine).filter(
            Medicine.user_id==self.user_id
        ).all()
        result=[]
        for medicine in medicines:
            items=self.db.query(InvoiceItem).filter(
                InvoiceItem.medicine_id==medicine.medicine_id
            ).all()
            total_sold=0
            for item in items:
                total_sold+=item.quantity
            result.append({
                "medicine_name":medicine.medicine_name,
                "manufacturer":medicine.manufacturer,
                "units_sold":total_sold
            })
        result.sort(key=lambda x: x["units_sold"])
        return result[:10]

    # Reorder Suggestions
    def reorder_suggestions(self):
        batches=self.db.query(InventoryBatch).filter(
            InventoryBatch.user_id==self.user_id
        ).all()
        result=[]
        for batch in batches:
            if batch.quantity<10:
                medicine=self.db.query(Medicine).filter(
                    Medicine.medicine_id==batch.medicine_id
                ).first()
                items=self.db.query(InvoiceItem).filter(
                    InvoiceItem.medicine_id==batch.medicine_id
                ).all()
                total_sold=0
                for item in items:
                    total_sold+=item.quantity
                result.append({
                    "medicine_name":medicine.medicine_name,
                    "manufacturer":medicine.manufacturer,
                    "current_stock":batch.quantity,
                    "units_sold":total_sold,
                    "recommended_reorder":max(100, total_sold)
                })
        return result

    # Demand Forecast
    def demand_forecast(self):
        medicines=self.db.query(Medicine).filter(
            Medicine.user_id==self.user_id
        ).all()
        result=[]
        for medicine in medicines:
            items=self.db.query(InvoiceItem).filter(
                InvoiceItem.medicine_id==medicine.medicine_id
            ).all()
            total_sold=0
            for item in items:
                total_sold+=item.quantity
            predicted_next_month=int(total_sold*1.1)
            result.append({
                "medicine_name":medicine.medicine_name,
                "manufacturer":medicine.manufacturer,
                "historical_sales":total_sold,
                "predicted_next_month":predicted_next_month
            })
        result.sort(
            key=lambda x:
            x["predicted_next_month"],
            reverse=True
        )
        return result

    # Complete Demand Report
    def demand_report(self):
        return {
            "fast_moving":self.fast_moving_medicines(),
            "slow_moving":self.slow_moving_medicines(),
            "reorder":self.reorder_suggestions(),
            "forecast":self.demand_forecast()
        }