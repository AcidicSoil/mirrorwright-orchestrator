#!/usr/bin/env python3
"""
Memory Bank Management Tool for Mirrorwright Orchestrator

This tool helps manage a structured memory bank for the project, allowing
developers to save and retrieve important lessons, templates, and workflows.

Usage:
  python tools/memory.py save --title "Title" --tags tag1,tag2 --notes "Notes"
  python tools/memory.py search --query "search terms"
"""

import os
import sys
import json
import argparse
import datetime
import re
from pathlib import Path
import shutil

# Configuration
MEMORY_BANK_DIR = "cursor-memory-bank"
MEMORY_INDEX_FILE = os.path.join(MEMORY_BANK_DIR, "memory_index.json")

def ensure_memory_bank_exists():
    """Ensure the memory bank directory and index file exist."""
    if not os.path.exists(MEMORY_BANK_DIR):
        os.makedirs(MEMORY_BANK_DIR)
    
    if not os.path.exists(MEMORY_INDEX_FILE):
        with open(MEMORY_INDEX_FILE, 'w') as f:
            json.dump({"memories": []}, f, indent=2)

def slugify(text):
    """Convert text to a URL-friendly slug."""
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')

def save_memory(title, tags, notes):
    """Save a new memory to the memory bank."""
    ensure_memory_bank_exists()
    
    # Load existing index
    with open(MEMORY_INDEX_FILE, 'r') as f:
        index = json.load(f)
    
    # Create memory metadata
    timestamp = datetime.datetime.now().isoformat()
    memory_id = f"{slugify(title)}-{timestamp.split('T')[0]}"
    
    # Create memory file path
    memory_file = os.path.join(MEMORY_BANK_DIR, f"{memory_id}.md")
    
    # Split tags
    tag_list = [tag.strip() for tag in tags.split(',')]
    
    # Add to index
    memory_entry = {
        "id": memory_id,
        "title": title,
        "tags": tag_list,
        "created": timestamp,
        "file_path": memory_file
    }
    index["memories"].append(memory_entry)
    
    # Save updated index
    with open(MEMORY_INDEX_FILE, 'w') as f:
        json.dump(index, f, indent=2)
    
    # Create memory file
    with open(memory_file, 'w') as f:
        f.write(f"# {title}\n\n")
        f.write(f"**Date:** {timestamp.split('T')[0]}\n\n")
        f.write(f"**Tags:** {', '.join(tag_list)}\n\n")
        f.write("## Notes\n\n")
        f.write(f"{notes}\n\n")
    
    print(f"Memory saved: {memory_file}")
    return memory_file

def search_memories(query):
    """Search memories by query terms."""
    ensure_memory_bank_exists()
    
    # Load index
    with open(MEMORY_INDEX_FILE, 'r') as f:
        index = json.load(f)
    
    # Split query into terms
    query_terms = query.lower().split()
    
    results = []
    for memory in index["memories"]:
        score = 0
        
        # Search in title
        title_lower = memory["title"].lower()
        for term in query_terms:
            if term in title_lower:
                score += 3
        
        # Search in tags
        for tag in memory["tags"]:
            for term in query_terms:
                if term in tag.lower():
                    score += 2
        
        # Search in content
        if os.path.exists(memory["file_path"]):
            with open(memory["file_path"], 'r') as f:
                content = f.read().lower()
                for term in query_terms:
                    if term in content:
                        score += 1
        
        if score > 0:
            results.append((score, memory))
    
    # Sort by score
    results.sort(reverse=True, key=lambda x: x[0])
    
    if not results:
        print("No matching memories found.")
        return []
    
    print(f"Found {len(results)} matching memories:")
    for score, memory in results:
        print(f"- [{score}] {memory['title']} (Tags: {', '.join(memory['tags'])})")
        print(f"  File: {memory['file_path']}")
    
    return [memory for _, memory in results]

def main():
    parser = argparse.ArgumentParser(description="Memory Bank Management Tool")
    subparsers = parser.add_subparsers(dest="command", help="Command to run")
    
    # Save command
    save_parser = subparsers.add_parser("save", help="Save a new memory")
    save_parser.add_argument("--title", required=True, help="Memory title")
    save_parser.add_argument("--tags", required=True, help="Comma-separated tags")
    save_parser.add_argument("--notes", required=True, help="Memory notes/content")
    
    # Search command
    search_parser = subparsers.add_parser("search", help="Search memories")
    search_parser.add_argument("--query", required=True, help="Search query")
    
    args = parser.parse_args()
    
    if args.command == "save":
        save_memory(args.title, args.tags, args.notes)
    elif args.command == "search":
        search_memories(args.query)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
