from datetime import datetime
from sqlalchemy import (
    Boolean, Column, DateTime, Float, ForeignKey,
    Integer, String, Text, UniqueConstraint, JSON,
)
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    current_generation = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    selections = relationship("UserKanjiSelection", back_populates="user", cascade="all, delete-orphan")
    progress = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")
    attempts = relationship("Attempt", back_populates="user")


class Kanji(Base):
    __tablename__ = "kanji"

    id = Column(Integer, primary_key=True, index=True)
    character = Column(String(1), unique=True, nullable=False, index=True)
    meanings = Column(JSON, nullable=False)   # list[str]
    onyomi = Column(String, nullable=True)
    kunyomi = Column(String, nullable=True)
    romaji = Column(String, nullable=True)
    jlpt_level = Column(String, default="N5", nullable=False)

    sentences = relationship("Sentence", back_populates="kanji", cascade="all, delete-orphan")
    selections = relationship("UserKanjiSelection", back_populates="kanji")
    progress = relationship("UserProgress", back_populates="kanji")
    attempts = relationship("Attempt", back_populates="kanji")


class Sentence(Base):
    __tablename__ = "sentences"

    id = Column(Integer, primary_key=True, index=True)
    kanji_id = Column(Integer, ForeignKey("kanji.id"), nullable=False)
    text_jp = Column(Text, nullable=False)
    furigana = Column(Text, nullable=True)   # ruby markup or JSON
    romaji = Column(Text, nullable=True)
    translation = Column(Text, nullable=True)
    note = Column(Text, nullable=True)  # post-answer feedback (e.g. why a false sentence is wrong)
    is_correct = Column(Boolean, nullable=False)  # True = correct use of this kanji

    kanji = relationship("Kanji", back_populates="sentences")


class UserKanjiSelection(Base):
    __tablename__ = "user_kanji_selection"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    kanji_id = Column(Integer, ForeignKey("kanji.id"), primary_key=True)

    user = relationship("User", back_populates="selections")
    kanji = relationship("Kanji", back_populates="selections")


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    kanji_id = Column(Integer, ForeignKey("kanji.id"), nullable=False)
    mastery_meaning = Column(Float, default=0.0, nullable=False)
    reps_meaning = Column(Integer, default=0, nullable=False)
    mastery_usage = Column(Float, default=0.0, nullable=False)
    reps_usage = Column(Integer, default=0, nullable=False)
    last_seen = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (UniqueConstraint("user_id", "kanji_id", name="uq_user_kanji_progress"),)

    user = relationship("User", back_populates="progress")
    kanji = relationship("Kanji", back_populates="progress")


class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    kanji_id = Column(Integer, ForeignKey("kanji.id"), nullable=False)
    question_type = Column(String, nullable=False)   # "meaning" | "usage"
    correct = Column(Boolean, nullable=False)
    generation = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="attempts")
    kanji = relationship("Kanji", back_populates="attempts")
