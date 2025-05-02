#!/usr/bin/env python3
"""
Memory Bank Maintenance Tool for Mirrorwright Orchestrator

This tool helps maintain the memory bank system by cleaning up old memories,
organizing memories by tags, and generating reports.
"""

import os
import sys
import json
import argparse
import datetime
from pathlib import Path

# Configuration
MEMORY_BANK_DIR = "cursor-memory-bank"
MEMORY_INDEX_FILE = os.path.join(MEMORY_BANK_DIR, "memory_index.json")

def load_memory_index():
    """Load the memory index file."""
    if not os.path.exists(MEMORY_INDEX_FILE):
        print(f"Error: Memory index file '{MEMORY_INDEX_FILE}' does not exist.")
        return None
    
    with open(MEMORY_INDEX_FILE, 'r') as f:
        return json.load(f)

def save_memory_index(index):
    """Save the memory index file."""
    with open(MEMORY_INDEX_FILE, 'w') as f:
        json.dump(index, f, indent=2)

def list_memories():
    """List all memories in the memory bank."""
    index = load_memory_index()
    if not index:
        return
    
    memories = index.get("memories", [])
    if not memories:
        print("No memories found in the memory bank.")
        return
    
    print(f"Found {len(memories)} memories in the memory bank:")
    for i, memory in enumerate(memories, 1):
        print(f"{i}. {memory['title']} (Tags: {', '.join(memory['tags'])})")
        print(f"   Created: {memory['created'].split('T')[0]}")
        print(f"   File: {memory['file_path']}")
        print()

def list_tags():
    """List all tags used in the memory bank."""
    index = load_memory_index()
    if not index:
        return
    
    memories = index.get("memories", [])
    if not memories:
        print("No memories found in the memory bank.")
        return
    
    tags = {}
    for memory in memories:
        for tag in memory["tags"]:
            if tag in tags:
                tags[tag] += 1
            else:
                tags[tag] = 1
    
    if not tags:
        print("No tags found in the memory bank.")
        return
    
    print(f"Found {len(tags)} unique tags in the memory bank:")
    for tag, count in sorted(tags.items(), key=lambda x: x[1], reverse=True):
        print(f"- {tag}: {count} memories")

def generate_report():
    """Generate a report of the memory bank."""
    index = load_memory_index()
    if not index:
        return
    
    memories = index.get("memories", [])
    if not memories:
        print("No memories found in the memory bank.")
        return
    
    # Count memories by tag
    tags = {}
    for memory in memories:
        for tag in memory["tags"]:
            if tag in tags:
                tags[tag] += 1
            else:
                tags[tag] = 1
    
    # Count memories by month
    months = {}
    for memory in memories:
        month = memory["created"].split('T')[0][:7]  # YYYY-MM
        if month in months:
            months[month] += 1
        else:
            months[month] = 1
    
    # Generate report
    report_file = os.path.join(MEMORY_BANK_DIR, "memory_report.md")
    with open(report_file, 'w') as f:
        f.write("# Memory Bank Report\n\n")
        f.write(f"**Generated:** {datetime.datetime.now().isoformat().split('T')[0]}\n\n")
        f.write(f"**Total Memories:** {len(memories)}\n\n")
        
        f.write("## Memories by Tag\n\n")
        for tag, count in sorted(tags.items(), key=lambda x: x[1], reverse=True):
            f.write(f"- {tag}: {count} memories\n")
        
        f.write("\n## Memories by Month\n\n")
        for month, count in sorted(months.items(), reverse=True):
            f.write(f"- {month}: {count} memories\n")
        
        f.write("\n## Recent Memories\n\n")
        for memory in sorted(memories, key=lambda x: x["created"], reverse=True)[:5]:
            f.write(f"- {memory['title']} (Tags: {', '.join(memory['tags'])})\n")
            f.write(f"  Created: {memory['created'].split('T')[0]}\n")
    
    print(f"Report generated: {report_file}")
    return report_file

def main():
    parser = argparse.ArgumentParser(description="Memory Bank Maintenance Tool")
    parser.add_argument("--list", action="store_true", help="List all memories in the memory bank")
    parser.add_argument("--tags", action="store_true", help="List all tags used in the memory bank")
    parser.add_argument("--report", action="store_true", help="Generate a report of the memory bank")
    
    args = parser.parse_args()
    
    if args.list:
        list_memories()
    elif args.tags:
        list_tags()
    elif args.report:
        generate_report()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
