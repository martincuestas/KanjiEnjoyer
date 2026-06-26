"""
Run from the backend/ directory:
    python -m app.seed.seed
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.database import engine, SessionLocal
from app.models import Base, Kanji, Sentence
from app.seed.kanji_data import KANJI_SEED


def run():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Kanji).count() > 0:
            print("DB already seeded — skipping.")
            return

        for entry in KANJI_SEED:
            kanji = Kanji(
                character=entry["character"],
                meanings=entry["meanings"],
                onyomi=entry.get("onyomi"),
                kunyomi=entry.get("kunyomi"),
                romaji=entry.get("romaji"),
                jlpt_level=entry.get("jlpt_level", "N5"),
            )
            db.add(kanji)
            db.flush()

            for s in entry.get("sentences", []):
                db.add(Sentence(
                    kanji_id=kanji.id,
                    text_jp=s["text_jp"],
                    furigana=s.get("furigana"),
                    romaji=s.get("romaji"),
                    translation=s.get("translation"),
                    is_correct=s["is_correct"],
                ))

        db.commit()
        print(f"Seeded {len(KANJI_SEED)} kanji successfully.")
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    run()
