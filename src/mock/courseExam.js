/**
 * แบบทดสอบปลายคอร์ส 50 ข้อ — คนละชุดกับแบบทดสอบท้ายบท
 *
 * ─────────────────────────────────────────────────────────────
 * ทำไมต้องแยกสองชุด
 * ─────────────────────────────────────────────────────────────
 * เดิมทุกทางเข้าได้ข้อสอบชุดเดียวกันหมด ทั้งปุ่มท้ายเพลย์ลิสต์และแท็บแบบทดสอบ
 * ผู้เรียนจึงแยกไม่ออกว่า "ทดสอบว่าเข้าใจบทนี้ไหม" กับ "สอบวัดระดับทั้งคอร์สเพื่อเอาวุฒิบัตร"
 * ต่างกันตรงไหน ทั้งที่เป็นคนละเรื่องกันคนละขนาด
 *
 *   ท้ายบท   เข้าจากหน้าวิดีโอ    ไม่เกิน 20 ข้อ   ผูกกับบทที่กำลังดู
 *   ปลายคอร์ส เข้าจากแท็บแบบทดสอบ  50 ข้อ          คลุมทั้งคอร์ส และเป็นที่มาของวุฒิบัตร
 *
 * ─────────────────────────────────────────────────────────────
 * ชุดนี้เป็นข้อสอบจำลอง ไม่ได้มาจากไฟล์ต้นฉบับ
 * ─────────────────────────────────────────────────────────────
 * ต่างจาก quizbank.js ที่แปลงมาจากไฟล์ Word ของทีมเนื้อหาจริง
 * ชุดนี้เขียนขึ้นเองเพื่อให้เห็นรูปร่างของข้อสอบปลายคอร์สว่าหน้าตาเป็นยังไง
 * เมื่อมีของจริงแล้วให้แทนที่ทั้งไฟล์ ไม่ต้องแก้ทีละข้อ
 *
 * มีสองชุดภาษา เพราะคอร์สที่เปิดสอบมีทั้ง CEFR (อังกฤษ) และ HSK (จีน)
 * ใช้ชุดอังกฤษกับข้อสอบ HSK ไม่ได้ ต่อให้เป็นข้อสอบจำลองก็ตาม
 *
 * ไฟล์นี้ไม่ import อะไรเลย — รับ course เข้ามาเป็นพารามิเตอร์
 * จึงไม่มีวงจร import กับ nodes.js และสคริปต์ตรวจสอบโหลดตรงๆ ได้
 */

/** จำนวนข้อของข้อสอบปลายคอร์ส — วุฒิบัตรอ้างเลขนี้ สองที่จึงไม่มีทางบอกคนละเลข */
export const COURSE_EXAM_TOTAL = 50;

/** เวลาที่ให้ 90 นาที — มากกว่าท้ายบทเท่าตัวครึ่ง เป็นสัญญาณแรกที่บอกว่าคนละขนาด */
const TIME_LIMIT_SEC = 90 * 60;
const PASS_MARK = 0.6;

/** เนื้อข้อสอบเป็นภาษาเป้าหมาย ทั้งสองภาษาจึงเป็นข้อความเดียวกัน (เหมือน quizbank.js) */
const bi = (s) => ({ th: s, en: s });
const LETTERS = ['a', 'b', 'c', 'd'];

/** ข้อปรนัยหนึ่งข้อ — เขียนย่อไว้ก่อน แล้วขยายเป็นรูปเต็มตอนประกอบชุด */
const mc = (prompt, choices, answer, why) => ({ prompt, choices, answer, why });

/* ============================================================
   ชุดภาษาอังกฤษ — ใช้กับคอร์ส CEFR (A1 · A2 · B1 · B2)
   ============================================================ */
