from fastapi import APIRouter, HTTPException, Depends, Form, UploadFile, File, Query, status, Body
from fastapi.responses import JSONResponse
from typing import List, Optional
import datetime
import csv
import io
import shutil
import os
from pathlib import Path
import pandas as pd
import uuid
import time

from ..models.employee import EmployeeCreate, EmployeeUpdate, EmployeeInDB
from ..database import employees_collection, db
from ..database_dynamodb import get_employees_table, parse_dynamodb_item, format_dynamodb_item
from boto3.dynamodb.conditions import Key
from ..feature_flags import FeatureFlags
from ..services.image_upload import ImageUploadService

# Simple in-memory cache for employee list
_employee_cache = {}
_cache_timestamp = 0
CACHE_DURATION = 30  # Cache for 30 seconds

# Initialize cache timestamp to current time
import time
_cache_timestamp = time.time()

def clear_employee_cache():
    """Clear the employee cache when data is modified"""
    global _employee_cache, _cache_timestamp
    _employee_cache.clear()
    _cache_timestamp = 0
    print("Employee cache cleared")
from ..services.bedrock_service import bedrock_service
from ..security import get_current_active_user
from ..models.goal import GoalCreate

router = APIRouter(
    prefix="/api/employees",
    tags=["employees"],
    responses={404: {"description": "Not found"}},
)

# Helper function to get employee by ID
async def get_employee_or_404(employee_id: str) -> dict:
    """Get employee by ID or raise 404"""
    if not employee_id:
        raise HTTPException(status_code=404, detail="Employee ID is required")
        
    try:
        table = await get_employees_table()
        response = await table.get_item(Key={"id": employee_id})
        
        if "Item" not in response:
            raise HTTPException(status_code=404, detail="Employee not found")
    
        employee = parse_dynamodb_item(response["Item"])
        
        # Ensure photo_url is set from S3 if not present or if it's a direct S3 URL
        if not employee.get("photo_url") or (employee.get("photo_url") and employee.get("photo_url").startswith("https://zenith-hr-pulse-photos.s3.")):
            # Try to get photo from S3 using partition structure
            location = employee.get("location")
            department = employee.get("department")
            photo_url = await ImageUploadService.get_employee_photo_url(employee_id, location, department)
            if photo_url:
                employee["photo_url"] = photo_url
    
        return employee
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch employee: {str(e)}")

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
    """Get all employees with optional filtering from DynamoDB using optimized queries"""
    try:
        print(f"DEBUG: get_employees called with params: department={department}, location={location}, skip={skip}, limit={limit}")
        
        # Extract actual values from FastAPI Query objects
        skip_value = skip if isinstance(skip, int) else 0
        limit_value = limit if isinstance(limit, int) else 100
        
        print(f"DEBUG: Extracted values - skip: {skip_value}, limit: {limit_value}")
        
        # Check cache first for general queries without filters
        current_time = time.time()
        cache_key = f"employees_{department}_{location}_{employee_status}_{employment_category}_{is_leader}_{position}_{gender}_{account}_{search}"
        
        # Skip cache for now to debug the main issue
        # if (not department and not location and not employee_status and not employment_category and 
        #     not is_leader and not position and not gender and not account and not search and
        #     current_time - _cache_timestamp < CACHE_DURATION and cache_key in _employee_cache):
        #     print(f"Returning cached employees data")
        #     cached_data = _employee_cache[cache_key]
        #     return cached_data["items"][skip:skip+limit]

        print(f"DEBUG: Getting employees table...")
        table = await get_employees_table()
        print(f"DEBUG: Table obtained: {table}")

        items: List[dict] = []

        # Determine the best index to use based on filters
        index_name = None
        key_condition = None
        
        if department:
            index_name = "DepartmentIndex"
            key_condition = Key("department").eq(department)
        elif location:
            index_name = "LocationIndex"
            key_condition = Key("location").eq(location)
        elif employee_status:
            index_name = "StatusIndex"
            key_condition = Key("employee_status").eq(employee_status)
        elif employment_category:
            index_name = "CategoryIndex"
            key_condition = Key("employment_category").eq(employment_category)
        elif is_leader:
            index_name = "LeaderIndex"
            key_condition = Key("is_leader").eq(is_leader)
        elif position:
            index_name = "PositionIndex"
            key_condition = Key("position").eq(position)
        elif gender:
            index_name = "GenderIndex"
            key_condition = Key("gender").eq(gender)
        elif account:
            index_name = "AccountIndex"
            key_condition = Key("account").eq(account)

        # Define projection expression for list view (only fetch needed fields)
        projection_expression = "id, name, position, department, email, phone, employee_status, employment_category, is_leader, location, gender, account, start_date, created_at, reporting_to, skills, expertise, experience_years"
        
        # Use index query if we have a specific filter
        if index_name and key_condition:
            try:
                query_limit = max(limit_value + skip_value, limit_value)
                resp = await table.query(
                    IndexName=index_name,
                    KeyConditionExpression=key_condition,
                    ProjectionExpression=projection_expression,
                    Limit=query_limit,
                )
                items = resp.get("Items", [])
            except Exception as e:
                print(f"Index query failed for {index_name}: {e}")
                # Fallback to scan
                scan_limit = max(limit_value + skip_value, limit_value)
                resp = await table.scan(
                    ProjectionExpression=projection_expression,
                    Limit=scan_limit
                )
                items = resp.get("Items", [])
        else:
            # For general queries without specific filters, use scan with pagination
            print(f"DEBUG: Performing scan with projection: {projection_expression}")
            scan_limit = max(limit_value + skip_value, limit_value)
            print(f"DEBUG: Scan limit: {scan_limit}")
            resp = await table.scan(
                ProjectionExpression=projection_expression,
                Limit=scan_limit
            )
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
                # Skip malformed items without id
                print(f"DEBUG: Skipping item {i+1} - no id field")
                continue
            
            # Skip expensive S3 photo URL generation for list view
            # Only set photo_url if it already exists in the database
            if not doc.get("photo_url"):
                doc["photo_url"] = ""  # Set empty string instead of making S3 calls

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
        sliced = parsed[skip_value: skip_value + limit_value]
        
        # Update cache for general queries without filters
        if (not department and not location and not employee_status and not employment_category and 
            not is_leader and not position and not gender and not account and not search):
            _employee_cache[cache_key] = {"items": parsed, "timestamp": current_time}
            _cache_timestamp = current_time
            print(f"Cached employees data with {len(parsed)} items")
        
        return sliced
    except Exception as e:
        print(f"Error fetching employees from DynamoDB: {e}")
        return []

