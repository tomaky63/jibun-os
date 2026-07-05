export type Driver = "D" | "I" | "H" | "M";
export type Charge = "C" | "S";
export type ProcessAxis = "O" | "F";
export type TypeSlug =
  | "sol" | "comet" | "lighthouse" | "meteor"
  | "prism" | "spark" | "polaris" | "nebula"
  | "lantern" | "bonfire" | "luna" | "hotaru"
  | "kaleido" | "hanabi" | "crystal" | "aurora";

export type Family = "前進系" | "探究系" | "共鳴系" | "創造系";

export interface OsType {
  slug: TypeSlug;
  driver: Driver;
  charge: Charge;
  process: ProcessAxis;
  code: string;
  codename: string;
  nameJa: string;
  epithet: string;
  catchcopy: string;
  family: Family;
  colorPrimary: string;
  colorSecondary: string;
  effect: string;
  summary: string;
  strengths: string[];
  shadows: string[];
  operatingMode: string;
  loveFlavor: string;
}

export const FAMILY_LABEL: Record<Driver, Family> = {
  D: "前進系",
  I: "探究系",
  H: "共鳴系",
  M: "創造系",
};

export const DRIVER_LABEL: Record<Driver, string> = {
  D: "前進",
  I: "探究",
  H: "共鳴",
  M: "創造",
};

