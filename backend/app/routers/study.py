from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Kanji, User
from ..schemas import AnswerRequest, AnswerResponse, RoundRequest, RoundResponse
from ..services.auth_service import get_current_user
from ..services import study_engine

router = APIRouter(prefix="/study", tags=["study"])


@router.post("/round", response_model=RoundResponse)
def start_round(
    body: RoundRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sampled_ids = study_engine.sample_round(current_user.id, body.n, db)
    if not sampled_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No tenés kanji seleccionados. Seleccioná algunos antes de estudiar.",
        )

    all_kanji = db.query(Kanji).all()
    all_kanji_map = {k.id: k for k in all_kanji}
    all_ids = [k.id for k in all_kanji]

    items = []
    for kid in sampled_ids:
        kanji = all_kanji_map[kid]
        items.append(
            {
                "kanji": {
                    "id": kanji.id,
                    "character": kanji.character,
                    "meanings": kanji.meanings,
                    "onyomi": kanji.onyomi,
                    "kunyomi": kanji.kunyomi,
                    "romaji": kanji.romaji,
                },
                "meaning_question": study_engine.build_meaning_question(kanji, all_kanji),
                "usage_question": study_engine.build_usage_question(kanji, all_ids, db),
            }
        )

    return {"items": items}


@router.post("/answer", response_model=AnswerResponse)
def submit_answer(
    body: AnswerRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prog = study_engine.update_mastery(
        user_id=current_user.id,
        kanji_id=body.kanji_id,
        question_type=body.question_type,
        correct=body.correct,
        generation=current_user.current_generation,
        db=db,
    )
    return AnswerResponse(
        mastery_meaning=prog.mastery_meaning,
        mastery_usage=prog.mastery_usage,
        reps_meaning=prog.reps_meaning,
        reps_usage=prog.reps_usage,
    )
