from datetime import datetime
from typing import List, Optional, Dict, Any
from bson import ObjectId
from backend.models.recruitment import (
    JobRequisition, JobRequisitionCreate, JobRequisitionUpdate, 
    WorkflowStep, StepStatus, WorkflowStepType, WorkflowAction,
    RecruitmentStats, HeadcountForecast,
    DepartmentRequestData, HRReviewData, BudgetApprovalData, FinalApprovalData
)
from backend.database.recruitment_db import get_recruitment_collection

class RecruitmentService:
    
    @staticmethod
    def generate_requisition_id() -> str:
        """Generate unique requisition ID."""
        timestamp = datetime.now().strftime('%Y%m%d')
        unique_id = str(ObjectId())[-6:]
        return f"REQ-{timestamp}-{unique_id}"
    
    @staticmethod
    def create_workflow_steps() -> List[WorkflowStep]:
        """Create default workflow steps for a new requisition."""
        return [
            WorkflowStep(
                id="step-1",
                title="Department Request",
                status=StepStatus.IN_PROGRESS,
                step_type=WorkflowStepType.DEPARTMENT_REQUEST
            ),
            WorkflowStep(
                id="step-2",
                title="HR Review",
                status=StepStatus.PENDING,
                step_type=WorkflowStepType.HR_REVIEW
            ),
            WorkflowStep(
                id="step-3",
                title="Budget Approval",
                status=StepStatus.PENDING,
                step_type=WorkflowStepType.BUDGET_APPROVAL
            ),
            WorkflowStep(
                id="step-4",
                title="Final Approval",
                status=StepStatus.PENDING,
                step_type=WorkflowStepType.FINAL_APPROVAL
            )
        ]
    
    @staticmethod
    async def create_job_requisition(requisition_data: JobRequisitionCreate) -> JobRequisition:
        """Create a new job requisition."""
        collection = await get_recruitment_collection("job_requisitions")
        
        # Create workflow steps
        workflow_steps = RecruitmentService.create_workflow_steps()
        
        # Create requisition
        requisition = JobRequisition(
            requisition_id=RecruitmentService.generate_requisition_id(),
            department_request=requisition_data.department_request,
            workflow_steps=workflow_steps,
            created_by=requisition_data.created_by
        )
        
        # Insert into database
        result = await collection.insert_one(requisition.dict(by_alias=True))
        requisition.id = str(result.inserted_id)
        
        return requisition
    
    @staticmethod
    async def get_job_requisition(requisition_id: str) -> Optional[JobRequisition]:
        """Get a job requisition by ID."""
        collection = await get_recruitment_collection("job_requisitions")
        
        # Try to find by ObjectId first
        if ObjectId.is_valid(requisition_id):
            requisition = await collection.find_one({"_id": ObjectId(requisition_id)})
            if requisition:
                req = JobRequisition(**{**requisition, 'id': str(requisition['_id']), '_id': str(requisition['_id'])})
                return req
        
        # Try to find by requisition_id
        requisition = await collection.find_one({"requisition_id": requisition_id})
        if requisition:
            req = JobRequisition(**{**requisition, 'id': str(requisition['_id']), '_id': str(requisition['_id'])})
            return req
        
        return None
    
    @staticmethod
    async def get_all_job_requisitions(
        skip: int = 0, 
        limit: int = 100,
        status: Optional[StepStatus] = None,
        department: Optional[str] = None
    ) -> List[JobRequisition]:
        """Get all job requisitions with optional filtering."""
        collection = await get_recruitment_collection("job_requisitions")
        
        # Build filter
        filter_query = {"is_active": True}
        if status:
            filter_query["status"] = status
        if department:
            filter_query["department_request.department"] = department
        
        cursor = collection.find(filter_query).skip(skip).limit(limit).sort("created_at", -1)
        requisitions = await cursor.to_list(length=limit)
        
        return [JobRequisition(**{**req, 'id': str(req['_id']), '_id': str(req['_id'])}) for req in requisitions]
    
    @staticmethod
    async def update_workflow_step(
        requisition_id: str, 
        step_id: str, 
        action: WorkflowAction
    ) -> Optional[JobRequisition]:
        """Update workflow step status and handle transitions."""
        collection = await get_recruitment_collection("job_requisitions")
        
        requisition = await RecruitmentService.get_job_requisition(requisition_id)
        if not requisition:
            return None
        
        # Find the current step
        step_index = next((i for i, step in enumerate(requisition.workflow_steps) if step.id == step_id), None)
        if step_index is None:
            return None
        
        current_step = requisition.workflow_steps[step_index]
        
        # Update step based on action
        if action.action == "submit" and step_id == "step-1":
            # Submit department request
            current_step.status = StepStatus.APPROVED
            current_step.reviewer = action.reviewer
            current_step.reviewed_at = datetime.utcnow()
            current_step.comments = action.comments
            
            # Move to next step
            if step_index + 1 < len(requisition.workflow_steps):
                requisition.workflow_steps[step_index + 1].status = StepStatus.CURRENT
                requisition.current_step = requisition.workflow_steps[step_index + 1].step_type
                requisition.status = StepStatus.CURRENT
        
        elif action.action == "approve":
            # Approve current step
            current_step.status = StepStatus.APPROVED
            current_step.reviewer = action.reviewer
            current_step.reviewed_at = datetime.utcnow()
            current_step.comments = action.comments
            
            # Add step-specific data
            if step_id == "step-2":  # HR Review
                requisition.hr_review = HRReviewData(
                    reviewer=action.reviewer,
                    decision="approve",
                    comments=action.comments
                )
            elif step_id == "step-3":  # Budget Approval
                requisition.budget_approval = BudgetApprovalData(
                    budget_owner=action.reviewer,
                    approved_budget=requisition.department_request.salary_max,
                    comments=action.comments
                )
            elif step_id == "step-4":  # Final Approval
                requisition.final_approval = FinalApprovalData(
                    approver=action.reviewer,
                    decision="approve",
                    comments=action.comments
                )
                requisition.status = StepStatus.APPROVED
            
            # Move to next step if not final
            if step_index + 1 < len(requisition.workflow_steps) and step_id != "step-4":
                requisition.workflow_steps[step_index + 1].status = StepStatus.CURRENT
                requisition.current_step = requisition.workflow_steps[step_index + 1].step_type
        
        elif action.action == "decline":
            # Decline current step
            current_step.status = StepStatus.DECLINED
            current_step.reviewer = action.reviewer
            current_step.reviewed_at = datetime.utcnow()
            current_step.comments = action.comments
            requisition.status = StepStatus.DECLINED
        
        elif action.action == "request_info":
            # Request more information - move back to department request
            current_step.status = StepStatus.PENDING
            current_step.comments = action.comments
            
            # Reset to department request
            requisition.workflow_steps[0].status = StepStatus.CURRENT
            requisition.current_step = WorkflowStepType.DEPARTMENT_REQUEST
            requisition.status = StepStatus.IN_PROGRESS
        
        # Update timestamps
        requisition.updated_at = datetime.utcnow()
        
        # Update in database
        await collection.replace_one(
            {"_id": requisition.id},
            requisition.dict(by_alias=True)
        )
        
        requisition.id = str(requisition.id)
        return requisition
    
    @staticmethod
    async def update_job_requisition(
        requisition_id: str, 
        update_data: JobRequisitionUpdate
    ) -> Optional[JobRequisition]:
        """Update job requisition data."""
        collection = await get_recruitment_collection("job_requisitions")
        
        # Build update dict
        update_dict = {"updated_at": datetime.utcnow()}
        
        if update_data.department_request:
            update_dict["department_request"] = update_data.department_request.dict()
        if update_data.hr_review:
            update_dict["hr_review"] = update_data.hr_review.dict()
        if update_data.budget_approval:
            update_dict["budget_approval"] = update_data.budget_approval.dict()
        if update_data.final_approval:
            update_dict["final_approval"] = update_data.final_approval.dict()
        if update_data.current_step:
            update_dict["current_step"] = update_data.current_step
        if update_data.status:
            update_dict["status"] = update_data.status
        
        result = await collection.update_one(
            {"requisition_id": requisition_id},
            {"$set": update_dict}
        )
        
        if result.modified_count > 0:
            return await RecruitmentService.get_job_requisition(requisition_id)
        
        return None
    
    @staticmethod
    async def delete_job_requisition(requisition_id: str) -> bool:
        """Soft delete a job requisition."""
        collection = await get_recruitment_collection("job_requisitions")
        
        result = await collection.update_one(
            {"requisition_id": requisition_id},
            {"$set": {"is_active": False, "updated_at": datetime.utcnow()}}
        )
        
        return result.modified_count > 0
    
    @staticmethod
    async def get_recruitment_stats() -> RecruitmentStats:
        """Get recruitment statistics."""
        collection = await get_recruitment_collection("job_requisitions")
        
        # Get counts
        total = await collection.count_documents({"is_active": True})
        pending = await collection.count_documents({"is_active": True, "status": StepStatus.PENDING})
        approved = await collection.count_documents({"is_active": True, "status": StepStatus.APPROVED})
        declined = await collection.count_documents({"is_active": True, "status": StepStatus.DECLINED})
        
        # Calculate open positions (sum of approved requisitions)
        pipeline = [
            {"$match": {"is_active": True, "status": StepStatus.APPROVED}},
            {"$group": {"_id": None, "total_openings": {"$sum": "$department_request.number_of_openings"}}}
        ]
        
        open_positions_result = await collection.aggregate(pipeline).to_list(length=1)
        open_positions = open_positions_result[0]["total_openings"] if open_positions_result else 0
        
        # For now, closed positions is hardcoded (in real app, this would come from job postings)
        closed_positions = 8
        
        return RecruitmentStats(
            total_requisitions=total,
            pending_requisitions=pending,
            approved_requisitions=approved,
            declined_requisitions=declined,
            open_positions=open_positions,
            closed_positions=closed_positions
        )
    
    @staticmethod
    async def get_headcount_forecast() -> List[HeadcountForecast]:
        """Get headcount forecast data."""
        # This would typically come from a more complex analytics system
        # For now, returning mock data
        return [
            HeadcountForecast(month='Jan', actual=10, forecast=10),
            HeadcountForecast(month='Feb', actual=12, forecast=12),
            HeadcountForecast(month='Mar', actual=15, forecast=15),
            HeadcountForecast(month='Apr', actual=18, forecast=16),
            HeadcountForecast(month='May', actual=22, forecast=19),
            HeadcountForecast(month='Jun', actual=None, forecast=23),
            HeadcountForecast(month='Jul', actual=None, forecast=28),
            HeadcountForecast(month='Aug', actual=None, forecast=30),
            HeadcountForecast(month='Sep', actual=None, forecast=27),
            HeadcountForecast(month='Oct', actual=None, forecast=24),
            HeadcountForecast(month='Nov', actual=None, forecast=22),
            HeadcountForecast(month='Dec', actual=None, forecast=20),
        ] 