/**
 * ข้อมูลจำลองที่ไม่ใช่หลักสูตร — ผู้ใช้ ข้อสอบ ผลสอบ การแจ้งเตือน และตัวช่วยจัดรูปแบบ
 *
 * *** โครงสร้างหลักสูตรไม่ได้อยู่ที่นี่แล้ว ***
 * วิชา คอร์ส หน่วย และสื่อทุกชิ้นมาจาก curriculum.js (แปลงจากสเปรดชีตจริง)
 * แล้ว nodes.js ห่อเป็นโหนด — ที่นี่เหลือแต่ของที่ไม่มีในหลักสูตร
 *
 * เนื้อหาใช้ { th, en } inline อ่านผ่าน p() ของ useI18n — ไม่ใช่ i18n key
 * เพราะชื่อเรื่องคือ "เนื้อหา" ไม่ใช่ "เปลือก UI"
 */

export const user = {
  id: 'u1',
  name: { th: 'ณัฐพล ศรีสุข', en: 'Nattapon Srisuk' },
  role: { th: 'นักเรียน', en: 'Student' },
  email: 'nattapon.s@school.ac.th',
  avatar: null,
  xp: 2480,
  streakDays: 12,
  level: 7,
};

export const currentLessonProgressSec = 192;

export const lessonDetail = {
  description: {
    th: 'บทเรียนนี้จะพาคุณฝึกโมเดล Machine Learning ตัวแรกด้วย scikit-learn ตั้งแต่โหลดชุดข้อมูล แบ่งข้อมูล เลือกอัลกอริทึม ไปจนถึงวัดผลว่าโมเดลทำงานได้ดีแค่ไหน ทุกขั้นตอนเขียนโค้ดไปพร้อมกัน ไม่ต้องมีพื้นฐานคณิตศาสตร์ขั้นสูง',
    en: 'In this lesson you will train your first machine learning model with scikit-learn — loading a dataset, splitting it, picking an algorithm and measuring how well it does. We write every line together, and no advanced maths is required.',
  },
  objectives: [
    { th: 'โหลดและสำรวจชุดข้อมูลด้วย pandas', en: 'Load and explore a dataset with pandas' },
    { th: 'แบ่งข้อมูลเป็นชุดฝึกและชุดทดสอบอย่างถูกวิธี', en: 'Split data into train and test sets properly' },
    { th: 'ฝึกโมเดล classification และอ่านค่าผลลัพธ์', en: 'Train a classifier and read its output' },
    { th: 'รู้ว่าเมื่อไหร่ควรเปลี่ยนอัลกอริทึม', en: 'Know when to reach for a different algorithm' },
  ],
  resources: [
    { id: 'r1', type: 'pdf', name: { th: 'สไลด์ประกอบบทเรียน', en: 'Lesson slides' }, sizeKb: 1840 },
    { id: 'r2', type: 'code', name: { th: 'โน้ตบุ๊กตัวอย่าง (.ipynb)', en: 'Companion notebook (.ipynb)' }, sizeKb: 96 },
    { id: 'r3', type: 'data', name: { th: 'ชุดข้อมูลฝึกหัด (.csv)', en: 'Practice dataset (.csv)' }, sizeKb: 512 },
  ],
  qa: [
    {
      id: 'qa1',
      author: { th: 'ปาริชาต ม.', en: 'Parichat M.' },
      askedAt: { th: '2 วันที่แล้ว', en: '2 days ago' },
      question: {
        th: 'ทำไมต้องแบ่งข้อมูลเป็น train กับ test ครับ ใช้ข้อมูลทั้งหมดฝึกเลยไม่ได้เหรอ',
        en: 'Why split into train and test? Why not train on everything?',
      },
      replies: 3,
      likes: 24,
    },
    {
      id: 'qa2',
      author: { th: 'ธีรเดช ก.', en: 'Teeradech K.' },
      askedAt: { th: '5 วันที่แล้ว', en: '5 days ago' },
      question: {
        th: 'random_state=42 ที่อาจารย์ใส่มีความหมายพิเศษไหม หรือใส่เลขอะไรก็ได้',
        en: 'Does random_state=42 mean anything special, or can it be any number?',
      },
      replies: 5,
      likes: 41,
    },
    {
      id: 'qa3',
      author: { th: 'อรอุมา ส.', en: 'Onuma S.' },
      askedAt: { th: '1 สัปดาห์ที่แล้ว', en: '1 week ago' },
      question: {
        th: 'ถ้า accuracy ได้ 99% แต่ข้อมูลไม่สมดุล ควรดูค่าอะไรแทนคะ',
        en: 'If accuracy is 99% on imbalanced data, what should I look at instead?',
      },
      replies: 8,
      likes: 67,
    },
  ],
  notes: [
    {
      id: 'n1',
      atSec: 252,
      text: {
        th: 'train_test_split ค่า default คือ test_size=0.25 — จำไว้ว่าถ้าไม่ระบุจะได้ 75/25',
        en: 'train_test_split defaults to test_size=0.25 — 75/25 if unspecified',
      },
    },
    {
      id: 'n2',
      atSec: 418,
      text: {
        th: 'ต้อง fit เฉพาะกับ train เท่านั้น ห้าม fit กับ test เด็ดขาด ไม่งั้นข้อมูลรั่ว',
        en: 'Only ever fit on train — fitting on test leaks information',
      },
    },
  ],
};

