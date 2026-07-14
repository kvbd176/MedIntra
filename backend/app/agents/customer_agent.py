from sqlalchemy.orm import Session
from app.models.customer import Customer
from app.models.invoice import Invoice


class CustomerAgent:
    def __init__(self, db:Session, user_id:int):
        self.db=db
        self.user_id=user_id

    # Top Customers By Spending
    def top_customers(self):
        customers=self.db.query(Customer).filter(Customer.user_id==self.user_id).all()
        result=[]
        for customer in customers:
            invoices=self.db.query(Invoice).filter(
                Invoice.customer_id==customer.customer_id,
                Invoice.user_id==self.user_id
            ).all()
            total_spent=0
            for invoice in invoices:
                total_spent+=invoice.total_amount
            result.append({
                "customer_name":customer.customer_name,
                "phone_number":customer.phone_number,
                "total_spent":total_spent,
                "total_visits":len(invoices)
            })
        result.sort(
            key=lambda x:x["total_spent"],
            reverse=True
        )
        return result[:10]

    # Most Frequent Customers
    def frequent_customers(self):
        customers=self.db.query(Customer).filter(Customer.user_id==self.user_id).all()
        result=[]
        for customer in customers:
            invoices=self.db.query(Invoice).filter(
                Invoice.customer_id==customer.customer_id,
                Invoice.user_id==self.user_id
            ).all()
            result.append({
                "customer_name":customer.customer_name,
                "phone_number":customer.phone_number,
                "total_visits":len(invoices)
            })
        result.sort(
            key=lambda x: x["total_visits"],
            reverse=True
        )
        return result[:10]

    # Customer Summary By Phone
    def customer_summary(
        self,
        phone_number: str
    ):
        customer=self.db.query(Customer).filter(
            Customer.phone_number==phone_number,
            Customer.user_id==self.user_id
        ).first()
        if not customer:
            return {
                "message":
                "Customer not found"
            }
        invoices=self.db.query(Invoice).filter(
            Invoice.customer_id==customer.customer_id,
            Invoice.user_id==self.user_id
        ).all()
        total_spent=0
        for invoice in invoices:
            total_spent+=invoice.total_amount
        return {
            "customer_name":customer.customer_name,
            "phone_number":customer.phone_number,
            "total_visits":len(invoices),
            "total_spent":total_spent
        }

    # Overall Customer Statistics
    def customer_statistics(self):
        customers=self.db.query(Customer).filter(Customer.user_id==self.user_id).all()
        invoices=self.db.query(Invoice).filter(Invoice.user_id==self.user_id).all()
        return {
            "total_customers":len(customers),
            "total_invoices":len(invoices)
        }

    # Complete Customer Summary
    def customer_report(self):
        return {
            "top_customers":self.top_customers(),
            "frequent_customers":self.frequent_customers(),
            "statistics":self.customer_statistics()
        }
    
    def find_phone(self,query: str):
        import re
        match=re.search(r"\d{10}",query)
        if match:
            return match.group()
        return None
    
    def best_customer(self):
        customers = self.top_customers()
        if not customers:
            return {"message":"No customers found"}
        return customers[0]
    
    def most_frequent_customer(self):
        customers = self.frequent_customers()
        if not customers:
            return {"message":"No customers found"}
        return customers[0]