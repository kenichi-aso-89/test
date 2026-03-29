#!/usr/bin/env python
"""
Wrapper script for browser-use CLI to work with Python 3.14+
"""
import asyncio
import sys

async def main():
    from browser_use.skill_cli.main import main as cli_main
    await cli_main()

if __name__ == "__main__":
    asyncio.run(main())
