export type QuestionAxis =
  | "charge" | "process" | "D" | "I" | "H" | "M"
  | "distance" | "channel" | "aux";

export interface Question {
  id: string;
  text: string;
  axis: QuestionAxis;
  reversed: boolean;
  channel?: 0 | 1 | 2; // 0:言葉 1:行動 2:時間
}

export const QUESTIONS: Record<string, Question> = {
  C1: { id: "C1", axis: "charge", reversed: false, text: "週末に人と会う予定が入っていると、それだけで少し元気が出る" },
  C2: { id: "C2", axis: "charge", reversed: true, text: "にぎやかな集まりのあとは、楽しかったとしても、どっと疲れが出る" },
  C3: { id: "C3", axis: "charge", reversed: false, text: "悩みごとは、誰かに話しているうちに整理されていくことが多い" },
  C4: { id: "C4", axis: "charge", reversed: true, text: "丸一日誰とも話さない日は、つらいというより、むしろ回復する" },
  C5: { id: "C5", axis: "charge", reversed: false, text: "初対面の人が多い場でも、エネルギーをもらえることのほうが多い" },
  C6: { id: "C6", axis: "charge", reversed: true, text: "予定がまったくない休日が続くと、心からほっとする" },
  C7: { id: "C7", axis: "charge", reversed: false, text: "職場や学校に雑談できる相手がいないと、調子が出ない" },
  C8: { id: "C8", axis: "charge", reversed: true, text: "本気で集中したいときは、通知を切って完全に一人になりたい" },
  P1: { id: "P1", axis: "process", reversed: false, text: "旅行は、事前に行く場所や順番を決めておくほうが楽しめる" },
  P2: { id: "P2", axis: "process", reversed: true, text: "締切ぎりぎりの一気の集中で、むしろいい仕事をしてきたと思う" },
  P3: { id: "P3", axis: "process", reversed: false, text: "決まっていた予定が急に変わると、内心かなりストレスを感じる" },
  P4: { id: "P4", axis: "process", reversed: true, text: "まず手を動かしてみて、やりながら形にしていくほうが得意だ" },
  P5: { id: "P5", axis: "process", reversed: false, text: "ToDoリストや手帳・カレンダーでの管理が好き、または欠かせない" },
  P6: { id: "P6", axis: "process", reversed: true, text: "予想外の展開が起きたとき、面倒くささよりワクワクのほうが大きい" },
  P7: { id: "P7", axis: "process", reversed: false, text: "仕事や作業は、段取りを決めてから始めたい" },
  P8: { id: "P8", axis: "process", reversed: true, text: "ルールや手順は「目安」であって、状況に合わせて変えていいと思う" },
  D1: { id: "D1", axis: "D", reversed: false, text: "「勝ち負け」や「目標達成」がはっきりあるほうが燃える" },
  D2: { id: "D2", axis: "D", reversed: false, text: "進みの遅い会議や作業に、人一倍もどかしさを感じる" },
  D3: { id: "D3", axis: "D", reversed: false, text: "成果が数字や結果ではっきり見える仕事のほうが好きだ" },
  D4: { id: "D4", axis: "D", reversed: false, text: "同世代より早く成長したい・上に行きたいという気持ちが強い" },
  I1: { id: "I1", axis: "I", reversed: false, text: "「なぜそうなるのか」が分からないままだと、気持ち悪い" },
  I2: { id: "I2", axis: "I", reversed: false, text: "興味のあるテーマは、誰に頼まれなくても深く調べてしまう" },
  I3: { id: "I3", axis: "I", reversed: false, text: "感情のこもった訴えより、筋の通った説明のほうに納得する" },
  I4: { id: "I4", axis: "I", reversed: false, text: "新しいことを理解できた瞬間に、強い快感がある" },
  H1: { id: "H1", axis: "H", reversed: false, text: "誰かの役に立てたと実感できた日は、疲れていても満たされる" },
  H2: { id: "H2", axis: "H", reversed: false, text: "その場の空気や、人の機嫌の変化に、人より早く気づくほうだ" },
  H3: { id: "H3", axis: "H", reversed: false, text: "競争に勝つことより、チームの雰囲気がいいことのほうが大事だ" },
  H4: { id: "H4", axis: "H", reversed: false, text: "身近な人間関係がぎくしゃくしていると、他のことが手につかない" },
  M1: { id: "M1", axis: "M", reversed: false, text: "自分にしか作れないもの・自分らしい表現を、何かの形で残したい" },
  M2: { id: "M2", axis: "M", reversed: false, text: "決められた通りにやるだけの作業は、心が死ぬ感じがする" },
  M3: { id: "M3", axis: "M", reversed: false, text: "デザイン・言葉選び・音など、細部の「好き嫌い」がはっきりある" },
  M4: { id: "M4", axis: "M", reversed: false, text: "ふと思いついたアイデアをメモしたり、形にしたりする習慣がある" },
  L1: { id: "L1", axis: "distance", reversed: false, text: "恋人とは、できれば毎日なにかしら連絡を取り合いたい" },
  L2: { id: "L2", axis: "distance", reversed: true, text: "どんなに大切な人とでも、一人の時間や自分の世界は必ず確保したい" },
  L3: { id: "L3", axis: "distance", reversed: false, text: "特別なことをしなくても「なんとなく一緒にいる」時間が好きだ" },
  E1: { id: "E1", axis: "channel", reversed: false, channel: 0, text: "「好き」や「ありがとう」は、言葉にして伝えたいし、伝えてほしい" },
  E2: { id: "E2", axis: "channel", reversed: false, channel: 1, text: "愛情は、言葉より行動(手伝う・送り迎え・差し入れなど)に表れると思う" },
  E3: { id: "E3", axis: "channel", reversed: false, channel: 2, text: "何をするかより「一緒に時間を過ごすこと」自体が愛情表現だと思う" },
  X1: { id: "X1", axis: "aux", reversed: false, text: "強いストレスがかかったとき、人に話すより、まず一人になりたくなる" },
  X2: { id: "X2", axis: "aux", reversed: false, text: "いまの生活の「やるべきこと」と「自分の時間」のバランスに満足している" },
};

// 04 §7 の固定出題順
export const QUESTION_ORDER: string[] = [
  "C1", "P1", "D1", "I1", "H1", "M1",
  "C2", "P2", "D2", "I2", "H2", "M2",
  "C3", "P3", "D3", "I3", "H3", "M3",
  "C4", "P4", "D4", "I4", "H4", "M4",
  "C5", "P5", "L1", "E1", "C6", "P6",
  "L2", "E2", "C7", "P7", "L3", "E3",
  "C8", "P8", "X1", "X2",
];

export const LIKERT_LABELS = [
  "そう思わない",
  "あまりそう思わない",
  "どちらともいえない",
  "ややそう思う",
  "そう思う",
];
