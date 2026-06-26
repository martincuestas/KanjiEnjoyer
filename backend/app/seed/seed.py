"""
Run from the backend/ directory:
    python -m app.seed.seed           # skip if already seeded
    python -m app.seed.seed --force   # wipe kanji+sentences and re-seed
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.database import engine, SessionLocal
from app.models import Base, Kanji, Sentence
from app.seed.kanji_data import KANJI_SEED

FORCE = "--force" in sys.argv


def run():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = db.query(Kanji).count()

        if existing > 0 and not FORCE:
            print(f"DB already has {existing} kanji — skipping. Use --force to re-seed.")
            return

        if existing > 0 and FORCE:
            print(f"--force: deleting {existing} kanji and all sentences…")
            db.query(Sentence).delete()
            db.query(Kanji).delete()
            db.commit()
            print("Deleted. Re-seeding…")

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
        print(f"Seeded {len(KANJI_SEED)} kanji ({len(KANJI_SEED) * 3} sentences) successfully.")
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    run()
