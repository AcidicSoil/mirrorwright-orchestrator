#!/usr/bin/env python3
"""
Memory Bank Setup Tool for Mirrorwright Orchestrator

This tool helps set up and verify the memory bank system for the project.
"""

import os
import sys
import json
import argparse
import shutil
from pathlib import Path

# Configuration
MEMORY_BANK_DIR = "cursor-memory-bank"
MEMORY_INDEX_FILE = os.path.join(MEMORY_BANK_DIR, "memory_index.json")
MEMORY_BANK_FILES_DIR = os.path.join(MEMORY_BANK_DIR, "memory-bank")

def check_setup():
    """Check if the memory bank system is properly set up."""
    print("Checking Memory Bank setup...")

    # Check if memory bank directory exists
    if not os.path.exists(MEMORY_BANK_DIR):
        print(f"❌ Memory Bank directory '{MEMORY_BANK_DIR}' does not exist.")
        return False

    # Check if memory index file exists
    if not os.path.exists(MEMORY_INDEX_FILE):
        print(f"❌ Memory index file '{MEMORY_INDEX_FILE}' does not exist.")
        return False

    # Check if memory bank files directory exists
    if not os.path.exists(MEMORY_BANK_FILES_DIR):
        print(f"❌ Memory bank files directory '{MEMORY_BANK_FILES_DIR}' does not exist.")
        return False

    # Check if memory.py script exists
    if not os.path.exists("tools/memory.py"):
        print("❌ Memory management script 'tools/memory.py' does not exist.")
        return False

    # Check if custom modes directory exists
    if not os.path.exists(os.path.join(MEMORY_BANK_DIR, "custom_modes")):
        print(f"❌ Custom modes directory '{os.path.join(MEMORY_BANK_DIR, 'custom_modes')}' does not exist.")
        return False

    print("✅ Memory Bank system is properly set up!")
    return True

def setup_memory_bank():
    """Set up the memory bank system."""
    print("Setting up Memory Bank system...")

    # Create memory bank directory if it doesn't exist
    if not os.path.exists(MEMORY_BANK_DIR):
        os.makedirs(MEMORY_BANK_DIR)
        print(f"✅ Created Memory Bank directory '{MEMORY_BANK_DIR}'.")

    # Create memory index file if it doesn't exist
    if not os.path.exists(MEMORY_INDEX_FILE):
        with open(MEMORY_INDEX_FILE, 'w') as f:
            json.dump({"memories": []}, f, indent=2)
        print(f"✅ Created memory index file '{MEMORY_INDEX_FILE}'.")

    # Create memory bank files directory if it doesn't exist
    if not os.path.exists(MEMORY_BANK_FILES_DIR):
        os.makedirs(MEMORY_BANK_FILES_DIR)
        print(f"✅ Created memory bank files directory '{MEMORY_BANK_FILES_DIR}'.")

    # Create basic memory bank files if they don't exist
    core_files = [
        "projectbrief.md",
        "productContext.md",
        "activeContext.md",
        "systemPatterns.md",
        "techContext.md",
        "progress.md",
        "tasks.md"
    ]

    for file_name in core_files:
        file_path = os.path.join(MEMORY_BANK_FILES_DIR, file_name)
        if not os.path.exists(file_path):
            with open(file_path, 'w') as f:
                title = file_name.split('.')[0].title()
                f.write(f"# {title}\n\n")

                # Add basic structure based on file type
                if file_name == "projectbrief.md":
                    f.write("## Project Overview\n\n[Project description goes here]\n\n")
                    f.write("## Core Requirements\n\n[List core requirements here]\n\n")
                    f.write("## Project Goals\n\n[List project goals here]\n\n")
                    f.write("## Success Criteria\n\n[List success criteria here]\n\n")

                elif file_name == "productContext.md":
                    f.write("## Problem Statement\n\n[Describe the problem being solved]\n\n")
                    f.write("## Solution\n\n[Describe the solution approach]\n\n")
                    f.write("## User Experience Goals\n\n[Describe user experience goals]\n\n")
                    f.write("## Key Differentiators\n\n[List key differentiators]\n\n")

                elif file_name == "activeContext.md":
                    f.write("## Current Focus\n\n[Describe current development focus]\n\n")
                    f.write("## Related Components\n\n[List related components]\n\n")
                    f.write("## Technical Requirements\n\n[List technical requirements]\n\n")
                    f.write("## Progress Notes\n\n[Add progress notes here]\n\n")

                elif file_name == "systemPatterns.md":
                    f.write("## Architecture Overview\n\n[Describe system architecture]\n\n")
                    f.write("## Key Design Patterns\n\n[List key design patterns]\n\n")
                    f.write("## Component Relationships\n\n[Describe component relationships]\n\n")
                    f.write("## Critical Implementation Paths\n\n[Describe critical implementation paths]\n\n")

                elif file_name == "techContext.md":
                    f.write("## Technology Stack\n\n[List technologies used]\n\n")
                    f.write("## Development Environment\n\n[Describe development environment]\n\n")
                    f.write("## Technical Constraints\n\n[List technical constraints]\n\n")
                    f.write("## Dependencies\n\n[List dependencies]\n\n")

                elif file_name == "progress.md":
                    f.write("## Implementation Progress\n\n[List implementation progress]\n\n")
                    f.write("## Current Status\n\n[Describe current status]\n\n")
                    f.write("## Known Issues\n\n[List known issues]\n\n")
                    f.write("## Next Steps\n\n[List next steps]\n\n")

                elif file_name == "tasks.md":
                    f.write("## Current Tasks\n\n[List current tasks]\n\n")
                    f.write("## Completed Tasks\n\n[List completed tasks]\n\n")
                    f.write("## Backlog\n\n[List backlog items]\n\n")

            print(f"✅ Created memory bank file '{file_path}'.")

    # Create custom modes directory if it doesn't exist
    custom_modes_dir = os.path.join(MEMORY_BANK_DIR, "custom_modes")
    if not os.path.exists(custom_modes_dir):
        os.makedirs(custom_modes_dir)
        print(f"✅ Created custom modes directory '{custom_modes_dir}'.")

    print("✅ Memory Bank system setup complete!")
    return True

def main():
    parser = argparse.ArgumentParser(description="Memory Bank Setup Tool")
    parser.add_argument("--check", action="store_true", help="Check if the memory bank system is properly set up")
    parser.add_argument("--setup", action="store_true", help="Set up the memory bank system")

    args = parser.parse_args()

    if args.check:
        check_setup()
    elif args.setup:
        setup_memory_bank()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
