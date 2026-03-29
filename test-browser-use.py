#!/usr/bin/env python
"""
Test browser-use basic functionality
"""
import asyncio
from browser_use import Browser

async def test_browser():
    print("Testing Browser Use...")
    try:
        browser = Browser()
        print("OK - Browser object created successfully")
        print(f"Browser class: {browser.__class__.__name__}")
        return True
    except Exception as e:
        print(f"ERROR: {e}")
        return False

if __name__ == "__main__":
    result = asyncio.run(test_browser())
    exit(0 if result else 1)