const EN = {
  grammar: [
    mc('She ______ to the gym three times a week.', ['goes', 'go', 'going', 'is go'], 0, 'ประธานเอกพจน์บุรุษที่สามใน Present Simple ต้องเติม -s'),
    mc('If I ______ more time, I would learn another language.', ['had', 'have', 'will have', 'would have'], 0, 'Second conditional ใช้ past simple ในประโยค if'),
    mc('The report ______ by the finance team last Friday.', ['was written', 'wrote', 'has written', 'is writing'], 0, 'Passive voice ในอดีต: was/were + past participle'),
    mc('I have been working here ______ 2019.', ['since', 'for', 'from', 'during'], 0, '"since" ใช้กับจุดเริ่มต้น ส่วน "for" ใช้กับช่วงเวลา'),
    mc('He is not used to ______ in front of a crowd.', ['speaking', 'speak', 'spoke', 'be spoken'], 0, 'be used to + V-ing แปลว่า "เคยชินกับ"'),
    mc('You ______ have told me earlier — I could have helped.', ['should', 'must', 'can', 'would'], 0, 'should have + V3 ใช้ตำหนิสิ่งที่ควรทำแต่ไม่ได้ทำ'),
    mc('This is the colleague ______ helped me with the proposal.', ['who', 'which', 'whose', 'where'], 0, 'relative pronoun ที่แทนคนและทำหน้าที่ประธานคือ who'),
    mc('Neither of the applicants ______ the requirements.', ['meets', 'meet', 'are meeting', 'have met'], 0, '"neither of" ถือเป็นเอกพจน์ กริยาจึงเติม -s'),
    mc('By the time we arrived, the meeting ______.', ['had already started', 'already started', 'has already started', 'was already start'], 0, 'เหตุการณ์ที่เกิดก่อนอีกเหตุการณ์ในอดีตใช้ past perfect'),
    mc('I would rather you ______ tell anyone about this yet.', ["didn't", "don't", "won't", 'not'], 0, 'would rather + someone + past simple สำหรับเรื่องปัจจุบัน/อนาคต'),
    mc('The more he practised, ______ he became.', ['the more confident', 'more confident', 'the most confident', 'confident more'], 0, 'โครงสร้าง the + comparative, the + comparative'),
    mc('She asked me ______ I could finish the draft by Friday.', ['whether', 'that', 'what', 'if that'], 0, 'คำถาม yes/no ที่เล่าต่อใช้ whether หรือ if'),
    mc('Hardly ______ sat down when the phone rang.', ['had I', 'I had', 'did I', 'I did'], 0, 'ขึ้นต้นด้วย Hardly ต้องสลับประธานกับกริยาช่วย'),
    mc('This option is ______ expensive than the one we saw yesterday.', ['less', 'least', 'little', 'lesser'], 0, 'เปรียบเทียบขั้นกว่าทางลบใช้ less + adjective + than'),
    mc('We look forward to ______ from you soon.', ['hearing', 'hear', 'have heard', 'be heard'], 0, 'look forward to เป็นสำนวนที่ตามด้วย V-ing'),
    mc('The instructions were ______ confusing that nobody finished on time.', ['so', 'such', 'too', 'very'], 0, 'so + adjective + that / such + noun phrase + that'),
    mc('I wish I ______ harder for that exam.', ['had studied', 'studied', 'have studied', 'would study'], 0, 'เสียดายเรื่องในอดีตใช้ wish + past perfect'),
  ],

  reading: [
    {
      passage: `Working from the Kitchen Table

When Maya's company closed its offices, she thought working from home would be a holiday. Three months later she had learned otherwise. The commute was gone, but so was the line between her job and the rest of her life. She answered messages at nine in the evening because the laptop was right there on the kitchen table.

What finally helped was not a new app. It was a rule. At six o'clock the laptop went into a drawer and stayed there until morning. Her output did not fall. If anything, her mornings were sharper, because she had actually rested.

Her manager noticed and asked the team to try the same thing. Not everyone agreed at first. One colleague argued that flexibility was the whole point of remote work, and that fixed hours defeated it. Maya's answer was simple: flexibility means choosing your hours, not having none.`,
      items: [
        mc('What did Maya expect at first?', ['That working from home would be relaxing', 'That she would be promoted', 'That the office would reopen quickly', 'That she would need a new laptop'], 0, 'ย่อหน้าแรกบอกว่าเธอคิดว่าการทำงานที่บ้านจะเหมือนวันหยุด'),
        mc('What problem did she actually face?', ['Work and personal life blurred together', 'Her internet was too slow', 'Her manager checked on her constantly', 'She missed her commute'], 0, '"the line between her job and the rest of her life" หายไป'),
        mc('What solved the problem?', ['Putting the laptop away at a fixed time', 'Installing a time-tracking app', 'Moving to a bigger flat', 'Working fewer days per week'], 0, 'ข้อความบอกชัดว่าไม่ใช่แอปใหม่ แต่เป็นกฎเรื่องเวลา'),
        mc('What happened to her work output?', ['It stayed the same or improved', 'It dropped sharply', 'It became impossible to measure', 'It doubled within a week'], 0, '"Her output did not fall. If anything, her mornings were sharper"'),
        mc('What does Maya mean by flexibility?', ['Choosing your own hours rather than having no hours', 'Working whenever your manager asks', 'Never setting any schedule at all', 'Being able to change jobs easily'], 0, 'ประโยคสุดท้ายของบทความตอบข้อนี้โดยตรง'),
      ],
    },
    {
      passage: `The Night Market

Ask anyone in the city where to eat and they will send you to the night market. It opens when the day cools, around six, and the first stalls to appear are the ones selling grilled skewers and iced drinks. By eight the lane is so full that walking takes twice as long as it should.

Most visitors come for the food, but the market is also where the neighbourhood does its ordinary business. Parents buy school shoes. An old man repairs watches at a folding table he has used for thirty years. A woman sells nothing but plastic containers, stacked to the height of her shoulders.

Prices are not fixed, and bargaining is expected — but only up to a point. Push too hard and the seller will simply turn away, which is considered a fair answer rather than a rude one.`,
      items: [
        mc('When does the market open?', ['In the early evening', 'At noon', 'Before sunrise', 'Only at weekends'], 0, '"It opens when the day cools, around six"'),
        mc('What sells first?', ['Grilled skewers and cold drinks', 'School shoes', 'Plastic containers', 'Watch repairs'], 0, 'ย่อหน้าแรกระบุร้านที่มาก่อนคือไม้ย่างกับเครื่องดื่มเย็น'),
        mc('What does the second paragraph mainly show?', ['The market serves everyday local needs, not just tourists', 'The market is losing customers', 'Food stalls earn the most money', 'The market is only for older residents'], 0, 'ยกตัวอย่างของใช้ประจำวันหลายอย่างที่ขายในตลาด'),
        mc('What is said about the watch repairer?', ['He has worked at the same table for decades', 'He recently opened his stall', 'He sells watches rather than repairing them', 'He works only on weekends'], 0, '"a folding table he has used for thirty years"'),
        mc('What happens if a buyer bargains too aggressively?', ['The seller ends the conversation', 'The price is doubled', 'The buyer is asked to leave the market', 'Other sellers refuse to serve them'], 0, '"the seller will simply turn away"'),
      ],
    },
    {
      passage: `A Letter That Worked

Dear Ms Oduya,

I am writing about order 4417, which arrived on 3 March. Two of the six chairs were damaged: one has a cracked leg and the other is missing a fixing bolt. Photographs are attached.

I would like the two chairs replaced rather than refunded, as the set is no longer sold elsewhere. I understand replacements may take time, and I am happy to wait until the end of the month. If replacement is not possible, I would ask for a partial refund of the two items.

I have been a customer since 2021 and have never had a problem before, so I am confident this can be sorted out quickly.

Yours sincerely,
Daniel Okafor`,
      items: [
        mc('What is the main purpose of the letter?', ['To ask for two damaged chairs to be replaced', 'To cancel the whole order', 'To ask for a discount on a future order', 'To complain about a late delivery'], 0, 'ผู้เขียนขอเปลี่ยนเก้าอี้สองตัวที่เสียหาย ไม่ใช่ขอคืนเงิน'),
        mc('What is wrong with the items?', ['A cracked leg and a missing bolt', 'The wrong colour was sent', 'They arrived at the wrong address', 'They were the wrong size'], 0, 'ระบุไว้ตรงย่อหน้าแรก'),
        mc('Why does he prefer replacement over a refund?', ['The set is not available anywhere else', 'A refund would take longer', 'He has lost the receipt', 'The seller does not offer refunds'], 0, '"as the set is no longer sold elsewhere"'),
        mc('What deadline does he give?', ['The end of the month', 'Within 48 hours', 'Before 3 March', 'No deadline at all'], 0, '"I am happy to wait until the end of the month"'),
        mc('What is the tone of the letter?', ['Firm but polite', 'Angry and threatening', 'Casual and joking', 'Uncertain and apologetic'], 0, 'ระบุปัญหาชัดเจนพร้อมข้อเสนอ แต่ใช้ถ้อยคำสุภาพตลอด'),
      ],
    },
  ],

  listening: [
    {
      script: `Hello, this is Priya calling from Harbour Logistics about your delivery scheduled for tomorrow, Thursday the fourteenth. Unfortunately our driver has reported a problem with the vehicle, so we will not be able to deliver in the morning slot as arranged. We can still deliver tomorrow, but it would have to be between four and seven in the evening. Alternatively, if the evening does not suit you, the next available morning slot is Monday the eighteenth. Please call us back on 0-2-7-7-4-1-9-0-3 and let us know which you prefer. If we do not hear from you by six o'clock this evening, we will assume the evening delivery is acceptable and the driver will come tomorrow afternoon. Sorry again for the inconvenience.`,
      items: [
        mc('Why is the caller phoning?', ['A delivery time has to change', 'A payment has failed', 'An order has been cancelled', 'A new order has been placed'], 0, 'ผู้โทรแจ้งว่ารถมีปัญหาจึงส่งช่วงเช้าไม่ได้'),
        mc('What alternative is offered for tomorrow?', ['Delivery between four and seven in the evening', 'Delivery at noon', 'Collection from the depot', 'Delivery early on Friday'], 0, 'ระบุช่วงเวลาเย็นสี่โมงถึงหนึ่งทุ่ม'),
        mc('When is the next morning slot?', ['Monday the eighteenth', 'Friday the fifteenth', 'Saturday the sixteenth', 'Thursday next week'], 0, 'บอกไว้ชัดว่าช่วงเช้าถัดไปคือวันจันทร์ที่ 18'),
        mc('What happens if the customer does not call back?', ['The evening delivery goes ahead', 'The order is cancelled', 'The company calls again tomorrow', 'The delivery moves to Monday'], 0, '"we will assume the evening delivery is acceptable"'),
      ],
    },
    {
      script: `Right, let's start. Most of you have heard that adults need eight hours of sleep. That number is an average, not a rule, and the useful range is closer to seven to nine. What matters more than the total is the regularity. Going to bed and getting up at roughly the same time, including at weekends, does more for how you feel than adding an extra hour on a Sunday. Now, one common mistake is trying to catch up. If you sleep five hours during the week and twelve on Saturday, you have not repaid the debt; you have simply moved your body clock. The second mistake is caffeine. It stays in your system far longer than most people expect — roughly half of it is still there five to six hours later. So a four o'clock coffee is still working at ten. If you take one thing away today, take this: fix the time you get up, and the rest tends to follow.`,
      items: [
        mc('What does the speaker say about eight hours?', ['It is an average rather than a rule', 'It is the minimum for everyone', 'It is too much for most adults', 'It applies only to teenagers'], 0, '"That number is an average, not a rule"'),
        mc('What matters more than the total hours?', ['Keeping a regular schedule', 'Sleeping in a dark room', 'Exercising before bed', 'Counting sleep cycles'], 0, '"What matters more than the total is the regularity"'),
        mc('What does the speaker say about catching up at weekends?', ['It shifts your body clock instead of repaying sleep', 'It works if you sleep twelve hours', 'It is the best way to recover', 'It only helps in winter'], 0, '"you have not repaid the debt; you have simply moved your body clock"'),
        mc('How long does caffeine stay active?', ['About half of it remains after five to six hours', 'It is gone within two hours', 'It lasts a full twenty-four hours', 'It depends entirely on body weight'], 0, 'ผู้พูดระบุว่าครึ่งหนึ่งยังอยู่หลังผ่านไป 5-6 ชั่วโมง'),
      ],
    },
    {
      script: `A: Morning. I need to book a room for a client meeting next week — probably Wednesday.
B: Wednesday is quite busy. How many people, and how long do you need it?
A: Six of us, and about two hours. Ideally late morning, so we can go straight to lunch afterwards.
B: Let me look. Wednesday, the boardroom is taken all morning by the audit team. I could give you the small meeting room at eleven, but it only seats four comfortably.
A: That is too small. What about Thursday?
B: Thursday morning the boardroom is free from nine thirty. Would ten to twelve work?
A: That works. Can you also arrange coffee for six at ten?
B: Yes. And do you need the screen and the video link set up?
A: The screen yes, video link no — everyone is coming in person.
B: Fine. I will send you a confirmation this afternoon.`,
      items: [
        mc('Which day do they finally book?', ['Thursday', 'Wednesday', 'Monday', 'Friday'], 0, 'ห้องประชุมใหญ่ว่างวันพฤหัสบดี จึงย้ายไปวันนั้น'),
        mc('Why is the small meeting room rejected?', ['It seats only four people comfortably', 'It has no screen', 'It is being redecorated', 'It is on the wrong floor'], 0, 'ผู้พูด B บอกว่าห้องเล็กนั่งสบายได้แค่สี่คน'),
        mc('What time is the room booked for?', ['Ten to twelve', 'Nine thirty to eleven', 'Eleven to one', 'Two to four'], 0, '"Would ten to twelve work?" แล้ว A ตอบว่าใช้ได้'),
        mc('What extra arrangements are requested?', ['Coffee for six and a screen', 'Coffee and a video link', 'Lunch and a screen', 'A video link only'], 0, 'ขอกาแฟหกที่และจอ แต่ไม่เอา video link'),
      ],
    },
  ],

  open: [
    {
      type: 'typing',
      skill: 'writing',
      prompt: 'Email: asking for a deadline extension',
      instruction:
        'Write an email of about 80–120 words to your manager asking to move a project deadline by one week. Give a reason, say what you have already finished, and propose a new date.',
      guidelines: [
        'ขึ้นต้นและลงท้ายให้ตรงกับระดับความเป็นทางการของอีเมลถึงหัวหน้า',
        'บอกเหตุผลหนึ่งข้อให้ชัด อย่าขอโทษยืดยาว',
        'ระบุสิ่งที่ทำเสร็จแล้ว เพื่อให้เห็นว่างานไม่ได้หยุดนิ่ง',
        'เสนอวันใหม่ที่เจาะจง ไม่ใช่ "อีกสักหน่อย"',
      ],
      starter: 'Dear …, I am writing to ask whether …',
      sample:
        'Dear Khun Somchai, I am writing to ask whether the deadline for the supplier report could be moved from 14 to 21 March. Two of the three suppliers replied late, and I would rather submit complete figures than partial ones. The market analysis and the cost tables are already finished, and I have drafted the summary. With one extra week I can include the final supplier data and check the totals properly. Please let me know if the new date causes a problem for the board meeting. Kind regards, …',
    },
    {
      type: 'typing',
      skill: 'writing',
      prompt: 'Opinion: should companies keep remote work?',
      instruction:
        'Write about 100–150 words giving your opinion on whether companies should let staff keep working from home. Give two reasons and one point that someone might disagree with.',
      guidelines: [
        'บอกจุดยืนให้ชัดในประโยคแรก',
        'สองเหตุผลต้องไม่ใช่เรื่องเดียวกันพูดสองรอบ',
        'ยกข้อโต้แย้งของอีกฝ่ายมาหนึ่งข้อ แล้วตอบ',
        'ใช้คำเชื่อมอย่าง however, on the other hand, that said',
      ],
      starter: 'In my opinion, companies should …',
      sample:
        'In my opinion, companies should keep the option of working from home rather than removing it. First, people who avoid a long commute get back an hour or more each day, and most of them spend part of it on work. Second, teams can hire outside the city, which widens the pool considerably. That said, the argument against it is real: new employees learn far less when nobody is sitting beside them. The fairest answer is probably a fixed number of office days each week, decided by the team rather than by head office.',
    },
    {
      type: 'typing',
      skill: 'writing',
      prompt: 'Describe a place you would recommend',
      instruction:
        'Write about 80–120 words describing a place you would recommend to a visitor. Say what it is, when to go, and one thing to avoid.',
      guidelines: [
        'เลือกที่เดียวแล้วลงรายละเอียด ดีกว่าเล่าสามที่แบบผิวๆ',
        'ใช้คำคุณศัพท์ที่เห็นภาพ ไม่ใช่ good กับ nice ซ้ำๆ',
        'บอกช่วงเวลาที่ควรไปพร้อมเหตุผล',
        'ปิดท้ายด้วยคำเตือนหนึ่งข้อที่เป็นประโยชน์จริง',
      ],
      starter: 'If you only have one afternoon, go to …',
      sample:
        'If you only have one afternoon, go to the old harbour just before sunset. The light turns the warehouses orange, and the fishing boats come back between five and six, which is the busiest and most interesting hour. There is a row of small restaurants along the water; the third one from the end is the one locals use. Avoid the weekend if you can — the same walk takes three times as long, and the tables are booked out by four. Bring a jacket, because the wind picks up as soon as the sun goes down.',
    },
    {
      type: 'typing',
      skill: 'writing',
      prompt: 'Summarise a problem and propose a solution',
      instruction:
        'Your team keeps missing small deadlines. Write about 100–150 words describing the problem and proposing one concrete change.',
      guidelines: [
        'อธิบายปัญหาด้วยข้อเท็จจริง ไม่ใช่การตำหนิคน',
        'เสนอทางแก้เพียงข้อเดียวแต่เจาะจงพอจะลงมือได้',
        'บอกว่าจะรู้ได้ยังไงว่าทางแก้นั้นได้ผล',
        'ความยาวย่อหน้าไม่ควรเกินสามถึงสี่ประโยค',
      ],
      starter: 'Over the last two months, …',
      sample:
        'Over the last two months, roughly a third of our small deliverables have arrived a day or two late. The pattern is consistent: the work itself is finished on time, but the review step has no owner, so items sit waiting. I would like to try one change. Every task gets a named reviewer at the moment it is created, not after the work is done. If the reviewer cannot take it, they hand it back the same day. We can measure this easily — if the gap between "work finished" and "task closed" drops below twenty-four hours within a month, the change is working.',
    },
    {
      type: 'speaking',
      skill: 'speaking',
      prompt: 'Introduce yourself and your work',
      instruction:
        'Speak for about one minute. Say who you are, what you do, and one thing you are working on at the moment.',
      guidelines: [
        'พูดต่อเนื่องราวหนึ่งนาที ไม่ต้องรีบจบ',
        'เล่าเรื่องที่กำลังทำอยู่หนึ่งเรื่องให้เห็นภาพ ดีกว่าไล่ตำแหน่งงาน',
        'ระวังการออกเสียงลงท้าย -s และ -ed',
        'จบด้วยประโยคที่ชวนให้ถามต่อ',
      ],
      sample:
        'Hi, my name is …, and I work as a … at …. Most of my week is spent on …, which basically means …. At the moment I am working on …, and the interesting part is that …. If it goes well, we should be able to …. Outside work I …, which is probably why I ….',
    },
    {
      type: 'speaking',
      skill: 'speaking',
      prompt: 'Explain a decision you made and why',
      instruction:
        'Speak for about ninety seconds about a decision you made recently. Explain the options, what you chose, and whether you would choose the same again.',
      guidelines: [
        'วางโครงเป็นสามช่วง: ทางเลือก · สิ่งที่เลือก · ผลที่ตามมา',
        'ใช้ past tense ให้สม่ำเสมอเมื่อเล่าเหตุการณ์',
        'ใส่คำเชื่อมอย่าง in the end, looking back, if I had to choose again',
        'ตอบให้ตรงว่าจะเลือกเหมือนเดิมไหม อย่าเลี่ยง',
      ],
      sample:
        'A few months ago I had to decide whether to …. On one hand, …; on the other hand, …. In the end I chose … mainly because …. Looking back, it turned out …, which I did not expect. If I had to choose again, I would probably …, although I would ….',
    },
  ],
};