@router.post("/", response_model=EmployeeInDB, status_code=201)
async def create_employee(
    # Basic information
    employee_id: Optional[str] = Form(None),
    first_name: Optional[str] = Form(None),
    last_name: Optional[str] = Form(None),
    name: str = Form(...),
    email: str = Form(...),
    position: str = Form(...),
    department: str = Form(...),
    phone: Optional[str] = Form(None),
    mobile: Optional[str] = Form(None),
    
    # Employment details
    employment_category: Optional[str] = Form(None),
    gender: Optional[str] = Form(None),
    employee_status: Optional[str] = Form(None),
    account: Optional[str] = Form(None),
    is_leader: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    
    # Dates
    date_of_birth: Optional[str] = Form(None),
    date_of_joining: Optional[str] = Form(None),
    
    # Additional information
    bio: Optional[str] = Form(None),
    start_date: Optional[str] = Form(None),
    skills: Optional[str] = Form(None),
    expertise: Optional[str] = Form(None),
    experience_years: Optional[int] = Form(None),
    reporting_to: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None)
):
    """Create a new employee with optional photo upload"""
    try:
        # Generate employee ID first
        employee_id = str(uuid.uuid4())
        
        # Handle photo upload if provided
        photo_url = None
        if photo:
            photo_url = await ImageUploadService.upload_photo(photo, employee_id, location, department)
        
        # Parse dates if provided
        dob = None
        doj = None
        
        if date_of_birth:
            try:
                dob = datetime.datetime.strptime(date_of_birth, "%Y-%m-%d").date()
            except ValueError:
                pass
        
        if date_of_joining:
            try:
                doj = datetime.datetime.strptime(date_of_joining, "%Y-%m-%d").date()
            except ValueError:
                pass
        
        # Create employee dict for DynamoDB
        employee_data = {
            "id": employee_id,
            "employee_id": employee_id or "",
            "first_name": first_name or "",
            "last_name": last_name or "",
            "name": name,
            "email": email,
            "position": position,
            "department": department,
            "phone": phone or "",
            "mobile": mobile or "",
            "employment_category": employment_category or "",
            "gender": gender or "",
            "employee_status": employee_status or "",
            "account": account or "",
            "is_leader": is_leader or "",
            "location": location or "",
            "date_of_birth": dob.isoformat() if dob else None,
            "date_of_joining": doj.isoformat() if doj else None,
            "bio": bio or "",
            "start_date": start_date,
            "skills": skills.split(',') if skills else [],
            "expertise": expertise or "",
            "experience_years": experience_years or 0,
            "reporting_to": reporting_to or "",
            "photo_url": photo_url,
            "created_at": datetime.datetime.now().date().isoformat(),
            "updated_at": datetime.datetime.now().date().isoformat()
        }
        
        # Insert into DynamoDB
        table = await get_employees_table()
        formatted_item = format_dynamodb_item(employee_data)
        await table.put_item(Item=formatted_item)
        
        # Clear cache since we added a new employee
        clear_employee_cache()
        
        # Return created employee
        return employee_data
        
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
    
    # Update employee in DynamoDB
    table = await get_employees_table()
    
    # Build update expression
    update_expression = "SET "
    expression_attribute_values = {}
    expression_attribute_names = {}
    
    for key, value in update_data.items():
        if value is not None:
            placeholder = f":{key}"
            name_placeholder = f"#{key}"
            update_expression += f"{name_placeholder} = {placeholder}, "
            expression_attribute_values[placeholder] = value
            expression_attribute_names[name_placeholder] = key
    
    # Remove trailing comma and space
    update_expression = update_expression.rstrip(", ")
    
    await table.update_item(
        Key={"id": employee_id},
        UpdateExpression=update_expression,
        ExpressionAttributeValues=expression_attribute_values,
        ExpressionAttributeNames=expression_attribute_names
    )
    
    # Clear cache since we updated an employee
    clear_employee_cache()
    
    # Return updated employee
    return await get_employee_or_404(employee_id)

