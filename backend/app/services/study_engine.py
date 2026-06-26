import random
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from ..models import Attempt, Kanji, Sentence, UserKanjiSelection, UserProgress

ALPHA = 0.3


# ── Progress helpers ───────────────────────────────────────────────────────────

def _get_or_create_progress(db: Session, user_id: int, kanji_id: int) -> UserProgress:
    prog = (
        db.query(UserProgress)
        .filter_by(user_id=user_id, kanji_id=kanji_id)
        .first()
    )
    if prog is None:
        prog = UserProgress(user_id=user_id, kanji_id=kanji_id)
        db.add(prog)
        db.flush()
    return prog


def _weight(prog: UserProgress) -> float:
    mastery_g = (prog.mastery_meaning + prog.mastery_usage) / 2
    reps_g = (prog.reps_meaning + prog.reps_usage) / 2
    return (1 - mastery_g) * (1 / (1 + reps_g))


# ── Weighted sampling without replacement ──────────────────────────────────────

def _weighted_sample(items: list, weights: list[float], k: int) -> list:
    items = list(items)
    weights = list(weights)
    k = min(k, len(items))
    result = []
    for _ in range(k):
        idx = random.choices(range(len(items)), weights=weights, k=1)[0]
        result.append(items[idx])
        items.pop(idx)
        weights.pop(idx)
    return result


# ── Round sampling ─────────────────────────────────────────────────────────────

def sample_round(user_id: int, n: int, db: Session) -> list[int]:
    """Return up to n kanji IDs sampled from the user's selection, weighted by learning need."""
    sel_ids = [
        r[0]
        for r in db.query(UserKanjiSelection.kanji_id)
        .filter(UserKanjiSelection.user_id == user_id)
        .all()
    ]
    if not sel_ids:
        return []

    progress_map = {
        p.kanji_id: p
        for p in db.query(UserProgress)
        .filter(UserProgress.user_id == user_id, UserProgress.kanji_id.in_(sel_ids))
        .all()
    }

    weights = [
        max(_weight(progress_map[kid]) if kid in progress_map else 1.0, 1e-6)
        for kid in sel_ids
    ]

    return _weighted_sample(sel_ids, weights, min(n, len(sel_ids)))


# ── Question builders ──────────────────────────────────────────────────────────

def build_meaning_question(kanji: Kanji, all_kanji: list[Kanji]) -> list[dict]:
    """1 correct + 3 distractor meaning/reading options, shuffled."""
    distractors = random.sample(
        [k for k in all_kanji if k.id != kanji.id],
        min(3, len([k for k in all_kanji if k.id != kanji.id])),
    )
    options = [
        {
            "kanji_id": kanji.id,
            "meanings": kanji.meanings,
            "onyomi": kanji.onyomi,
            "kunyomi": kanji.kunyomi,
            "romaji": kanji.romaji,
            "is_correct": True,
        }
    ]
    for d in distractors:
        options.append(
            {
                "kanji_id": d.id,
                "meanings": d.meanings,
                "onyomi": d.onyomi,
                "kunyomi": d.kunyomi,
                "romaji": d.romaji,
                "is_correct": False,
            }
        )
    random.shuffle(options)
    return options


def build_usage_question(
    kanji: Kanji, other_kanji_ids: list[int], db: Session
) -> list[dict] | None:
    """1 correct sentence + 3 false sentences (all for this kanji), shuffled.
    Falls back to other-kanji sentences only when false sentences are unavailable."""
    correct_sents = (
        db.query(Sentence)
        .filter(Sentence.kanji_id == kanji.id, Sentence.is_correct == True)
        .all()
    )
    if not correct_sents:
        return None

    correct = random.choice(correct_sents)

    # Prefer false sentences for the same kanji so the target kanji appears in all options
    false_sents = (
        db.query(Sentence)
        .filter(Sentence.kanji_id == kanji.id, Sentence.is_correct == False)
        .all()
    )
    if len(false_sents) >= 3:
        distractors = random.sample(false_sents, 3)
    else:
        # Fallback: pull from other kanji's correct sentences
        other_ids = [kid for kid in other_kanji_ids if kid != kanji.id]
        random.shuffle(other_ids)
        distractors = list(false_sents)  # use whatever false ones exist
        for oid in other_ids:
            if len(distractors) >= 3:
                break
            sents = (
                db.query(Sentence)
                .filter(Sentence.kanji_id == oid, Sentence.is_correct == True)
                .all()
            )
            if sents:
                distractors.append(random.choice(sents))

    def _fmt(s: Sentence, is_correct: bool) -> dict:
        return {
            "sentence_id": s.id,
            "text_jp": s.text_jp,
            "furigana": s.furigana,
            "romaji": s.romaji,
            "translation": s.translation,
            "is_correct": is_correct,
        }

    options = [_fmt(correct, True)] + [_fmt(d, False) for d in distractors]
    random.shuffle(options)
    return options


# ── Mastery update ─────────────────────────────────────────────────────────────

def update_mastery(
    user_id: int,
    kanji_id: int,
    question_type: str,
    correct: bool,
    generation: int,
    db: Session,
) -> UserProgress:
    prog = _get_or_create_progress(db, user_id, kanji_id)
    outcome = 1.0 if correct else 0.0

    if question_type == "meaning":
        prog.mastery_meaning = (1 - ALPHA) * prog.mastery_meaning + ALPHA * outcome
        prog.reps_meaning += 1
    else:
        prog.mastery_usage = (1 - ALPHA) * prog.mastery_usage + ALPHA * outcome
        prog.reps_usage += 1

    prog.last_seen = datetime.now(timezone.utc)

    db.add(
        Attempt(
            user_id=user_id,
            kanji_id=kanji_id,
            question_type=question_type,
            correct=correct,
            generation=generation,
        )
    )
    db.commit()
    db.refresh(prog)
    return prog
