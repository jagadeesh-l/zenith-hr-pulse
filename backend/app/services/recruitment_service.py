class RecruitmentService:
    @staticmethod
    async def get_recruitment_stats():
        return {
            "total_requisitions": 10,
            "open_positions": 4,
            "closed_positions": 6,
            "avg_time_to_hire": 25
        }

    @staticmethod
    async def get_headcount_forecast():
        return [
            {"department": "Engineering", "forecast": 12},
            {"department": "Product", "forecast": 5},
            {"department": "HR", "forecast": 2}
        ] 