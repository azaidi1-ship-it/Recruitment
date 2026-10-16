import type { CheatSheet } from '../../../types/models';

export const cheatSheet: CheatSheet = {
  sectionId: 'fit',
  blocks: [
    {
      kind: 'formula',
      title: 'Core structures',
      lines: [
        'Walkthrough: background → spark → thread → recent work → why banking',
        'Why IB: story → evidence → what you’ll learn',
        'Why us: deal or sector → person → fit',
        'STAR: S 10% · T 10% · A 60% · R 20%',
        'Weakness: real → when it hurt → fix → evidence',
      ],
    },
    {
      kind: 'table',
      headers: ['Story', 'Use it for'],
      rows: [
        ['Stratus Labs ($250K raise, closed)', 'Impact, deadlines, senior exposure'],
        ['Ayah Apparel (3-statement model)', 'Initiative, analysis, learning fast'],
        ['Improve ME (6 submarkets)', 'Variant view, persuasion'],
        ['Modelcore (VP, C-suite speakers)', 'Leadership, teamwork'],
        ['TCS (500 records, 19 variables)', 'Messy data, judgment, ethics'],
      ],
    },
    {
      kind: 'list',
      items: ['Questions to ask: their best deal, the group’s direction, what makes analysts succeed', 'Thank-you email within 24 hours, specific to the conversation'],
    },
    {
      kind: 'trap',
      title: 'Common mistakes',
      text: 'Listing instead of storytelling. Leading with money, prestige or exits. Generic “great culture” answers. Disguised-strength weaknesses. Blaming others in failure stories. Telling different versions of a story in different rooms.',
    },
  ],
};