/* ============================================================
   ชุดภาษาจีน — ใช้กับคอร์ส HSK (ระดับ 4 · 5 · 6)
   ============================================================ */
const ZH = {
  grammar: [
    mc('他每天早上六点______起床。', ['就', '才', '还', '再'], 0, '"就" ใช้แสดงว่าเกิดขึ้นเร็วกว่าที่คาด ส่วน "才" คือช้ากว่าที่คาด'),
    mc('这个问题比我想象的______复杂。', ['还要', '很', '太', '非常'], 0, 'ประโยคเปรียบเทียบด้วย "比" ใช้ "还/更/还要" ขยาย ไม่ใช้ "很/太"'),
    mc('他把钥匙______在桌子上了。', ['放', '放着', '被放', '放了放'], 0, 'ประโยค "把" ต้องตามด้วยกริยาและส่วนเสริม เช่น 放在…上'),
    mc('我们已经等了______一个小时了。', ['快', '将要', '正在', '刚才'], 0, '"快…了" ใช้บอกว่าใกล้ถึงจำนวนหรือเวลานั้น'),
    mc('这件事______他来处理最合适。', ['由', '被', '把', '让给'], 0, '"由" ใช้ระบุผู้รับผิดชอบดำเนินการ'),
    mc('无论天气怎么样，比赛______会照常进行。', ['都', '就', '却', '才'], 0, '"无论…都…" เป็นคู่คำเชื่อมที่ต้องใช้ด้วยกัน'),
    mc('他不但会说汉语，______会写汉字。', ['而且', '但是', '所以', '因为'], 0, '"不但…而且…" ใช้เพิ่มระดับความเข้ม'),
    mc('这本书我看______三遍了。', ['过', '了', '着', '起来'], 1, 'เน้นจำนวนครั้งที่ทำเสร็จแล้วใช้ "了" คู่กับ 遍'),
    mc('虽然他很忙，______每天都坚持锻炼。', ['但是', '而且', '因此', '于是'], 0, '"虽然…但是…" เป็นคู่คำเชื่อมแสดงการขัดแย้ง'),
    mc('你______早点儿告诉我就好了。', ['要是', '除非', '尽管', '幸亏'], 0, '"要是…就好了" ใช้แสดงความเสียดายกับสิ่งที่ไม่ได้เกิดขึ้น'),
    mc('房间被他打扫得______干净。', ['很', '非常地', '得很', '太了'], 0, 'โครงสร้าง 得 + คำวิเศษณ์ + คำคุณศัพท์'),
    mc('他一边走，______打电话。', ['一边', '一面就', '又', '再'], 0, '"一边…一边…" ใช้กับสองการกระทำที่เกิดพร้อมกัน'),
    mc('这种方法______别的方法有效得多。', ['比', '跟', '像', '对'], 0, 'ประโยคเปรียบเทียบขั้นกว่าใช้ "比"'),
    mc('他刚来的时候，一句汉语______不会说。', ['也', '就', '还', '才'], 0, '"一…也不…" ใช้เน้นการปฏิเสธอย่างสิ้นเชิง'),
    mc('会议______下午三点开始。', ['将于', '将要在了', '正在于', '快要在'], 0, '"将于 + เวลา" เป็นรูปแบบทางการที่ใช้ในประกาศ'),
    mc('只有努力，______能取得好成绩。', ['才', '就', '都', '还'], 0, '"只有…才…" เป็นคู่คำเชื่อมแสดงเงื่อนไขจำเป็น'),
    mc('他把这件事看得______重。', ['很', '非常了', '太了', '更加地'], 0, '得 + 很 เป็นรูปเสริมระดับที่ใช้ได้ทั่วไป'),
  ],

  reading: [
    {
      passage: `请假的规矩

小林进公司的第一个月就发现，这里请假不看你写了多少字，而看你提前多久说。同事们私下总结了一条规矩：临时的事，当天早上说；能提前知道的事，至少提前三天说。

有一次他生病，早上七点给主管发消息，主管很快回复"好好休息"，并没有多问。可是另一次他提前一天才说要参加朋友的婚礼，主管却把这一周的排班表发给他，让他自己看谁能替他。

小林后来明白了，主管在意的不是理由，而是别人有没有时间调整。理由再充分，如果留给同事的时间不够，代价还是别人来承担。`,
      items: [
        mc('公司请假最重要的是什么？', ['提前多久告知', '请假的理由是否充分', '写的申请是否详细', '请假天数的多少'], 0, 'ย่อหน้าแรกสรุปกฎว่าดูที่บอกล่วงหน้านานแค่ไหน'),
        mc('小林生病那次，主管的反应是什么？', ['很快让他休息，没有多问', '要求他补交证明', '让他自己找人替班', '批评他通知太晚'], 0, '主管回复"好好休息"并没有多问'),
        mc('参加婚礼那次，主管做了什么？', ['把排班表发给他，让他自己找人替', '直接拒绝了他', '让他改期请假', '同意但扣了工资'], 0, 'ระบุไว้ตรงย่อหน้าที่สอง'),
        mc('小林最后明白了什么？', ['关键是别人有没有时间调整', '请假必须写正式申请', '生病比婚礼更容易请假', '主管其实不喜欢他'], 0, 'ย่อหน้าสุดท้ายบอกว่าสิ่งที่หัวหน้าสนใจคือเวลาที่เหลือให้คนอื่นปรับตัว'),
        mc('这篇文章主要想说明什么？', ['提前通知比理由更重要', '公司的制度不合理', '生病时应该马上请假', '同事之间要互相帮助'], 0, 'ใจความหลักของทั้งบทความคือการบอกล่วงหน้าสำคัญกว่าเหตุผล'),
      ],
    },
    {
      passage: `一家不做外卖的面馆

城里的面馆几乎都上了外卖平台，只有街角这一家没有。老板娘的理由很直接：面泡在汤里超过十分钟就不是那碗面了，客人吃到的是另一种东西，却记在她的名下。

有人劝她可以做干拌的，汤单独装。她试过两个星期，最后还是停了。不是因为卖得不好，恰恰相反，订单多得让堂食的客人等太久。

现在她的店只做堂食，中午十一点半到两点，晚上五点到八点半。门口经常排队，但没人抱怨，因为大家都知道，队伍前进的速度是稳定的。`,
      items: [
        mc('老板娘为什么不做外卖？', ['面在汤里泡久了就变了味道', '平台收费太高', '没有人手送餐', '店里没有打包盒'], 0, '理由是面泡在汤里超过十分钟就不是那碗面了'),
        mc('她试过什么办法？', ['汤和面分开装的干拌面', '延长营业时间', '涨价控制订单', '换一个外卖平台'], 0, '有人劝她做干拌的，汤单独装，她试过两个星期'),
        mc('这个办法为什么停了？', ['订单太多，堂食客人等太久', '卖得不好', '成本太高', '客人投诉包装'], 0, '"恰恰相反，订单多得让堂食的客人等太久"'),
        mc('这家店现在的营业方式是什么？', ['只做堂食，分中午和晚上两段', '全天营业', '只做晚上', '只接受预约'], 0, 'ย่อหน้าสุดท้ายระบุเวลาเปิดสองช่วง'),
        mc('客人为什么不抱怨排队？', ['队伍前进的速度稳定', '排队时有免费茶水', '队伍其实很短', '老板娘会道歉'], 0, '"因为大家都知道，队伍前进的速度是稳定的"'),
      ],
    },
    {
      passage: `通知

各位同事：

公司将于本月二十日至二十二日进行网络系统升级。升级期间，内部邮件和文件共享系统会分时段暂停，具体安排如下：二十日晚上八点至十二点，邮件系统暂停；二十一日全天，文件共享系统只能读取，不能上传；二十二日上午，两个系统都会短暂中断，预计不超过两小时。

请各部门提前把二十二日之前需要提交的材料上传完毕。如遇紧急情况，请直接联系信息部值班电话，不要发邮件。

给大家带来不便，敬请谅解。

信息部
本月十二日`,
      items: [
        mc('这次升级一共几天？', ['三天', '两天', '一天', '一个星期'], 0, '本月二十日至二十二日 คือสามวัน'),
        mc('二十一日文件共享系统的情况是什么？', ['只能读取，不能上传', '完全停止使用', '正常使用', '只能上传，不能下载'], 0, 'ระบุไว้ตรงในประกาศ'),
        mc('邮件系统什么时候暂停？', ['二十日晚上八点到十二点', '二十一日全天', '二十二日全天', '三天都暂停'], 0, 'ประกาศระบุช่วงเวลาไว้ชัดเจน'),
        mc('遇到紧急情况应该怎么做？', ['打信息部值班电话', '发邮件给信息部', '等升级结束再说', '联系本部门主管'], 0, '"请直接联系信息部值班电话，不要发邮件"'),
        mc('这份通知要求同事做什么准备？', ['提前上传二十二日之前要交的材料', '备份个人电脑', '这三天在家办公', '更换新的账号密码'], 0, 'ย่อหน้าที่สองระบุให้อัปโหลดล่วงหน้า'),
      ],
    },
  ],

  listening: [
    {
      script: `喂，是王先生吗？我是快递公司的，您有一个包裹今天下午送到。本来说好三点到五点之间，但是我们这边车出了点问题，下午可能来不了了。您看这样行不行：要么今天晚上七点以后我给您送过去，要么改到明天上午九点到十一点。如果您今天晚上不在家，明天上午是最快的时间了。麻烦您收到消息以后回个电话，号码就是这个。如果六点之前没接到您的电话，我就默认送明天上午了。不好意思啊，给您添麻烦了。`,
      items: [
        mc('打电话的人是做什么的？', ['快递员', '公司同事', '房东', '银行工作人员'], 0, '开头就说"我是快递公司的"'),
        mc('原来约定的送货时间是什么时候？', ['今天下午三点到五点', '今天晚上七点以后', '明天上午九点到十一点', '明天下午'], 0, '"本来说好三点到五点之间"'),
        mc('如果王先生今天晚上不在家，最快什么时候能收到？', ['明天上午九点到十一点', '今天晚上七点', '明天下午', '后天上午'], 0, '"明天上午是最快的时间了"'),
        mc('如果王先生没有回电话会怎么样？', ['默认改到明天上午送', '包裹会被退回', '快递员会再打一次', '包裹放在门口'], 0, '"如果六点之前没接到您的电话，我就默认送明天上午了"'),
      ],
    },
    {
      script: `很多人以为背单词最重要的是数量，其实不是。研究发现，同样花一个小时，一次背一百个然后再也不看，和分五天每天背二十个再复习，效果差得很远。后者能记住的大概是前者的三倍。原因很简单：记忆靠的是重复见面，不是一次见面见很久。还有一点也常被忽略，就是背单词的时候最好把它放在句子里。单独记"承担"这两个字，过两天就模糊了；但如果记的是"这个责任由他承担"，你同时记住了它怎么用。所以我的建议是：每天少一点，天数多一点，而且一定要带着句子。`,
      items: [
        mc('说话人认为背单词最重要的是什么？', ['重复见面的次数', '一次背的数量', '花的总时间', '使用的教材'], 0, '"记忆靠的是重复见面，不是一次见面见很久"'),
        mc('分五天每天背二十个的效果怎么样？', ['大约是一次背一百个的三倍', '和一次背一百个差不多', '不如一次背一百个', '文中没有提到'], 0, '"后者能记住的大概是前者的三倍"'),
        mc('说话人建议怎样记单词？', ['把单词放在句子里记', '只记最常用的单词', '用图片帮助记忆', '每天写十遍'], 0, '"背单词的时候最好把它放在句子里"'),
        mc('这段话主要讲什么？', ['背单词的方法', '汉语考试的技巧', '记忆力的训练', '学习计划的制定'], 0, 'ทั้งย่อหน้าพูดเรื่องวิธีท่องคำศัพท์'),
      ],
    },
    {
      script: `女：下周三的会议室你订好了吗？
男：还没有，我正想问你，我们大概几个人？
女：加上客户一共八个，时间要两个小时，最好是上午。
男：八个人的话小会议室坐不下，得订大会议室。不过大会议室下周三上午被市场部占了。
女：那下周四呢？
男：我看看……下周四上午十点以后是空的。十点到十二点行吗？
女：可以。另外能不能准备八杯咖啡，十点送进来？
男：没问题。投影仪要用吗？
女：要用，但是不需要视频会议，客户都是当面来。
男：好，我下午把确认单发给你。`,
      items: [
        mc('他们最后订了哪一天的会议室？', ['下周四', '下周三', '下周五', '这周三'], 0, '大会议室下周三上午被占了，所以改到下周四'),
        mc('为什么不能用小会议室？', ['八个人坐不下', '小会议室在装修', '小会议室没有投影仪', '离客户停车的地方太远'], 0, '"八个人的话小会议室坐不下"'),
        mc('会议定在什么时间？', ['十点到十二点', '九点到十一点', '十一点到一点', '下午两点到四点'], 0, '"十点到十二点行吗？" 女方回答"可以"'),
        mc('女的还要求准备什么？', ['八杯咖啡和投影仪', '咖啡和视频会议设备', '午餐和投影仪', '只要投影仪'], 0, '要八杯咖啡和投影仪，但不需要视频会议'),
      ],
    },
  ],

  open: [
    {
      type: 'typing',
      skill: 'writing',
      prompt: '写一封请假邮件',
      instruction: '给主管写一封八十到一百二十字的邮件，说明你需要请假两天，写清原因、已经完成的工作和交接安排。',
      guidelines: [
        '开头和结尾要符合写给主管的正式程度',
        '原因写一条就够，不要反复道歉',
        '说明哪些工作已经做完，让人放心',
        '写清楚这两天谁接手、怎么联系你',
      ],
      starter: '主管您好，我想申请……',
      sample:
        '主管您好，我想申请下周一和周二请假两天，因为家里有事需要回老家一趟。本周需要提交的供应商报表我已经做完，今天下午会上传到共享文件夹。这两天如果有紧急情况，可以先找小李，我已经把项目进度和联系人发给他了。我周三上午会正常到岗。麻烦您批准，谢谢。',
    },
    {
      type: 'typing',
      skill: 'writing',
      prompt: '谈谈你对"在家办公"的看法',
      instruction: '写一百到一百五十字，说明你支持还是反对在家办公，给出两个理由，并写一条别人可能不同意的地方。',
      guidelines: [
        '第一句话就把立场说清楚',
        '两个理由不要是同一件事说两遍',
        '主动写出反方的一个理由，再回应它',
        '用"首先、其次、不过、总的来说"等连接词',
      ],
      starter: '我认为公司应该……',
      sample:
        '我认为公司应该保留在家办公的选择，而不是完全取消。首先，省下来的通勤时间不少人会花在工作上，效率反而更高。其次，公司可以招到不住在本市的人，选择范围大了很多。不过，反对的理由也很实在：新员工在家学不到东西，因为身边没有人可以随时问。总的来说，比较公平的做法是每周固定几天到公司，具体哪几天由团队自己决定。',
    },
    {
      type: 'typing',
      skill: 'writing',
      prompt: '介绍一个你会推荐的地方',
      instruction: '写八十到一百二十字，介绍一个你会推荐给外地朋友的地方，说明它是什么、什么时候去最好、有什么要注意的。',
      guidelines: [
        '只写一个地方，写细一点',
        '用具体的词，不要一直用"很好""不错"',
        '说明最佳时间并给出理由',
        '结尾提醒一件真正有用的事',
      ],
      starter: '如果你只有一个下午，就去……',
      sample:
        '如果你只有一个下午，就去老码头。太阳快落山的时候，仓库的墙会被照成橘色，渔船大概五点到六点之间回来，那一个小时最热闹。水边有一排小饭馆，从最里面数第三家是本地人常去的。周末最好别去，同样一段路要多走两三倍的时间，桌子四点就订完了。另外记得带件外套，太阳一下去风就起来了。',
    },
    {
      type: 'typing',
      skill: 'writing',
      prompt: '说明一个问题并提出解决办法',
      instruction: '你们团队经常小事拖延一两天。写一百到一百五十字，说明问题出在哪里，并提出一个具体的改进办法。',
      guidelines: [
        '用事实描述问题，不要指责某个人',
        '只提一个办法，但要具体到能马上做',
        '说明怎么判断这个办法有没有效果',
        '每段不超过三四句话',
      ],
      starter: '最近两个月，……',
      sample:
        '最近两个月，我们大约三分之一的小任务都晚交了一两天。情况其实很一致：活儿本身按时做完了，但是审核这一步没有固定的人负责，任务就一直放在那里等。我想试一个办法：任务建立的时候就写上审核人的名字，而不是等做完再找。如果审核人当天接不了，就当天退回来。效果也好判断——如果一个月内"做完"到"关闭"之间的时间能降到二十四小时以内，就说明这个办法有用。',
    },
    {
      type: 'speaking',
      skill: 'speaking',
      prompt: '介绍你自己和你的工作',
      instruction: '说一分钟左右，介绍你是谁、做什么工作，以及你现在正在做的一件事。',
      guidelines: [
        '说满一分钟左右，不用着急结束',
        '把正在做的一件事讲清楚，比列职位更有意思',
        '注意声调，特别是三声和四声连读',
        '结尾留一句让人想继续问的话',
      ],
      sample:
        '大家好，我叫……，在……工作，主要负责……。简单说就是……。我现在正在做的一件事是……，比较有意思的地方在于……。如果顺利的话，我们应该可以……。工作之外我喜欢……，可能也是因为这个，我才……。',
    },
    {
      type: 'speaking',
      skill: 'speaking',
      prompt: '说说你最近做的一个决定',
      instruction: '说一分半左右，讲一个你最近做的决定：当时有哪些选择、你选了什么、如果再来一次会不会一样。',
      guidelines: [
        '按"有哪些选择—选了什么—结果如何"三段来说',
        '讲过去的事要一直用过去的时间词',
        '用"一方面…另一方面…、最后、现在回过头看"等连接词',
        '最后明确回答会不会做同样的选择',
      ],
      sample:
        '几个月前我需要决定要不要……。一方面……，另一方面……。最后我选了……，主要是因为……。现在回过头看，结果是……，这一点我当时没想到。如果再来一次，我可能还是会……，不过我会……。',
    },
  ],
};

