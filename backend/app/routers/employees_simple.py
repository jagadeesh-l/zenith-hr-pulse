from fastapi import APIRouter, HTTPException, Depends, Query, File, UploadFile, status
from typing import List, Optional
from ..models.employee import EmployeeCreate, EmployeeUpdate, EmployeeInDB
from ..database_dynamodb import get_employees_table, parse_dynamodb_item, format_dynamodb_item
from ..security import get_current_active_user
import time

router = APIRouter()

@router.get("", response_model=List[EmployeeInDB])
@router.get("/", response_model=List[EmployeeInDB])
async def get_employees(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    department: Optional[str] = None,
    location: Optional[str] = None,
    employee_status: Optional[str] = None,
    employment_category: Optional[str] = None,
    is_leader: Optional[str] = None,
    position: Optional[str] = None,
    gender: Optional[str] = None,
    account: Optional[str] = None,
    search: Optional[str] = None
):
    """Get all employees with optional filtering from DynamoDB"""
    try:
        print(f"DEBUG: get_employees called with params: department={department}, location={location}, skip={skip}, limit={limit}")
        
        # Get table
        table = await get_employees_table()
        print(f"DEBUG: Table obtained: {table}")

        # Simple scan to get all employees
        print(f"DEBUG: Performing scan...")
        resp = await table.scan(Limit=1000)  # Get up to 1000 employees
        items = resp.get("Items", [])
        print(f"DEBUG: Scan returned {len(items)} items")

        # Parse and normalize items
        print(f"DEBUG: Parsing {len(items)} items")
        parsed = []
        for i, raw in enumerate(items):
            print(f"DEBUG: Parsing item {i+1}: {raw}")
            doc = parse_dynamodb_item(raw)
            print(f"DEBUG: Parsed item {i+1}: {doc}")
            
            # Ensure id field exists for API model
            if "id" not in doc and "_id" in doc:
                doc["id"] = doc["_id"]
            elif "id" not in doc:
                print(f"DEBUG: Skipping item {i+1} - no id field")
                continue

            # Set photo_url to empty string if not present
            if not doc.get("photo_url"):
                doc["photo_url"] = ""

            parsed.append(doc)
        
        print(f"DEBUG: Final parsed items: {len(parsed)}")

        # Apply search filter client-side
        if search:
            search_lower = search.lower()
            parsed = [
                d for d in parsed
                if (
                    search_lower in d.get("name", "").lower()
                    or search_lower in d.get("position", "").lower()
                    or search_lower in d.get("email", "").lower()
                )
            ]

        # Apply pagination via slicing
        sliced = parsed[skip: skip + limit]
        
        print(f"DEBUG: Returning {len(sliced)} employees")
        return sliced
        
    except Exception as e:
        print(f"Error fetching employees from DynamoDB: {e}")
        return []

@router.get("/{employee_id}", response_model=EmployeeInDB)
async def get_employee(employee_id: str):
    """Get a specific employee by ID"""
    try:
        table = await get_employees_table()
        response = await table.get_item(Key={"id": employee_id})
        
        if "Item" not in response:
            raise HTTPException(status_code=404, detail="Employee not found")
    
        employee = parse_dynamodb_item(response["Item"])
        return employee
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch employee: {str(e)}")

@router.post("/", response_model=EmployeeInDB, status_code=201)
async def create_employee(employee_data: EmployeeCreate):
    """Create a new employee"""
    try:
        table = await get_employees_table()
        
        # Generate a unique ID
        import uuid
        employee_id = str(uuid.uuid4())
        
        # Format data for DynamoDB
        employee_dict = employee_data.dict()
        employee_dict["id"] = employee_id
        employee_dict["created_at"] = time.strftime("%Y-%m-%d")
        employee_dict["updated_at"] = time.strftime("%Y-%m-%d")
        
        # Convert to DynamoDB format
        dynamodb_item = format_dynamodb_item(employee_dict)
        
        # Insert into DynamoDB
        await table.put_item(Item=dynamodb_item)
        
        # Return the created employee
        return EmployeeInDB(**employee_dict)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create employee: {str(e)}")

@router.put("/{employee_id}", response_model=EmployeeInDB)
async def update_employee(employee_id: str, employee_update: EmployeeUpdate):
    """Update an existing employee"""
    try:
        table = await get_employees_table()
        
        # Get existing employee
        response = await table.get_item(Key={"id": employee_id})
        if "Item" not in response:
            raise HTTPException(status_code=404, detail="Employee not found")
        
        # Update fields
        update_data = employee_update.dict(exclude_unset=True)
        update_data["updated_at"] = time.strftime("%Y-%m-%d")
        
        # Convert to DynamoDB format and update
        dynamodb_item = format_dynamodb_item(update_data)
        
        # Update in DynamoDB
        await table.put_item(Item=dynamodb_item)
        
        # Return updated employee
        return EmployeeInDB(**update_data)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update employee: {str(e)}")

@router.delete("/{employee_id}", status_code=204)
async def delete_employee(employee_id: str):
    """Delete an employee"""
    try:
        table = await get_employees_table()
        
        # Check if employee exists
        response = await table.get_item(Key={"id": employee_id})
        if "Item" not in response:
            raise HTTPException(status_code=404, detail="Employee not found")
        
        # Delete from DynamoDB
        await table.delete_item(Key={"id": employee_id})
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete employee: {str(e)}")
