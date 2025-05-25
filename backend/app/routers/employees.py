from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Query, status, Body
from fastapi.responses import JSONResponse
from typing import List, Optional
from bson import ObjectId
import datetime
import csv
import io

from ..models.employee import EmployeeCreate, EmployeeUpdate, EmployeeInDB
from ..database import employees_collection
from ..feature_flags import FeatureFlags
from ..utils import PyObjectId, validate_object_id

router = APIRouter(
    prefix="/api/employees",
    tags=["employees"],
    responses={404: {"description": "Not found"}},
)

# Helper function to convert MongoDB document to Employee model
async def get_employee_or_404(employee_id: str) -> dict:
    """Get employee by ID or raise 404"""
    if not validate_object_id(employee_id):
        raise HTTPException(status_code=404, detail="Invalid employee ID format")
        
    employee = await employees_collection.find_one({"_id": ObjectId(employee_id)})
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Convert ObjectId to string
    employee["id"] = str(employee["_id"])
    del employee["_id"]
    
    return employee

@router.get("", response_model=List[EmployeeInDB])
@router.get("/", response_model=List[EmployeeInDB])
async def get_employees(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    department: Optional[str] = None,
    search: Optional[str] = None
):
    """Get all employees with optional filtering"""
    try:
        # Build query based on filters
        query = {}
        if department:
            query["department"] = department
        
        if search:
            # Search in name, position, and department
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"position": {"$regex": search, "$options": "i"}},
                {"email": {"$regex": search, "$options": "i"}},
            ]
        
        # Get filtered employees with pagination
        cursor = employees_collection.find(query).skip(skip).limit(limit)
        employees = []
        
        # Process results
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            del doc["_id"]
            employees.append(doc)
        
        return employees
    except Exception as e:
        print(f"Error fetching employees: {e}")
        # Return empty list rather than failing
        return []

@router.post("/", response_model=EmployeeInDB, status_code=201)
async def create_employee(employee: EmployeeCreate):
    """Create a new employee"""
    # Prepare employee document
    current_date = datetime.datetime.now().date().isoformat()
    employee_dict = employee.model_dump(exclude_unset=True)
    employee_dict.update({
        "created_at": current_date,
        "updated_at": current_date
    })
    
    # Insert into database
    result = await employees_collection.insert_one(employee_dict)
    
    # Get created employee
    created_employee = await get_employee_or_404(str(result.inserted_id))
    return created_employee

@router.get("/{employee_id}", response_model=EmployeeInDB)
async def get_employee(employee_id: str):
    """Get employee by ID"""
    return await get_employee_or_404(employee_id)

@router.put("/{employee_id}", response_model=EmployeeInDB)
async def update_employee(employee_id: str, employee_update: EmployeeUpdate):
    """Update employee by ID"""
    # Ensure employee exists
    await get_employee_or_404(employee_id)
    
    # Prepare update data
    update_data = employee_update.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.datetime.now().date().isoformat()
    
    # Update employee
    await employees_collection.update_one(
        {"_id": ObjectId(employee_id)},
        {"$set": update_data}
    )
    
    # Return updated employee
    return await get_employee_or_404(employee_id)

@router.delete("/{employee_id}", status_code=204)
async def delete_employee(employee_id: str):
    """Delete employee by ID"""
    # Ensure employee exists
    await get_employee_or_404(employee_id)
    
    # Delete employee
    await employees_collection.delete_one({"_id": ObjectId(employee_id)})
    return None

@router.post("/import-csv")
async def import_employees_csv(
    file: UploadFile = File(...),
    overwrite: bool = Query(False),
):
    """Import employees from CSV file"""
    # Check if bulk upload feature is enabled
    if not FeatureFlags.is_enabled("bulk_upload"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bulk upload feature is not enabled"
        )
    
    # Read and parse CSV
    contents = await file.read()
    buffer = io.StringIO(contents.decode())
    csv_reader = csv.DictReader(buffer)
    
    employees_to_insert = []
    row_count = 0
    error_rows = []
    
    # Process each CSV row
    for row in csv_reader:
        row_count += 1
        
        # Validate required fields
        if not all(key in row and row[key] for key in ["name", "position", "department"]):
            error_rows.append(f"Row {row_count}: Missing required fields")
            continue
        
        # Create employee record
        now = datetime.datetime.now().date()
        employee = {
            "name": row["name"],
            "position": row["position"],
            "department": row["department"],
            "email": row.get("email", ""),
            "phone": row.get("phone", ""),
            "bio": row.get("bio", ""),
            "start_date": row.get("start_date", None),
            "photo_url": row.get("photo_url", ""),
            "created_at": now,
            "updated_at": now
        }
        
        employees_to_insert.append(employee)
    
    # Insert employees if we have valid rows
    inserted_count = 0
    if employees_to_insert:
        result = await employees_collection.insert_many(employees_to_insert)
        inserted_count = len(result.inserted_ids)
    
    # Return summary
    return {
        "success": True,
        "total_rows": row_count,
        "inserted": inserted_count,
        "errors": error_rows
    }

@router.get("/feature-flags/status")
async def get_feature_flags():
    """Get the status of all feature flags"""
    return FeatureFlags.all_features()

@router.post("/seed-test-data", status_code=201)
async def seed_test_data():
    """Add sample employee data for testing"""
    try:
        # Check if we already have employees
        count = await employees_collection.count_documents({})
        if count > 0:
            return {"message": f"Database already contains {count} employees"}
        
        # Get current date as ISO format string
        current_date = datetime.datetime.now().date().isoformat()
        
        # Sample employee data
        sample_employees = [
            {
                "name": "Alex Johnson",
                "email": "alex.johnson@example.com",
                "position": "Developer",
                "department": "Engineering",
                "phone": "+1 (555) 123-4567",
                "bio": "Full-stack developer with 5 years of experience in React and Node.js.",
                "start_date": "2021-05-15",
                "photo_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
                "created_at": current_date,
                "updated_at": current_date
            },
            {
                "name": "Emma Wilson",
                "email": "emma.wilson@example.com",
                "position": "Designer",
                "department": "Product",
                "start_date": "2022-01-10",
                "photo_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
                "created_at": current_date,
                "updated_at": current_date
            },
            {
                "name": "Michael Chen",
                "email": "michael.chen@example.com",
                "position": "Manager",
                "department": "Operations",
                "photo_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
                "created_at": current_date,
                "updated_at": current_date
            }
        ]
        
        # Insert sample data
        result = await employees_collection.insert_many(sample_employees)
        return {"message": f"Added {len(result.inserted_ids)} sample employees"}
    
    except Exception as e:
        print(f"Error seeding test data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to seed test data: {str(e)}"
        ) 