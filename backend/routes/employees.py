from fastapi import APIRouter, HTTPException, status
from typing import List
from models.employee import Employee, EmployeeCreate, EmployeeUpdate
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter()

# MongoDB connection
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.hr_pulse

@router.get("/", response_model=List[Employee])
async def get_employees():
    employees = await db.employees.find().to_list(length=100)
    return employees

@router.get("/{employee_id}", response_model=Employee)
async def get_employee(employee_id: str):
    employee = await db.employees.find_one({"_id": employee_id})
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.post("/", response_model=Employee, status_code=status.HTTP_201_CREATED)
async def create_employee(employee: EmployeeCreate):
    employee_dict = employee.dict()
    result = await db.employees.insert_one(employee_dict)
    created_employee = await db.employees.find_one({"_id": result.inserted_id})
    return created_employee

@router.put("/{employee_id}", response_model=Employee)
async def update_employee(employee_id: str, employee: EmployeeUpdate):
    update_data = employee.dict(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await db.employees.update_one(
        {"_id": employee_id},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    updated_employee = await db.employees.find_one({"_id": employee_id})
    return updated_employee

@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(employee_id: str):
    result = await db.employees.delete_one({"_id": employee_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found") 