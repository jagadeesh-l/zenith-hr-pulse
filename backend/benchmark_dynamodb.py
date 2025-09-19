#!/usr/bin/env python3
"""
DynamoDB Performance Benchmark Script

This script measures the performance of different query types
to demonstrate the improvement from adding indexes.

Usage:
    python benchmark_dynamodb.py
"""

import asyncio
import time
import boto3
from botocore.exceptions import ClientError
import os
from dotenv import load_dotenv

load_dotenv()

class DynamoDBBenchmark:
    def __init__(self):
        self.dynamodb = None
        self.table_name = "zenith-hr-employees"
        
    async def __aenter__(self):
        # Initialize DynamoDB
        session = boto3.Session(
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION', 'us-east-1')
        )
        
        self.dynamodb = session.resource('dynamodb')
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        pass
    
    async def benchmark_scan(self):
        """Benchmark full table scan"""
        table = self.dynamodb.Table(self.table_name)
        
        start_time = time.time()
        try:
            response = table.scan(Limit=100)
            end_time = time.time()
            
            return {
                'method': 'scan',
                'duration': end_time - start_time,
                'items_returned': len(response.get('Items', [])),
                'success': True
            }
        except Exception as e:
            end_time = time.time()
            return {
                'method': 'scan',
                'duration': end_time - start_time,
                'items_returned': 0,
                'success': False,
                'error': str(e)
            }
    
    async def benchmark_index_query(self, index_name, key_name, key_value):
        """Benchmark index query"""
        table = self.dynamodb.Table(self.table_name)
        
        start_time = time.time()
        try:
            from boto3.dynamodb.conditions import Key
            response = table.query(
                IndexName=index_name,
                KeyConditionExpression=Key(key_name).eq(key_value),
                Limit=100
            )
            end_time = time.time()
            
            return {
                'method': f'index_query_{index_name}',
                'duration': end_time - start_time,
                'items_returned': len(response.get('Items', [])),
                'success': True
            }
        except Exception as e:
            end_time = time.time()
            return {
                'method': f'index_query_{index_name}',
                'duration': end_time - start_time,
                'items_returned': 0,
                'success': False,
                'error': str(e)
            }
    
    async def benchmark_filtered_scan(self, filter_expression):
        """Benchmark scan with filter"""
        table = self.dynamodb.Table(self.table_name)
        
        start_time = time.time()
        try:
            response = table.scan(
                FilterExpression=filter_expression,
                Limit=100
            )
            end_time = time.time()
            
            return {
                'method': 'filtered_scan',
                'duration': end_time - start_time,
                'items_returned': len(response.get('Items', [])),
                'success': True
            }
        except Exception as e:
            end_time = time.time()
            return {
                'method': 'filtered_scan',
                'duration': end_time - start_time,
                'items_returned': 0,
                'success': False,
                'error': str(e)
            }
    
    async def get_sample_data(self):
        """Get sample data for testing"""
        table = self.dynamodb.Table(self.table_name)
        
        try:
            response = table.scan(Limit=10)
            items = response.get('Items', [])
            
            if not items:
                return None
            
            # Extract sample values for testing
            sample = {
                'department': items[0].get('department'),
                'location': items[0].get('location'),
                'employee_status': items[0].get('employee_status'),
                'employment_category': items[0].get('employment_category'),
                'is_leader': items[0].get('is_leader'),
                'position': items[0].get('position'),
                'gender': items[0].get('gender'),
                'account': items[0].get('account')
            }
            
            return sample
        except Exception as e:
            print(f"Error getting sample data: {e}")
            return None
    
    async def run_benchmarks(self):
        """Run all benchmarks"""
        print("Starting DynamoDB performance benchmarks...")
        
        # Get sample data for testing
        sample_data = await self.get_sample_data()
        if not sample_data:
            print("No sample data available for testing.")
            return
        
        print(f"Using sample data: {sample_data}")
        
        results = []
        
        # Benchmark 1: Full table scan
        print("\n1. Benchmarking full table scan...")
        result = await self.benchmark_scan()
        results.append(result)
        print(f"   Duration: {result['duration']:.3f}s, Items: {result['items_returned']}")
        
        # Benchmark 2: Index queries
        print("\n2. Benchmarking index queries...")
        
        index_tests = [
            ('DepartmentIndex', 'department', sample_data['department']),
            ('LocationIndex', 'location', sample_data['location']),
            ('StatusIndex', 'employee_status', sample_data['employee_status']),
            ('CategoryIndex', 'employment_category', sample_data['employment_category']),
            ('LeaderIndex', 'is_leader', sample_data['is_leader']),
            ('PositionIndex', 'position', sample_data['position']),
            ('GenderIndex', 'gender', sample_data['gender']),
            ('AccountIndex', 'account', sample_data['account'])
        ]
        
        for index_name, key_name, key_value in index_tests:
            if key_value:  # Only test if we have a value
                print(f"   Testing {index_name}...")
                result = await self.benchmark_index_query(index_name, key_name, key_value)
                results.append(result)
                print(f"   Duration: {result['duration']:.3f}s, Items: {result['items_returned']}")
        
        # Benchmark 3: Filtered scan (for comparison)
        print("\n3. Benchmarking filtered scan...")
        if sample_data['department']:
            from boto3.dynamodb.conditions import Attr
            result = await self.benchmark_filtered_scan(
                Attr('department').eq(sample_data['department'])
            )
            results.append(result)
            print(f"   Duration: {result['duration']:.3f}s, Items: {result['items_returned']}")
        
        # Print summary
        print("\n" + "="*60)
        print("BENCHMARK SUMMARY")
        print("="*60)
        
        successful_results = [r for r in results if r['success']]
        
        if successful_results:
            scan_result = next((r for r in successful_results if r['method'] == 'scan'), None)
            index_results = [r for r in successful_results if r['method'].startswith('index_query_')]
            
            if scan_result and index_results:
                avg_index_time = sum(r['duration'] for r in index_results) / len(index_results)
                improvement = ((scan_result['duration'] - avg_index_time) / scan_result['duration']) * 100
                
                print(f"Full Table Scan:     {scan_result['duration']:.3f}s")
                print(f"Average Index Query: {avg_index_time:.3f}s")
                print(f"Performance Improvement: {improvement:.1f}%")
                
                if improvement > 0:
                    print(f"✅ Indexes provide {improvement:.1f}% faster queries!")
                else:
                    print("⚠️  Indexes may not provide significant improvement with current data size.")
        
        print("\nDetailed Results:")
        for result in results:
            status = "✅" if result['success'] else "❌"
            print(f"{status} {result['method']}: {result['duration']:.3f}s ({result['items_returned']} items)")
            if not result['success'] and 'error' in result:
                print(f"   Error: {result['error']}")

async def main():
    """Main function"""
    async with DynamoDBBenchmark() as benchmark:
        await benchmark.run_benchmarks()

if __name__ == "__main__":
    asyncio.run(main())