export const quiz = {
  id: 'q1',
  // ชุดตัวอย่างที่เขียนมือ ใช้กับทุกคอร์สที่ยังไม่มีชุดจริงจากไฟล์ Word
  // QuizScreen ดูธงนี้เพื่อตัดสินใจว่าจะเปิดมาแบบ "ทำไปแล้วบางส่วน" หรือเริ่มข้อ 1
  demo: true,
  // ผูกกับสื่อชนิดแบบทดสอบใน mock/nodes.js ไม่ผูกกับวิชาแล้ว
  // เพราะ "วิชา" เป็นชื่อชั้นของโครงการหนึ่งเท่านั้น โครงการอื่นเรียกชั้นนี้ว่าระดับ
  nodeId: 'q-p1',
  title: { th: 'แบบทดสอบท้ายหน่วย', en: 'End-of-unit quiz' },
  timeLimitSec: 900,
  passMark: 0.6,
  questions: [
    {
      id: 'q1a',
      type: 'single',
      topicId: 'ml-basics',
      prompt: {
        th: 'ข้อใดคือคำจำกัดความของ Supervised Learning ที่ถูกต้องที่สุด',
        en: 'Which best defines supervised learning?',
      },
      choices: [
        { id: 'a', text: { th: 'การเรียนรู้จากข้อมูลที่มีป้ายกำกับคำตอบไว้แล้ว', en: 'Learning from labelled data' } },
        { id: 'b', text: { th: 'การเรียนรู้จากข้อมูลที่ไม่มีป้ายกำกับ', en: 'Learning from unlabelled data' } },
        { id: 'c', text: { th: 'การเรียนรู้จากการลองผิดลองถูกและรับรางวัล', en: 'Learning by trial, error and reward' } },
        { id: 'd', text: { th: 'การเรียนรู้โดยไม่ต้องใช้ข้อมูลเลย', en: 'Learning without any data' } },
      ],
      answerIds: ['a'],
      explanation: {
        th: 'Supervised Learning ใช้ชุดข้อมูลที่มี label กำกับไว้แล้ว โมเดลจึงเรียนความสัมพันธ์ระหว่างอินพุตกับคำตอบได้ ส่วนข้อ ค. คือ Reinforcement Learning',
        en: 'Supervised learning uses labelled datasets so the model can learn the mapping from input to answer. Option C describes reinforcement learning.',
      },
    },
    {
      id: 'q2a',
      type: 'multi',
      topicId: 'ml-basics',
      prompt: {
        th: 'ข้อใดบ้างที่เป็นสัญญาณว่าโมเดลกำลัง Overfitting (เลือกได้มากกว่า 1 ข้อ)',
        en: 'Which signal that a model is overfitting? (choose all that apply)',
      },
      choices: [
        { id: 'a', text: { th: 'คะแนนบนชุดฝึกสูงมาก แต่ชุดทดสอบต่ำ', en: 'High train score, low test score' } },
        { id: 'b', text: { th: 'คะแนนต่ำทั้งชุดฝึกและชุดทดสอบ', en: 'Low score on both train and test' } },
        { id: 'c', text: { th: 'โมเดลจำรายละเอียดปลีกย่อยของข้อมูลฝึกได้หมด', en: 'The model memorises noise in the training data' } },
        { id: 'd', text: { th: 'โมเดลทำงานได้ดีกับข้อมูลใหม่ที่ไม่เคยเห็น', en: 'The model generalises well to unseen data' } },
      ],
      answerIds: ['a', 'c'],
      explanation: {
        th: 'Overfitting คือโมเดลจำข้อมูลฝึกจนเกินไป จึงเก่งเฉพาะชุดฝึกแต่ทำได้แย่กับข้อมูลใหม่ ส่วนข้อ ข. คือ Underfitting',
        en: 'Overfitting means the model memorised the training set, so it excels there but fails on new data. Option B describes underfitting.',
      },
    },
    {
      id: 'q3a',
      type: 'truefalse',
      topicId: 'ml-basics',
      prompt: {
        th: 'การนำชุดข้อมูลทดสอบ (test set) มาใช้ปรับจูนพารามิเตอร์ของโมเดล เป็นวิธีที่ถูกต้อง',
        en: 'Using the test set to tune model hyperparameters is good practice.',
      },
      choices: [
        { id: 'true', text: { th: 'ถูก', en: 'True' } },
        { id: 'false', text: { th: 'ผิด', en: 'False' } },
      ],
      answerIds: ['false'],
      explanation: {
        th: 'ผิด — ถ้าใช้ test set ปรับจูน ข้อมูลจะรั่ว (data leakage) ทำให้ค่าที่วัดได้ดูดีเกินจริง ควรใช้ validation set แยกต่างหาก',
        en: 'False — tuning on the test set leaks information and inflates your score. Use a separate validation set.',
      },
    },
    {
      id: 'q4a',
      type: 'single',
      topicId: 'nn',
      prompt: {
        th: 'จากโค้ดด้านล่าง บรรทัดใดคือขั้นตอนที่โมเดลเรียนรู้จากข้อมูล',
        en: 'In the code below, which line is where the model learns from data?',
      },
      code: `X_train, X_test, y_train, y_test = train_test_split(X, y)
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)
pred = model.predict(X_test)`,
      choices: [
        { id: 'a', text: { th: 'บรรทัดที่ 1 — train_test_split', en: 'Line 1 — train_test_split' } },
        { id: 'b', text: { th: 'บรรทัดที่ 2 — RandomForestClassifier(...)', en: 'Line 2 — RandomForestClassifier(...)' } },
        { id: 'c', text: { th: 'บรรทัดที่ 3 — model.fit(...)', en: 'Line 3 — model.fit(...)' } },
        { id: 'd', text: { th: 'บรรทัดที่ 4 — model.predict(...)', en: 'Line 4 — model.predict(...)' } },
      ],
      answerIds: ['c'],
      explanation: {
        th: '.fit() คือขั้นตอนฝึก โมเดลจะปรับพารามิเตอร์ภายในจากข้อมูลตรงนี้ ส่วนบรรทัดที่ 2 แค่สร้างอ็อบเจกต์ ยังไม่ได้เรียนอะไร',
        en: '.fit() is the training step where internal parameters are adjusted. Line 2 only constructs the object.',
      },
    },
    {
      id: 'q5a',
      type: 'single',
      topicId: 'nn',
      prompt: {
        th: 'จากกราฟความคลาดเคลื่อน เส้นสีส้ม (validation) เริ่มสูงขึ้นหลังรอบที่ 40 แต่เส้นสีฟ้า (train) ยังลดลง สิ่งนี้บอกอะไร',
        en: 'The orange (validation) curve rises after epoch 40 while the blue (train) curve keeps falling. What does this tell you?',
      },
      chart: 'overfit',
      choices: [
        { id: 'a', text: { th: 'โมเดลเริ่ม Overfitting ควรหยุดฝึกราวรอบที่ 40', en: 'It is overfitting — stop training around epoch 40' } },
        { id: 'b', text: { th: 'โมเดล Underfitting ควรฝึกต่อไปอีกนาน', en: 'It is underfitting — train much longer' } },
        { id: 'c', text: { th: 'ข้อมูลฝึกน้อยเกินไป ต้องเพิ่ม learning rate', en: 'Too little data — raise the learning rate' } },
        { id: 'd', text: { th: 'เป็นเรื่องปกติ ไม่ต้องทำอะไร', en: 'Perfectly normal, do nothing' } },
      ],
      answerIds: ['a'],
      explanation: {
        th: 'เมื่อ train loss ลดแต่ validation loss เพิ่ม แปลว่าโมเดลเริ่มจำข้อมูลฝึกแทนที่จะเรียนรูปแบบทั่วไป เทคนิคที่ใช้คือ early stopping',
        en: 'Train loss falling while validation loss rises is the classic overfitting signature. The fix is early stopping.',
      },
    },
    {
      id: 'q6a',
      type: 'single',
      topicId: 'ml-basics',
      prompt: {
        th: 'ชุดข้อมูลมีผู้ป่วย 990 คนที่ปกติ และ 10 คนที่ป่วย โมเดลทายว่า "ปกติ" ทุกคน จะได้ accuracy เท่าไร',
        en: 'A dataset has 990 healthy and 10 sick patients. A model predicts "healthy" for everyone. What is its accuracy?',
      },
      choices: [
        { id: 'a', text: { th: '50%', en: '50%' } },
        { id: 'b', text: { th: '90%', en: '90%' } },
        { id: 'c', text: { th: '99%', en: '99%' } },
        { id: 'd', text: { th: '100%', en: '100%' } },
      ],
      answerIds: ['c'],
      explanation: {
        th: 'ทายถูก 990 จาก 1,000 = 99% ซึ่งดูดีมากแต่ไร้ประโยชน์สิ้นเชิง นี่คือเหตุผลที่ข้อมูลไม่สมดุลต้องดู precision, recall และ F1 แทน',
        en: '990 of 1,000 correct = 99%, which looks great but is useless. This is why imbalanced data needs precision, recall and F1.',
      },
    },
    {
      id: 'q7a',
      type: 'multi',
      topicId: 'ethics',
      prompt: {
        th: 'ข้อใดบ้างเป็นแหล่งที่มาของอคติ (bias) ในระบบ AI (เลือกได้มากกว่า 1 ข้อ)',
        en: 'Which are sources of bias in AI systems? (choose all that apply)',
      },
      choices: [
        { id: 'a', text: { th: 'ข้อมูลฝึกที่เก็บมาจากกลุ่มคนที่ไม่หลากหลาย', en: 'Training data drawn from a narrow group' } },
        { id: 'b', text: { th: 'การเลือกฟีเจอร์ที่สะท้อนอคติในอดีต', en: 'Feature choices that encode historical bias' } },
        { id: 'c', text: { th: 'การใช้ GPU แทน CPU ในการฝึกโมเดล', en: 'Training on GPUs instead of CPUs' } },
        { id: 'd', text: { th: 'ทีมพัฒนาที่ไม่หลากหลายจึงมองไม่เห็นปัญหา', en: 'A homogeneous team that cannot see the problem' } },
      ],
      answerIds: ['a', 'b', 'd'],
      explanation: {
        th: 'อคติเกิดจากข้อมูล การออกแบบฟีเจอร์ และมุมมองของทีม ส่วนฮาร์ดแวร์ที่ใช้ฝึกไม่เกี่ยวกับอคติเลย',
        en: 'Bias comes from data, feature design and team perspective. The hardware used for training is irrelevant.',
      },
    },
    {
      id: 'q8a',
      type: 'single',
      topicId: 'nn',
      prompt: {
        th: 'ฟังก์ชันกระตุ้น (activation function) มีไว้เพื่ออะไร',
        en: 'What is an activation function for?',
      },
      choices: [
        { id: 'a', text: { th: 'ทำให้เครือข่ายเรียนความสัมพันธ์แบบไม่เชิงเส้นได้', en: 'To let the network learn non-linear relationships' } },
        { id: 'b', text: { th: 'ทำให้การฝึกโมเดลเร็วขึ้นเท่านั้น', en: 'Purely to speed up training' } },
        { id: 'c', text: { th: 'ลดขนาดไฟล์ของโมเดล', en: 'To shrink the model file' } },
        { id: 'd', text: { th: 'แปลงข้อความให้เป็นตัวเลข', en: 'To turn text into numbers' } },
      ],
      answerIds: ['a'],
      explanation: {
        th: 'ถ้าไม่มี activation function ต่อให้ซ้อนชั้นกี่ชั้น เครือข่ายก็ยังเทียบเท่าสมการเชิงเส้นชั้นเดียว จึงเรียนรูปแบบซับซ้อนไม่ได้',
        en: 'Without one, stacking layers still collapses to a single linear equation, so the network cannot learn complex patterns.',
      },
    },
    {
      id: 'q9a',
      type: 'truefalse',
      topicId: 'ethics',
      prompt: {
        th: 'โมเดล AI ที่แม่นยำสูง สามารถนำไปใช้ตัดสินใจแทนมนุษย์ในเรื่องสำคัญได้ทันทีโดยไม่ต้องมีคนตรวจสอบ',
        en: 'A highly accurate AI model can replace human judgement on high-stakes decisions without oversight.',
      },
      choices: [
        { id: 'true', text: { th: 'ถูก', en: 'True' } },
        { id: 'false', text: { th: 'ผิด', en: 'False' } },
      ],
      answerIds: ['false'],
      explanation: {
        th: 'ผิด — ความแม่นยำสูงไม่ได้แปลว่าไม่มีอคติหรือไม่ผิดพลาดในเคสสำคัญ เรื่องที่กระทบชีวิตคนต้องมีมนุษย์ร่วมตัดสินใจเสมอ',
        en: 'False — high accuracy does not rule out bias or catastrophic edge cases. High-stakes decisions need a human in the loop.',
      },
    },
    {
      id: 'q10a',
      type: 'single',
      topicId: 'ml-basics',
      prompt: {
        th: 'ก่อนฝึกโมเดล คุณพบว่าคอลัมน์ "รายได้" มีค่าว่างอยู่ 15% ควรทำอย่างไรเป็นอันดับแรก',
        en: 'Before training you find the "income" column is 15% missing. What should you do first?',
      },
      choices: [
        { id: 'a', text: { th: 'ลบทุกแถวที่มีค่าว่างทิ้งทันที', en: 'Immediately drop every row with a missing value' } },
        { id: 'b', text: { th: 'ตรวจก่อนว่าค่าว่างเกิดแบบสุ่มหรือมีรูปแบบซ่อนอยู่', en: 'Check whether the missingness is random or patterned' } },
        { id: 'c', text: { th: 'เติมด้วยเลข 0 ทั้งหมด', en: 'Fill them all with 0' } },
        { id: 'd', text: { th: 'ไม่ต้องสนใจ โมเดลจัดการเองได้', en: 'Ignore it, the model will handle it' } },
      ],
      answerIds: ['b'],
      explanation: {
        th: 'ต้องเข้าใจสาเหตุก่อนเลือกวิธีจัดการ ถ้าค่าว่างมีรูปแบบ (เช่น คนรายได้สูงไม่ตอบ) การลบหรือเติมมั่วจะสร้างอคติเข้าไปในโมเดล',
        en: 'Understand the cause before choosing a fix. If missingness is patterned (e.g. high earners skip the question), dropping or naive filling injects bias.',
      },
    },
  ],
};

