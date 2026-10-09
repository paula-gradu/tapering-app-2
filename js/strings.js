// Every word the app shows, in English and Romanian.
//
// The copy was approved line by line in both languages; change it only with
// the author. Keys must match across languages (tests/strings.test.js checks).
// A value is either a string or a function of a context object.

export const LANGS = ['en', 'ro'];

export const STRINGS = {
  en: {
    name: 'English',
    greeting: c => c.name ? 'Hi, ' + c.name : 'Hi',
    nameLabel: 'Your name',
    namePlaceholder: 'e.g. Dad',
    dayLabel: c => 'Day ' + c.day,
    saved: c => c.avoided + ' not smoked',
    todayKicker: 'Today',
    unit: c => c.dose === 1 ? 'cigarette' : 'cigarettes',
    vsStart: c => c.pctDown > 0 ? (c.start - c.dose) + ' fewer than day one' : 'where you started',
    tally: c => c.smoked === 0 ? 'None yet today.'
      : c.smoked > c.dose ? (c.smoked + ' smoked — ' + (c.smoked - c.dose) + ' past today\u2019s number.')
      : (c.smoked + ' smoked, ' + (c.dose - c.smoked) + ' left.'),
    smokedOne: 'Smoked one',
    undoOne: 'Undo that one',
    holdingKicker: 'Still holding',
    holdingBody: 'Nothing to count today. The evening question carries on for a fortnight, because the craving still has something to say.',
    holdingDayOf: c => 'Day ' + c.holdingDay + ' of 14 with none',
    celebrateTitle: 'Two weeks with none',
    celebrateBody: 'Fourteen evenings answered and nothing smoked. The number reached zero and stayed there. Whatever comes next, this happened.',
    smokedToday: 'I smoked today',
    notSmokedToday: 'I did not smoke today',
    relapseTitle: 'Back to where we were',
    relapseBody: 'A relapse is just another place to quit from — the same protocol, with far better information than it had on day one. Count what you smoke today and answer this evening as usual.',
    acceptHolding: 'Another day with none',
    overTitle: 'Did today need more room?',
    overBody: c => 'You\u2019ve gone past today\u2019s number. That is information, not a failure — was ' + c.tolerable + ' too low a setting for the day you have had?',
    overYes: 'Yes, today needed more',
    overNo: c => 'No, ' + c.tolerable + ' was right',
    ciTitle: 'How was the craving today?',
    ciSub: 'Worst it got, not the average.',
    ciSubmit: 'Set tomorrow\u2019s number',
    ciSubmitHolding: 'Confirm craving',
    scale0: '0 · hardly noticed',
    scale10: '10 · all day',
    cravingWord: v => v <= 1 ? 'Hardly there' : v <= 3 ? 'Mild' : v <= 5 ? 'Bearable' : v <= 7 ? 'A hard day' : 'A very hard day',
    tolerableNote: c => c.over ? 'Over what you can live with — tomorrow will give you a little more room.' : 'Under what you can live with — tomorrow can come down.',
    noteLabel: 'Anything you want to say about today?',
    notePlaceholder: 'Optional. Saved with the day.',
    eveningTitle: 'This evening\u2019s question',
    eveningSub: 'One slider, then tomorrow\u2019s number.',
    sinceDayOne: 'Since day one',
    pctDown: c => c.pctDown + '% down',
    encouragement: c => c.pctDown >= 50
      ? 'More than half the way down, and the hard days have been getting shorter.'
      : 'Slowly is the point. Every day answered is a day the number knows more about you.',
    lastWeek: 'The last week',

    progress: 'How it\u2019s going',
    trendSub: c => c.day + ' days in, ' + c.pctDown + '% down from ' + c.start + '.',
    notSmoked: 'not smoked so far',
    eveningsAnswered: 'evenings answered',
    chartDose: 'Cigarettes a day',
    chartCraving: 'Craving each evening',
    dayOneAxis: c => c.start + ' on day one',
    todayAxis: c => c.dose + ' today',
    tolerableAxis: c => 'tolerable · ' + c.tolerable,
    chartNote: 'Under the dashed line the number comes down. Over it, the number goes back up a little — never above where you started.',
    dayByDay: 'Day by day',
    rowToday: c => 'Today — ' + c.smoked + ' so far',
    rowOver: c => 'Craving ' + c.craving + ', over what you can live with',
    rowUnder: c => 'Craving ' + c.craving + ', ' + c.room + ' under',
    rowRaised: c => 'Craving ' + c.craving + ', hard day — floor raised to ' + c.floor,
    chipNow: 'now', chipUp: 'eased off', chipDown: 'down', chipHard: 'hard day',
    dayWord: 'Day',

    settings: 'Settings',
    language: 'Language',
    tolerableTitle: 'What\u2019s tolerable',
    tolerableBody: 'A craving you can live with for a day. Move it up and the number comes down more slowly; move it down and it goes faster. Change it whenever you like.',
    outOfTen: 'out of 10',
    tolerableSetting: v => v <= 2 ? 'Strict. The number will come down fast and the days will be hard.'
      : v <= 5 ? 'A fair place to sit — uncomfortable days allowed, miserable ones not.'
      : 'Gentle. Progress will be slow, which is still progress.',
    setupTitle: 'Your answers from day one',
    setupBody: 'Asked once, kept for good. These set the size of each step.',
    setupRow1: 'Smoked on a normal day',
    setupRow2: 'Enough to satisfy the craving',
    setupRow3: 'Craving with none at all',
    previewToggle: c => c.open ? 'Hide what that means' : 'What does that mean?',
    livePreview: c => 'One cigarette corresponds to about ' + c.perCig + ' points on the craving scale, so every point you are under what you can live with takes about ' + c.perPoint + ' cigarettes off tomorrow.',
    ceilingNote: c => 'Your ' + c.start + ' a day is also a ceiling: a hard day can raise the number a little, but never past where you started.',
    dataTitle: 'Your record',
    dataBody: 'Every evening is saved on this phone as you answer. Nothing leaves the device unless you send it.',
    dataStatus: c => c.rows + ' days recorded, last saved ' + c.savedAt + '.',
    storageWarn: 'This phone is not saving your answers — today will be lost when the app closes. Opening it from a link rather than a file usually fixes it.',
    syncNone: 'No cloud set up yet — days are kept on this phone and exported by hand.',
    syncSending: 'Sending…',
    syncWaiting: c => c.n + (c.n === 1 ? ' day waiting to send' : ' days waiting to send'),
    syncSent: c => 'All ' + c.n + ' days sent',
    retry: 'Retry',
    exportCsv: 'Export as CSV',
    sendCsv: 'Send CSV to the author',
    sendNote: 'Opens your mail app with the file attached, addressed to pgradu@berkeley.edu. Nothing is sent until you press send.',
    redoSetup: 'Redo setup',
    resetTitle: 'Start over',
    resetBody: 'Clears every day you have logged and returns to the first questions. This cannot be undone.',
    resetButton: 'Erase everything and start again',
    resetConfirm: 'Tap again to erase everything',
    legalTitle: 'Before you rely on this',
    paperNote: 'The number comes from a research paper: Online Control for Adaptive Tapering of Medications (Gradu & Recht, 2023). It works out the smallest dose that still keeps a person above the level they say they can live with, and adjusts it from their own answers rather than a fixed schedule.',
    legalBody: 'This is a personal experiment, not medical care, and not a medical device. It suggests a number — the decision is always yours, and nobody who made it is responsible for what follows. If stopping is going badly, speak to a doctor rather than to this screen.',
    agree: c => c.agreed ? 'I understand ✓' : 'I understand',

    tomorrow: 'Tomorrow',
    today: 'Today',
    resultHeadline: c => c.next === 0 ? 'Tomorrow, none'
      : c.next > c.taken ? 'A little more room tomorrow'
      : c.next < c.taken ? 'Down to ' + c.next + ' tomorrow'
      : 'The same again tomorrow',
    resultBody: c => c.next === 0
      ? 'You said ' + c.craving + ', under what you can live with, and you are close enough to nothing that tomorrow is nothing. Name it as your last day if you like.'
      : c.next === c.taken
        ? 'You said ' + c.craving + ', right at the level you can live with. There is no room to come down today, so tomorrow stays at ' + c.next + '.'
      : c.err >= 0
        ? 'You said ' + c.craving + ', which is ' + c.err + ' under what you can live with. That room is worth about ' + (c.taken - c.next) + ', so tomorrow is ' + c.next + '.'
        : 'You said ' + c.craving + ', over the ' + c.floor + ' you could live with today. Tomorrow goes up to ' + c.next + ' to take the edge off, then carries on down from there.',
    upTitle: c => c.atCeiling ? 'Back at where you started' : 'Going up is allowed',
    upBody: c => c.atCeiling
      ? 'This is the ceiling — ' + c.start + ' a day, your own starting number. The app will not go past it however hard a day gets. If days keep landing here, what you can live with may be set too low.'
      : 'A hard day earns a little back. It is not a reset and it is not a failure: the number has gone up ' + (c.next - c.taken) + ' and will start coming down again as soon as the craving eases.',
    numbersToggle: c => c.open ? 'Hide the working' : 'Show me the working',
    mathCraving: 'Craving today',
    mathTolerable: 'What you could live with today',
    mathRoom: 'Room to spare',
    mathOver: 'Over by',
    mathPerPoint: 'Cigarettes per point',
    mathTaken: 'Smoked today',
    countTitle: 'That is not the number for today',
    countBody: c => 'You tallied ' + c.n + ', and today\u2019s number was ' + c.dose + '. Confirm what you actually smoked — tomorrow is worked out from it, not from the number you were given.',
    countConfirm: c => 'Yes, I smoked ' + c.n,
    countConfirmAlt: c => 'No, I smoked ' + c.dose,
    noteWhy: 'Today did not go to plan. Worth a line about why, while you remember.',
    countHint: c => c.n === 1 ? 'You counted 1 as you went' : 'You counted ' + c.n + ' as you went',
    // Added for the smoked-fewer check; not part of the originally approved copy.
    countLessTitle: c => 'Just ' + c.n + ' today?',
    countLessBody: c => 'Are you sure you smoked just ' + c.n + ', rather than ' + c.dose + '?',
    mathTomorrow: c => 'Tomorrow, capped at ' + c.start,
    accept: c => c.next === 0 ? 'That\u2019s my last one' : 'Set ' + c.next + ' for tomorrow',

    // Added with the daily step limit. Not part of the copy approved in the
    // original build — review before relying on it.
    mathStep: 'Most it moves in a day',
    capBody: c => 'You said ' + c.craving + '. Worked out from what you smoked today (' + c.taken + '), tomorrow would be ' + c.raw + ' — but the number never moves by more than ' + c.step + ' from one day to the next, so tomorrow is ' + c.next + '.',
    stepNote: c => 'From one day to the next it moves by ' + c.step + ' at most.',

    hardDayKicker: 'A hard day',
    todayOnlyTitle: 'Did today need more room?',
    todayOnlyBody: c => 'You normally get through on a ' + c.tolerable + '. Some days that is not the day you are having. If today asked more of you, say what you could actually live with — just for today.',
    justToday: 'just for today',
    dayFloorNote: c => 'The mark shows your usual ' + c.tolerable + '. Tomorrow\u2019s number is worked out against whatever you set here.',
    todayOnlyConfirm: 'That\u2019s what today needed',
    todayOnlySkip: c => 'No, ' + c.tolerable + ' was right',
    andGenerally: 'And generally?',
    baselineTitle: 'Was that just today, or is it every day now?',
    baselineBody: c => 'You said today needed ' + c.dayFloor + ' rather than your usual ' + c.tolerable + '. If that is how most days feel at the moment, it makes sense to move the general setting too. If today was a one-off, leave it — the taper carries on as before.',
    baselineYes: c => 'Make ' + c.dayFloor + ' my usual',
    baselineNo: 'Just today — keep it as it was',

    ob: [
      { title: 'One number a day', body: 'Every evening it asks one question: how bad was the craving? Every morning it gives you a number for the day. That is the whole app.' },
      { title: 'Which language?', body: 'You can change this any time in Settings.' },
      { title: 'What should it call you?', body: 'Only used to say hello. It never leaves the phone.' },
      { title: 'How many do you smoke on a normal day?', body: 'Start where you actually are. This also becomes the most the app will ever suggest.' },
      { title: 'How many cigarettes a day fully satisfy your cravings?', body: 'The number where you are not wanting another one. A range is fine — nobody knows this exactly.' },
      { title: 'And with none at all, how bad would it get?', body: 'Ten is all-day, can\u2019t-think-about-anything-else.' },
      { title: 'What craving could you live with?', body: 'Not comfortable — liveable, for a day. You can change this whenever you like, and on a hard day the app will ask whether that day needed more.' },
      { title: 'One thing to be clear about', body: 'Please read this before you start.' },
      { title: 'That\u2019s everything', body: 'No plan, no schedule, no end date to fall behind on. Just this evening\u2019s question.' }
    ],
    obNext: 'Next',
    obStart: 'Three questions, then done',
    obBegin: 'Start today',
    obBack: 'Back',
    obClose: 'Close',
    aDay: 'a day',
    to: 'to',
    atFewest: 'At fewest',
    atMost: 'At most',
    dontKnow: 'I don\u2019t know',
    doneBody: 'The same as usual, on purpose. Nothing changes until you\u2019ve answered one evening\u2019s question.',
    tabToday: 'Today', tabProgress: 'Progress', tabSettings: 'Settings'
  },

  ro: {
    name: 'Română',
    greeting: c => c.name ? 'Bună, ' + c.name : 'Bună',
    nameLabel: 'Numele tău',
    namePlaceholder: 'ex. tată',
    dayLabel: c => 'Ziua ' + c.day,
    saved: c => c.avoided + ' nefumate',
    todayKicker: 'Astăzi',
    unit: c => c.dose === 1 ? 'țigară' : 'țigări',
    vsStart: c => c.pctDown > 0 ? (c.start - c.dose) + ' mai puține decât în prima zi' : 'de unde ai început',
    tally: c => c.smoked === 0 ? 'Niciuna încă astăzi.'
      : c.smoked > c.dose ? (c.smoked + ' fumate — ' + (c.smoked - c.dose) + ' peste numărul de azi.')
      : (c.smoked + ' fumate, au rămas ' + (c.dose - c.smoked) + '.'),
    smokedOne: 'Am fumat una',
    undoOne: 'Anulează ultima țigară',
    holdingKicker: 'Încă rezistă',
    holdingBody: 'Nimic de numărat astăzi. Întrebarea de seară continuă două săptămâni, pentru că disconfortul mai are ceva de spus.',
    holdingDayOf: c => 'Ziua ' + c.holdingDay + ' din 14 fără niciuna',
    celebrateTitle: 'Două săptămâni fără niciuna',
    celebrateBody: 'Paisprezece seri cu răspuns și nicio țigară. Numărul a ajuns la zero și a rămas acolo. Orice urmează, asta s-a întâmplat.',
    smokedToday: 'Am fumat azi',
    notSmokedToday: 'Nu am fumat azi',
    relapseTitle: 'Ne întoarcem de unde eram',
    relapseBody: 'O recădere este doar un alt loc din care poți renunța — același proces, cu informații mult mai bune decât avea în prima zi. Numără ce fumezi azi și răspunde diseară ca de obicei.',
    acceptHolding: 'Încă o zi fără niciuna',
    overTitle: 'A avut ziua de azi nevoie de mai mult loc?',
    overBody: c => 'Ai trecut peste numărul de azi. Este o informație, nu un eșec — a fost ' + c.tolerable + ' o setare prea mică pentru ziua pe care ai avut-o?',
    overYes: 'Da, azi a cerut mai mult',
    overNo: c => 'Nu, ' + c.tolerable + ' a fost corect',
    ciTitle: 'Cum a fost disconfortul astăzi?',
    ciSub: 'Cât de rău a fost la maxim, nu media.',
    ciSubmit: 'Stabilește numărul de mâine',
    ciSubmitHolding: 'Confirmă disconfortul',
    scale0: '0 · aproape deloc',
    scale10: '10 · toată ziua',
    cravingWord: v => v <= 1 ? 'Aproape absent' : v <= 3 ? 'Ușor' : v <= 5 ? 'Suportabil' : v <= 7 ? 'O zi grea' : 'O zi foarte grea',
    tolerableNote: c => c.over ? 'Peste cât poți suporta — mâine vei avea puțin mai mult loc.' : 'Sub cât poți suporta — mâine poate scădea.',
    noteLabel: 'Vrei să spui ceva despre ziua de azi?',
    notePlaceholder: 'Opțional. Se salvează cu ziua.',
    eveningTitle: 'Întrebarea de seară',
    eveningSub: 'Un cursor, apoi numărul de mâine.',
    sinceDayOne: 'De la prima zi',
    pctDown: c => 'cu ' + c.pctDown + '% mai puțin',
    encouragement: c => c.pctDown >= 50
      ? 'Mai mult de jumătate din drum, iar zilele grele s-au scurtat.'
      : 'Încet este ideea. Fiecare zi la care răspunzi este o zi în care numărul te cunoaște mai bine.',
    lastWeek: 'Ultima săptămână',

    progress: 'Cum merge',
    trendSub: c => c.day + ' zile, cu ' + c.pctDown + '% mai puțin decât ' + c.start + '.',
    notSmoked: 'nefumate până acum',
    eveningsAnswered: 'seri cu răspuns',
    chartDose: 'Țigări pe zi',
    chartCraving: 'Disconfortul în fiecare seară',
    dayOneAxis: c => c.start + ' în prima zi',
    todayAxis: c => c.dose + ' astăzi',
    tolerableAxis: c => 'suportabil · ' + c.tolerable,
    chartNote: 'Sub linia punctată numărul scade. Peste ea, numărul urcă puțin — niciodată peste cât ai avut la început.',
    dayByDay: 'Zi de zi',
    rowToday: c => 'Astăzi — ' + c.smoked + ' până acum',
    rowOver: c => 'Disconfort ' + c.craving + ', peste cât poți suporta',
    rowUnder: c => 'Disconfort ' + c.craving + ', cu ' + c.room + ' sub',
    rowRaised: c => 'Disconfort ' + c.craving + ', zi grea — limita ridicată la ' + c.floor,
    chipNow: 'acum', chipUp: 'mai ușor', chipDown: 'mai jos', chipHard: 'zi grea',
    dayWord: 'Ziua',

    settings: 'Setări',
    language: 'Limbă',
    tolerableTitle: 'Cât poți suporta',
    tolerableBody: 'Un disconfort cu care poți trăi o zi. Ridică-l și numărul scade mai lent; coboară-l și merge mai repede. Îl poți schimba oricând.',
    outOfTen: 'din 10',
    tolerableSetting: v => v <= 2 ? 'Strict. Numărul va scădea repede și zilele vor fi grele.'
      : v <= 5 ? 'Un loc rezonabil — zile neplăcute da, zile chinuitoare nu.'
      : 'Blând. Progresul va fi lent, dar tot progres.',
    setupTitle: 'Răspunsurile din prima zi',
    setupBody: 'Întrebate o dată, păstrate definitiv. Ele stabilesc mărimea fiecărui pas.',
    setupRow1: 'Fumate într-o zi normală',
    setupRow2: 'Cât înlătură complet disconfortul',
    setupRow3: 'Disconfortul fără niciuna',
    previewToggle: c => c.open ? 'Ascunde explicația' : 'Ce înseamnă asta?',
    livePreview: c => 'O țigară corespunde a ' + c.perCig + ' puncte pe scala de disconfort, deci fiecare punct sub cât poți suporta scade numărul de mâine cu aproximativ ' + c.perPoint + ' țigări.',
    ceilingNote: c => 'Cele ' + c.start + ' pe zi sunt și o limită de sus: o zi grea poate ridica numărul puțin, dar niciodată peste cât aveai la început.',
    dataTitle: 'Înregistrarea ta',
    dataBody: 'Fiecare seară se salvează pe acest telefon pe măsură ce răspunzi. Nimic nu pleacă de pe dispozitiv dacă nu trimiți tu.',
    dataStatus: c => c.rows + ' zile înregistrate, salvate ultima dată la ' + c.savedAt + '.',
    storageWarn: 'Acest telefon nu salvează răspunsurile — ziua de azi se va pierde când închizi aplicația. De obicei se rezolvă dacă o deschizi dintr-un link, nu dintr-un fișier.',
    syncNone: 'Încă nu există un cloud — zilele rămân pe acest telefon și se exportă manual.',
    syncSending: 'Se trimite…',
    syncWaiting: c => c.n === 1 ? 'O zi așteaptă să fie trimisă' : (c.n + ' zile așteaptă să fie trimise'),
    syncSent: c => 'Toate cele ' + c.n + ' zile au fost trimise',
    retry: 'Reîncearcă',
    exportCsv: 'Exportă ca CSV',
    sendCsv: 'Trimite CSV-ul autorului',
    sendNote: 'Deschide aplicația de email cu fișierul atașat, către pgradu@berkeley.edu. Nu se trimite nimic până nu apeși trimite.',
    redoSetup: 'Reia setarea',
    resetTitle: 'Începe de la zero',
    resetBody: 'Șterge toate zilele înregistrate și revine la primele întrebări. Nu se poate anula.',
    resetButton: 'Șterge tot și începe din nou',
    resetConfirm: 'Apasă din nou pentru a șterge tot',
    legalTitle: 'Înainte să te bazezi pe asta',
    paperNote: 'Numărul vine dintr-o lucrare de cercetare: Online Control for Adaptive Tapering of Medications (Gradu & Recht, 2023). Ea calculează cea mai mică doză care te ține deasupra nivelului pe care spui că îl poți suporta și o ajustează din propriile tale răspunsuri, nu după un program fix.',
    legalBody: 'Aceasta este un experiment personal, nu îngrijire medicală și nu un dispozitiv medical. Sugerează un număr — decizia rămâne mereu a ta, iar nimeni dintre cei care au făcut aplicația nu răspunde pentru ce urmează. Dacă renunțarea merge prost, vorbește cu un medic, nu cu acest ecran.',
    agree: c => c.agreed ? 'Am înțeles ✓' : 'Am înțeles',

    tomorrow: 'Mâine',
    today: 'Astăzi',
    resultHeadline: c => c.next === 0 ? 'Mâine, niciuna'
      : c.next > c.taken ? 'Puțin mai mult loc mâine'
      : c.next < c.taken ? 'Mâine scade la ' + c.next
      : 'Mâine tot la fel',
    resultBody: c => c.next === 0
      ? 'Ai spus ' + c.craving + ', sub cât poți suporta, și ești atât de aproape de zero că mâine este zero. Dacă vrei, numește ziua de azi ultima.'
      : c.next === c.taken
        ? 'Ai spus ' + c.craving + ', exact la nivelul pe care îl poți suporta. Nu este loc de scădere azi, deci mâine rămâne ' + c.next + '.'
      : c.err >= 0
        ? 'Ai spus ' + c.craving + ', cu ' + c.err + ' sub cât poți suporta. Acel loc valorează cam ' + (c.taken - c.next) + ', deci mâine sunt ' + c.next + '.'
        : 'Ai spus ' + c.craving + ', peste ' + c.floor + ' cu care puteai trăi astăzi. Mâine urcă la ' + c.next + ' ca să taie vârful, apoi continuă să scadă.',
    upTitle: c => c.atCeiling ? 'Înapoi de unde ai început' : 'Este permis să urce',
    upBody: c => c.atCeiling
      ? 'Aceasta este limita — ' + c.start + ' pe zi, numărul tău de la început. Aplicația nu trece peste el, oricât de grea ar fi ziua. Dacă zilele ajung mereu aici, poate ai pus prea jos cât poți suporta.'
      : 'O zi grea recuperează puțin. Nu este o resetare și nu este un eșec: numărul a urcat cu ' + (c.next - c.taken) + ' și va începe să scadă din nou imediat ce disconfortul scade.',
    numbersToggle: c => c.open ? 'Ascunde calculul' : 'Arată-mi calculul',
    mathCraving: 'Disconfortul de azi',
    mathTolerable: 'Cât puteai suporta azi',
    mathRoom: 'Loc rămas',
    mathOver: 'Peste cu',
    mathPerPoint: 'Țigări pe punct',
    mathTaken: 'Fumate azi',
    countTitle: 'Nu este numărul de azi',
    countBody: c => 'Ai numărat ' + c.n + ', iar numărul de azi era ' + c.dose + '. Confirmă cât ai fumat de fapt — numărul de mâine se calculează din asta, nu din cel primit.',
    countConfirm: c => 'Da, am fumat ' + c.n,
    countConfirmAlt: c => 'Nu, am fumat ' + c.dose,
    noteWhy: 'Ziua de azi nu a ieșit ca planul. Merită un rând despre de ce, cât mai ții minte.',
    countHint: c => c.n === 1 ? 'Ai numărat 1 pe parcurs' : 'Ai numărat ' + c.n + ' pe parcurs',
    // Added for the smoked-fewer check; not part of the originally approved copy.
    countLessTitle: c => 'Doar ' + c.n + ' azi?',
    countLessBody: c => 'Ești sigur că ai fumat doar ' + c.n + ', nu ' + c.dose + '?',
    mathTomorrow: c => 'Mâine, limitat la ' + c.start,
    accept: c => c.next === 0 ? 'Aceasta a fost ultima' : 'Pune ' + c.next + ' pentru mâine',

    // Added with the daily step limit. Not part of the copy approved in the
    // original build — review before relying on it.
    mathStep: 'Cel mult într-o zi',
    capBody: c => 'Ai spus ' + c.craving + '. Calculat din cât ai fumat azi (' + c.taken + '), mâine ar fi ' + c.raw + ' — dar numărul nu se schimbă cu mai mult de ' + c.step + ' de la o zi la alta, deci mâine sunt ' + c.next + '.',
    stepNote: c => 'De la o zi la alta se schimbă cu cel mult ' + c.step + '.',

    hardDayKicker: 'O zi grea',
    todayOnlyTitle: 'A avut ziua de azi nevoie de mai mult loc?',
    todayOnlyBody: c => 'De obicei te descurci cu un ' + c.tolerable + '. Unele zile nu sunt însă ziua pe care o ai. Dacă azi ți-a cerut mai mult, spune cât puteai suporta de fapt — doar pentru azi.',
    justToday: 'doar pentru azi',
    dayFloorNote: c => 'Semnul arată ' + c.tolerable + ' al tău obișnuit. Numărul de mâine se calculează față de ce pui aici.',
    todayOnlyConfirm: 'Atât a cerut ziua de azi',
    todayOnlySkip: c => 'Nu, ' + c.tolerable + ' a fost corect',
    andGenerally: 'Și în general?',
    baselineTitle: 'A fost doar azi, sau așa sunt toate zilele acum?',
    baselineBody: c => 'Ai spus că azi a avut nevoie de ' + c.dayFloor + ' în loc de ' + c.tolerable + '. Dacă așa se simt majoritatea zilelor acum, are sens să schimbi și setarea generală. Dacă a fost o excepție, las-o — procesul continuă ca înainte.',
    baselineYes: c => 'Fă din ' + c.dayFloor + ' obișnuitul meu',
    baselineNo: 'Doar azi — lasă cum era',

    ob: [
      { title: 'Un număr pe zi', body: 'În fiecare seară o singură întrebare: cât de mare a fost disconfortul? În fiecare dimineață un număr pentru ziua aceea. Asta este toată aplicația.' },
      { title: 'În ce limbă?', body: 'Poți schimba oricând din Setări.' },
      { title: 'Cum să ți se adreseze?', body: 'Folosit doar ca să te salute. Nu pleacă niciodată de pe telefon.' },
      { title: 'Câte fumezi într-o zi normală?', body: 'Pornește de unde ești de fapt. Acesta devine și maximul pe care aplicația îl va sugera vreodată.' },
      { title: 'Câte țigări pe zi îți înlătură complet disconfortul?', body: 'Numărul la care nu mai vrei încă una. Un interval este suficient — nimeni nu știe exact.' },
      { title: 'Și fără niciuna, cât de rău ar fi?', body: 'Zece înseamnă toată ziua, fără să te poți gândi la altceva.' },
      { title: 'Cu cât disconfort ai putea trăi?', body: 'Nu confortabil — suportabil, pentru o zi. Îl poți schimba oricând, iar într-o zi grea aplicația te va întreba dacă acea zi a cerut mai mult.' },
      { title: 'Un lucru care trebuie spus clar', body: 'Te rog citește înainte de a începe.' },
      { title: 'Asta e tot', body: 'Fără plan, fără program, fără o dată limită față de care să rămâi în urmă. Doar întrebarea din această seară.' }
    ],
    obNext: 'Mai departe',
    obStart: 'Trei întrebări și am terminat',
    obBegin: 'Începe astăzi',
    obBack: 'Înapoi',
    obClose: 'Închide',
    aDay: 'pe zi',
    to: 'până la',
    atFewest: 'Cel puțin',
    atMost: 'Cel mult',
    dontKnow: 'Nu știu',
    doneBody: 'La fel ca de obicei, intenționat. Nimic nu se schimbă până nu răspunzi la întrebarea unei seri.',
    tabToday: 'Astăzi', tabProgress: 'Progres', tabSettings: 'Setări'
  }
};


// Look up a string, calling it with ctx when it is a function.
export function t(lang, key, ctx) {
  const v = (STRINGS[lang] || STRINGS.en)[key];
  return typeof v === 'function' ? v(ctx) : v;
}
