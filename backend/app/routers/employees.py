from fastapi import APIRouter, HTTPException, Depends, Form, UploadFile, File, Query, status, Body
from fastapi.responses import JSONResponse
from typing import List, Optional
from bson import ObjectId
import datetime
import csv
import io
import shutil
import os
from pathlib import Path
import pandas as pd

from ..models.employee import EmployeeCreate, EmployeeUpdate, EmployeeInDB
from ..database import employees_collection
from ..feature_flags import FeatureFlags
from ..utils import PyObjectId, validate_object_id
from ..services.image_upload import ImageUploadService
from ..security import get_current_active_user

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
async def create_employee(
    name: str = Form(...),
    position: str = Form(...),
    department: str = Form(...),
    email: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None)
):
    """Create a new employee with optional photo upload"""
    try:
        # Handle photo upload if provided
        photo_url = None
        if photo:
            photo_url = await ImageUploadService.upload_photo(photo)
            base_url = "http://localhost:8000"
            photo_url = f"{base_url}{photo_url}"
        
        # Create employee dict
        employee_data = {
            "name": name,
            "position": position,
            "department": department,
            "email": email,
            "phone": phone,
            "bio": bio,
            "photo_url": photo_url,
            "created_at": datetime.datetime.now().date().isoformat(),
            "updated_at": datetime.datetime.now().date().isoformat()
        }
        
        # Insert into database
        result = await employees_collection.insert_one(employee_data)
        
        # Get created employee
        created_employee = await get_employee_or_404(str(result.inserted_id))
        return created_employee
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create employee: {str(e)}"
        )

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
    
    # Convert date object to ISO format string if it exists
    if update_data.get('start_date'):
        update_data['start_date'] = update_data['start_date'].isoformat()
    
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

@router.post("/import")
async def import_employees(
    file: UploadFile = File(...),
    replace_existing: bool = Form(False)
):
    """Import employees from CSV or Excel file"""
    try:
        contents = await file.read()
        
        # Check file extension
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        elif file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(
                status_code=400,
                detail="File must be CSV or Excel format"
            )

        # Map CSV columns to database fields
        field_mapping = {
            'employee_id': 'employee_id',
            'first_name': 'first_name',
            'last_name': 'last_name',
            'email': 'email',
            'date_of_joining': 'start_date',
            'department': 'department',
            'designation': 'position',
            'phone_number': 'phone',
            'address': 'address',
            'city': 'city',
            'state': 'state',
            'country': 'country',
            'postal_code': 'postal_code'
        }

        # Validate required columns
        required_columns = ['first_name', 'last_name', 'email', 'department', 'designation']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required columns: {', '.join(missing_columns)}"
            )

        # Process employees
        successful_imports = 0
        failed_imports = 0
        error_messages = []

        for index, row in df.iterrows():
            try:
                # Combine first and last name
                full_name = f"{row['first_name']} {row['last_name']}"
                
                # Create employee data dict
                employee_data = {
                    "name": full_name,
                    "position": row['designation'],
                    "department": row['department'],
                    "email": row['email'],
                    "phone": str(row['phone_number']) if 'phone_number' in row else '',
                    "start_date": row['date_of_joining'] if 'date_of_joining' in row else None,
                    "employee_id": row['employee_id'] if 'employee_id' in row else None,
                    "address": {
                        "street": row['address'] if 'address' in row else '',
                        "city": row['city'] if 'city' in row else '',
                        "state": row['state'] if 'state' in row else '',
                        "country": row['country'] if 'country' in row else '',
                        "postal_code": str(row['postal_code']) if 'postal_code' in row else ''
                    },
                    "emergency_contact": {
                        "name": row['emergency_contact_name'] if 'emergency_contact_name' in row else '',
                        "phone": str(row['emergency_contact_number']) if 'emergency_contact_number' in row else ''
                    },
                    "personal_info": {
                        "gender": row['gender'] if 'gender' in row else '',
                        "blood_group": row['blood_group'] if 'blood_group' in row else '',
                        "date_of_birth": row['date_of_birth'] if 'date_of_birth' in row else None
                    },
                    "employment_status": row['employment_status'] if 'employment_status' in row else 'Full-time',
                    "reporting_manager": row['reporting_manager'] if 'reporting_manager' in row else '',
                    "created_at": datetime.datetime.now().date().isoformat(),
                    "updated_at": datetime.datetime.now().date().isoformat()
                }

                # Convert NaN values to None
                employee_data = {k: (v if pd.notna(v) else None) for k, v in employee_data.items()}

                # Insert employee
                print(f"Inserting employee data: {employee_data}")  # Debug print
                result = await employees_collection.insert_one(employee_data)
                successful_imports += 1

            except Exception as e:
                failed_imports += 1
                error_messages.append(f"Row {index + 2}: {str(e)}")
                print(f"Error processing row {index + 2}: {str(e)}")  # Debug print

        return JSONResponse(content={
            "status": "completed",
            "successful_imports": successful_imports,
            "failed_imports": failed_imports,
            "errors": error_messages
        })

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Import failed: {str(e)}")  # Debug print
        raise HTTPException(
            status_code=500,
            detail=f"Import failed: {str(e)}"
        )

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

UPLOAD_DIR = Path("uploads/photos")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/upload-photo")
async def upload_photo(file: UploadFile = File(...)):
    """Upload a photo and return its URL"""
    try:
        photo_url = await ImageUploadService.upload_photo(file)
        base_url = "http://localhost:8000"  # In production, use your domain
        return {"photo_url": f"{base_url}{photo_url}"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {str(e)}"
        )

@router.post("/upload-photo/{employee_id}")
async def upload_employee_photo(
    employee_id: str,
    name: str = Form(...),  # Fix: Use fastapi Form class
    description: Optional[str] = Form(None),
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_active_user)
):
    """Upload an employee's photo"""
    try:
        # Ensure employee exists
        employee = await get_employee_or_404(employee_id)
        
        # Handle photo upload
        photo_url = await ImageUploadService.upload_photo(file)
        base_url = "http://localhost:8000"  # In production, use your domain
        photo_url = f"{base_url}{photo_url}"
        
        # Update employee with new photo URL
        await employees_collection.update_one(
            {"_id": ObjectId(employee_id)},
            {"$set": {"photo_url": photo_url}}
        )
        
        # Return updated employee
        return await get_employee_or_404(employee_id)
    
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload employee photo: {str(e)}"
        )

@router.post("/create")
async def create_employee_with_photo(
    name: str = Form(...),
    position: str = Form(...),
    department: str = Form(...),
    email: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    start_date: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None)
):
    """Create a new employee with optional photo upload"""
    try:
        # Handle photo upload if provided
        photo_url = None
        if photo:
            photo_url = await ImageUploadService.upload_photo(photo)
            if photo_url:
                base_url = "http://localhost:8000"  # Change in production
                photo_url = f"{base_url}{photo_url}"

        # Create employee data
        employee_data = {
            "name": name,
            "position": position,
            "department": department,
            "email": email,
            "phone": phone,
            "bio": bio,
            "start_date": start_date,
            "photo_url": photo_url,
            "created_at": datetime.datetime.now().date().isoformat(),
            "updated_at": datetime.datetime.now().date().isoformat()
        }

        # Insert into database
        result = await employees_collection.insert_one(employee_data)
        
        # Return created employee
        return await get_employee_or_404(str(result.inserted_id))

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create employee: {str(e)}"
        )