export const TYPES: OsType[] = [
  {
    slug: "sol", driver: "D", charge: "C", process: "O", code: "D-CO",
    codename: "SOL", nameJa: "太陽", epithet: "みんなを進ませる旗振り役",
    catchcopy: "あなたが動くと、まわりが動き出す。",
    family: "前進系", colorPrimary: "#FFB300", colorSecondary: "#FF8A50", effect: "halo",
    summary: "目標を掲げ、計画に落とし、人を巻き込んで進める天性のキャプテン。「とりあえずやってみよう」ではなく「こうやって勝とう」と言う。あなたがいるチームは、なぜか前に進む。",
    strengths: ["決めて進める推進力", "人を巻き込む説得力", "目標から逆算する段取り力"],
    shadows: ["仕切りすぎて人の主体性を奪いがち", "成果の出ない停滞期に苛立ちが漏れる", "「弱音を吐く」機能が実装されていない"],
    operatingMode: "先頭に立つと最大出力",
    loveFlavor: "そしてSOLのあなたは、愛情も「ちゃんと応えたい」人。もらった愛に成果で返そうとしなくていいのです。",
  },
  {
    slug: "comet", driver: "D", charge: "C", process: "F", code: "D-CF",
    codename: "COMET", nameJa: "彗星", epithet: "勢いで道をひらく突破者",
    catchcopy: "考えるより先に、もう走ってる。",
    family: "前進系", colorPrimary: "#FF6B35", colorSecondary: "#FFD180", effect: "streaks",
    summary: "会議で決まる前に、もう試している。初速と度胸で道なき場所に道を作るタイプ。熱があるうちに動くから成功も失敗も早く、結果として誰よりも遠くまで行く。",
    strengths: ["圧倒的な初速と行動量", "断られてもへこまない回復力", "人の懐に飛び込む勢い"],
    shadows: ["詰めと後処理が甘い", "軌道に乗ると急に飽きる", "待たされると露骨に失速する"],
    operatingMode: "初速で最大出力",
    loveFlavor: "そしてCOMETのあなたは、愛の伝え方に勢いが出る人。速度と愛の深さは別物だと、相手に伝えておきましょう。",
  },
  {
    slug: "lighthouse", driver: "D", charge: "S", process: "O", code: "D-SO",
    codename: "LIGHTHOUSE", nameJa: "灯台", epithet: "黙々と積み上げる完遂者",
    catchcopy: "派手じゃない。でも、絶対に消えない。",
    family: "前進系", colorPrimary: "#F4D06F", colorSecondary: "#8C9EFF", effect: "beam",
    summary: "自分で決めた基準まで、誰に見られていなくても積み上げる。騒がず、サボらず、締切の前に終わらせる。周りが気づいたときには、いつの間にかとんでもない高さの塔が建っている。",
    strengths: ["約束と品質を絶対に守る完遂力", "孤独に強い自己管理能力", "長期戦での圧倒的な安定感"],
    shadows: ["人に頼る・任せるのが下手", "自分の基準を人にも課して疲れる", "成果のアピールをしないので損をする"],
    operatingMode: "無人環境で安定稼働",
    loveFlavor: "そしてLIGHTHOUSEのあなたは、表現より継続で愛す人。「続いていること」を時々言葉に翻訳してあげてください。",
  },
  {
    slug: "meteor", driver: "D", charge: "S", process: "F", code: "D-SF",
    codename: "METEOR", nameJa: "流星", epithet: "一点突破のハンター",
    catchcopy: "群れない。狙ったものは、外さない。",
    family: "前進系", colorPrimary: "#FF4E50", colorSecondary: "#FFB300", effect: "meteor",
    summary: "目標が決まった瞬間の集中力は16タイプ最強。群れず、媚びず、最短距離で獲りに行く。ただしロックオンしていないときは、驚くほど省エネモード。",
    strengths: ["勝負どころの瞬発力と集中力", "他人の目に依存しない独立性", "リスクを取れる胆力"],
    shadows: ["チームプレイと報連相が苦手", "興味のない仕事へのムラが激しい", "指示・管理されると急速にやる気を失う"],
    operatingMode: "ロックオン時のみ全開",
    loveFlavor: "そしてMETEORのあなたは、自由なままで愛せる人。「離れていても繋がっている」の説明書を相手に渡しておくこと。",
  },
  {
    slug: "prism", driver: "I", charge: "C", process: "O", code: "I-CO",
    codename: "PRISM", nameJa: "プリズム", epithet: "要点を照らす参謀",
    catchcopy: "ややこしい話を、ぜんぶ分解して光に変える。",
    family: "探究系", colorPrimary: "#4FC3F7", colorSecondary: "#B794FF", effect: "prisms",
    summary: "ごちゃごちゃの議論を聞きながら、頭の中でホワイトボードが動いている。複雑な問題を分解し、「要するにこういうことですよね」で全員の視界をクリアにする参謀。",
    strengths: ["構造化と言語化の速さ", "立場の違う人の間を翻訳する力", "感情に流されないバランス感覚"],
    shadows: ["正しさで人を詰めてしまうことがある", "分析が終わらず決断が遅れる", "「気持ちの話」への対応が後回しになる"],
    operatingMode: "会話中にクロック上昇",
    loveFlavor: "そしてPRISMのあなたは、愛も対話で確かめたい人。ただし相手の「うまく言えない愛」も有効票として数えること。",
  },
  {
    slug: "spark", driver: "I", charge: "C", process: "F", code: "I-CF",
    codename: "SPARK", nameJa: "火花", epithet: "議論で燃える知的触媒",
    catchcopy: "その一言で、会議も恋も動き出す。",
    family: "探究系", colorPrimary: "#00B0FF", colorSecondary: "#64FFDA", effect: "sparks",
    summary: "会話の中でしか出ない火花がある。誰かの発言に「それ、逆に言うと…」と打ち返した瞬間、場の温度が上がる。新しい情報と面白い人が、あなたの燃料。",
    strengths: ["頭の回転と切り返しの速さ", "情報収集のアンテナの広さ", "停滞した場に火をつける触媒力"],
    shadows: ["言わなくていい一言まで言う", "一つのことを腰を据えて続けるのが苦手", "静かな環境で燃料切れを起こす"],
    operatingMode: "議論中にオーバークロック",
    loveFlavor: "そしてSPARKのあなたは、会話の熱=愛の熱の人。静かな夜の沈黙にも、別種の愛が流れていることをお忘れなく。",
  },
  {
    slug: "polaris", driver: "I", charge: "S", process: "O", code: "I-SO",
    codename: "POLARIS", nameJa: "北極星", epithet: "ぶれない基準を持つ研究者",
    catchcopy: "流行が何周しても、あなたの基準はぶれない。",
    family: "探究系", colorPrimary: "#8C9EFF", colorSecondary: "#E6E9F0", effect: "polestar",
    summary: "自分の中に座標系がある。流行にも多数決にも動かされず、納得できるまで深く掘る。時間はかかるが、あなたの出す答えは10年後も使える。",
    strengths: ["専門を深く掘り続ける持久力", "正確さと一貫性への信頼", "雑音に流されない判断軸"],
    shadows: ["方針転換への腰が重い", "「浅い議論」への忍耐が切れやすい", "正論の刃で人を切ってしまう"],
    operatingMode: "長時間駆動に最適化",
    loveFlavor: "そしてPOLARISのあなたは、不変で愛を証明する人。変わらないことは、時々報告しないと観測されません。",
  },
  {
    slug: "nebula", driver: "I", charge: "S", process: "F", code: "I-SF",
    codename: "NEBULA", nameJa: "星雲", epithet: "頭の中に宇宙がある仮説家",
    catchcopy: "頭の中に、まだ名前のない宇宙がある。",
    family: "探究系", colorPrimary: "#5C6BC0", colorSecondary: "#B794FF", effect: "nebula",
    summary: "散歩中も入浴中も、頭の中では仮説が生まれ続けている。人と違う角度から世界を見る才能があり、脱線こそがあなたの発見のルート。問題は、締切がこの宇宙の外にあること。",
    strengths: ["発想の飛距離と独自の視点", "抽象化して本質を掴む力", "一人で考え続けられる知的体力"],
    shadows: ["締切と定型手続きが宇宙の外", "説明を省いて「伝わらない」", "実務の詰めで急に失速する"],
    operatingMode: "散歩中にバックグラウンド演算",
    loveFlavor: "そしてNEBULAのあなたは、世界を共有することが愛の人。頭の中の愛は、外に出して初めて相手のものになります。",
  },
  {
    slug: "lantern", driver: "H", charge: "C", process: "O", code: "H-CO",
    codename: "LANTERN", nameJa: "ランタン", epithet: "場を照らす世話役",
    catchcopy: "あなたがいる場所は、なぜかあったかい。",
    family: "共鳴系", colorPrimary: "#FFB74D", colorSecondary: "#FFE0B2", effect: "halo",
    summary: "新人が困っていることに一番早く気づくのはあなた。人の状態を察知し、仕組みと気配りでチームを回す。あなたが休んだ日、職場は初めてあなたの仕事量に気づく。",
    strengths: ["人の変化に気づく観察力", "調整・根回し・段取りの巧さ", "「この人には話せる」と思わせる信頼感"],
    shadows: ["NOが言えず限界まで抱える", "自分のケアが常に最後回し", "感謝されないと静かに消耗する"],
    operatingMode: "誰かのそばで高効率運転",
    loveFlavor: "そしてLANTERNのあなたは、世話が愛の言語の人。「してあげる」と同じ量の「してもらう」を許可しましょう。",
  },
  {
    slug: "bonfire", driver: "H", charge: "C", process: "F", code: "H-CF",
    codename: "BONFIRE", nameJa: "焚き火", epithet: "人が集まるムードメーカー",
    catchcopy: "気づけばみんな、あなたの周りに集まってる。",
    family: "共鳴系", colorPrimary: "#FF8A50", colorSecondary: "#FFD54F", effect: "embers",
    summary: "あなたが笑うと場の温度が2度上がる。計画とか役割とかの前に、まず空気をあたためる。人見知り同士が、あなたを介してだけは話せる——そういう不思議な引力の持ち主。",
    strengths: ["場の空気を一瞬であたためる力", "初対面との距離を溶かす親しみやすさ", "人の感情への素直な共感"],
    shadows: ["空気を読みすぎて自分の意見が消える", "事務・数字・締切が後回し", "一人になると急に電池が切れる"],
    operatingMode: "人が集まるほど出力上昇",
    loveFlavor: "そしてBONFIREのあなたは、体温で愛を伝える人。寂しさは弱さではなく、あなたの愛の燃費の話です。",
  },
  {
    slug: "luna", driver: "H", charge: "S", process: "O", code: "H-SO",
    codename: "LUNA", nameJa: "月", epithet: "静かに支える番人",
    catchcopy: "騒がない。でも、ずっとそこにいてくれる。",
    family: "共鳴系", colorPrimary: "#E6E9F0", colorSecondary: "#8C9EFF", effect: "moon",
    summary: "目立つことは苦手。でも、あなたが毎日きちんと回している仕事の上に、みんなの「いつも通り」が成り立っている。声の大きい人が去った後も、あなたは同じ場所で照らし続ける。",
    strengths: ["誠実さと正確さへの絶対的な信頼", "感情の起伏に左右されない安定感", "静かな観察眼(実は全部見ている)"],
    shadows: ["主張しないので便利に使われがち", "急な変化・無茶振りに強いストレス", "不満を溜めて、ある日静かに心を閉じる"],
    operatingMode: "静音モード常時ON",
    loveFlavor: "そしてLUNAのあなたは、静けさで愛す人。あなたの「そばにいる」は、言葉一つ添えると倍の輝度で届きます。",
  },
  {
    slug: "hotaru", driver: "H", charge: "S", process: "F", code: "H-SF",
    codename: "HOTARU", nameJa: "蛍", epithet: "感受性のアンテナを持つ観察者",
    catchcopy: "小さな光ほど、暗闇ではよく見える。",
    family: "共鳴系", colorPrimary: "#A8E063", colorSecondary: "#64FFDA", effect: "fireflies",
    summary: "人の声のトーンが昨日と違うこと、既読の速度が変わったこと——あなたは全部受信している。その感受性は才能であり、同時に、あなたが人の3倍疲れる理由でもある。",
    strengths: ["人の痛みへの深い共感力", "言葉にならないものを言葉にする表現力", "誰も気づかない小さな変化への気づき"],
    shadows: ["刺激と感情を受信しすぎて消耗が激しい", "頼まれると断れない", "自己否定ループに入りやすい"],
    operatingMode: "低刺激環境で高感度",
    loveFlavor: "そしてHOTARUのあなたは、察する力で愛す人。同じ精度で察してもらえなくても、愛がないわけではありません。",
  },
  {
    slug: "kaleido", driver: "M", charge: "C", process: "O", code: "M-CO",
    codename: "KALEIDO", nameJa: "万華鏡", epithet: "世界観を設計する演出家",
    catchcopy: "世界の見せ方を、デザインする人。",
    family: "創造系", colorPrimary: "#AB47BC", colorSecondary: "#EC407A", effect: "kaleido",
    summary: "「なんかいい感じにして」を、ちゃんと設計図にできる人。色・言葉・順番・余白——すべてに意図を持たせ、バラバラの素材を一つの世界観に束ねる。あなたが関わったものは「ちゃんとしてる」ではなく「素敵」と言われる。",
    strengths: ["美意識と構成力の両立", "コンセプトで人を束ねる編集力", "「伝わる見せ方」の設計力"],
    shadows: ["細部への譲れなさで消耗する", "美意識のない意思決定に本気で傷つく", "手柄が「裏方」扱いされると静かに萎える"],
    operatingMode: "美しい環境で性能向上",
    loveFlavor: "そしてKALEIDOのあなたは、演出に愛を込める人。相手が気づかなくても、その美意識は関係の資産になっています。",
  },
  {
    slug: "hanabi", driver: "M", charge: "C", process: "F", code: "M-CF",
    codename: "HANABI", nameJa: "花火", epithet: "瞬間を爆発させる表現者",
    catchcopy: "一瞬で心を撃ち抜く、それがあなたの仕事。",
    family: "創造系", colorPrimary: "#EC407A", colorSecondary: "#FFD54F", effect: "fireworks",
    summary: "準備8割の世界で、あなたは本番の一瞬に全部を懸けるタイプ。プレゼン、ステージ、投稿がバズる瞬間——「うわっ」と人の心が動く音が、あなたの生きがい。打ち上げた後、誰よりも静かに燃え尽きていることは、あまり知られていない。",
    strengths: ["人の心を掴む瞬発的な表現力", "本番に強い度胸", "場を祝祭に変える華"],
    shadows: ["打ち上げ後の燃え尽きが深い", "地味な継続と事務作業が天敵", "反応がないと自分の価値を疑い始める"],
    operatingMode: "本番で瞬間最大風速",
    loveFlavor: "そしてHANABIのあなたは、愛を打ち上げる人。静かな期間は失速ではなく、次の花火の仕込みです。",
  },
  {
    slug: "crystal", driver: "M", charge: "S", process: "O", code: "M-SO",
    codename: "CRYSTAL", nameJa: "結晶", epithet: "細部に美を宿らせる職人",
    catchcopy: "時間をかけたものだけが持つ、透明度。",
    family: "創造系", colorPrimary: "#B39DDB", colorSecondary: "#E6E9F0", effect: "glints",
    summary: "誰も気づかない0.5mmのズレを直すのは、誰かのためではなく自分が許せないから。速さを競う時代に、あなたは純度で勝負する。あなたの作ったものは、説明がなくても「丁寧に作られたもの」だと伝わる。",
    strengths: ["細部への執念と精度", "静かに没頭する集中力", "時間に劣化しないアウトプットの質"],
    shadows: ["速度優先の現場と衝突する", "「まだ出せない」で締切が溶ける", "こだわりを言語化せず孤立しがち"],
    operatingMode: "集中時は省電力・高精度",
    loveFlavor: "そしてCRYSTALのあなたは、手間ひまが愛の人。渡すときに「これは愛情表現です」とラベルを付けていい。",
  },
  {
    slug: "aurora", driver: "M", charge: "S", process: "F", code: "M-SF",
    codename: "AURORA", nameJa: "オーロラ", epithet: "ひとり空想の発明家",
    catchcopy: "誰も見たことのない光は、あなたの中から出る。",
    family: "創造系", colorPrimary: "#64FFDA", colorSecondary: "#7C4DFF", effect: "aurora",
    summary: "あなたの頭の中には、他の誰のものとも違う世界が広がっている。それを取り出す方法(絵・文章・音・コード・企画)を見つけたとき、あなたは静かに無敵になる。社会の定型フォーマットが苦手なのは、欠陥ではなく仕様。",
    strengths: ["ゼロから生む独創性", "独自の感性と世界観", "好きな領域での異常な集中力"],
    shadows: ["気分とコンディションに出力が左右される", "手続き・書類・定例が本気で苦手", "わかってもらう努力を放棄しがち"],
    operatingMode: "深夜に高出力(朝は低電圧)",
    loveFlavor: "そしてAURORAのあなたは、たまにしか出ない極光で愛す人。頻度ではなく深度で愛を測る相手を選びましょう。",
  },
];

export const TYPE_BY_SLUG: Record<TypeSlug, OsType> = Object.fromEntries(
  TYPES.map((t) => [t.slug, t])
) as Record<TypeSlug, OsType>;

export function findType(driver: Driver, charge: Charge, process: ProcessAxis): OsType {
  return TYPES.find(
    (t) => t.driver === driver && t.charge === charge && t.process === process
  )!;
}