export const topics = [
  { id: 'ml-basics', label: { th: 'พื้นฐาน ML', en: 'ML Basics' } },
  { id: 'nn', label: { th: 'Neural Networks', en: 'Neural Networks' } },
  { id: 'ethics', label: { th: 'จริยธรรม AI', en: 'AI Ethics' } },
];

/** คำตอบที่ "ผู้เรียน" เลือกไว้ — ใช้เรนเดอร์หน้าผลสอบโดยไม่ต้องทำข้อสอบจริง */
export const submittedAnswers = {
  q1a: ['a'],
  q2a: ['a', 'c'],
  q3a: ['false'],
  q4a: ['c'],
  q5a: ['b'],
  q6a: ['c'],
  q7a: ['a', 'b'],
  q8a: ['a'],
  q9a: ['false'],
  q10a: ['b'],
};

export const quizResult = {
  quizId: 'q1',
  timeSpentSec: 462,
  classAverage: 0.71,
  rankInClass: 4,
  classSize: 32,
  xpGained: 150,
  badges: [
    { id: 'b1', icon: 'flame', label: { th: 'เรียน 12 วันติด', en: '12-day streak' } },
    { id: 'b2', icon: 'star', label: { th: 'ผ่านบททดสอบแรก', en: 'First quiz passed' } },
    { id: 'b3', icon: 'trophy', label: { th: 'ติด 5 อันดับแรกของห้อง', en: 'Top 5 in class' } },
  ],
};