/* ============================================================
   ประกอบเป็นชุดข้อสอบ
   ============================================================ */

const TOPICS = [
  { id: 'grammar', label: { th: 'ไวยากรณ์', en: 'Grammar' } },
  { id: 'reading', label: { th: 'การอ่าน', en: 'Reading' } },
  { id: 'listening', label: { th: 'การฟัง', en: 'Listening' } },
  { id: 'writing', label: { th: 'การเขียน', en: 'Writing' } },
  { id: 'speaking', label: { th: 'การพูด', en: 'Speaking' } },
];

/**
 * ขยายข้อย่อเป็นรูปเต็มที่ QuestionCard อ่านได้
 * ตัวเลือกเก็บเป็นสตริงล้วนตอนเขียน แล้วติดป้าย ก-ง ตรงนี้ที่เดียว
 * ถ้าให้เขียนป้ายเองทุกข้อ วันหนึ่งจะมีข้อที่ป้ายซ้ำหรือเฉลยชี้ป้ายที่ไม่มีอยู่
 */
function toQuestion(raw, id, skill, extra = {}) {
  return {
    id,
    type: 'single',
    skill,
    prompt: bi(raw.prompt),
    choices: raw.choices.map((text, i) => ({ id: LETTERS[i], text: bi(text) })),
    answerIds: [LETTERS[raw.answer]],
    explanation: bi(raw.why),
    ...extra,
  };
}

