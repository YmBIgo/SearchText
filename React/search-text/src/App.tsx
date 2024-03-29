import React from 'react';

import SearchText from "./components/SearchText"

function App() {
  return (
    <div className="App">
      <SearchText>
      {/* Search Text only can handle HTML indent of 2 */}
      <span>
      「政治家の皆さんはそれぞれに日本のことを考えて、社会を良くしようとしているはずなのに、貶め合うような論争ばかりが目について〝怖い〟イメージです」

      　小誌の取材に応じた早稲田大学の女子学生は日本の「政治」に対する印象をこう話す。彼女の言葉は現代の若者の声を代弁しているとも言える。

      　55.93％と戦後3番目に低い投票率を記録した昨年10月の衆院選。この選挙における10代～30代の投票率はいずれも全体平均を10％～20％近く下回り、実際に投票した人の割合は10代～30代を合わせても全体の2割に満たない（下図）。政治に〝怖さ〟を感じているとすれば、若い世代が距離を置くのも不思議ではない。

      30代以下の投票者は20％にも満たない

      　「
        <a href="https://google.co.jp">若者の投票率低下</a>
        」や「
        <a href="https://bing.com">若者の政治離れ</a>
        」は何をもたらすのだろうか。世代間格差を研究する関東学院大学の島澤諭教授は「政治的影響力が強く、経済的弱者と見なされがちな高齢世代に向けた政策が優遇される〝シルバーファースト主義〟に陥る可能性が高まる」と指摘する。それが行き過ぎれば公共施設の維持や教育、少子化対策をはじめとする未来への投資の優先順位が相対的に下がり、若者世代や将来世代に大きなツケが回ることになる。

      　「若者目線での社会の改善が期待できなくなるため、『多様性』が失われ、自分と異なる意見を持つ人に対する『寛容性』の維持も難しくなり、民主主義の基盤が揺らぐことになる」。こう語るのは近代日本の政党政治に詳しい帝京大学の小山俊樹教授だ。

      　政治学が専門の東北大学・河村和徳准教授も同様の懸念を示したうえで「世界には、民主主義的な制度の下で当選したはずの指導者が任期の撤廃や非人道的な弾圧に走るなど、権威主義国家に近づく例もある。こうした予兆があるとき、若者が積極的に参加していれば、長期間抗うことができる。つまり、独裁政治への抑止力にもなる」と解説する。
      </span>
      </SearchText>
    </div>
  );
}

export default App;
