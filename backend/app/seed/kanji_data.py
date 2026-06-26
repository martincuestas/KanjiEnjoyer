# Seed data for 10 N5 kanji.
# Sources: KANJIDIC2 (readings/meanings), JMdict-derived example sentences.
# Sentences marked [PROVISIONAL] have been hand-written for pipeline validation
# and should be reviewed by a Japanese-language editor before production use.
# is_correct=True  → sentence naturally uses THIS kanji
# is_correct=False → sentence uses a different kanji (valid distractor)

KANJI_SEED = [
    {
        "character": "日",
        "meanings": ["sun", "day", "Japan"],
        "onyomi": "ニチ、ジツ",
        "kunyomi": "ひ、-び、-か",
        "romaji": "nichi, jitsu / hi",
        "jlpt_level": "N5",
        "sentences": [
            {
                "text_jp": "今日はいい天気ですね。",
                "furigana": "きょうはいいてんきですね。",
                "romaji": "Kyō wa ii tenki desu ne.",
                "translation": "The weather is nice today, isn't it?",
                "is_correct": True,
            },
            {
                "text_jp": "毎日学校に行きます。",
                "furigana": "まいにちがっこうにいきます。",
                "romaji": "Mainichi gakkō ni ikimasu.",
                "translation": "I go to school every day.",
                "is_correct": True,
            },
            {
                "text_jp": "日本語を勉強しています。",
                "furigana": "にほんごをべんきょうしています。",
                "romaji": "Nihongo o benkyō shite imasu.",
                "translation": "I am studying Japanese.",
                "is_correct": True,
            },
            # Distractors (other kanji used correctly in their own context)
            {
                "text_jp": "山の上から見る景色はきれいです。",  # 山
                "furigana": "やまのうえからみるけしきはきれいです。",
                "romaji": "Yama no ue kara miru keshiki wa kirei desu.",
                "translation": "The view from the top of the mountain is beautiful.",
                "is_correct": False,
            },
            {
                "text_jp": "川で魚を釣りました。",  # 川
                "furigana": "かわでさかなをつりました。",
                "romaji": "Kawa de sakana o tsurimashita.",
                "translation": "I fished in the river.",
                "is_correct": False,
            },
        ],
    },
    {
        "character": "月",
        "meanings": ["moon", "month"],
        "onyomi": "ゲツ、ガツ",
        "kunyomi": "つき",
        "romaji": "getsu, gatsu / tsuki",
        "jlpt_level": "N5",
        "sentences": [
            {
                "text_jp": "今夜は月がきれいです。",
                "furigana": "こんやはつきがきれいです。",
                "romaji": "Konya wa tsuki ga kirei desu.",
                "translation": "The moon is beautiful tonight.",
                "is_correct": True,
            },
            {
                "text_jp": "来月、旅行に行く予定です。",
                "furigana": "らいげつ、りょこうにいくよていです。",
                "romaji": "Raigetsu, ryokō ni iku yotei desu.",
                "translation": "I plan to travel next month.",
                "is_correct": True,
            },
            {
                "text_jp": "毎月本を三冊読みます。",
                "furigana": "まいつきほんをさんさつよみます。",
                "romaji": "Maitsuki hon o sansatsu yomimasu.",
                "translation": "I read three books every month.",
                "is_correct": True,
            },
            {
                "text_jp": "今日はいい天気ですね。",  # 日 distractor
                "furigana": "きょうはいいてんきですね。",
                "romaji": "Kyō wa ii tenki desu ne.",
                "translation": "The weather is nice today, isn't it?",
                "is_correct": False,
            },
            {
                "text_jp": "火曜日に試験があります。",  # 火 distractor
                "furigana": "かようびにしけんがあります。",
                "romaji": "Kayōbi ni shiken ga arimasu.",
                "translation": "There is an exam on Tuesday.",
                "is_correct": False,
            },
        ],
    },
    {
        "character": "山",
        "meanings": ["mountain"],
        "onyomi": "サン、セン",
        "kunyomi": "やま",
        "romaji": "san, sen / yama",
        "jlpt_level": "N5",
        "sentences": [
            {
                "text_jp": "富士山はとても高いです。",
                "furigana": "ふじさんはとてもたかいです。",
                "romaji": "Fujisan wa totemo takai desu.",
                "translation": "Mt. Fuji is very tall.",
                "is_correct": True,
            },
            {
                "text_jp": "山に登るのが好きです。",
                "furigana": "やまにのぼるのがすきです。",
                "romaji": "Yama ni noboru no ga suki desu.",
                "translation": "I like climbing mountains.",
                "is_correct": True,
            },
            {
                "text_jp": "あの山の向こうに村があります。",
                "furigana": "あのやまのむこうにむらがあります。",
                "romaji": "Ano yama no mukō ni mura ga arimasu.",
                "translation": "There is a village beyond that mountain.",
                "is_correct": True,
            },
            {
                "text_jp": "今夜は月がきれいです。",  # 月 distractor
                "furigana": "こんやはつきがきれいです。",
                "romaji": "Konya wa tsuki ga kirei desu.",
                "translation": "The moon is beautiful tonight.",
                "is_correct": False,
            },
            {
                "text_jp": "川で魚を釣りました。",  # 川 distractor
                "furigana": "かわでさかなをつりました。",
                "romaji": "Kawa de sakana o tsurimashita.",
                "translation": "I fished in the river.",
                "is_correct": False,
            },
        ],
    },
    {
        "character": "川",
        "meanings": ["river"],
        "onyomi": "セン",
        "kunyomi": "かわ、-がわ",
        "romaji": "sen / kawa",
        "jlpt_level": "N5",
        "sentences": [
            {
                "text_jp": "この川はとても長いです。",
                "furigana": "このかわはとてもながいです。",
                "romaji": "Kono kawa wa totemo nagai desu.",
                "translation": "This river is very long.",
                "is_correct": True,
            },
            {
                "text_jp": "川のそばで遊びました。",
                "furigana": "かわのそばであそびました。",
                "romaji": "Kawa no soba de asobimashita.",
                "translation": "I played by the river.",
                "is_correct": True,
            },
            {
                "text_jp": "川を渡って公園に着きました。",
                "furigana": "かわをわたってこうえんにつきました。",
                "romaji": "Kawa o watatte kōen ni tsukimashita.",
                "translation": "I crossed the river and arrived at the park.",
                "is_correct": True,
            },
            {
                "text_jp": "富士山はとても高いです。",  # 山 distractor
                "furigana": "ふじさんはとてもたかいです。",
                "romaji": "Fujisan wa totemo takai desu.",
                "translation": "Mt. Fuji is very tall.",
                "is_correct": False,
            },
            {
                "text_jp": "林の中を散歩しました。",  # 林 distractor
                "furigana": "はやしのなかをさんぽしました。",
                "romaji": "Hayashi no naka o sanpo shimashita.",
                "translation": "I took a walk in the grove.",
                "is_correct": False,
            },
        ],
    },
    {
        "character": "火",
        "meanings": ["fire", "Tuesday"],
        "onyomi": "カ",
        "kunyomi": "ひ、-び、ほ-",
        "romaji": "ka / hi",
        "jlpt_level": "N5",
        "sentences": [
            {
                "text_jp": "火を使うときは気をつけてください。",
                "furigana": "ひをつかうときはきをつけてください。",
                "romaji": "Hi o tsukau toki wa ki o tsukete kudasai.",
                "translation": "Please be careful when using fire.",
                "is_correct": True,
            },
            {
                "text_jp": "火曜日に図書館で会いましょう。",
                "furigana": "かようびにとしょかんであいましょう。",
                "romaji": "Kayōbi ni toshokan de aimashō.",
                "translation": "Let's meet at the library on Tuesday.",
                "is_correct": True,
            },
            {
                "text_jp": "キャンプで火を起こしました。",
                "furigana": "キャンプでひをおこしました。",
                "romaji": "Kyanpu de hi o okoshimashita.",
                "translation": "We started a fire at the campsite.",
                "is_correct": True,
            },
            {
                "text_jp": "川のそばで遊びました。",  # 川 distractor
                "furigana": "かわのそばであそびました。",
                "romaji": "Kawa no soba de asobimashita.",
                "translation": "I played by the river.",
                "is_correct": False,
            },
            {
                "text_jp": "毎日学校に行きます。",  # 日 distractor
                "furigana": "まいにちがっこうにいきます。",
                "romaji": "Mainichi gakkō ni ikimasu.",
                "translation": "I go to school every day.",
                "is_correct": False,
            },
        ],
    },
    {
        "character": "水",
        "meanings": ["water", "Wednesday"],
        "onyomi": "スイ",
        "kunyomi": "みず",
        "romaji": "sui / mizu",
        "jlpt_level": "N5",
        "sentences": [
            {
                "text_jp": "水を一杯ください。",
                "furigana": "みずをいっぱいください。",
                "romaji": "Mizu o ippai kudasai.",
                "translation": "Please give me a glass of water.",
                "is_correct": True,
            },
            {
                "text_jp": "水曜日は学校が早く終わります。",
                "furigana": "すいようびはがっこうがはやくおわります。",
                "romaji": "Suiyōbi wa gakkō ga hayaku owarimasu.",
                "translation": "School ends early on Wednesdays.",
                "is_correct": True,
            },
            {
                "text_jp": "魚は水の中に住んでいます。",
                "furigana": "さかなはみずのなかにすんでいます。",
                "romaji": "Sakana wa mizu no naka ni sunde imasu.",
                "translation": "Fish live in the water.",
                "is_correct": True,
            },
            {
                "text_jp": "火を使うときは気をつけてください。",  # 火 distractor
                "furigana": "ひをつかうときはきをつけてください。",
                "romaji": "Hi o tsukau toki wa ki o tsukete kudasai.",
                "translation": "Please be careful when using fire.",
                "is_correct": False,
            },
            {
                "text_jp": "今夜は月がきれいです。",  # 月 distractor
                "furigana": "こんやはつきがきれいです。",
                "romaji": "Konya wa tsuki ga kirei desu.",
                "translation": "The moon is beautiful tonight.",
                "is_correct": False,
            },
        ],
    },
    {
        "character": "木",
        "meanings": ["tree", "wood", "Thursday"],
        "onyomi": "ボク、モク",
        "kunyomi": "き、こ-",
        "romaji": "boku, moku / ki",
        "jlpt_level": "N5",
        "sentences": [
            {
                "text_jp": "公園に大きな木があります。",
                "furigana": "こうえんにおおきなきがあります。",
                "romaji": "Kōen ni ōkina ki ga arimasu.",
                "translation": "There is a big tree in the park.",
                "is_correct": True,
            },
            {
                "text_jp": "木曜日に友達と映画を見ます。",
                "furigana": "もくようびにともだちとえいがをみます。",
                "romaji": "Mokuyōbi ni tomodachi to eiga o mimasu.",
                "translation": "I'll watch a movie with a friend on Thursday.",
                "is_correct": True,
            },
            {
                "text_jp": "この机は木でできています。",
                "furigana": "このつくえはきでできています。",
                "romaji": "Kono tsukue wa ki de dekite imasu.",
                "translation": "This desk is made of wood.",
                "is_correct": True,
            },
            {
                "text_jp": "林の中を散歩しました。",  # 林 distractor
                "furigana": "はやしのなかをさんぽしました。",
                "romaji": "Hayashi no naka o sanpo shimashita.",
                "translation": "I took a walk in the grove.",
                "is_correct": False,
            },
            {
                "text_jp": "水を一杯ください。",  # 水 distractor
                "furigana": "みずをいっぱいください。",
                "romaji": "Mizu o ippai kudasai.",
                "translation": "Please give me a glass of water.",
                "is_correct": False,
            },
        ],
    },
    {
        "character": "人",
        "meanings": ["person", "human", "people"],
        "onyomi": "ジン、ニン",
        "kunyomi": "ひと、-り、-と",
        "romaji": "jin, nin / hito",
        "jlpt_level": "N5",
        "sentences": [
            {
                "text_jp": "あの人は誰ですか？",
                "furigana": "あのひとはだれですか？",
                "romaji": "Ano hito wa dare desu ka?",
                "translation": "Who is that person?",
                "is_correct": True,
            },
            {
                "text_jp": "この町には親切な人が多いです。",
                "furigana": "このまちにはしんせつなひとがおおいです。",
                "romaji": "Kono machi ni wa shinsetsu na hito ga ōi desu.",
                "translation": "There are many kind people in this town.",
                "is_correct": True,
            },
            {
                "text_jp": "日本人の友達がいます。",
                "furigana": "にほんじんのともだちがいます。",
                "romaji": "Nihonjin no tomodachi ga imasu.",
                "translation": "I have a Japanese friend.",
                "is_correct": True,
            },
            {
                "text_jp": "公園に大きな木があります。",  # 木 distractor
                "furigana": "こうえんにおおきなきがあります。",
                "romaji": "Kōen ni ōkina ki ga arimasu.",
                "translation": "There is a big tree in the park.",
                "is_correct": False,
            },
            {
                "text_jp": "富士山はとても高いです。",  # 山 distractor
                "furigana": "ふじさんはとてもたかいです。",
                "romaji": "Fujisan wa totemo takai desu.",
                "translation": "Mt. Fuji is very tall.",
                "is_correct": False,
            },
        ],
    },
    {
        "character": "口",
        "meanings": ["mouth", "opening", "entrance"],
        "onyomi": "コウ、ク",
        "kunyomi": "くち",
        "romaji": "kō, ku / kuchi",
        "jlpt_level": "N5",
        "sentences": [
            {
                "text_jp": "口を大きく開けてください。",
                "furigana": "くちをおおきくあけてください。",
                "romaji": "Kuchi o ōkiku akete kudasai.",
                "translation": "Please open your mouth wide.",
                "is_correct": True,
            },
            {
                "text_jp": "入り口はどこですか？",
                "furigana": "いりぐちはどこですか？",
                "romaji": "Iriguchi wa doko desu ka?",
                "translation": "Where is the entrance?",
                "is_correct": True,
            },
            {
                "text_jp": "口で説明するより書いた方がいいです。",
                "furigana": "くちでせつめいするよりかいたほうがいいです。",
                "romaji": "Kuchi de setsumei suru yori kaita hō ga ii desu.",
                "translation": "It is better to write it down than to explain verbally.",
                "is_correct": True,
            },
            {
                "text_jp": "あの人は誰ですか？",  # 人 distractor
                "furigana": "あのひとはだれですか？",
                "romaji": "Ano hito wa dare desu ka?",
                "translation": "Who is that person?",
                "is_correct": False,
            },
            {
                "text_jp": "目が痛いので病院に行きます。",  # 目 distractor
                "furigana": "めがいたいのでびょういんにいきます。",
                "romaji": "Me ga itai no de byōin ni ikimasu.",
                "translation": "My eyes hurt, so I'll go to the hospital.",
                "is_correct": False,
            },
        ],
    },
    {
        "character": "目",
        "meanings": ["eye", "look", "ordinal marker"],
        "onyomi": "モク、ボク",
        "kunyomi": "め、-め、ま-",
        "romaji": "moku, boku / me",
        "jlpt_level": "N5",
        "sentences": [
            {
                "text_jp": "目が痛いので病院に行きます。",
                "furigana": "めがいたいのでびょういんにいきます。",
                "romaji": "Me ga itai no de byōin ni ikimasu.",
                "translation": "My eyes hurt, so I'll go to the hospital.",
                "is_correct": True,
            },
            {
                "text_jp": "二つ目の角を右に曲がってください。",
                "furigana": "ふたつめのかどをみぎにまがってください。",
                "romaji": "Futatsume no kado o migi ni magatte kudasai.",
                "translation": "Please turn right at the second corner.",
                "is_correct": True,
            },
            {
                "text_jp": "彼は青い目をしています。",
                "furigana": "かれはあおいめをしています。",
                "romaji": "Kare wa aoi me o shite imasu.",
                "translation": "He has blue eyes.",
                "is_correct": True,
            },
            {
                "text_jp": "口を大きく開けてください。",  # 口 distractor
                "furigana": "くちをおおきくあけてください。",
                "romaji": "Kuchi o ōkiku akete kudasai.",
                "translation": "Please open your mouth wide.",
                "is_correct": False,
            },
            {
                "text_jp": "日本語を勉強しています。",  # 日 distractor
                "furigana": "にほんごをべんきょうしています。",
                "romaji": "Nihongo o benkyō shite imasu.",
                "translation": "I am studying Japanese.",
                "is_correct": False,
            },
        ],
    },
]
