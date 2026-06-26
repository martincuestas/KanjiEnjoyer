from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Kanji, User, UserKanjiSelection
from ..schemas import KanjiPublic, SelectionUpdate
from ..services.auth_service import get_current_user

router = APIRouter(prefix="/kanji", tags=["kanji"])


@router.get("", response_model=list[KanjiPublic])
def list_kanji(db: Session = Depends(get_db)):
    return db.query(Kanji).order_by(Kanji.id).all()


@router.get("/selection", response_model=list[int])
def get_selection(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(UserKanjiSelection.kanji_id)
        .filter(UserKanjiSelection.user_id == current_user.id)
        .all()
    )
    return [r[0] for r in rows]


@router.put("/selection", response_model=list[int])
def update_selection(
    body: SelectionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Verify all kanji_ids exist
    valid_ids = {
        k.id for k in db.query(Kanji.id).filter(Kanji.id.in_(body.kanji_ids)).all()
    }
    # Replace selection
    db.query(UserKanjiSelection).filter(
        UserKanjiSelection.user_id == current_user.id
    ).delete()
    for kid in valid_ids:
        db.add(UserKanjiSelection(user_id=current_user.id, kanji_id=kid))
    db.commit()
    return sorted(valid_ids)