@router.delete("/{employee_id}", status_code=204)
async def delete_employee(employee_id: str):
    """Delete employee by ID"""
    # Ensure employee exists
    employee = await get_employee_or_404(employee_id)
    
    # Delete employee photo from S3 if exists
    if employee.get("photo_url"):
        await ImageUploadService.delete_photo(employee["photo_url"])
    
    # Delete employee from DynamoDB
    table = await get_employees_table()
    await table.delete_item(Key={"id": employee_id})
    
    # Clear cache since we deleted an employee
    clear_employee_cache()
    
    return None

@router.post("/import-csv")
async def import_employees_csv(
    file: UploadFile = File(...),
    overwrite: bool = Query(False),
    current_user: dict = Depends(get_current_active_user)
):
    """Import employees from CSV/Excel file with new structure"""
    # Check if bulk upload feature is enabled
    bulk_upload_enabled = FeatureFlags.is_enabled("bulk_upload")
    print(f"DEBUG: bulk_upload feature flag: {bulk_upload_enabled}")
    print(f"DEBUG: All feature flags: {FeatureFlags.all_features()}")
    
    if not bulk_upload_enabled:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bulk upload feature is not enabled"
        )
    
    try:
        contents = await file.read()
        
        # Check file extension and parse accordingly
        if file.filename.endswith('.csv'):
            buffer = io.StringIO(contents.decode())
            csv_reader = csv.DictReader(buffer)
            rows = list(csv_reader)
        elif file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(io.BytesIO(contents))
            rows = df.to_dict('records')
        else:
            raise HTTPException(
                status_code=400,
                detail="File must be CSV or Excel format"
            )
        
        # Expected CSV columns
        expected_columns = [
            "EmployeeID", "FirstName", "LastName", "EmploymentCategory", 
            "Gender", "EmployeeStatus", "Account", "Department", 
            "IsLeader", "Location", "Mobile", "Dob", "Doj", 
            "Email", "Position", "ProfilePic", "Expertise"
        ]
        
        # Check for missing required columns
        if not rows:
            raise HTTPException(status_code=400, detail="File is empty")
        
        available_columns = list(rows[0].keys())
        missing_columns = [col for col in expected_columns if col not in available_columns]
        
        if missing_columns:
            error_message = f"Missing required columns: {', '.join(missing_columns)}. "
            error_message += f"Expected columns: {', '.join(expected_columns)}. "
            error_message += f"Found columns: {', '.join(available_columns)}"
            raise HTTPException(status_code=400, detail=error_message)
        
        employees_to_insert = []
        row_count = 0
        error_rows = []
        
        # Process each row
        for row in rows:
            row_count += 1
            
            try:
                # Validate required fields
                required_fields = ["FirstName", "LastName", "Position", "Department", "Email"]
                missing_fields = [field for field in required_fields if not row.get(field)]
                
                if missing_fields:
                    error_rows.append(f"Row {row_count}: Missing required fields: {', '.join(missing_fields)}")
                    continue
                
                # Parse dates
                dob = None
                doj = None
                
                if row.get("Dob"):
                    try:
                        dob = datetime.datetime.strptime(row["Dob"], "%Y-%m-%d").date()
                    except ValueError:
                        error_rows.append(f"Row {row_count}: Invalid date format for Dob (expected YYYY-MM-DD)")
                        continue
                
                if row.get("Doj"):
                    try:
                        doj = datetime.datetime.strptime(row["Doj"], "%Y-%m-%d").date()
                    except ValueError:
                        error_rows.append(f"Row {row_count}: Invalid date format for Doj (expected YYYY-MM-DD)")
            continue
        
        # Create employee record
        now = datetime.datetime.now().date()
        employee = {
                    "id": str(uuid.uuid4()),
                    "employee_id": row.get("EmployeeID", ""),
                    "first_name": row.get("FirstName", ""),
                    "last_name": row.get("LastName", ""),
                    "name": f"{row['FirstName']} {row['LastName']}".strip(),
                    "email": row.get("Email", ""),
                    "position": row.get("Position", ""),
                    "department": row.get("Department", ""),
                    "phone": row.get("Mobile", ""),
                    "mobile": row.get("Mobile", ""),
                    "employment_category": row.get("EmploymentCategory", ""),
                    "gender": row.get("Gender", ""),
                    "employee_status": row.get("EmployeeStatus", ""),
                    "account": row.get("Account", ""),
                    "is_leader": row.get("IsLeader", ""),
                    "location": row.get("Location", ""),
                    "date_of_birth": dob.isoformat() if dob else None,
                    "date_of_joining": doj.isoformat() if doj else None,
                    "profile_pic": row.get("ProfilePic", ""),
                    "photo_url": row.get("ProfilePic", ""),  # Map ProfilePic to photo_url for compatibility
                    "expertise": row.get("Expertise", ""),
                    "created_at": now.isoformat(),
                    "updated_at": now.isoformat()
        }
        
        employees_to_insert.append(employee)
    
            except Exception as e:
                error_rows.append(f"Row {row_count}: Error processing row - {str(e)}")
                continue
        
        # Insert employees into DynamoDB
    inserted_count = 0
    if employees_to_insert:
            table = await get_employees_table()
            for employee in employees_to_insert:
                try:
                    formatted_item = format_dynamodb_item(employee)
                    await table.put_item(Item=formatted_item)
                    inserted_count += 1
                except Exception as e:
                    error_rows.append(f"Error inserting employee {employee.get('name', 'Unknown')}: {str(e)}")
        
        # Clear cache since we imported new employees
        if inserted_count > 0:
            clear_employee_cache()
    
    # Return summary
    return {
        "success": True,
        "total_rows": row_count,
        "inserted": inserted_count,
            "errors": error_rows,
            "message": f"Successfully imported {inserted_count} out of {row_count} employees"
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
            raise HTTPException(
            status_code=500,
            detail=f"Import failed: {str(e)}"
        )

# Old import endpoint removed - using /import-csv instead with new structure

@router.get("/dashboard-test")
async def get_dashboard_test():
    """Simple test endpoint"""
    return {"message": "Dashboard test endpoint working!"}

@router.get("/dashboard")
async def get_employees_dashboard():
    """Get comprehensive employee analytics data for dashboard visualization"""
    try:
        # Get all employees
        table = await get_employees_table()
        response = await table.scan()
        
        if "Items" not in response:
            return {
                "total_employees": 0,
                "monthly_headcount": [],
                "by_account": {},
                "by_location": {},
                "by_employee_status": {},
                "by_employment_category": {},
                "by_is_leader": {},
                "by_position": {},
                "by_department": {},
                "by_gender": {},
                "employees": []
            }
        
        employees = []
        for item in response["Items"]:
            employee = parse_dynamodb_item(item)
            employees.append(employee)
        
        # Calculate monthly headcount data
        monthly_headcount = []
        current_year = datetime.datetime.now().year
        
        for month in range(1, 13):
            month_date = datetime.datetime(current_year, month, 1)
            end_date = datetime.datetime(current_year, month + 1, 1) if month < 12 else datetime.datetime(current_year + 1, 1, 1)
            
            # Count employees who joined before or during this month
            count = 0
            for emp in employees:
                join_date_str = emp.get("date_of_joining") or emp.get("created_at")
                if join_date_str:
                    try:
                        join_date = datetime.datetime.fromisoformat(join_date_str.replace('Z', '+00:00'))
                        if join_date <= end_date:
                            count += 1
                    except:
                        # If date parsing fails, count as joined
                        count += 1
            
            monthly_headcount.append({
                "month": month_date.strftime("%b"),
                "count": count,
                "month_number": month
            })
        
        # Calculate distribution data
        by_account = {}
        by_location = {}
        by_employee_status = {}
        by_employment_category = {}
        by_is_leader = {}
        by_position = {}
        by_department = {}
        by_gender = {}
        
        for emp in employees:
            # Account distribution
            account = emp.get("account", "Unknown")
            by_account[account] = by_account.get(account, 0) + 1
            
            # Location distribution
            location = emp.get("location", "Unknown")
            by_location[location] = by_location.get(location, 0) + 1
            
            # Employee status distribution
            status = emp.get("employee_status", "Unknown")
            by_employee_status[status] = by_employee_status.get(status, 0) + 1
            
            # Employment category distribution
            category = emp.get("employment_category", "Unknown")
            by_employment_category[category] = by_employment_category.get(category, 0) + 1
            
            # Is leader distribution
            is_leader = emp.get("is_leader", "No")
            by_is_leader[is_leader] = by_is_leader.get(is_leader, 0) + 1
            
            # Position distribution
            position = emp.get("position", "Unknown")
            by_position[position] = by_position.get(position, 0) + 1
            
            # Department distribution
            department = emp.get("department", "Unknown")
            by_department[department] = by_department.get(department, 0) + 1
            
            # Gender distribution
            gender = emp.get("gender", "Unknown")
            by_gender[gender] = by_gender.get(gender, 0) + 1
        
        return {
            "total_employees": len(employees),
            "monthly_headcount": monthly_headcount,
            "by_account": by_account,
            "by_location": by_location,
            "by_employee_status": by_employee_status,
            "by_employment_category": by_employment_category,
            "by_is_leader": by_is_leader,
            "by_position": by_position,
            "by_department": by_department,
            "by_gender": by_gender,
            "employees": employees  # Include full employee data for filtering
        }
        
    except Exception as e:
        print(f"Error getting dashboard data: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get dashboard data: {str(e)}"
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

@router.post("/seed-core-users", status_code=201)
async def seed_core_users():
    core_users = [
        {
            "_id": "1",
            "name": "Alex Johnson",
            "email": "admin@example.com",
            "position": "Administrator",
            "department": "Admin",
            "role": "admin",
            "location": "New York",
            "created_at": datetime.datetime.now().date().isoformat(),
            "updated_at": datetime.datetime.now().date().isoformat()
        },
        {
            "_id": "2",
            "name": "Emma Wilson",
            "email": "user@example.com",
            "position": "Employee",
            "department": "General",
            "role": "user",
            "location": "San Francisco",
            "created_at": datetime.datetime.now().date().isoformat(),
            "updated_at": datetime.datetime.now().date().isoformat()
        },
        {
            "_id": "3",
            "name": "Rajinikanth",
            "email": "rajinikanth@example.com",
            "position": "Actor",
            "department": "Entertainment",
            "role": "user",
            "location": "Chennai",
            "created_at": datetime.datetime.now().date().isoformat(),
            "updated_at": datetime.datetime.now().date().isoformat()
        },
        {
            "_id": "4",
            "name": "Prasanna",
            "email": "prasanna@example.com",
            "position": "Engineer",
            "department": "Engineering",
            "role": "user",
            "location": "Bangalore",
            "created_at": datetime.datetime.now().date().isoformat(),
            "updated_at": datetime.datetime.now().date().isoformat()
        }
    ]
    for user in core_users:
        # Check if user exists, if not insert
        existing = await employees_collection.find_one({"_id": user["_id"]})
        if not existing:
            await employees_collection.insert_one(user)
    return {"message": "Core users seeded."}

UPLOAD_DIR = Path("uploads/photos")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/upload-photo")
async def upload_photo(file: UploadFile = File(...)):
    """Upload a photo and return its URL (legacy endpoint - use /upload-photo/{employee_id} instead)"""
    try:
        print(f"Legacy upload-photo endpoint called with file: {file.filename}")
        # Generate a temporary employee ID for the legacy endpoint
        temp_employee_id = str(uuid.uuid4())
        photo_url = await ImageUploadService.upload_photo(file, temp_employee_id, None, None)
        print(f"Legacy endpoint uploaded photo: {photo_url}")
        return {"photo_url": photo_url}
    except HTTPException as he:
        print(f"HTTPException in legacy upload_photo: {he}")
        raise he
    except Exception as e:
        print(f"Error in legacy upload_photo: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file: {str(e)}"
        )

@router.post("/upload-photo/{employee_id}")
async def upload_employee_photo(
    employee_id: str,
    name: str = Form(...),  # Fix: Use fastapi Form class
    description: Optional[str] = Form(None),
    file: UploadFile = File(...)
):
    """Upload an employee's photo"""
    try:
        print(f"Uploading photo for employee {employee_id}")
        # Ensure employee exists
        employee = await get_employee_or_404(employee_id)
        print(f"Employee found: {employee.get('name')}")
        
        # Delete old photo if exists
        if employee.get("photo_url"):
            print(f"Deleting old photo: {employee.get('photo_url')}")
            await ImageUploadService.delete_photo(employee["photo_url"])
        
        # Handle photo upload with partition structure
        location = employee.get("location")
        department = employee.get("department")
        print(f"Uploading to S3 with location={location}, department={department}")
        photo_url = await ImageUploadService.upload_photo(file, employee_id, location, department)
        print(f"Photo uploaded successfully: {photo_url}")
        
        # Update employee with new photo URL in DynamoDB
        table = await get_employees_table()
        await table.update_item(
            Key={"id": employee_id},
            UpdateExpression="SET photo_url = :photo_url, updated_at = :updated_at",
            ExpressionAttributeValues={
                ":photo_url": photo_url,
                ":updated_at": datetime.datetime.now().date().isoformat()
            }
        )
        print("Employee record updated in DynamoDB")
        
        # Return updated employee
        updated_employee = await get_employee_or_404(employee_id)
        return updated_employee
    
    except HTTPException as he:
        print(f"HTTPException in upload_employee_photo: {he}")
        raise he
    except Exception as e:
        print(f"Exception in upload_employee_photo: {e}")
        import traceback
        traceback.print_exc()
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
    location: Optional[str] = Form(None),
    expertise: Optional[str] = Form(None),
    photo: Optional[UploadFile] = File(None)
):
    """Create a new employee with optional photo upload"""
    try:
        # Generate employee ID first
        employee_id = str(uuid.uuid4())
        
        # Handle photo upload if provided
        photo_url = None
        if photo:
            photo_url = await ImageUploadService.upload_photo(photo, employee_id, location, department)

        # Create employee data for DynamoDB
        employee_data = {
            "id": employee_id,
            "name": name,
            "position": position,
            "department": department,
            "email": email,
            "phone": phone,
            "bio": bio,
            "start_date": start_date,
            "location": location,
            "expertise": expertise,
            "photo_url": photo_url,
            "created_at": datetime.datetime.now().date().isoformat(),
            "updated_at": datetime.datetime.now().date().isoformat()
        }

        # Insert into DynamoDB
        table = await get_employees_table()
        formatted_item = format_dynamodb_item(employee_data)
        await table.put_item(Item=formatted_item)
        
        # Return created employee
        return employee_data

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create employee: {str(e)}"
        )

