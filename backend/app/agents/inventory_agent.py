from datetime import date, timedelta

from sqlalchemy.orm import Session

from app.models.inventory_batch import InventoryBatch
from app.models.medicine import Medicine

class InventoryAgent:
    def __init__(self,db: Session,user_id: int):
        self.db=db
        self.user_id=user_id
    def low_stock(self):
        batches=self.db.query(InventoryBatch).filter(InventoryBatch.user_id==self.user_id).all()
        result=[]
        for batch in batches:
            if batch.quantity<10:
                medicine=self.db.query(Medicine).filter(Medicine.medicine_id==batch.medicine_id).first()
                result.append({
                    "medicine_name": medicine.medicine_name,
                    "manufacturer": medicine.manufacturer,
                    "batch_number": batch.batch_number,
                    "quantity": batch.quantity
                })
        return result
    #expiry risk detection
    def expiry_risk(self):
        today=date.today()
        limit=today+timedelta(days=90)
        batches=self.db.query(InventoryBatch).filter(InventoryBatch.user_id==self.user_id).all()
        result=[]
        for batch in batches:
            if batch.expiry_date<=limit:
                medicine=self.db.query(Medicine).filter(Medicine.medicine_id==batch.medicine_id).first()
                result.append({
                    "medicine_name": medicine.medicine_name,
                    "manufacturer": medicine.manufacturer,
                    "batch_number": batch.batch_number,
                    "expiry_date": batch.expiry_date,
                    "remaining_stock": batch.quantity
                })
        return result
    
    #current inventory value
    def inventory_value(self):
        today=date.today()
        batches=self.db.query(InventoryBatch).filter(
            InventoryBatch.user_id == self.user_id
        ).all()
        total_purchased=0
        current_inventory=0
        stock_sold_value=0
        profit=0
        expired_loss=0
        for batch in batches:
            sold_qty=(batch.initial_quantity-batch.quantity)
            total_purchased+=(batch.initial_quantity*batch.cost_price)
            if batch.expiry_date<today:
                expired_loss+=(batch.quantity*batch.cost_price)
            else:
                current_inventory+=(batch.quantity*batch.cost_price)
            stock_sold_value+=(sold_qty*batch.selling_price)
            profit+=(sold_qty*(batch.selling_price-batch.cost_price))
        profit-=expired_loss
        return{
            "total_purchased_stock_value":round(total_purchased, 2),
            "current_inventory_value":round(current_inventory, 2),
            "stock_sold_value":round(stock_sold_value, 2),
            "expired_stock_loss":round(expired_loss, 2),
            "estimated_profit":round(profit, 2)
        }
    
    #reorder suggestions
    def reorder_suggestions(self):
        batches=self.db.query(InventoryBatch).filter(InventoryBatch.user_id==self.user_id).all()
        result=[]
        for batch in batches:
            if batch.quantity<10:
                medicine=self.db.query(Medicine).filter(Medicine.medicine_id==batch.medicine_id).first()
                result.append({
                    "medicine_name": medicine.medicine_name,
                    "manufacturer": medicine.manufacturer,
                    "current_stock": batch.quantity,
                    "recommended_reorder":100
                })
        return result
    
    def expired_medicines(self):
        today = date.today()
        batches = self.db.query(InventoryBatch).filter(
            InventoryBatch.user_id == self.user_id
        ).all()
        result = []
        for batch in batches:
            if batch.expiry_date < today:
                medicine = self.db.query(Medicine).filter(
                    Medicine.medicine_id == batch.medicine_id
                ).first()
                result.append({
                    "medicine_name":medicine.medicine_name,
                    "manufacturer":medicine.manufacturer,
                    "batch_number":batch.batch_number,
                    "quantity":batch.quantity,
                    "expiry_date":batch.expiry_date,
                    "loss_value":round(batch.quantity*batch.cost_price,2)
                })

        return result