
import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguagePicker from '../components/common/LanguagePicker';

interface MonetizationPageProps {
  onNavigateHome: () => void;
  onNavigateToPrivacy: () => void;
  onNavigateToTerms: () => void;
  onNavigateToAbout: () => void;
  onNavigateToContact: () => void;
  onNavigateToMonetization: () => void;
}

interface PlatformReportTableProps {
  headers: string[];
  rows: (string[])[];
}

const PlatformReportTable: React.FC<PlatformReportTableProps> = ({ headers, rows }) => {
  return (
    <div className="overflow-x-auto my-6 shadow-lg rounded-lg border border-border">
      <table className="min-w-full divide-y divide-border bg-secondary">
        <thead className="bg-muted">
          <tr>
            {headers.map((header, index) => (
              <th key={index} scope="col" className="px-4 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-accent/30 transition-colors">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 text-sm text-foreground whitespace-pre-wrap align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


const MonetizationPage: React.FC<MonetizationPageProps> = ({ 
  onNavigateHome,
  onNavigateToPrivacy,
  onNavigateToTerms,
  onNavigateToAbout,
  onNavigateToContact,
  onNavigateToMonetization
}) => {
  const { t } = useTranslation();

  const englishPlatformTable1Data = {
    headers: ["Platform", "Tags", "Pros", "Cons"],
    rows: [
      ["WebNovel", "International platform, Asian themes primarily", "Large user base, high income for top authors (e.g., C$170k/year), offers royalties (28%), click share, and bonuses", "Contract terms criticized as exploitative, platform owns copyright, low royalties, payment delays possible"],
      ["Radish", "Serial fiction, romance prominent", "Top authors can earn up to $13k/month, readers unlock chapters with coins", "Niche platform, genre limitations, complex payment terms, income volatility"],
      ["Wattpad (Originals Program)", "Young reader dominated, social-driven", "Over 85M users, publishing and film adaptation opportunities, paid chapter monetization", "Only a few works selected for Originals, high competition"]
    ]
  };

  const englishPlatformTable2Data = {
    headers: ["Platform", "Tags", "Pros", "Cons"],
    rows: [
      ["Royal Road", "Fantasy and LitRPG community", "No publishing cost, active community, high external monetization potential (e.g., $15k/month via Patreon)", "No direct monetization, requires self-setup of external channels"],
      ["Scribble Hub", "Niche free platform", "No contract restrictions, community-driven, good for beginners", "No direct monetization, smaller reader base"]
    ]
  };
  
  const englishPlatformTable3Data = {
    headers: ["Platform", "Tags", "Pros", "Cons"],
    rows: [
      ["Tapas", "Diversified monetization, comics & novels", "Ads (30% share), tipping (60-85%), support program, authors retain copyright", "Potentially lower income, smaller reader base"]
    ]
  };


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-secondary shadow-xl sticky top-0 z-50 border-b border-border mb-12">
        <div className="container mx-auto flex items-center justify-between">
          <button onClick={onNavigateHome} className="text-2xl font-extrabold text-primary hover:text-primary/90 transition-colors tracking-tight">
            {t('appTitle')}
          </button>
          <button onClick={onNavigateHome} className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-secondary active:scale-[0.98] transition-all duration-200 ease-in-out">
            {t('staticPages.backToHome')}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow w-full max-w-5xl">
        <div className="bg-card p-6 md:p-8 rounded-xl shadow-2xl border border-border">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mb-10 text-center tracking-tight">
            {t('monetizationPage.title')}
          </h1>

          {/* Section 1: English Platforms */}
          <section id="english-platforms" className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary/90 mb-6 border-b-2 border-primary/30 pb-3 tracking-tight">
              {t('monetizationPage.englishPlatformsReportTitle')}
            </h2>
            <div className="prose prose-sm md:prose-base max-w-none mx-auto text-foreground leading-relaxed space-y-4 
                          prose-headings:text-primary prose-a:text-accent prose-strong:text-foreground 
                          prose-ul:text-muted-foreground prose-li:marker:text-primary prose-table:border-border prose-th:text-primary/90 prose-td:text-foreground">

              <p>The following report, dated June 23, 2025, provides a comprehensive analysis of English web novel platforms. It covers subscription/pay-per-chapter, free with external monetization, and hybrid models. Information is based on sources like Reddit and Medium. Authors should always consult official platform websites for the latest policies.</p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Background & Market Overview</h3>
              <p>According to "Web Novel Popularity Surge," English web novels have grown rapidly, especially in fantasy, sci-fi, and romance. Platforms like Wattpad and WebNovel boast user bases exceeding 85 million and several million, respectively, indicating strong market potential. In 2025, web novel adaptations to film and TV continue to rise, offering authors publication or adaptation opportunities.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Platform Categories & Detailed Analysis</h3>
              
              <h4 className="text-lg font-medium mt-4 mb-2">1. Subscription/Pay-Per-Chapter Platforms</h4>
              <p>These platforms provide direct income through reader subscriptions or per-chapter payments, suitable for authors seeking quick monetization.</p>
              <PlatformReportTable headers={englishPlatformTable1Data.headers} rows={englishPlatformTable1Data.rows} />
              
              <h5>WebNovel</h5>
              <p>Operated by China Literature, focuses on fantasy, sci-fi, and romance. Readers subscribe or pay per chapter. Authors get 28% royalty, click/tip shares, signing bonuses, and awards (e.g., 2025 Spirity Award $50,000). Top author earnings are substantial, but contracts are controversial; review terms carefully.</p>

              <h5>Radish</h5>
              <p>Focuses on romance, fantasy. Readers use coins to unlock chapters. Authors earn commissions from purchases, paid quarterly via Tipalti (min $50). Transparent payment process, but niche market limits broad income.</p>
              
              <h5>Wattpad (Originals Program)</h5>
              <p>One of the largest web novel communities. Originals Program allows monetization via paid chapters. Readers use coins; authors share revenue. Offers publishing/film adaptation chances. Invitation-only, requires high reader engagement.</p>

              <h4 className="text-lg font-medium mt-4 mb-2">2. Free Platforms with External Monetization</h4>
              <p>Content is free; authors monetize via external channels (e.g., Patreon). Good for building a reader base first.</p>
              <PlatformReportTable headers={englishPlatformTable2Data.headers} rows={englishPlatformTable2Data.rows} />

              <h5>Royal Road</h5>
              <p>Focuses on fantasy, LitRPG, sci-fi. Authors use Patreon for early chapters/exclusive content or publish eBooks via Kindle Unlimited. At least 15 authors earn over $4,000/month via Patreon.</p>

              <h5>Scribble Hub</h5>
              <p>Similar to Royal Road, diverse genres. Authors monetize via Patreon or donations. Growing market potential with 4.9M monthly visits.</p>

              <h4 className="text-lg font-medium mt-4 mb-2">3. Hybrid Model Platforms</h4>
              <p>Offer multiple monetization methods, suiting authors seeking flexibility.</p>
              <PlatformReportTable headers={englishPlatformTable3Data.headers} rows={englishPlatformTable3Data.rows} />
              
              <h5>Tapas</h5>
              <p>Supports novels and comics. Offers ads (30% share), tips (60-85%), support programs. Authors retain copyright. Min $25 PayPal withdrawal. Good for new authors, but income may be limited.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Advice for New Writers</h3>
              <ul>
                <li><strong>Choose the right platform:</strong> Direct monetization (WebNovel, Radish, Tapas) or reader base building (Royal Road, Scribble Hub).</li>
                <li><strong>Review contract terms:</strong> Especially WebNovel's copyright clauses.</li>
                <li><strong>Engage with readers:</strong> Build a fan base through comments, events, social media.</li>
                <li><strong>Diversify income:</strong> Combine with Patreon, Kindle Unlimited, etc.</li>
                <li><strong>Maintain quality and updates:</strong> Regular, high-quality content is key.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Limitations & Future Outlook</h3>
              <p>This report is based on June 23, 2025, info and may become outdated. WebNovel and Wattpad remain market leaders, but Royal Road and Tapas show growth. Globalization offers more opportunities but also more competition. Follow WebNovel Official and Wattpad Creators for updates.</p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Key Citations</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>WebNovel Author Earnings Report 2023</li>
                <li>Wattpad Originals Program Details</li>
                <li>Royal Road Monetization via Patreon</li>
                <li>Tapas Creator Monetization Guide</li>
                <li>Radish Fiction Payment Structure</li>
                <li>Kindle Vella Discontinuation FAQ</li>
                <li>WebNovel Popularity and Competitors</li>
                <li>WebNovel Platform Overview</li>
              </ul>
            </div>
          </section>

          {/* Section 2: Male-Oriented Platforms */}
          <section id="male-oriented-platforms" className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary/90 mb-6 border-b-2 border-primary/30 pb-3 tracking-tight">
              {t('monetizationPage.maleOrientedPlatformsReportTitle')}
            </h2>
             <div className="prose prose-sm md:prose-base max-w-none mx-auto text-foreground leading-relaxed space-y-4 
                          prose-headings:text-primary prose-a:text-accent prose-strong:text-foreground 
                          prose-ul:text-muted-foreground prose-li:marker:text-primary prose-table:border-border prose-th:text-primary/90 prose-td:text-foreground">

              <p>This section provides a detailed analysis and suggestions for Male-Oriented (often Chinese-style) web novel platforms, based on Reddit analysis and updated as of June 23, 2025. Always verify with official sources as information can become outdated.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Key Takeaways</h3>
              <ul>
                <li>Male-oriented web novel platforms are categorized into subscription, free, new media, content provider, and studio platforms.</li>
                <li>Subscription platforms like Qidian and Faloo suit competitive authors but may pose contract difficulties and piracy issues for new authors.</li>
                <li>Free platforms like Fanqie and Midu are suitable for beginners but have volatile income and opaque traffic distribution.</li>
                <li>New media platforms are highly competitive and not recommended for novices; content provider and studio platforms require caution.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Platform Overview</h3>
              
              <h4 className="text-lg font-medium mt-4 mb-2">1. Subscription Platforms</h4>
              <p>These platforms primarily earn through reader subscriptions, suitable for authors with some writing foundation.</p>
              <ul>
                <li><strong>起点中文网 (Qidian):</strong> Industry leader, high reputation. Pros: Timely payments, high bonuses (1500 RMB full attendance), broad genres, good channel resources, royalties after completion, low daily word count (4k). Cons: Hard to sign, fierce competition, rampant piracy, low exposure for new authors, income drop after 1M words, strict content policy, unresponsive editors, risk of account封禁if data is poor. 2025 Update: Qidian expands overseas via WebNovel, remains industry benchmark, piracy persists.</li>
                <li><strong>飞卢小说网 (Faloo):</strong> Best anti-piracy, good for new authors. Pros: Good anti-piracy, new authors succeed easily, proactive editors, less picky readers, high royalty split (70/30), low signing bar, "Recent Updates" list offers good exposure. Cons: Poor owner reputation, payment delays, extremely strict content review, channel fees might be deducted, no completion royalty, low full attendance bonus (600 RMB), high daily word count (10k+), stories burn out easily, hard to build fanbase. 2025 Update: Faloo has over 100M users, rich original content, adapts works for comics/audio/film, but payment delay issues persist (Reddit).</li>
                <li><strong>创世中文网 (Chuangshi):</strong> Declined, associated with Qidian. Pros: Author reputation doesn't matter, less top author competition, initial income okay, 1500 RMB full attendance, reliable payment via Qidian. Cons: Severe piracy, small reader base, recommendation spots often taken by Qidian books, risk of account封禁if data is poor, unsustainable long-term income. 2025 Update: Few recent updates, market influence likely reduced.</li>
                <li><strong>刺猬猫/书客 (Ciweimao/Shuke):</strong> Focuses on ACGN, no piracy. Pros: No piracy, loyal ACGN readers, lenient content policy (adult themes allowed), civil reader community, timely payments. Cons: No completion royalty, no market for non-ACGN novels, unstable reader retention. 2025 Update: Likely a niche platform for ACGN authors.</li>
                <li><strong>掌阅 (Zhangyue):</strong> Extremely poor reviews, not recommended. Pros: No clear advantages. Cons: Low base pay easily cut, severe channel fee exploitation (e.g., author gets 5 RMB from 100 RMB subscription). 2025 Update: Likely further marginalized.</li>
              </ul>

              <h4 className="text-lg font-medium mt-4 mb-2">2. Free Platforms</h4>
              <p>These platforms earn via ads, suitable for novices, but traffic and income are unstable.</p>
              <ul>
                <li><strong>番茄中文网 (Fanqie):</strong> Leading free platform, backed by ByteDance. Pros: ByteDance backing, stable payments, highest traffic, large diverse reader base, timely payments, high daily income during promotion, low daily word count (4k), 800 RMB full attendance. Cons: Uncertain initial traffic, low reader value, slow/inconsistent content review, hard brand building, income drops sharply post-promotion, high startup cost (100k words to determine fate), toxic readers, opaque traffic allocation. 2025 Update: Traffic advantage likely continues.</li>
                <li><strong>米读小说 (Midu):</strong> Acquired by China Literature, income declined. Pros: Was relatively stable, good bonus tiers, pays channel fees. Cons: Income plummeted after Dec 2022, high startup cost (300k words to determine fate), hard to get traffic. 2025 Update: Market performance likely poor post-integration.</li>
                <li><strong>昆仑中文网 (Kunlun):</strong> Authors reportedly deceived, not recommended. Pros: Decent full attendance bonus for first 3 months. Cons: Extremely low income, arbitrary policies, unprofessional/misleading editors, unstable traffic, non-transparent data, unfair promotion, low overall traffic. 2025 Update: Likely marginalized.</li>
                <li><strong>七猫 (Qimao):</strong> Many ads, little author revenue. Pros: Higher base pay, chances for new authors. Cons: Income rarely exceeds base pay, never pays channel fees, low author income ceiling, large ad spend but little author benefit. 2025 Update: Likely still ad-driven, limited author earnings.</li>
                <li><strong>塔读 (Tadu):</strong> Limited information. Needs further investigation. 2025 Update: Minor market influence.</li>
              </ul>

              <h4 className="text-lg font-medium mt-4 mb-2">3. Other Platforms</h4>
              <ul>
                <li><strong>New Media Platforms:</strong> Push via WeChat etc., high chapter prices, anti-piracy. Extremely high competition (0.1% success rate). Not for novices.</li>
                <li><strong>Content Provider Platforms:</strong> e.g., 17k, Zongheng. Produce content for distribution. Good reputation. Small platforms may delay payments.</li>
                <li><strong>Studio Platforms:</strong> Emerging model. Senior authors guide new writers. Often requires on-site work. Risk of exploitation, but offers intensive training. Choose carefully.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Writing Advice for Novices</h3>
              <ol>
                <li><strong>Prioritize Learning:</strong> Study hooks, suspense, titles, synopses, and popular tropes (Bilibili, Lkong).</li>
                <li><strong>Market-Oriented Writing:</strong> Write for the market, not just for self-expression.</li>
                <li><strong>Signing Strategy:</strong> Free platforms and Faloo have low signing bars. Chuangshi is easier than Qidian.</li>
                <li><strong>First Book Choice:</strong> Choose a guaranteed minimum contract for the first book to ensure income and motivation.</li>
                <li><strong>Complete First Book:</strong> Signing is just the start. Finish the first book (approx. 600k words), analyze, then plan the next.</li>
                <li><strong>Keep Writing:</strong> Success comes from persistence. "Words are typed, not thought."</li>
              </ol>

              <h3 className="text-xl font-semibold mt-6 mb-3">Limitations & Future Outlook</h3>
              <p>The information above is based on Reddit analysis and may be outdated. As of June 23, 2025, Qidian and Faloo remain market leaders. Other platforms like Chuangshi and Kunlun have less discussion. Authors should consult latest official sources. The web novel market is globalizing, with potential in male-oriented genres like fantasy and sci-fi, but novices must be aware of policy changes and income risks.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Key Citations (Male-Oriented Platforms)</h3>
              <ul className="list-disc list-inside space-y-1">
                  <li><a href="https://variety.com/2025/digital/news/china-web-novels-ne-zha-2-1236339068/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">China's Web Novels Power Entertainment Surge Beyond 'Ne Zha 2'</a></li>
                  <li><a href="https://www.webnovel.com/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">WebNovel Official Site</a></li>
                  <li><a href="https://www.scrapestorm.com/tutorial/faloob-faloo-com/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Faloo Data Scraping Encyclopedia Entry</a></li>
                  <li><a href="https://www.reddit.com/r/noveltranslations/comments/li2tza/wapfaloo_publishing_site_like_qidiancn_site/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Reddit Post on Faloo Publishing Site</a></li>
              </ul>
            </div>
          </section>

          <div className="text-center mt-12">
            <button
              onClick={onNavigateHome}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-lg hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card active:scale-[0.98] transition-all duration-200 ease-in-out"
            >
              {t('staticPages.returnToHomepage')}
            </button>
          </div>
        </div>
      </main>

      <footer className="w-full text-center py-10 mt-12 border-t border-border bg-secondary">
        <p className="text-sm text-muted-foreground mb-4">{t('footer.copyrightSimple', { year: new Date().getFullYear(), appTitle: t('appTitle') })}</p>
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
            <button onClick={onNavigateToPrivacy} className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors duration-200 ease-in-out">{t('footer.privacyPolicy')}</button>
            <button onClick={onNavigateToTerms} className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors duration-200 ease-in-out">{t('footer.termsOfService')}</button>
            <button onClick={onNavigateToAbout} className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors duration-200 ease-in-out">{t('footer.aboutUs')}</button>
            <button onClick={onNavigateToContact} className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors duration-200 ease-in-out">{t('footer.contactUs')}</button>
            <button onClick={onNavigateToMonetization} className="text-xs text-primary font-semibold hover:text-primary/80 hover:underline transition-colors duration-200 ease-in-out">{t('monetizationPage.footerLink')}</button>
            <div className="w-full sm:w-auto mt-2 sm:mt-0">
                 <LanguagePicker />
            </div>
        </div>
      </footer>
    </div>
  );
};

export default MonetizationPage;