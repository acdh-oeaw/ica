export const relationTypes = new Map([
  ['10967', { id: '10967', label: 'was active in', source: 'person', target: 'event' }],
  ['10851', { id: '10851', label: 'participated in', source: 'person', target: 'event' }],
  ['10441', { id: '10441', label: 'studied at', source: 'person', target: 'institution' }],
  ['10440', { id: '10440', label: 'located in\u002Fat', source: 'institution', target: 'place' }],
  ['10444', { id: '10444', label: 'located in', source: 'place', target: 'place' }],
  ['10446', { id: '10446', label: 'renamed into', source: 'place', target: 'place' }],
  ['6357', { id: '6357', label: 'related', source: 'person', target: 'institution' }],
  ['10544', { id: '10544', label: 'visited', source: 'person', target: 'institution' }],
  [
    '10728',
    { id: '10728', label: 'was stage director at', source: 'person', target: 'institution' },
  ],
  ['10620', { id: '10620', label: 'stayed at', source: 'person', target: 'institution' }],
  ['10471', { id: '10471', label: 'friendship with', source: 'person', target: 'person' }],
  ['10666', { id: '10666', label: 'regularly visited', source: 'person', target: 'institution' }],
  ['10647', { id: '10647', label: 'acquired', source: 'person', target: 'institution' }],
  ['10520', { id: '10520', label: 'attended', source: 'person', target: 'institution' }],
  ['10579', { id: '10579', label: 'close friendship with', source: 'person', target: 'person' }],
  ['10542', { id: '10542', label: 'founder of', source: 'person', target: 'institution' }],
  ['10594', { id: '10594', label: 'was publisher at', source: 'person', target: 'institution' }],
  ['10592', { id: '10592', label: 'was publisher of', source: 'person', target: 'institution' }],
  ['10596', { id: '10596', label: 'was editor of', source: 'person', target: 'institution' }],
  [
    '10597',
    { id: '10597', label: 'was vice president at', source: 'person', target: 'institution' },
  ],
  ['10498', { id: '10498', label: 'acquainted with', source: 'person', target: 'person' }],
  ['10610', { id: '10610', label: 'hosted', source: 'person', target: 'event' }],
  ['10612', { id: '10612', label: 'was location for', source: 'place', target: 'event' }],
  ['10699', { id: '10699', label: 'witnessed', source: 'person', target: 'event' }],
  ['11123', { id: '11123', label: 'reported on', source: 'person', target: 'event' }],
  ['10469', { id: '10469', label: 'worked for', source: 'person', target: 'institution' }],
  ['10595', { id: '10595', label: 'wrote for', source: 'person', target: 'institution' }],
  ['10770', { id: '10770', label: 'had contacts with', source: 'person', target: 'person' }],
  ['10462', { id: '10462', label: 'married to', source: 'person', target: 'person' }],
  ['10599', { id: '10599', label: 'was author at', source: 'person', target: 'institution' }],
  ['10903', { id: '10903', label: 'organized', source: 'person', target: 'event' }],
  ['10499', { id: '10499', label: 'was director of', source: 'person', target: 'institution' }],
  ['10949', { id: '10949', label: 'worked at', source: 'person', target: 'institution' }],
  ['11139', { id: '11139', label: 'co-director of', source: 'person', target: 'institution' }],
  ['10514', { id: '10514', label: 'child-in-law of', source: 'person', target: 'person' }],
  ['11089', { id: '11089', label: 'directed', source: 'person', target: 'event' }],
  ['11025', { id: '11025', label: 'is location for', source: 'place', target: 'event' }],
  ['11170', { id: '11170', label: 'directed plays at', source: 'person', target: 'institution' }],
  ['10631', { id: '10631', label: 'taught at', source: 'person', target: 'institution' }],
  [
    '11220',
    {
      id: '11220',
      label: 'worked as culture officer for',
      source: 'person',
      target: 'institution',
    },
  ],
  [
    '11171',
    {
      id: '11171',
      label: 'received a doctorate in law from',
      source: 'person',
      target: 'institution',
    },
  ],
  [
    '11176',
    { id: '11176', label: 'received benefits from', source: 'person', target: 'institution' },
  ],
  [
    '11178',
    { id: '11178', label: 'meetings often took place at', source: 'institution', target: 'place' },
  ],
  [
    '11197',
    {
      id: '11197',
      label: 'worked as a civil servant for',
      source: 'person',
      target: 'institution',
    },
  ],
  ['10524', { id: '10524', label: 'visited', source: 'person', target: 'place' }],
  ['10500', { id: '10500', label: 'collaborated with', source: 'person', target: 'person' }],
  ['11224', { id: '11224', label: 'co-author of', source: 'person', target: 'event' }],
  ['10653', { id: '10653', label: 'owner of', source: 'person', target: 'institution' }],
  ['10656', { id: '10656', label: 'held', source: 'person', target: 'institution' }],
  [
    '10605',
    { id: '10605', label: 'attempt to collaborate with', source: 'person', target: 'person' },
  ],
  [
    '10888',
    {
      id: '10888',
      label: 'qualified as a docent (habilitation) at',
      source: 'person',
      target: 'institution',
    },
  ],
  [
    '10889',
    { id: '10889', label: 'did repeatedly research at', source: 'person', target: 'institution' },
  ],
  [
    '10905',
    { id: '10905', label: 'contributed artistically to', source: 'person', target: 'event' },
  ],
  ['10580', { id: '10580', label: 'correspondence with', source: 'person', target: 'person' }],
  ['10614', { id: '10614', label: 'was translator of', source: 'person', target: 'person' }],
  ['10626', { id: '10626', label: 'helped to emigrate', source: 'person', target: 'person' }],
  ['11263', { id: '11263', label: 'supported', source: 'person', target: 'institution' }],
  ['10681', { id: '10681', label: 'attended', source: 'person', target: 'event' }],
  ['10690', { id: '10690', label: 'won', source: 'person', target: 'institution' }],
  ['10726', { id: '10726', label: 'archived letters', source: 'person', target: 'institution' }],
  ['4', { id: '4', label: 'born in', source: 'person', target: 'place' }],
  ['5', { id: '5', label: 'died in', source: 'person', target: 'place' }],
  ['10529', { id: '10529', label: 'lived at', source: 'person', target: 'place' }],
  ['10627', { id: '10627', label: 'emigrated to', source: 'person', target: 'place' }],
  ['10464', { id: '10464', label: 'stayed in', source: 'person', target: 'place' }],
  ['10938', { id: '10938', label: 'received', source: 'person', target: 'event' }],
  [
    '10708',
    { id: '10708', label: 'tried to help to emigrate', source: 'person', target: 'person' },
  ],
  [
    '10780',
    {
      id: '10780',
      label: 'had intensive personal correspondence with',
      source: 'person',
      target: 'person',
    },
  ],
  ['10611', { id: '10611', label: 'was guest at', source: 'person', target: 'event' }],
  [
    '10890',
    {
      id: '10890',
      label: 'was a foreign correspondent in Central Europe for',
      source: 'person',
      target: 'institution',
    },
  ],
  ['10892', { id: '10892', label: 'editor of', source: 'person', target: 'institution' }],
  ['10894', { id: '10894', label: 'policy director of', source: 'person', target: 'institution' }],
  [
    '10895',
    { id: '10895', label: 'program evaluator at', source: 'person', target: 'institution' },
  ],
  ['10758', { id: '10758', label: 'was member of', source: 'person', target: 'institution' }],
  ['10804', { id: '10804', label: 'co-founder of', source: 'person', target: 'institution' }],
  ['10828', { id: '10828', label: 'lectured at', source: 'person', target: 'institution' }],
  ['10958', { id: '10958', label: 'held', source: 'person', target: 'event' }],
  ['10959', { id: '10959', label: 'had', source: 'person', target: 'event' }],
  ['10785', { id: '10785', label: 'was president of', source: 'person', target: 'institution' }],
  ['10882', { id: '10882', label: 'wrote articles for', source: 'person', target: 'institution' }],
  ['10992', { id: '10992', label: 'was head of', source: 'person', target: 'institution' }],
  ['10764', { id: '10764', label: 'graduated from', source: 'person', target: 'institution' }],
  ['11064', { id: '11064', label: 'founding member of', source: 'person', target: 'institution' }],
  ['10474', { id: '10474', label: 'Place of Birth', source: 'person', target: 'place' }],
  [
    '10803',
    { id: '10803', label: 'visited for educational purposes', source: 'person', target: 'place' },
  ],
  ['10650', { id: '10650', label: 'lived in', source: 'person', target: 'place' }],
  ['10465', { id: '10465', label: 'stayed in for work', source: 'person', target: 'place' }],
  ['10960', { id: '10960', label: 'moved to', source: 'person', target: 'place' }],
  ['6364', { id: '6364', label: 'related', source: 'place', target: 'place' }],
  ['10590', { id: '10590', label: 'rented', source: 'person', target: 'place' }],
  ['10586', { id: '10586', label: 'regularly lived at', source: 'person', target: 'place' }],
  ['10517', { id: '10517', label: 'had an affair with', source: 'person', target: 'person' }],
  ['11040', { id: '11040', label: 'admirer of', source: 'person', target: 'person' }],
  ['10587', { id: '10587', label: 'was invited at', source: 'person', target: 'place' }],
  ['10772', { id: '10772', label: 'worked as journalist in', source: 'person', target: 'place' }],
  ['10589', { id: '10589', label: 'mentor of', source: 'person', target: 'person' }],
  [
    '10887',
    {
      id: '10887',
      label: 'sponsored a lectureship in the U.S. for',
      source: 'person',
      target: 'person',
    },
  ],
  ['10506', { id: '10506', label: 'parent of', source: 'person', target: 'person' }],
  ['10584', { id: '10584', label: 'owner of', source: 'person', target: 'place' }],
  [
    '11014',
    { id: '11014', label: 'was editor-in-chief of', source: 'person', target: 'institution' },
  ],
  [
    '11186',
    { id: '11186', label: 'financially supported', source: 'person', target: 'institution' },
  ],
  [
    '11079',
    { id: '11079', label: 'regularly contributed to', source: 'person', target: 'institution' },
  ],
  [
    '11081',
    { id: '11081', label: 'sporadically contributed to', source: 'person', target: 'institution' },
  ],
  ['11066', { id: '11066', label: 'was professor at', source: 'person', target: 'institution' }],
  ['10571', { id: '10571', label: 'student of', source: 'person', target: 'person' }],
  ['11324', { id: '11324', label: 'taught at', source: 'person', target: 'institution' }],
  [
    '11152',
    { id: '11152', label: 'was associate professor at', source: 'person', target: 'institution' },
  ],
  ['11162', { id: '11162', label: 'was fellow of', source: 'person', target: 'institution' }],
  [
    '10950',
    { id: '10950', label: 'was guest professor at', source: 'person', target: 'institution' },
  ],
  ['11213', { id: '11213', label: 'located in', source: 'institution', target: 'place' }],
  ['11163', { id: '11163', label: 'met', source: 'person', target: 'person' }],
  ['10976', { id: '10976', label: 'grew up in', source: 'person', target: 'place' }],
  [
    '11167',
    { id: '11167', label: 'had named after themselves', source: 'person', target: 'place' },
  ],
  ['10769', { id: '10769', label: 'expelled from', source: 'person', target: 'place' }],
  ['10660', { id: '10660', label: 'fled to', source: 'person', target: 'place' }],
  ['6356', { id: '6356', label: 'related', source: 'person', target: 'place' }],
  ['10619', { id: '10619', label: 'engaged to', source: 'person', target: 'person' }],
  [
    '10704',
    { id: '10704', label: 'stayed in for musical training', source: 'person', target: 'place' },
  ],
  ['10732', { id: '10732', label: 'language tandem', source: 'person', target: 'person' }],
  [
    '10774',
    { id: '10774', label: 'undergoing psychoanalysis', source: 'person', target: 'person' },
  ],
  [
    '10920',
    { id: '10920', label: 'gave a guest lecture at', source: 'person', target: 'institution' },
  ],
  ['10581', { id: '10581', label: 'patient of', source: 'person', target: 'person' }],
  ['10914', { id: '10914', label: 'rented', source: 'person', target: 'place' }],
  ['10640', { id: '10640', label: 'had a meeting with', source: 'person', target: 'person' }],
  ['10635', { id: '10635', label: 'sibling of', source: 'person', target: 'person' }],
  ['6355', { id: '6355', label: 'related', source: 'person', target: 'person' }],
  [
    '10771',
    { id: '10771', label: 'had regular contacts with', source: 'person', target: 'person' },
  ],
  ['10988', { id: '10988', label: 'interviewed', source: 'person', target: 'person' }],
  ['10588', { id: '10588', label: 'regularly visited', source: 'person', target: 'place' }],
  [
    '10883',
    {
      id: '10883',
      label: 'wrote reports inspired by Zionism while in',
      source: 'person',
      target: 'place',
    },
  ],
  [
    '10663',
    { id: '10663', label: 'stayed in for scientific work', source: 'person', target: 'place' },
  ],
  ['11195', { id: '11195', label: 'regularly stayed in', source: 'person', target: 'place' }],
  [
    '10600',
    { id: '10600', label: 'landlady\u002Flandlord of', source: 'person', target: 'person' },
  ],
  ['10763', { id: '10763', label: 'employed by', source: 'person', target: 'person' }],
  [
    '10664',
    { id: '10664', label: 'qualified as a professor at', source: 'person', target: 'institution' },
  ],
  [
    '10942',
    {
      id: '10942',
      label: 'became associate professor of history at',
      source: 'person',
      target: 'institution',
    },
  ],
  [
    '10941',
    { id: '10941', label: 'got the venia legendi at', source: 'person', target: 'institution' },
  ],
  ['10945', { id: '10945', label: 'converted to', source: 'person', target: 'institution' }],
  [
    '10948',
    { id: '10948', label: 'worked for a semester at', source: 'person', target: 'institution' },
  ],
  [
    '11165',
    {
      id: '11165',
      label: 'worked as research associate at',
      source: 'person',
      target: 'institution',
    },
  ],
  [
    '10951',
    {
      id: '10951',
      label: 'was full professor for modern history at',
      source: 'person',
      target: 'institution',
    },
  ],
  [
    '10952',
    {
      id: '10952',
      label: 'was elected corresponding member of',
      source: 'person',
      target: 'institution',
    },
  ],
  [
    '11231',
    {
      id: '11231',
      label: 'received a doctorate in philosophy from',
      source: 'person',
      target: 'institution',
    },
  ],
  ['11098', { id: '11098', label: 'had a conversation with', source: 'person', target: 'person' }],
  [
    '10943',
    { id: '10943', label: 'worked as a guest professor in', source: 'person', target: 'place' },
  ],
  [
    '10946',
    {
      id: '10946',
      label: 'emigrated with his wife and daughter from',
      source: 'person',
      target: 'place',
    },
  ],
  [
    '10947',
    {
      id: '10947',
      label: 'emigrated via Switzerland and France to',
      source: 'person',
      target: 'place',
    },
  ],
  ['10673', { id: '10673', label: 'returned to', source: 'person', target: 'place' }],
  ['11047', { id: '11047', label: 'had a summer house at', source: 'person', target: 'place' }],
  [
    '10582',
    { id: '10582', label: 'stayed in for medical treatment', source: 'person', target: 'place' },
  ],
  ['10591', { id: '10591', label: 'was publisher of', source: 'person', target: 'person' }],
  ['10634', { id: '10634', label: 'child of', source: 'person', target: 'person' }],
  ['11105', { id: '11105', label: 'escaped via', source: 'person', target: 'place' }],
  [
    '10857',
    { id: '10857', label: 'went on a speaking tour to', source: 'person', target: 'place' },
  ],
  ['10778', { id: '10778', label: 'had a farm in', source: 'person', target: 'place' }],
  ['11223', { id: '11223', label: 'conductor of', source: 'person', target: 'event' }],
  [
    '11205',
    {
      id: '11205',
      label: 'interrogated Herbert von Karajan,  Paula Wessely,  Werner Krauss and Richard Strauss',
      source: 'person',
      target: 'place',
    },
  ],
  ['10839', { id: '10839', label: 'advisor of', source: 'person', target: 'person' }],
  ['11033', { id: '11033', label: 'went on a family trip to', source: 'person', target: 'place' }],
  [
    '11074',
    { id: '11074', label: 'was associate director of', source: 'person', target: 'institution' },
  ],
  ['10876', { id: '10876', label: 'was a stop during', source: 'place', target: 'event' }],
  ['6361', { id: '6361', label: 'related', source: 'institution', target: 'place' }],
  ['10790', { id: '10790', label: 'was curator at', source: 'person', target: 'institution' }],
  [
    '10850',
    { id: '10850', label: 'went on a collecting trip to', source: 'person', target: 'place' },
  ],
  ['11102', { id: '11102', label: 'attended classes at', source: 'person', target: 'institution' }],
  [
    '10583',
    { id: '10583', label: 'stayed in for medical education', source: 'person', target: 'place' },
  ],
  ['11373', { id: '11373', label: 'taught for', source: 'person', target: 'institution' }],
  ['11188', { id: '11188', label: 'chairman of', source: 'person', target: 'institution' }],
  [
    '10954',
    { id: '10954', label: 'was appointed to a chair at', source: 'person', target: 'institution' },
  ],
  [
    '11214',
    { id: '11214', label: 'was a honorary professor at', source: 'person', target: 'institution' },
  ],
  [
    '11232',
    {
      id: '11232',
      label: "received a master's degree in German philology from",
      source: 'person',
      target: 'institution',
    },
  ],
  ['10840', { id: '10840', label: 'studied in', source: 'person', target: 'place' }],
  [
    '11154',
    {
      id: '11154',
      label: 'was director of the Europe division',
      source: 'person',
      target: 'institution',
    },
  ],
  [
    '11187',
    { id: '11187', label: 'worked as party secretary at', source: 'person', target: 'institution' },
  ],
])
