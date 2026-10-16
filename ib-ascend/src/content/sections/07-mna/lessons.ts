import type { Lesson } from '../../../types/models';

export const lessons: Lesson[] = [
  {
    id: 'ma-l1',
    sectionId: 'mna',
    order: 1,
    title: 'Why companies buy, and how deals run',
    minutes: 6,
    blocks: [
      {
        kind: 'p',
        text: 'Companies acquire to grow faster than they could alone, to gain capabilities, products or customers, to cut costs through scale, or to deploy cash. A deal creates value only if the buyer gets more than it pays: the standalone value plus synergies must exceed the price, including the premium.',
      },
      {
        kind: 'table',
        headers: ['Process', 'Pros', 'Cons'],
        rows: [
          ['Broad auction', 'Maximum price tension', 'Slow; leak risk; disrupts the business'],
          ['Targeted auction', 'Balance of tension and control', 'May miss an unexpected buyer'],
          ['Negotiated sale', 'Fast, confidential', 'Less competition on price'],
        ],
      },
      {
        kind: 'list',
        ordered: true,
        items: [
          'Preparation: teaser, confidential information memorandum (CIM), model, buyer list.',
          'Marketing: NDAs, CIM sent, first-round non-binding indications of interest.',
          'Diligence: management presentations, data room.',
          'Final round: binding bids and markups of the purchase agreement.',
          'Signing, then regulatory and shareholder approvals, then closing.',
        ],
      },
      {
        kind: 'trap',
        title: 'Breakup fee vs reverse termination fee',
        text: 'A breakup fee is paid by the target to the buyer if the target walks away (e.g. for a superior offer); typically about 2–4% of equity value. A reverse termination fee is paid by the buyer to the target if the deal fails for buyer-side reasons, such as financing or regulatory blocks.',
      },
    ],
    sixtySecond:
      'Companies buy to grow, add capabilities, cut costs or deploy cash, and a deal creates value only if standalone value plus synergies exceeds the price paid. Sell-side processes range from broad auctions, which maximize price tension, to negotiated sales, which are faster and more confidential. The stages run from preparation and marketing through diligence, final bids, signing and closing.',
  },
  {
    id: 'ma-l2',
    sectionId: 'mna',
    order: 2,
    title: 'Accretion / dilution',
    minutes: 8,
    blocks: [
      {
        kind: 'formula',
        title: 'Pro forma EPS',
        lines: [
          'Pro forma NI = Acquirer NI + Target NI − after-tax foregone interest on cash − after-tax interest on new debt + after-tax synergies − new D&A from write-ups (after tax)',
          'Pro forma shares = Acquirer shares + new shares issued',
          'Accretion = Pro forma EPS / Standalone EPS − 1',
        ],
      },
      {
        kind: 'formula',
        title: 'The shortcut: yields',
        lines: [
          'Target earnings yield = Target NI / Purchase equity price (= 1 / purchase P/E)',
          'Cost of stock = 1 / Acquirer P/E;  Cost of debt = r × (1 − t);  Cost of cash = interest earned × (1 − t)',
          'Accretive if target yield > weighted cost of funding',
        ],
      },
      {
        kind: 'example',
        title: 'Mixed consideration',
        text: 'Acquirer: NI 500, 200 shares (EPS 2.50), price $50 (20x P/E). Target: NI 60, bought for 1,000 (16.7x). Funding: 50% stock (500 / 50 = 10 shares) and 50% debt at 6%. After-tax interest = 500 × 6% × 0.75 = 22.5. Pro forma NI = 500 + 60 − 22.5 = 537.5; shares 210; EPS 2.560: 2.4% accretive. Yield check: target 6.0% vs cost 0.5 × 5.0% + 0.5 × 4.5% = 4.75%.',
      },
      {
        kind: 'trap',
        title: 'Accretive ≠ good',
        text: 'Cheap debt makes almost any deal accretive. Value is created only if the return on the price paid exceeds the cost of capital. Say this if asked “is accretion good?”.',
      },
    ],
    sixtySecond:
      'Accretion/dilution compares the acquirer’s pro forma EPS with its standalone EPS. Combine net incomes, subtract after-tax foregone interest on cash and after-tax interest on new debt, add after-tax synergies, and divide by the share count including any new shares. Shortcut: the deal is accretive if the target’s earnings yield at the purchase price exceeds the weighted after-tax cost of the funding. Accretion isn’t the same as value creation.',
  },
  {
    id: 'ma-l3',
    sectionId: 'mna',
    order: 3,
    title: 'Purchase price allocation, goodwill and DTLs',
    minutes: 7,
    blocks: [
      {
        kind: 'formula',
        title: 'Goodwill',
        lines: [
          'Goodwill = Purchase equity price − (Book equity − Existing goodwill + Asset write-ups − New DTL)',
          'New DTL (stock deal) = Write-ups × tax rate',
        ],
      },
      {
        kind: 'example',
        title: 'With and without the DTL',
        text: 'Price 1,000; book equity 400; write-ups of PP&E 100 and intangibles 150. Without taxes: goodwill = 1,000 − 650 = 350. With a 25% DTL on write-ups (62.5): goodwill = 1,000 − 587.5 = 412.5.',
      },
      {
        kind: 'table',
        headers: ['', 'Stock purchase', 'Asset purchase / 338(h)(10)'],
        rows: [
          ['Tax basis', 'Carries over (no step-up)', 'Stepped up to fair value'],
          ['DTL on write-ups', 'Yes', 'No'],
          ['Goodwill tax-deductible', 'No', 'Yes (US: amortized over 15 years)'],
          ['Usually preferred by', 'Seller', 'Buyer'],
        ],
      },
      {
        kind: 'trap',
        title: 'After the deal',
        text: 'US public companies don’t amortize goodwill; they test it for impairment at least annually. Write-ups of PP&E and finite-lived intangibles do create extra D&A, which reduces pro forma net income.',
      },
    ],
    sixtySecond:
      'Goodwill is the purchase price minus the fair value of the target’s identifiable net assets: book equity, less existing goodwill, plus asset write-ups and new intangibles, less the deferred tax liability those write-ups create in a stock deal. Asset deals step up the tax basis, so no DTL arises and goodwill becomes deductible. Goodwill is impaired, not amortized, for US public companies.',
  },
  {
    id: 'ma-l4',
    sectionId: 'mna',
    order: 4,
    title: 'Consideration, synergies and structure',
    minutes: 7,
    blocks: [
      {
        kind: 'table',
        headers: ['', 'Cash', 'Stock'],
        rows: [
          ['Seller gets', 'Certain value; taxable now', 'Shared upside and risk; possibly tax-deferred'],
          ['Buyer prefers when', 'Its stock is cheap; it has cash or debt capacity', 'Its stock is richly valued; deal is large'],
          ['EPS effect', 'Usually less dilutive', 'Dilutive if acquirer P/E < purchase P/E'],
        ],
      },
      {
        kind: 'formula',
        title: 'Stock deal mechanics',
        lines: ['Exchange ratio = Offer per target share / Acquirer share price', 'New shares = Target diluted shares × exchange ratio'],
        note: 'Fixed exchange ratio: value floats with the acquirer’s stock. Fixed price: share count floats. Collars limit either.',
      },
      {
        kind: 'formula',
        title: 'Synergies',
        lines: ['Value ≈ After-tax run-rate synergies × multiple (less costs to achieve, phased in)', 'Max premium ≈ PV of synergies / Target market value'],
      },
      {
        kind: 'trap',
        title: 'Revenue synergies',
        text: 'Investors heavily discount revenue synergies because they depend on customers and competitors. A deal that only works with revenue synergies is a red flag.',
      },
    ],
    sixtySecond:
      'Cash gives sellers certain value but is taxable now; stock shares risk and upside and may defer tax. Buyers use stock when it’s richly valued or the deal is large. The exchange ratio is the offer per target share divided by the acquirer’s price. Cost synergies are more credible than revenue synergies; value them after tax, net of costs to achieve and phase-in.',
  },
];
