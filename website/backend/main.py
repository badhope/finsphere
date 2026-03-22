"""
AI Skill Repository - Backend API
FastAPI-based backend for content management and API services
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import httpx
import markdown
import os
import sys
from pathlib import Path
from loguru import logger

sys.path.insert(0, str(Path(__file__).parent.parent))

logger.add(
    "logs/app_{time}.log",
    rotation="500 MB",
    retention="10 days",
    level="INFO",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}",
)

app = FastAPI(
    title="AI Skill Repository API",
    description="API for managing AI prompts, skills, and workflows",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptInfo(BaseModel):
    id: str
    name: str
    summary: str
    category: str
    sub_category: str
    tags: List[str]
    intent: str
    status: str

class SkillInfo(BaseModel):
    id: str
    name: str
    summary: str
    category: str
    tags: List[str]
    typical_use_cases: List[str]

class WorkflowInfo(BaseModel):
    id: str
    name: str
    summary: str
    steps: List[str]
   适用场景: str

class StatsResponse(BaseModel):
    prompts_count: int
    skills_count: int
    workflows_count: int
    categories_count: int
    last_updated: str

class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: str
    uptime_seconds: float

start_time = datetime.now()

@app.get("/", tags=["root"])
async def root():
    return {
        "message": "AI Skill Repository API",
        "version": "2.0.0",
        "docs": "/api/docs",
        "health": "/api/health",
    }

@app.get("/api/health", response_model=HealthResponse, tags=["system"])
async def health_check():
    uptime = (datetime.now() - start_time).total_seconds()
    return HealthResponse(
        status="healthy",
        version="2.0.0",
        timestamp=datetime.now().isoformat(),
        uptime_seconds=round(uptime, 2),
    )

@app.get("/api/stats", response_model=StatsResponse, tags=["system"])
async def get_stats():
    base_path = Path(__file__).parent.parent.parent

    prompts_count = len(list((base_path / "prompts").rglob("*.md"))) if (base_path / "prompts").exists() else 0
    skills_count = len(list((base_path / "skills").rglob("*.md"))) if (base_path / "skills").exists() else 0
    workflows_count = len(list((base_path / "prompts" / "workflow").rglob("*.md"))) if (base_path / "prompts" / "workflow").exists() else 0

    categories_count = 0
    categories_path = base_path / "prompts" / "task"
    if categories_path.exists():
        categories_count = len([d for d in categories_path.iterdir() if d.is_dir()])

    return StatsResponse(
        prompts_count=prompts_count,
        skills_count=skills_count,
        workflows_count=workflows_count,
        categories_count=categories_count,
        last_updated=datetime.now().strftime("%Y-%m-%d"),
    )

@app.get("/api/prompts", response_model=List[PromptInfo], tags=["prompts"])
async def list_prompts(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search in name or summary"),
    limit: int = Query(50, ge=1, le=200),
):
    base_path = Path(__file__).parent.parent.parent / "prompts"
    prompts = []

    search_path = base_path
    if category:
        search_path = base_path / "task" / category
        if not search_path.exists():
            search_path = base_path

    for md_file in search_path.rglob("*.md"):
        if "_" in md_file.stem and not md_file.stem.startswith("prompt"):
            continue

        content = md_file.read_text(encoding="utf-8")

        frontmatter = {}
        if content.startswith("---"):
            parts = content.split("---", 2)
            if len(parts) >= 3:
                for line in parts[1].strip().split("\n"):
                    if ":" in line:
                        key, value = line.split(":", 1)
                        frontmatter[key.strip()] = value.strip()

        prompts.append(PromptInfo(
            id=md_file.stem,
            name=frontmatter.get("name", md_file.stem),
            summary=frontmatter.get("summary", ""),
            category=frontmatter.get("category", "general"),
            sub_category=frontmatter.get("sub_category", ""),
            tags=frontmatter.get("tags", "").strip("[]").replace(" ", "").split(",") if frontmatter.get("tags") else [],
            intent=frontmatter.get("intent", ""),
            status=frontmatter.get("status", "active"),
        ))

    if search:
        search_lower = search.lower()
        prompts = [p for p in prompts if search_lower in p.name.lower() or search_lower in p.summary.lower()]

    if category:
        prompts = [p for p in prompts if p.category == category]

    return prompts[:limit]

@app.get("/api/prompts/{prompt_id}", tags=["prompts"])
async def get_prompt(prompt_id: str):
    base_path = Path(__file__).parent.parent.parent / "prompts"

    for md_file in base_path.rglob(f"{prompt_id}.md"):
        content = md_file.read_text(encoding="utf-8")

        html_content = markdown.markdown(content)

        return {
            "id": prompt_id,
            "content": content,
            "html": html_content,
            "path": str(md_file.relative_to(base_path.parent)),
        }

    raise HTTPException(status_code=404, detail=f"Prompt '{prompt_id}' not found")

@app.get("/api/skills", response_model=List[SkillInfo], tags=["skills"])
async def list_skills(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
):
    base_path = Path(__file__).parent.parent.parent / "skills"
    skills = []

    if not base_path.exists():
        return []

    for md_file in base_path.rglob("*.md"):
        content = md_file.read_text(encoding="utf-8")

        frontmatter = {}
        if content.startswith("---"):
            parts = content.split("---", 2)
            if len(parts) >= 3:
                for line in parts[1].strip().split("\n"):
                    if ":" in line:
                        key, value = line.split(":", 1)
                        frontmatter[key.strip()] = value.strip()

        skills.append(SkillInfo(
            id=md_file.stem,
            name=frontmatter.get("name", md_file.stem),
            summary=frontmatter.get("summary", ""),
            category=frontmatter.get("category", "general"),
            tags=frontmatter.get("tags", "").strip("[]").replace(" ", "").split(",") if frontmatter.get("tags") else [],
            typical_use_cases=frontmatter.get("typical_use_cases", "").strip("[]").split(",") if frontmatter.get("typical_use_cases") else [],
        ))

    if search:
        search_lower = search.lower()
        skills = [s for s in skills if search_lower in s.name.lower() or search_lower in s.summary.lower()]

    if category:
        skills = [s for s in skills if s.category == category]

    return skills[:limit]

@app.get("/api/categories", tags=["navigation"])
async def get_categories():
    base_path = Path(__file__).parent.parent.parent / "prompts" / "task"

    if not base_path.exists():
        return {"categories": []}

    categories = []
    for category_dir in base_path.iterdir():
        if category_dir.is_dir():
            prompt_count = len(list(category_dir.rglob("*.md")))

            subdirs = [d for d in category_dir.iterdir() if d.is_dir()]
            subcategories = [{"name": d.name, "count": len(list(d.rglob("*.md")))} for d in subdirs]

            categories.append({
                "name": category_dir.name,
                "display_name": category_dir.name.replace("-", " ").replace("_", " ").title(),
                "prompt_count": prompt_count,
                "subcategories": subcategories,
            })

    return {"categories": categories}

@app.get("/api/search", tags=["search"])
async def search_content(
    q: str = Query(..., min_length=1, description="Search query"),
    type: Optional[str] = Query(None, description="Content type: prompts, skills, all"),
    limit: int = Query(20, ge=1, le=100),
):
    base_path = Path(__file__).parent.parent.parent
    results = []

    search_types = ["prompts"] if type == "prompts" else ["skills"] if type == "skills" else ["prompts", "skills"]

    if "prompts" in search_types:
        prompts_path = base_path / "prompts"
        if prompts_path.exists():
            for md_file in prompts_path.rglob("*.md"):
                content = md_file.read_text(encoding="utf-8").lower()
                if q.lower() in content:
                    results.append({
                        "type": "prompt",
                        "id": md_file.stem,
                        "path": str(md_file.relative_to(base_path)),
                        "score": content.count(q.lower()),
                    })

    if "skills" in search_types:
        skills_path = base_path / "skills"
        if skills_path.exists():
            for md_file in skills_path.rglob("*.md"):
                content = md_file.read_text(encoding="utf-8").lower()
                if q.lower() in content:
                    results.append({
                        "type": "skill",
                        "id": md_file.stem,
                        "path": str(md_file.relative_to(base_path)),
                        "score": content.count(q.lower()),
                    })

    results.sort(key=lambda x: x["score"], reverse=True)

    return {"query": q, "total": len(results), "results": results[:limit]}

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "status_code": exc.status_code},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "status_code": 500},
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