@router.post("/seed-performance-data", status_code=201)
async def seed_performance_data():
    # Seed synthetic employees
    employees = [
        {
            "name": "Alice Smith",
            "email": "alice.smith@example.com",
            "position": "Software Engineer",
            "department": "Engineering",
            "performance_communication": 80.0,
            "performance_leadership": 85.0,
            "performance_client_feedback": 90.0,
            "overall_rating": 85.0,
            "strengths": ["Communication", "Teamwork"],
            "tech_stack": [
                {"name": "Python", "logo_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", "percent": 90},
                {"name": "AWS S3", "logo_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg", "percent": 80}
            ]
        },
        {
            "name": "Bob Johnson",
            "email": "bob.johnson@example.com",
            "position": "Product Manager",
            "department": "Product",
            "performance_communication": 75.0,
            "performance_leadership": 88.0,
            "performance_client_feedback": 82.0,
            "overall_rating": 81.7,
            "strengths": ["Leadership", "Client Focus"],
            "tech_stack": [
                {"name": "Jira", "logo_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg", "percent": 85},
                {"name": "Confluence", "logo_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/confluence/confluence-original.svg", "percent": 80}
            ]
        }
    ]
    # Insert employees if not present
    for emp in employees:
        existing = await employees_collection.find_one({"email": emp["email"]})
        if not existing:
            await employees_collection.insert_one(emp)
    # Fetch employee IDs
    all_emps = [e async for e in employees_collection.find({})]
    # Seed goals for each employee
    goals_collection = db["goals"]
    for emp in all_emps:
        emp_id = emp["_id"]
        # Communication goals
        for i in range(3):
            goal_data = {
                "_id": f"{emp_id}_comm_{i+1}",
                "employeeId": emp_id,
                "title": f"Improve Communication {i+1}",
                "description": f"Goal to improve communication skill {i+1}",
                "category": "communication",
                "completion": 80.0 + i,
                "created_at": datetime.datetime.utcnow().isoformat(),
                "updated_at": datetime.datetime.utcnow().isoformat()
            }
            existing = await goals_collection.find_one({"_id": goal_data["_id"]})
            if not existing:
                await goals_collection.insert_one(goal_data)
        
        # Leadership goals
        for i in range(2):
            goal_data = {
                "_id": f"{emp_id}_lead_{i+1}",
                "employeeId": emp_id,
                "title": f"Leadership Initiative {i+1}",
                "description": f"Goal to improve leadership skill {i+1}",
                "category": "leadership",
                "completion": 85.0 + i,
                "created_at": datetime.datetime.utcnow().isoformat(),
                "updated_at": datetime.datetime.utcnow().isoformat()
            }
            existing = await goals_collection.find_one({"_id": goal_data["_id"]})
            if not existing:
                await goals_collection.insert_one(goal_data)
        
        # Client feedback goals
        for i in range(2):
            goal_data = {
                "_id": f"{emp_id}_client_{i+1}",
                "employeeId": emp_id,
                "title": f"Client Feedback {i+1}",
                "description": f"Goal to improve client feedback {i+1}",
                "category": "client_feedback",
                "completion": 90.0 + i,
                "created_at": datetime.datetime.utcnow().isoformat(),
                "updated_at": datetime.datetime.utcnow().isoformat()
            }
            existing = await goals_collection.find_one({"_id": goal_data["_id"]})
            if not existing:
                await goals_collection.insert_one(goal_data)
    
    return {"message": "Seeded synthetic employees and goals."}

@router.post("/{employee_id}/ai-goal-suggestions")
async def get_ai_goal_suggestions(employee_id: str):
    """Get AI-powered goal suggestions for an employee"""
    try:
        # Get employee data
        employee = await get_employee_or_404(employee_id)
        
        # Generate AI goal suggestions
        suggestions = await bedrock_service.generate_goal_suggestions(employee)
        
        return {
            "employee_id": employee_id,
            "suggestions": suggestions
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate goal suggestions: {str(e)}"
        )

@router.post("/{employee_id}/ai-performance-feedback")
async def get_ai_performance_feedback(
    employee_id: str,
    feedback_type: str = "general"
):
    """Get AI-powered performance feedback for an employee"""
    try:
        # Get employee data
        employee = await get_employee_or_404(employee_id)
        
        # Generate AI performance feedback
        feedback = await bedrock_service.generate_performance_feedback(employee, feedback_type)
        
        return {
            "employee_id": employee_id,
            "feedback_type": feedback_type,
            "feedback": feedback
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate performance feedback: {str(e)}"
        )