export const notifications = [
  {
    id: 'nt1',
    icon: 'sparkle',
    text: { th: 'มีบทเรียนใหม่ในคอร์ส "พื้นฐาน AI"', en: 'New lesson in "Foundations of AI"' },
    at: { th: '10 นาทีที่แล้ว', en: '10 minutes ago' },
    unread: true,
  },
  {
    id: 'nt2',
    icon: 'trophy',
    text: { th: 'คุณได้เหรียญ "เรียน 12 วันติด"', en: 'You earned the 12-day streak badge' },
    at: { th: '3 ชั่วโมงที่แล้ว', en: '3 hours ago' },
    unread: true,
  },
  {
    id: 'nt3',
    icon: 'clock',
    text: { th: 'แบบทดสอบท้ายบทที่ 2 ปิดรับใน 2 วัน', en: 'Chapter 2 quiz closes in 2 days' },
    at: { th: 'เมื่อวาน', en: 'Yesterday' },
    unread: false,
  },
];

/* ---------------------------------------------------------------
   ตัวช่วยเล็กๆ ที่หน้าจอหลายหน้าใช้ร่วมกัน
   --------------------------------------------------------------- */

/* getSubject / getLesson / getSection / watchedCount ถูกลบทิ้งแล้ว
   การค้นหา node และการนับความคืบหน้าย้ายไปอยู่ใน mock/nodes.js ทั้งหมด
   เพราะที่นั่นมีดัชนีและ rollup ที่คิดครั้งเดียวตอนโหลด ไม่ใช่ find() ทุกครั้งที่เรนเดอร์ */