function buildQuestions(pack, prefix) {
  const out = [];
  const push = (q) => out.push(q);

  pack.grammar.forEach((raw, i) => push(toQuestion(raw, `${prefix}-g${i + 1}`, 'grammar')));

  pack.reading.forEach((block, bi_) =>
    block.items.forEach((raw, i) =>
      push(toQuestion(raw, `${prefix}-r${bi_ + 1}-${i + 1}`, 'reading', { passage: bi(block.passage) })),
    ),
  );

  pack.listening.forEach((block, bi_) =>
    block.items.forEach((raw, i) =>
      // audioScript ห้ามโผล่เป็นตัวหนังสือระหว่างทำข้อสอบ ไม่งั้นข้อการฟังกลายเป็นข้อการอ่าน
      // QuestionCard เป็นคนคุมเรื่องนี้ ที่นี่แค่แนบมาให้
      push(toQuestion(raw, `${prefix}-l${bi_ + 1}-${i + 1}`, 'listening', { audioScript: block.script })),
    ),
  );

  pack.open.forEach((raw, i) =>
    push({
      id: `${prefix}-o${i + 1}`,
      type: raw.type,
      skill: raw.skill,
      prompt: bi(raw.prompt),
      instruction: bi(raw.instruction),
      guidelines: raw.guidelines.map(bi),
      ...(raw.starter ? { starter: bi(raw.starter) } : {}),
      sample: bi(raw.sample),
      // ไม่มี answerIds โดยตั้งใจ — scoreQuiz จะตัดออกจากตัวหารแล้วขึ้นว่า "รอผู้สอนตรวจ"
    }),
  );

  return out;
}

