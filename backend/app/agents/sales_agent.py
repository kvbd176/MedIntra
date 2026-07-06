from sqlalchemy.orm import Session

from app.models.invoice import Invoice
from app.models.invoice_item import InvoiceItem
from app.models.inventory_batch import InventoryBatch
from app.models.medicine import Medicine


class SalesAgent:
    def __init__(self,db: Session,user_id: int):
        self.db=db
        self.user_id=user_id
    # Total Revenue
    def total_revenue(self):
        invoices=self.db.query(Invoice).filter(Invoice.user_id==self.user_id).all()
        revenue=0
        for invoice in invoices:
            revenue+=invoice.total_amount
        return {"total_revenue":revenue}

    # Total Investment
    def total_investment(self):
        batches=self.db.query(InventoryBatch).filter(InventoryBatch.user_id==self.user_id).all()
        investment=0
        for batch in batches:
            investment+=(batch.initial_quantity*batch.cost_price)
        return {"total_investment":investment}

    # Current Inventory Value
    def current_inventory_value(self):
        batches=self.db.query(InventoryBatch).filter(InventoryBatch.user_id==self.user_id).all()
        value=0
        for batch in batches:
            value+=(batch.quantity*batch.cost_price)
        return {"current_inventory_value": value}

    # Estimated Profit
    def estimated_profit(self):
        revenue=self.total_revenue()["total_revenue"]
        investment=self.total_investment()["total_investment"]
        inventory_value=(
            self.current_inventory_value()[
                "current_inventory_value"
            ]
        )
        profit=(revenue-(investment -inventory_value))
        return {
            "estimated_profit":
            round(profit, 2)
        }
    # Best Selling Medicines
    def best_selling_medicines(self):
        items=self.db.query(InvoiceItem).join(
            Invoice,
            Invoice.invoice_id==InvoiceItem.invoice_id
        ).filter(Invoice.user_id==self.user_id).all()
        sales={}
        for item in items:
            medicine=self.db.query(Medicine).filter(Medicine.medicine_id==item.medicine_id).first()
            if not medicine:
                continue
            name=medicine.medicine_name
            sales[name]=(sales.get(name,0)+item.quantity)

        sorted_sales=sorted(
            sales.items(),
            key=lambda x: x[1],
            reverse=True
        )
        result=[]
        for name, qty in sorted_sales:
            result.append({
                "medicine_name": name,
                "units_sold": qty
            })
        return result[:10]

    # Manufacturer Wise Sales
    def manufacturer_sales(self):

        items = self.db.query(
            InvoiceItem
        ).all()

        manufacturers = {}

        for item in items:

            medicine = self.db.query(
                Medicine
            ).filter(
                Medicine.medicine_id == item.medicine_id
            ).first()

            if not medicine:
                continue

            manufacturer = medicine.manufacturer

            manufacturers[manufacturer] = (
                manufacturers.get(manufacturer,0)
                + item.subtotal
            )

        result = []

        for manufacturer, amount in manufacturers.items():

            result.append({
                "manufacturer": manufacturer,
                "sales": amount
            })

        result.sort(
            key=lambda x: x["sales"],
            reverse=True
        )

        return result

    # Complete Sales Summary
    def sales_summary(self):
        return {
            "revenue":self.total_revenue(),
            "investment":self.total_investment(),
            "inventory_value":self.current_inventory_value(),
            "profit":self.estimated_profit(),
            "best_selling":self.best_selling_medicines(),
            "manufacturer_sales":self.manufacturer_sales()
        }
    
    def top_manufacturer(self):

        data = self.manufacturer_sales()

        if not data:
            return {
                "message":"No sales found"
            }

        return data[0]
    
    def top_medicine(self):

        medicines = self.best_selling_medicines()

        if not medicines:
            return {
                "message":"No sales found"
            }

        return medicines[0]