/** 742 -> "12:22" | 3600 -> "1:00:00" */
export function formatDuration(sec) {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
    : `${m}:${String(r).padStart(2, '0')}`;
}

/** 380 -> { h: 6, m: 20 } สำหรับแสดง "6 ชม. 20 น." */
export function splitMinutes(totalMin) {
  return { h: Math.floor(totalMin / 60), m: totalMin % 60 };
}

/** ตรวจคำตอบ 1 ข้อ — ต้องตรงทุกตัวเลือก ไม่ให้คะแนนบางส่วน */
export function isAnswerCorrect(question, selectedIds = []) {
  const want = [...question.answerIds].sort();
  const got = [...selectedIds].sort();
  return want.length === got.length && want.every((v, i) => v === got[i]);
}

/**
 * คำนวณผลสอบจาก quiz + คำตอบ — ไม่ hardcode คะแนน จึงไม่มีทางไม่ตรงกัน
 *
 * ข้อเขียนกับข้อพูดไม่มีเฉลย (ไม่มี answerIds) จึง **ตรวจอัตโนมัติไม่ได้**
 * ถ้านับรวมเข้าตัวหาร ผู้เรียนที่ตอบปรนัยถูกหมดจะได้ 16/20 ทั้งที่ไม่ได้ทำอะไรผิด
 * แยกออกมาเป็น ungraded แล้วให้หน้าผลสอบบอกแยกว่า "อีกกี่ข้อรอตรวจ"
 *
 * รายชื่อหัวข้อมาจากชุดข้อสอบเองก่อน (quizDef.topics) แล้วค่อยถอยไปใช้ topics กลาง
 * ชุดจริงแยกผลตาม "ทักษะ" ส่วนชุดตัวอย่างเดิมแยกตาม "หัวข้อ" — คนละแกนกัน
 */
export function scoreQuiz(quizDef = quiz, answers = submittedAnswers) {
  const perQuestion = quizDef.questions.map((q) => {
    const graded = Array.isArray(q.answerIds) && q.answerIds.length > 0;
    return {
      questionId: q.id,
      topicId: q.skill ?? q.topicId,
      selectedIds: answers[q.id] ?? [],
      graded,
      correct: graded && isAnswerCorrect(q, answers[q.id] ?? []),
    };
  });

  const graded = perQuestion.filter((a) => a.graded);
  const score = graded.filter((a) => a.correct).length;
  const total = graded.length;

  const byTopic = (quizDef.topics ?? topics)
    .map((t) => {
      const items = graded.filter((a) => a.topicId === t.id);
      return { ...t, correct: items.filter((a) => a.correct).length, total: items.length };
    })
    .filter((t) => t.total > 0);

  return {
    perQuestion,
    score,
    total,
    ungraded: perQuestion.length - total,
    questionCount: perQuestion.length,
    percent: total ? score / total : 0,
    passed: total ? score / total >= quizDef.passMark : false,
    byTopic,
  };
}
