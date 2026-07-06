import google.generativeai as genai
from dotenv import load_dotenv
import os
import json

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model=genai.GenerativeModel("gemini-2.5-flash")

def route_query(query:str):
    prompt=f"""
You are a pharmacy AI router.
Return ONLY JSON.
Possible intents:
low_stock
expiry_risk
inventory_value

total_revenue
investment
profit

best_selling
manufacturer_sales

top_customers
frequent_customers

top_distributor
distributor_spending

reorder
forecast
fast_moving
slow_moving

customer_summary
distributor_medicines

Examples:
Query:
Show low stock medicines
Output:
{{"intent":"low_stock"}}
Query:
How much profit have I made?
Output:
{{"intent":"profit"}}
Query:
Show customer 9876543210
Output:
{{"intent":"customer_summary","phone":"9876543210"}}
Query:
Show Apollo distributor medicines
Output:
{{"intent":"distributor_medicines","name":"Apollo"}}
User Query:
{query}
"""
    response=model.generate_content(prompt)
    text=response.text.strip()
    text=text.replace("```json","")
    text=text.replace("```","")
    return json.loads(text)