const PACKS = { en: buildQuestions(EN, 'ce-en'), zh: buildQuestions(ZH, 'ce-zh') };

if (import.meta.env?.DEV) {
  for (const [lang, qs] of Object.entries(PACKS)) {
    if (qs.length !== COURSE_EXAM_TOTAL)
      console.warn(`[courseExam] ชุด ${lang} มี ${qs.length} ข้อ ควรเป็น ${COURSE_EXAM_TOTAL}`);
  }
}

/**
 * ใบคำตอบจำลอง — มีไว้ให้หน้าผลสอบมีอะไรให้ดู
 *
 * ถ้าไม่มี ทุกข้อจะนับเป็นตอบไม่ครบ คะแนนออกมา 0/44 ทุกครั้ง
 * แล้วหน้าผลสอบก็ประเมินอะไรไม่ได้เลย ทั้งแถบคะแนนรายทักษะ สถานะผ่าน/ไม่ผ่าน
 * และปุ่มดูวุฒิบัตรซึ่งโผล่เฉพาะตอนสอบผ่าน
 *
 * ตอบผิดทุกข้อที่หกโดยตั้งใจ ได้ราว 84% — ผ่านเกณฑ์ 60% แต่ไม่เต็ม
 * ข้อเขียนกับข้อพูดเว้นว่างไว้ เพราะเป็นข้อที่รอผู้สอนตรวจอยู่แล้ว
 */
