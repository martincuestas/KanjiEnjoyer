from datetime import datetime, timedelta, timezone

from sqlalchemy import cast, func, Integer
from sqlalchemy.orm import Session, joinedload

from fastapi import APIRouter, Depends

from ..database import get_db
from ..models import Attempt, User, UserProgress
from ..schemas import (
    DailyPoint,
    GenerationSummary,
    KanjiStatItem,
    StatsResponse,
    TypeAccuracy,
)
from ..services.auth_service import get_current_user

router = APIRouter(prefix="/stats", tags=["stats"])


def _type_accuracy(rows: list, generation: int, q_type: str) -> TypeAccuracy:
    for r in rows:
        if r.generation == generation and r.question_type == q_type:
            return TypeAccuracy(
                total=r.total,
                correct=r.correct_count,
                accuracy=round(r.correct_count / r.total, 3) if r.total else 0.0,
            )
    return TypeAccuracy(total=0, correct=0, accuracy=0.0)


@router.get("", response_model=StatsResponse)
def get_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # ── Accuracy per generation per type ──────────────────────────────────────
    acc_rows = (
        db.query(
            Attempt.generation,
            Attempt.question_type,
            func.count(Attempt.id).label("total"),
            func.sum(cast(Attempt.correct, Integer)).label("correct_count"),
        )
        .filter(Attempt.user_id == current_user.id)
        .group_by(Attempt.generation, Attempt.question_type)
        .all()
    )

    all_gens = sorted({r.generation for r in acc_rows})
    all_generations = [
        GenerationSummary(
            generation=g,
            meaning=_type_accuracy(acc_rows, g, "meaning"),
            usage=_type_accuracy(acc_rows, g, "usage"),
        )
        for g in all_gens
    ]
    # Always include current generation even if no attempts yet
    current_gen = current_user.current_generation
    if not any(g.generation == current_gen for g in all_generations):
        all_generations.append(
            GenerationSummary(
                generation=current_gen,
                meaning=TypeAccuracy(total=0, correct=0, accuracy=0.0),
                usage=TypeAccuracy(total=0, correct=0, accuracy=0.0),
            )
        )
    all_generations.sort(key=lambda g: g.generation)

    # ── Kanji progress ────────────────────────────────────────────────────────
    progress_rows = (
        db.query(UserProgress)
        .filter(UserProgress.user_id == current_user.id)
        .options(joinedload(UserProgress.kanji))
        .all()
    )
    kanji_progress = [
        KanjiStatItem(
            kanji_id=p.kanji_id,
            character=p.kanji.character,
            meanings=p.kanji.meanings,
            mastery_meaning=round(p.mastery_meaning, 3),
            mastery_usage=round(p.mastery_usage, 3),
            reps_meaning=p.reps_meaning,
            reps_usage=p.reps_usage,
        )
        for p in progress_rows
    ]
    kanji_progress.sort(key=lambda k: k.kanji_id)

    # ── Daily activity (last 30 days, current generation) ─────────────────────
    cutoff = datetime.now(timezone.utc) - timedelta(days=30)
    daily_rows = (
        db.query(
            func.date(Attempt.timestamp).label("day"),
            func.count(Attempt.id).label("total"),
            func.sum(cast(Attempt.correct, Integer)).label("correct_count"),
        )
        .filter(
            Attempt.user_id == current_user.id,
            Attempt.generation == current_gen,
            Attempt.timestamp >= cutoff,
        )
        .group_by(func.date(Attempt.timestamp))
        .order_by(func.date(Attempt.timestamp))
        .all()
    )
    daily_activity = [
        DailyPoint(date=str(r.day), total=r.total, correct=r.correct_count)
        for r in daily_rows
    ]

    return StatsResponse(
        current_generation=current_gen,
        all_generations=all_generations,
        kanji_progress=kanji_progress,
        daily_activity=daily_activity,
    )
