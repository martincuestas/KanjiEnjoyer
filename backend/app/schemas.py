from pydantic import BaseModel, field_validator


class UserCreate(BaseModel):
    username: str
    password: str

    @field_validator("username")
    @classmethod
    def username_valid(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 3 or len(v) > 32:
            raise ValueError("El nombre de usuario debe tener entre 3 y 32 caracteres.")
        if not v.replace("_", "").replace("-", "").isalnum():
            raise ValueError("Solo letras, números, guiones y guiones bajos.")
        return v

    @field_validator("password")
    @classmethod
    def password_valid(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("La contraseña debe tener al menos 6 caracteres.")
        return v


class UserLogin(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserPublic(BaseModel):
    id: int
    username: str
    current_generation: int

    model_config = {"from_attributes": True}


class KanjiPublic(BaseModel):
    id: int
    character: str
    meanings: list[str]
    onyomi: str | None
    kunyomi: str | None
    romaji: str | None
    jlpt_level: str

    model_config = {"from_attributes": True}


class SelectionUpdate(BaseModel):
    kanji_ids: list[int]


# ── Study round ────────────────────────────────────────────────────────────────

class RoundRequest(BaseModel):
    n: int = 5

    @field_validator("n")
    @classmethod
    def n_valid(cls, v: int) -> int:
        if v < 1 or v > 50:
            raise ValueError("n debe estar entre 1 y 50.")
        return v


class KanjiInRound(BaseModel):
    id: int
    character: str
    meanings: list[str]
    onyomi: str | None
    kunyomi: str | None
    romaji: str | None


class MeaningOption(BaseModel):
    kanji_id: int
    meanings: list[str]
    onyomi: str | None
    kunyomi: str | None
    romaji: str | None
    is_correct: bool


class UsageOption(BaseModel):
    sentence_id: int
    text_jp: str
    furigana: str | None
    romaji: str | None
    translation: str | None
    is_correct: bool


class RoundItem(BaseModel):
    kanji: KanjiInRound
    meaning_question: list[MeaningOption]
    usage_question: list[UsageOption] | None


class RoundResponse(BaseModel):
    items: list[RoundItem]


# ── Answer ─────────────────────────────────────────────────────────────────────

class AnswerRequest(BaseModel):
    kanji_id: int
    question_type: str   # "meaning" | "usage"
    correct: bool

    @field_validator("question_type")
    @classmethod
    def type_valid(cls, v: str) -> str:
        if v not in ("meaning", "usage"):
            raise ValueError("question_type debe ser 'meaning' o 'usage'.")
        return v


class AnswerResponse(BaseModel):
    mastery_meaning: float
    mastery_usage: float
    reps_meaning: int
    reps_usage: int