function answerSheetOf(questions) {
  const sheet = {};
  let graded = 0;
  for (const q of questions) {
    if (!q.answerIds) continue;
    const wrong = graded % 6 === 5;
    const other = q.choices.find((c) => c.id !== q.answerIds[0]);
    sheet[q.id] = wrong ? [other.id] : [q.answerIds[0]];
    graded++;
  }
  return sheet;
}

const SHEETS = { en: answerSheetOf(PACKS.en), zh: answerSheetOf(PACKS.zh) };

/**
 * ข้อสอบปลายคอร์สของคอร์สหนึ่ง
 *
 * เลือกชุดภาษาจากไอดีวิชา ไม่ใช่จากชื่อคอร์ส —
 * ชื่อคอร์สเป็นข้อความที่คนพิมพ์ แก้เมื่อไรก็ได้ ส่วนไอดีวิชาเป็นโครงสร้าง
 */
export function courseExamOf(course) {
  if (!course) return undefined;
  const lang = course.projectId === 'zh' ? 'zh' : 'en';
  const questions = PACKS[lang];
  return {
    id: `${course.sheet}-course-exam`,
    courseId: course.id,
    title: { th: 'แบบทดสอบปลายคอร์ส', en: 'Course final exam' },
    timeLimitSec: TIME_LIMIT_SEC,
    passMark: PASS_MARK,
    topics: TOPICS,
    questions,
    answers: SHEETS[lang],
  };
}
