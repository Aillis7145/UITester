/**
 * ชุดแบบฝึกหัดและแบบทดสอบจริง — สร้างโดย scripts/build-quizbank.mjs
 *
 * *** ห้ามแก้ไฟล์นี้ด้วยมือ *** แก้ที่ไฟล์ Word ใน quiz_data/ แล้วรัน npm run build:quizbank
 *
 * key = "ชื่อแผ่นงาน#ลำดับหน่วย" ไม่ใช่ id ของโหนด
 * เพราะ id เปลี่ยนได้เมื่อลำดับคอร์สขยับ แต่ชื่อแผ่นงานกับลำดับบทเป็นของถาวร
 *
 * ตอนนี้มีบทเดียว (B1 บทที่ 1) เป็นตัวอย่าง — บทอื่นใช้รูปแบบไฟล์ Word เดียวกันได้เลย
 *
 * รวม 40 ข้อ
 */
export const quizBank = {
 "ENG_B1#1": {
  "title": {
   "th": "B1 บทที่ 1",
   "en": "B1 Unit 1"
  },
  "practice": {
   "grammar": {
    "id": "ENG_B1#1-practice-grammar",
    "skill": "grammar",
    "title": {
     "th": "แบบฝึกหัดไวยากรณ์",
     "en": "Grammar Practice"
    },
    "timeLimitSec": 360,
    "passMark": 0.6,
    "topics": [
     {
      "id": "grammar",
      "label": {
       "th": "ไวยากรณ์",
       "en": "Grammar"
      }
     }
    ],
    "questions": [
     {
      "id": "engb11-pg-1",
      "type": "single",
      "skill": "grammar",
      "prompt": {
       "th": "Pim: \"What _______ about your new job, Somchai?\"\nSomchai: \"_______ it's quite challenging but interesting.\"",
       "en": "Pim: \"What _______ about your new job, Somchai?\"\nSomchai: \"_______ it's quite challenging but interesting.\""
      },
      "choices": [
       {
        "id": "a",
        "text": {
         "th": "is your opinion / I think",
         "en": "is your opinion / I think"
        }
       },
       {
        "id": "b",
        "text": {
         "th": "do you opine / My feel",
         "en": "do you opine / My feel"
        }
       },
       {
        "id": "c",
        "text": {
         "th": "are your opinion / I feeling",
         "en": "are your opinion / I feeling"
        }
       },
       {
        "id": "d",
        "text": {
         "th": "your opinion is / To my view",
         "en": "your opinion is / To my view"
        }
       }
      ],
      "answerIds": [
       "a"
      ],
      "explanation": {
       "th": "ประโยคคำถาม “What is your opinion (about/on something)?” เป็นโครงสร้าง Wh-question ที่ถูกต้องสำหรับการถามความคิดเห็นเกี่ยวกับบางสิ่งบางอย่างค่ะ ส่วน “I think” เป็นวลีมาตรฐานและเป็นธรรมชาติสำหรับใช้แสดงความคิดเห็นส่วนตัวค่ะ",
       "en": "ประโยคคำถาม “What is your opinion (about/on something)?” เป็นโครงสร้าง Wh-question ที่ถูกต้องสำหรับการถามความคิดเห็นเกี่ยวกับบางสิ่งบางอย่างค่ะ ส่วน “I think” เป็นวลีมาตรฐานและเป็นธรรมชาติสำหรับใช้แสดงความคิดเห็นส่วนตัวค่ะ"
      }
     },
     {
      "id": "engb11-pg-2",
      "type": "single",
      "skill": "grammar",
      "prompt": {
       "th": "Mali shares her routine: \"I _______ my artwork at home; _______ it's a cozy place.\"",
       "en": "Mali shares her routine: \"I _______ my artwork at home; _______ it's a cozy place.\""
      },
      "choices": [
       {
        "id": "a",
        "text": {
         "th": "usually design / I feel that",
         "en": "usually design / I feel that"
        }
       },
       {
        "id": "b",
        "text": {
         "th": "design usually / in my opinion that",
         "en": "design usually / in my opinion that"
        }
       },
       {
        "id": "c",
        "text": {
         "th": "am usually designing / I guess",
         "en": "am usually designing / I guess"
        }
       },
       {
        "id": "d",
        "text": {
         "th": "usually designs / personally",
         "en": "usually designs / personally"
        }
       }
      ],
      "answerIds": [
       "a"
      ],
      "explanation": {
       "th": "ประโยค “I usually design” ใช้โครงสร้าง Present Simple โดยวาง adverb of frequency “usually” (โดยปกติ) ไว้หน้ากริยาแท้ “design” (ออกแบบ) ได้ถูกต้องค่ะ ส่วน “I feel that” (ฉันรู้สึกว่า) เป็นวลีที่เหมาะสมในการแสดงความรู้สึกหรือความคิดเห็นส่วนตัวค่ะ",
       "en": "ประโยค “I usually design” ใช้โครงสร้าง Present Simple โดยวาง adverb of frequency “usually” (โดยปกติ) ไว้หน้ากริยาแท้ “design” (ออกแบบ) ได้ถูกต้องค่ะ ส่วน “I feel that” (ฉันรู้สึกว่า) เป็นวลีที่เหมาะสมในการแสดงความรู้สึกหรือความคิดเห็นส่วนตัวค่ะ"
      }
     },
     {
      "id": "engb11-pg-3",
      "type": "single",
      "skill": "grammar",
      "prompt": {
       "th": "She usually ________ her friends at the library.",
       "en": "She usually ________ her friends at the library."
      },
      "choices": [
       {
        "id": "a",
        "text": {
         "th": "Meets",
         "en": "Meets"
        }
       },
       {
        "id": "b",
        "text": {
         "th": "Meet",
         "en": "Meet"
        }
       },
       {
        "id": "c",
        "text": {
         "th": "Meeting",
         "en": "Meeting"
        }
       },
       {
        "id": "d",
        "text": {
         "th": "is meet",
         "en": "is meet"
        }
       }
      ],
      "answerIds": [
       "a"
      ],
      "explanation": {
       "th": "ในประโยค Present Simple ถ้าประธานเป็นเอกพจน์บุรุษที่สาม (เช่น He, She, It หรือคำนามเอกพจน์ เช่น “She” ในที่นี้) กริยาจะต้องเติม -s หรือ -es ค่ะ ดังนั้นจึงต้องใช้กริยาว่า “meets” (พบ)",
       "en": "ในประโยค Present Simple ถ้าประธานเป็นเอกพจน์บุรุษที่สาม (เช่น He, She, It หรือคำนามเอกพจน์ เช่น “She” ในที่นี้) กริยาจะต้องเติม -s หรือ -es ค่ะ ดังนั้นจึงต้องใช้กริยาว่า “meets” (พบ)"
      }
     },
     {
      "id": "engb11-pg-4",
      "type": "single",
      "skill": "grammar",
      "prompt": {
       "th": "\"_______, this place is quiet and comfortable.”",
       "en": "\"_______, this place is quiet and comfortable.”"
      },
      "choices": [
       {
        "id": "a",
        "text": {
         "th": "I think",
         "en": "I think"
        }
       },
       {
        "id": "b",
        "text": {
         "th": "My opinion is because",
         "en": "My opinion is because"
        }
       },
       {
        "id": "c",
        "text": {
         "th": "I am feeling",
         "en": "I am feeling"
        }
       },
       {
        "id": "d",
        "text": {
         "th": "For my view",
         "en": "For my view"
        }
       }
      ],
      "answerIds": [
       "a"
      ],
      "explanation": {
       "th": "วลี “I think” (ฉันคิดว่า) เป็นการแสดงความคิดเห็นที่ถูกต้องและเป็นธรรมชาติค่ะ โดยทั่วไปจะตามด้วยอนุประโยค (clause) ที่มีความคิดสมบูรณ์ (มีประธานและกริยา) เช่น “I think (that) this place is quiet and comfortable.” (ฉันคิดว่าที่นี่เงียบและสะดวกสบาย)",
       "en": "วลี “I think” (ฉันคิดว่า) เป็นการแสดงความคิดเห็นที่ถูกต้องและเป็นธรรมชาติค่ะ โดยทั่วไปจะตามด้วยอนุประโยค (clause) ที่มีความคิดสมบูรณ์ (มีประธานและกริยา) เช่น “I think (that) this place is quiet and comfortable.” (ฉันคิดว่าที่นี่เงียบและสะดวกสบาย)"
      }
     },
     {
      "id": "engb11-pg-5",
      "type": "single",
      "skill": "grammar",
      "prompt": {
       "th": "\"My routine for this week _______ to check emails and _______ meetings.\"",
       "en": "\"My routine for this week _______ to check emails and _______ meetings.\""
      },
      "choices": [
       {
        "id": "a",
        "text": {
         "th": "is / attend",
         "en": "is / attend"
        }
       },
       {
        "id": "b",
        "text": {
         "th": "are / attending",
         "en": "are / attending"
        }
       },
       {
        "id": "c",
        "text": {
         "th": "be / attend",
         "en": "be / attend"
        }
       },
       {
        "id": "d",
        "text": {
         "th": "is / to attending",
         "en": "is / to attending"
        }
       }
      ],
      "answerIds": [
       "a"
      ],
      "explanation": {
       "th": "“My routine” (กิจวัตรของฉัน) เป็นประธานเอกพจน์ จึงใช้กริยา to be คือ “is” ค่ะ และในโครงสร้าง “is to check… and attend…” กริยาที่ตามมาคือ \"check\" และ \"attend\" ซึ่งอยู่ในรูป infinitive (กริยาช่อง 1 ไม่ผัน) โดยกริยาตัวที่สอง (attend) สามารถละ \"to\" ไว้ในฐานที่เข้าใจได้เมื่อมีโครงสร้างขนานกันและเชื่อมด้วย \"and\" ค่ะ",
       "en": "“My routine” (กิจวัตรของฉัน) เป็นประธานเอกพจน์ จึงใช้กริยา to be คือ “is” ค่ะ และในโครงสร้าง “is to check… and attend…” กริยาที่ตามมาคือ \"check\" และ \"attend\" ซึ่งอยู่ในรูป infinitive (กริยาช่อง 1 ไม่ผัน) โดยกริยาตัวที่สอง (attend) สามารถละ \"to\" ไว้ในฐานที่เข้าใจได้เมื่อมีโครงสร้างขนานกันและเชื่อมด้วย \"and\" ค่ะ"
      }
     },
     {
      "id": "engb11-pg-6",
      "type": "single",
      "skill": "grammar",
      "prompt": {
       "th": "Pim: \"Where _______ on weekends?\" Mali: \"I _______ find a quiet place if friends _______ over.\"",
       "en": "Pim: \"Where _______ on weekends?\" Mali: \"I _______ find a quiet place if friends _______ over.\""
      },
      "choices": [
       {
        "id": "a",
        "text": {
         "th": "do you normally go / often / come",
         "en": "do you normally go / often / come"
        }
       },
       {
        "id": "b",
        "text": {
         "th": "does you normally go / often / comes",
         "en": "does you normally go / often / comes"
        }
       },
       {
        "id": "c",
        "text": {
         "th": "are you normally going / am often / are coming",
         "en": "are you normally going / am often / are coming"
        }
       },
       {
        "id": "d",
        "text": {
         "th": "you do normally go / often / come",
         "en": "you do normally go / often / come"
        }
       }
      ],
      "answerIds": [
       "a"
      ],
      "explanation": {
       "th": "คำถาม “Where do you normally go?” (ปกติคุณไปไหน) ใช้โครงสร้างคำถาม Wh-question ใน Present Simple ที่ถูกต้อง (Wh-word + do/does + ประธาน + adverb of frequency + กริยาช่อง 1) ค่ะ ประโยค “I often find…” (ฉันมักจะหา...) วาง adverb of frequency \"often\" (บ่อย ๆ) หน้ากริยาแท้ \"find\" (หา) ตามหลักค่ะ และ “friends come over” (เพื่อน ๆ มาหา) ใช้กริยา “come” (มา) ซึ่งถูกต้องตามประธานพหูพจน์ “friends” (เพื่อน ๆ) ค่ะ",
       "en": "คำถาม “Where do you normally go?” (ปกติคุณไปไหน) ใช้โครงสร้างคำถาม Wh-question ใน Present Simple ที่ถูกต้อง (Wh-word + do/does + ประธาน + adverb of frequency + กริยาช่อง 1) ค่ะ ประโยค “I often find…” (ฉันมักจะหา...) วาง adverb of frequency \"often\" (บ่อย ๆ) หน้ากริยาแท้ \"find\" (หา) ตามหลักค่ะ และ “friends come over” (เพื่อน ๆ มาหา) ใช้กริยา “come” (มา) ซึ่งถูกต้องตามประธานพหูพจน์ “friends” (เพื่อน ๆ) ค่ะ"
      }
     }
    ]
   },
   "reading": {
    "id": "ENG_B1#1-practice-reading",
    "skill": "reading",
    "title": {
     "th": "แบบฝึกหัดการอ่าน",
     "en": "Reading Practice"
    },
    "timeLimitSec": 300,
    "passMark": 0.6,
    "topics": [
     {
      "id": "reading",
      "label": {
       "th": "การอ่าน",
       "en": "Reading"
      }
     }
    ],
    "questions": [
     {
      "id": "engb11-pr-1",
      "type": "single",
      "skill": "reading",
      "prompt": {
       "th": "Everything (1) ______ still quite new to me.",
       "en": "Everything (1) ______ still quite new to me."
      },
      "choices": [
       {
        "id": "a",
        "text": {
         "th": "is",
         "en": "is"
        }
       },
       {
        "id": "b",
        "text": {
         "th": "has",
         "en": "has"
        }
       },
       {
        "id": "c",
        "text": {
         "th": "are",
         "en": "are"
        }
       },
       {
        "id": "d",
        "text": {
         "th": "do",
         "en": "do"
        }
       }
      ],
      "answerIds": [
       "a"
      ],
      "explanation": {
       "th": "ประธาน “Everything” (ทุกสิ่งทุกอย่าง) เป็นคำนามเอกพจน์ ดังนั้นจึงใช้กริยาเอกพจน์ “is” ในรูป Present Simple ค่ะ จากประโยค \"Everything is still quite new to me.\" (ทุกสิ่งทุกอย่างยังค่อนข้างใหม่สำหรับฉัน)",
       "en": "ประธาน “Everything” (ทุกสิ่งทุกอย่าง) เป็นคำนามเอกพจน์ ดังนั้นจึงใช้กริยาเอกพจน์ “is” ในรูป Present Simple ค่ะ จากประโยค \"Everything is still quite new to me.\" (ทุกสิ่งทุกอย่างยังค่อนข้างใหม่สำหรับฉัน)"
      },
      "passage": {
       "th": "A New Start in a New City\nMy name is Carlos, and I have just moved to this city last month for a new job. Everything (1) ______ still quite new to me. On weekdays, my routine (2) ______ quite early. I usually wake up around 6:30 AM. First, I always make some coffee, and then I (3) ______ the local news on my tablet. I believe it's a good way to learn about what's happening in my new surroundings.\nI work as a software developer, and my office is downtown. I (4) ______ take the bus to work because I don't have a car yet. The bus ride is usually about 40 minutes. In the evenings, I sometimes (5) ______ different neighborhoods to get to know the city better. I hope to make some new friends soon",
       "en": "A New Start in a New City\nMy name is Carlos, and I have just moved to this city last month for a new job. Everything (1) ______ still quite new to me. On weekdays, my routine (2) ______ quite early. I usually wake up around 6:30 AM. First, I always make some coffee, and then I (3) ______ the local news on my tablet. I believe it's a good way to learn about what's happening in my new surroundings.\nI work as a software developer, and my office is downtown. I (4) ______ take the bus to work because I don't have a car yet. The bus ride is usually about 40 minutes. In the evenings, I sometimes (5) ______ different neighborhoods to get to know the city better. I hope to make some new friends soon"
      },
      "blank": 1
     },
     {
      "id": "engb11-pr-2",
      "type": "single",
      "skill": "reading",
      "prompt": {
       "th": "On weekdays, my routine (2) ______ quite early.",
       "en": "On weekdays, my routine (2) ______ quite early."
      },
      "choices": [
       {
        "id": "a",
        "text": {
         "th": "starts",
         "en": "starts"
        }
       },
       {
        "id": "b",
        "text": {
         "th": "start",
         "en": "start"
        }
       },
       {
        "id": "c",
        "text": {
         "th": "is starting",
         "en": "is starting"
        }
       },
       {
        "id": "d",
        "text": {
         "th": "starting",
         "en": "starting"
        }
       }
      ],
      "answerIds": [
       "a"
      ],
      "explanation": {
       "th": "วลี “My routine” (กิจวัตรของฉัน) ทำหน้าที่เป็นประธานเอกพจน์ ดังนั้นกริยาใน Present Simple จึงต้องเติม -s เป็น “starts” ค่ะ จากประโยค \"On weekdays, my routine starts quite early.\" (ในวันธรรมดา กิจวัตรของฉันเริ่มต้นค่อนข้างเช้า)",
       "en": "วลี “My routine” (กิจวัตรของฉัน) ทำหน้าที่เป็นประธานเอกพจน์ ดังนั้นกริยาใน Present Simple จึงต้องเติม -s เป็น “starts” ค่ะ จากประโยค \"On weekdays, my routine starts quite early.\" (ในวันธรรมดา กิจวัตรของฉันเริ่มต้นค่อนข้างเช้า)"
      },
      "passage": {
       "th": "A New Start in a New City\nMy name is Carlos, and I have just moved to this city last month for a new job. Everything (1) ______ still quite new to me. On weekdays, my routine (2) ______ quite early. I usually wake up around 6:30 AM. First, I always make some coffee, and then I (3) ______ the local news on my tablet. I believe it's a good way to learn about what's happening in my new surroundings.\nI work as a software developer, and my office is downtown. I (4) ______ take the bus to work because I don't have a car yet. The bus ride is usually about 40 minutes. In the evenings, I sometimes (5) ______ different neighborhoods to get to know the city better. I hope to make some new friends soon",
       "en": "A New Start in a New City\nMy name is Carlos, and I have just moved to this city last month for a new job. Everything (1) ______ still quite new to me. On weekdays, my routine (2) ______ quite early. I usually wake up around 6:30 AM. First, I always make some coffee, and then I (3) ______ the local news on my tablet. I believe it's a good way to learn about what's happening in my new surroundings.\nI work as a software developer, and my office is downtown. I (4) ______ take the bus to work because I don't have a car yet. The bus ride is usually about 40 minutes. In the evenings, I sometimes (5) ______ different neighborhoods to get to know the city better. I hope to make some new friends soon"
      },
      "blank": 2
     },
     {
      "id": "engb11-pr-3",
      "type": "single",
      "skill": "reading",
      "prompt": {
       "th": "First, I always make some coffee, and then I (3) ______ the local news on my tablet.",
       "en": "First, I always make some coffee, and then I (3) ______ the local news on my tablet."
      },
      "choices": [
       {
        "id": "a",
        "text": {
         "th": "read",
         "en": "read"
        }
       },
       {
        "id": "b",
        "text": {
         "th": "reads",
         "en": "reads"
        }
       },
       {
        "id": "c",
        "text": {
         "th": "am reading",
         "en": "am reading"
        }
       },
       {
        "id": "d",
        "text": {
         "th": "to read",
         "en": "to read"
        }
       }
      ],
      "answerIds": [
       "a"
      ],
      "explanation": {
       "th": "ประธานคือ “I” (ฉัน) ใน Present Simple กริยาที่ตามมาจะเป็นรูปพื้นฐาน (ไม่เติม -s) ค่ะ จากประโยค \"...and then I read the local news on my tablet.\" (...และจากนั้นฉันก็อ่านข่าวท้องถิ่นบนแท็บเล็ตของฉัน)",
       "en": "ประธานคือ “I” (ฉัน) ใน Present Simple กริยาที่ตามมาจะเป็นรูปพื้นฐาน (ไม่เติม -s) ค่ะ จากประโยค \"...and then I read the local news on my tablet.\" (...และจากนั้นฉันก็อ่านข่าวท้องถิ่นบนแท็บเล็ตของฉัน)"
      },
      "passage": {
       "th": "A New Start in a New City\nMy name is Carlos, and I have just moved to this city last month for a new job. Everything (1) ______ still quite new to me. On weekdays, my routine (2) ______ quite early. I usually wake up around 6:30 AM. First, I always make some coffee, and then I (3) ______ the local news on my tablet. I believe it's a good way to learn about what's happening in my new surroundings.\nI work as a software developer, and my office is downtown. I (4) ______ take the bus to work because I don't have a car yet. The bus ride is usually about 40 minutes. In the evenings, I sometimes (5) ______ different neighborhoods to get to know the city better. I hope to make some new friends soon",
       "en": "A New Start in a New City\nMy name is Carlos, and I have just moved to this city last month for a new job. Everything (1) ______ still quite new to me. On weekdays, my routine (2) ______ quite early. I usually wake up around 6:30 AM. First, I always make some coffee, and then I (3) ______ the local news on my tablet. I believe it's a good way to learn about what's happening in my new surroundings.\nI work as a software developer, and my office is downtown. I (4) ______ take the bus to work because I don't have a car yet. The bus ride is usually about 40 minutes. In the evenings, I sometimes (5) ______ different neighborhoods to get to know the city better. I hope to make some new friends soon"
      },
      "blank": 3
     },
     {
      "id": "engb11-pr-4",
      "type": "single",
      "skill": "reading",
      "prompt": {
       "th": "I (4) ______ take the bus to work because I don't have a car yet.",
       "en": "I (4) ______ take the bus to work because I don't have a car yet."
      },
      "choices": [
       {
        "id": "a",
        "text": {
         "th": "normally",
         "en": "normally"
        }
       },
       {
        "id": "b",
        "text": {
         "th": "never",
         "en": "never"
        }
       },
       {
        "id": "c",
        "text": {
         "th": "hardly",
         "en": "hardly"
        }
       },
       {
        "id": "d",
        "text": {
         "th": "always",
         "en": "always"
        }
       }
      ],
      "answerIds": [
       "a"
      ],
      "explanation": {
       "th": "“Normally” (โดยปกติ) เป็นคำวิเศษณ์บอกความถี่ที่เหมาะสมกับบริบทของพฤติกรรมที่ทำเป็นปกติเนื่องจากมีเหตุผลเฉพาะ (\"because I don't have a car yet\") จากประโยค \"I normally take the bus to work...\" (ฉันโดยปกติจะขึ้นรถบัสไปทำงาน...)",
       "en": "“Normally” (โดยปกติ) เป็นคำวิเศษณ์บอกความถี่ที่เหมาะสมกับบริบทของพฤติกรรมที่ทำเป็นปกติเนื่องจากมีเหตุผลเฉพาะ (\"because I don't have a car yet\") จากประโยค \"I normally take the bus to work...\" (ฉันโดยปกติจะขึ้นรถบัสไปทำงาน...)"
      },
      "passage": {
       "th": "A New Start in a New City\nMy name is Carlos, and I have just moved to this city last month for a new job. Everything (1) ______ still quite new to me. On weekdays, my routine (2) ______ quite early. I usually wake up around 6:30 AM. First, I always make some coffee, and then I (3) ______ the local news on my tablet. I believe it's a good way to learn about what's happening in my new surroundings.\nI work as a software developer, and my office is downtown. I (4) ______ take the bus to work because I don't have a car yet. The bus ride is usually about 40 minutes. In the evenings, I sometimes (5) ______ different neighborhoods to get to know the city better. I hope to make some new friends soon",
       "en": "A New Start in a New City\nMy name is Carlos, and I have just moved to this city last month for a new job. Everything (1) ______ still quite new to me. On weekdays, my routine (2) ______ quite early. I usually wake up around 6:30 AM. First, I always make some coffee, and then I (3) ______ the local news on my tablet. I believe it's a good way to learn about what's happening in my new surroundings.\nI work as a software developer, and my office is downtown. I (4) ______ take the bus to work because I don't have a car yet. The bus ride is usually about 40 minutes. In the evenings, I sometimes (5) ______ different neighborhoods to get to know the city better. I hope to make some new friends soon"
      },
      "blank": 4
     },
     {
      "id": "engb11-pr-5",
      "type": "single",
      "skill": "reading",
      "prompt": {
       "th": "In the evenings, I sometimes (5) ______ different neighborhoods to get to know the city better.",
       "en": "In the evenings, I sometimes (5) ______ different neighborhoods to get to know the city better."
      },
      "choices": [
       {
        "id": "a",
        "text": {
         "th": "explore",
         "en": "explore"
        }
       },
       {
        "id": "b",
        "text": {
         "th": "explores",
         "en": "explores"
        }
       },
       {
        "id": "c",
        "text": {
         "th": "am exploring",
         "en": "am exploring"
        }
       },
       {
        "id": "d",
        "text": {
         "th": "to exploring",
         "en": "to exploring"
        }
       }
      ],
      "answerIds": [
       "a"
      ],
      "explanation": {
       "th": "หลังจาก “I sometimes” (ฉันบางครั้ง...) ต้องใช้กริยาแท้ “explore” (สำรวจ) ในรูปพื้นฐาน (ไม่เติม -s) เพราะประธานคือ “I” ค่ะ จากประโยค \"In the evenings, I sometimes explore different neighborhoods...\" (ในตอนเย็น บางครั้งฉันก็สำรวจย่านต่าง ๆ...)",
       "en": "หลังจาก “I sometimes” (ฉันบางครั้ง...) ต้องใช้กริยาแท้ “explore” (สำรวจ) ในรูปพื้นฐาน (ไม่เติม -s) เพราะประธานคือ “I” ค่ะ จากประโยค \"In the evenings, I sometimes explore different neighborhoods...\" (ในตอนเย็น บางครั้งฉันก็สำรวจย่านต่าง ๆ...)"
      },
      "passage": {
       "th": "A New Start in a New City\nMy name is Carlos, and I have just moved to this city last month for a new job. Everything (1) ______ still quite new to me. On weekdays, my routine (2) ______ quite early. I usually wake up around 6:30 AM. First, I always make some coffee, and then I (3) ______ the local news on my tablet. I believe it's a good way to learn about what's happening in my new surroundings.\nI work as a software developer, and my office is downtown. I (4) ______ take the bus to work because I don't have a car yet. The bus ride is usually about 40 minutes. In the evenings, I sometimes (5) ______ different neighborhoods to get to know the city better. I hope to make some new friends soon",
       "en": "A New Start in a New City\nMy name is Carlos, and I have just moved to this city last month for a new job. Everything (1) ______ still quite new to me. On weekdays, my routine (2) ______ quite early. I usually wake up around 6:30 AM. First, I always make some coffee, and then I (3) ______ the local news on my tablet. I believe it's a good way to learn about what's happening in my new surroundings.\nI work as a software developer, and my office is downtown. I (4) ______ take the bus to work because I don't have a car yet. The bus ride is usually about 40 minutes. In the evenings, I sometimes (5) ______ different neighborhoods to get to know the city better. I hope to make some new friends soon"
      },
      "blank": 5
     }
    ]
   },
   "listening": {
    "id": "ENG_B1#1-practice-listening",
    "skill": "listening",
    "title": {
     "th": "แบบฝึกหัดการฟัง",
     "en": "Listening Practice"
    },
    "timeLimitSec": 300,
    "passMark": 0.6,
    "topics": [
     {
      "id": "listening",
      "label": {
       "th": "การฟัง",
       "en": "Listening"
      }
     }
    ],
    "questions": [
     {
      "id": "engb11-pl-1",
      "type": "single",
      "skill": "listening",
      "prompt": {
       "th": "What is Lin’s first impression of the campus?",
       "en": "What is Lin’s first impression of the campus?"
      },
      "choices": [
       {
        "id": "a",
        "text": {
         "th": "It’s very big and a bit confusing",
         "en": "It’s very big and a bit confusing"
        }
       },
       {
        "id": "b",
        "text": {
         "th": "It’s a bit quiet",
         "en": "It’s a bit quiet"
        }
       },
       {
        "id": "c",
        "text": {
         "th": "It’s small and easy to navigate",
         "en": "It’s small and easy to navigate"
        }
       },
       {
        "id": "d",
        "text": {
         "th": "It’s not interesting",
         "en": "It’s not interesting"
        }
       }
      ],
      "answerIds": [
       "a"
      ],
      "explanation": {
       "th": "จากบทความที่หลินกล่าวว่า \"I find the campus very big and sometimes a little confusing.\" (ฉันพบว่าวิทยาเขตใหญ่มากและบางครั้งก็สับสนเล็กน้อย) ทำให้ทราบว่าความประทับใจแรกของเธอคือวิทยาเขตใหญ่และค่อนข้างน่าสับสนค่ะ",
       "en": "จากบทความที่หลินกล่าวว่า \"I find the campus very big and sometimes a little confusing.\" (ฉันพบว่าวิทยาเขตใหญ่มากและบางครั้งก็สับสนเล็กน้อย) ทำให้ทราบว่าความประทับใจแรกของเธอคือวิทยาเขตใหญ่และค่อนข้างน่าสับสนค่ะ"
      },
      "audioScript": "Interviewer: Welcome to \"New Faces on Campus,\" our weekly segment! Today, we have Lin, a new exchange student. Hi Lin, welcome! Could you tell us a little about your first impressions and a typical day for you here? Lin: Hi! Thank you for having me. Well, this is my first week, so everything still feels very new. To be honest, I find the campus very big and sometimes a little confusing, but exciting too. My typical day starts around 8 AM. I usually have breakfast in the student canteen. Then, I go to my first class, which is English. In my opinion, it’s a good way to start the day because the class is fun and interactive. After that, I often spend some time in the library to review. One interesting experience I had yesterday was joining the international student orientation. I met many people from different countries. I feel that it was a great way to make new friends. I hardly ever feel lonely here because people are very friendly. Personally, I think this university is a great place to grow and learn."
     },
     {
      "id": "engb11-pl-2",
      "type": "single",
      "skill": "listening",
      "prompt": {
       "th": "What class does Lin usually attend first?",
       "en": "What class does Lin usually attend first?"
      },
      "choices": [
       {
        "id": "a",
        "text": {
         "th": "English",
         "en": "English"
        }
       },
       {
        "id": "b",
        "text": {
         "th": "Orientation",
         "en": "Orientation"
        }
       },
       {
        "id": "c",
        "text": {
         "th": "History",
         "en": "History"
        }
       },
       {
        "id": "d",
        "text": {
         "th": "Library study group",
         "en": "Library study group"
        }
       }
      ],
      "answerIds": [
       "a"
      ],
      "explanation": {
       "th": "หลินกล่าวในบทความว่า \"Then, I go to my first class, which is English.\" (จากนั้นฉันก็ไปเรียนคาบแรกซึ่งก็คือภาษาอังกฤษ)",
       "en": "หลินกล่าวในบทความว่า \"Then, I go to my first class, which is English.\" (จากนั้นฉันก็ไปเรียนคาบแรกซึ่งก็คือภาษาอังกฤษ)"
      },
      "audioScript": "Interviewer: Welcome to \"New Faces on Campus,\" our weekly segment! Today, we have Lin, a new exchange student. Hi Lin, welcome! Could you tell us a little about your first impressions and a typical day for you here? Lin: Hi! Thank you for having me. Well, this is my first week, so everything still feels very new. To be honest, I find the campus very big and sometimes a little confusing, but exciting too. My typical day starts around 8 AM. I usually have breakfast in the student canteen. Then, I go to my first class, which is English. In my opinion, it’s a good way to start the day because the class is fun and interactive. After that, I often spend some time in the library to review. One interesting experience I had yesterday was joining the international student orientation. I met many people from different countries. I feel that it was a great way to make new friends. I hardly ever feel lonely here because people are very friendly. Personally, I think this university is a great place to grow and learn."
     },
     {
      "id": "engb11-pl-3",
      "type": "single",
      "skill": "listening",
      "prompt": {
       "th": "Where does Lin usually have breakfast?",
       "en": "Where does Lin usually have breakfast?"
      },
      "choices": [
       {
        "id": "a",
        "text": {
         "th": "In the canteen",
         "en": "In the canteen"
        }
       },
       {
        "id": "b",
        "text": {
         "th": "In the dormitory",
         "en": "In the dormitory"
        }
       },
       {
        "id": "c",
        "text": {
         "th": "At home",
         "en": "At home"
        }
       },
       {
        "id": "d",
        "text": {
         "th": "In the park",
         "en": "In the park"
        }
       }
      ],
      "answerIds": [
       "a"
      ],
      "explanation": {
       "th": "จากบทความที่หลินเล่าว่า \"I usually have breakfast in the student canteen.\" (ฉันมักจะทานอาหารเช้าในโรงอาหารนักศึกษา)",
       "en": "จากบทความที่หลินเล่าว่า \"I usually have breakfast in the student canteen.\" (ฉันมักจะทานอาหารเช้าในโรงอาหารนักศึกษา)"
      },
      "audioScript": "Interviewer: Welcome to \"New Faces on Campus,\" our weekly segment! Today, we have Lin, a new exchange student. Hi Lin, welcome! Could you tell us a little about your first impressions and a typical day for you here? Lin: Hi! Thank you for having me. Well, this is my first week, so everything still feels very new. To be honest, I find the campus very big and sometimes a little confusing, but exciting too. My typical day starts around 8 AM. I usually have breakfast in the student canteen. Then, I go to my first class, which is English. In my opinion, it’s a good way to start the day because the class is fun and interactive. After that, I often spend some time in the library to review. One interesting experience I had yesterday was joining the international student orientation. I met many people from different countries. I feel that it was a great way to make new friends. I hardly ever feel lonely here because people are very friendly. Personally, I think this university is a great place to grow and learn."
     },
     {
      "id": "engb11-pl-4",
      "type": "single",
      "skill": "listening",
      "prompt": {
       "th": "How does Lin feel about making friends?",
       "en": "How does Lin feel about making friends?"
      },
      "choices": [
       {
        "id": "a",
        "text": {
         "th": "She rarely feels lonely because people are friendly",
         "en": "She rarely feels lonely because people are friendly"
        }
       },
       {
        "id": "b",
        "text": {
         "th": "She feels lonely most of the time",
         "en": "She feels lonely most of the time"
        }
       },
       {
        "id": "c",
        "text": {
         "th": "She made no friends yet",
         "en": "She made no friends yet"
        }
       },
       {
        "id": "d",
        "text": {
         "th": "It’s hard to meet people",
         "en": "It’s hard to meet people"
        }
       }
      ],
      "answerIds": [
       "a"
      ],
      "explanation": {
       "th": "หลินบอกในบทความว่า \"I hardly ever feel lonely here because people are very friendly.\" (ฉันแทบจะไม่เคยรู้สึกเหงาเลยที่นี่เพราะผู้คนเป็นมิตรมาก) คำว่า \"hardly ever\" มีความหมายใกล้เคียงกับ \"rarely\" (ไม่ค่อยจะ) ค่ะ",
       "en": "หลินบอกในบทความว่า \"I hardly ever feel lonely here because people are very friendly.\" (ฉันแทบจะไม่เคยรู้สึกเหงาเลยที่นี่เพราะผู้คนเป็นมิตรมาก) คำว่า \"hardly ever\" มีความหมายใกล้เคียงกับ \"rarely\" (ไม่ค่อยจะ) ค่ะ"
      },
      "audioScript": "Interviewer: Welcome to \"New Faces on Campus,\" our weekly segment! Today, we have Lin, a new exchange student. Hi Lin, welcome! Could you tell us a little about your first impressions and a typical day for you here? Lin: Hi! Thank you for having me. Well, this is my first week, so everything still feels very new. To be honest, I find the campus very big and sometimes a little confusing, but exciting too. My typical day starts around 8 AM. I usually have breakfast in the student canteen. Then, I go to my first class, which is English. In my opinion, it’s a good way to start the day because the class is fun and interactive. After that, I often spend some time in the library to review. One interesting experience I had yesterday was joining the international student orientation. I met many people from different countries. I feel that it was a great way to make new friends. I hardly ever feel lonely here because people are very friendly. Personally, I think this university is a great place to grow and learn."
     },
     {
      "id": "engb11-pl-5",
      "type": "single",
      "skill": "listening",
      "prompt": {
       "th": "Which phrase does Lin use to express her personal opinion about the university?",
       "en": "Which phrase does Lin use to express her personal opinion about the university?"
      },
      "choices": [
       {
        "id": "a",
        "text": {
         "th": "“Personally, I think”",
         "en": "“Personally, I think”"
        }
       },
       {
        "id": "b",
        "text": {
         "th": "“In that place”",
         "en": "“In that place”"
        }
       },
       {
        "id": "c",
        "text": {
         "th": "“To my news”",
         "en": "“To my news”"
        }
       },
       {
        "id": "d",
        "text": {
         "th": "“This is true”",
         "en": "“This is true”"
        }
       }
      ],
      "answerIds": [
       "a"
      ],
      "explanation": {
       "th": "ในตอนท้ายของบทความหลินใช้วลี \"Personally, I think this university is a great place to grow and learn.\" (ส่วนตัวแล้ว ฉันคิดว่ามหาวิทยาลัยนี้เป็นสถานที่ที่ดีเยี่ยมในการเติบโตและเรียนรู้) เพื่อแสดงความคิดเห็นของเธอค่ะ",
       "en": "ในตอนท้ายของบทความหลินใช้วลี \"Personally, I think this university is a great place to grow and learn.\" (ส่วนตัวแล้ว ฉันคิดว่ามหาวิทยาลัยนี้เป็นสถานที่ที่ดีเยี่ยมในการเติบโตและเรียนรู้) เพื่อแสดงความคิดเห็นของเธอค่ะ"
      },
      "audioScript": "Interviewer: Welcome to \"New Faces on Campus,\" our weekly segment! Today, we have Lin, a new exchange student. Hi Lin, welcome! Could you tell us a little about your first impressions and a typical day for you here? Lin: Hi! Thank you for having me. Well, this is my first week, so everything still feels very new. To be honest, I find the campus very big and sometimes a little confusing, but exciting too. My typical day starts around 8 AM. I usually have breakfast in the student canteen. Then, I go to my first class, which is English. In my opinion, it’s a good way to start the day because the class is fun and interactive. After that, I often spend some time in the library to review. One interesting experience I had yesterday was joining the international student orientation. I met many people from different countries. I feel that it was a great way to make new friends. I hardly ever feel lonely here because people are very friendly. Personally, I think this university is a great place to grow and learn."
     }
    ]
   },
   "writing": {
    "id": "ENG_B1#1-practice-writing",
    "skill": "writing",
    "title": {
     "th": "แบบฝึกหัดการเขียน",
     "en": "Writing Practice"
    },
    "timeLimitSec": 600,
    "passMark": 0.6,
    "topics": [
     {
      "id": "writing",
      "label": {
       "th": "การเขียน",
       "en": "Writing"
      }
     }
    ],
    "questions": [
     {
      "id": "engb11-pw-1",
      "type": "typing",
      "skill": "writing",
      "prompt": {
       "th": "My Weekday Routine & Opinions",
       "en": "My Weekday Routine & Opinions"
      },
      "instruction": {
       "th": "Write a short paragraph (about 20-30 words) about one part of your typical weekday routine and your opinion about it.",
       "en": "Write a short paragraph (about 20-30 words) about one part of your typical weekday routine and your opinion about it."
      },
      "guidelines": [
       {
        "th": "Mention one activity you do on a weekday. (กล่าวถึงกิจกรรมหนึ่งอย่างที่คุณทำในวันธรรมดา) (Example: \"I usually read news online.\")",
        "en": "Mention one activity you do on a weekday. (กล่าวถึงกิจกรรมหนึ่งอย่างที่คุณทำในวันธรรมดา) (Example: \"I usually read news online.\")"
       },
       {
        "th": "Use an adverb of frequency. (ใช้คำวิเศษณ์บอกความถี่)",
        "en": "Use an adverb of frequency. (ใช้คำวิเศษณ์บอกความถี่)"
       },
       {
        "th": "Express a simple opinion about that part of your routine. (แสดงความคิดเห็นง่าย ๆ เกี่ยวกับส่วนนั้นของกิจวัตรของคุณ) (Example: \"I think it's important.\")",
        "en": "Express a simple opinion about that part of your routine. (แสดงความคิดเห็นง่าย ๆ เกี่ยวกับส่วนนั้นของกิจวัตรของคุณ) (Example: \"I think it's important.\")"
       }
      ],
      "starter": {
       "th": "On weekdays, I usually ___________________________________________________. I think ___________________________________________________. (ในวันธรรมดา ฉันมักจะ... ฉันคิดว่า...)",
       "en": "On weekdays, I usually ___________________________________________________. I think ___________________________________________________. (ในวันธรรมดา ฉันมักจะ... ฉันคิดว่า...)"
      },
      "sample": {
       "th": "On weekdays, I usually check my emails first thing in the morning. I think it's a good way to plan my day.",
       "en": "On weekdays, I usually check my emails first thing in the morning. I think it's a good way to plan my day."
      }
     },
     {
      "id": "engb11-pw-2",
      "type": "typing",
      "skill": "writing",
      "prompt": {
       "th": "Describing Your Typical Weekday Morning (อธิบายกิจวัตรช่วงเช้าวันธรรมดาของคุณ)",
       "en": "Describing Your Typical Weekday Morning (อธิบายกิจวัตรช่วงเช้าวันธรรมดาของคุณ)"
      },
      "instruction": {
       "th": "Write a short paragraph (about 40–60 words) describing your typical weekday morning routine. (คำสั่ง: เขียนย่อหน้าสั้น ๆ (ประมาณ 40-60 คำ) อธิบายกิจวัตรช่วงเช้าในวันธรรมดาของคุณ)",
       "en": "Write a short paragraph (about 40–60 words) describing your typical weekday morning routine. (คำสั่ง: เขียนย่อหน้าสั้น ๆ (ประมาณ 40-60 คำ) อธิบายกิจวัตรช่วงเช้าในวันธรรมดาของคุณ)"
      },
      "guidelines": [
       {
        "th": "Start with the time you usually wake up. (เริ่มต้นด้วยเวลาที่คุณมักจะตื่นนอน) (Example: \"I usually wake up at 7 AM.\")",
        "en": "Start with the time you usually wake up. (เริ่มต้นด้วยเวลาที่คุณมักจะตื่นนอน) (Example: \"I usually wake up at 7 AM.\")"
       },
       {
        "th": "Mention at least 2-3 activities you do in sequence [e.g., first... then... after that...]. (กล่าวถึงกิจกรรมอย่างน้อย 2-3 อย่างที่คุณทำตามลำดับ เช่น ก่อนอื่น... จากนั้น... หลังจากนั้น...)",
        "en": "Mention at least 2-3 activities you do in sequence [e.g., first... then... after that...]. (กล่าวถึงกิจกรรมอย่างน้อย 2-3 อย่างที่คุณทำตามลำดับ เช่น ก่อนอื่น... จากนั้น... หลังจากนั้น...)"
       },
       {
        "th": "Use Present Simple tense for routines. (ใช้ Present Simple tense สำหรับกิจวัตร)",
        "en": "Use Present Simple tense for routines. (ใช้ Present Simple tense สำหรับกิจวัตร)"
       },
       {
        "th": "Include at least one adverb of frequency [e.g., always, usually, often, sometimes, rarely]. (ใส่คำวิเศษณ์บอกความถี่อย่างน้อยหนึ่งคำ เช่น always, usually, often, sometimes, rarely)",
        "en": "Include at least one adverb of frequency [e.g., always, usually, often, sometimes, rarely]. (ใส่คำวิเศษณ์บอกความถี่อย่างน้อยหนึ่งคำ เช่น always, usually, often, sometimes, rarely)"
       },
       {
        "th": "Include one sentence expressing your personal opinion or attitude about your morning routine [e.g., \"Personally, I think...\", \"In my opinion...\", \"I believe...\"]. (ใส่หนึ่งประโยคที่แสดงความคิดเห็นส่วนตัวหรือทัศนคติของคุณเกี่ยวกับกิจวัตรตอนเช้า เช่น \"ส่วนตัวแล้ว ฉันคิดว่า...\", \"ในความคิดของฉัน...\", \"ฉันเชื่อว่า...\")",
        "en": "Include one sentence expressing your personal opinion or attitude about your morning routine [e.g., \"Personally, I think...\", \"In my opinion...\", \"I believe...\"]. (ใส่หนึ่งประโยคที่แสดงความคิดเห็นส่วนตัวหรือทัศนคติของคุณเกี่ยวกับกิจวัตรตอนเช้า เช่น \"ส่วนตัวแล้ว ฉันคิดว่า...\", \"ในความคิดของฉัน...\", \"ฉันเชื่อว่า...\")"
       }
      ],
      "starter": {
       "th": "\"On weekdays, I usually wake up at...\" (ในวันธรรมดา ฉันมักจะตื่นนอนเวลา...)",
       "en": "\"On weekdays, I usually wake up at...\" (ในวันธรรมดา ฉันมักจะตื่นนอนเวลา...)"
      },
      "sample": {
       "th": "On weekdays, I usually wake up at 6:30 AM. First, I always drink a glass of water. Then, I take a quick shower and get dressed. For breakfast, I often have yogurt with fruit. I rarely watch TV in the morning. Personally, I think having a consistent morning routine helps me start my day feeling organized and energized.",
       "en": "On weekdays, I usually wake up at 6:30 AM. First, I always drink a glass of water. Then, I take a quick shower and get dressed. For breakfast, I often have yogurt with fruit. I rarely watch TV in the morning. Personally, I think having a consistent morning routine helps me start my day feeling organized and energized."
      }
     }
    ]
   },
   "speaking": {
    "id": "ENG_B1#1-practice-speaking",
    "skill": "speaking",
    "title": {
     "th": "แบบฝึกหัดการพูด",
     "en": "Speaking Practice"
    },
    "timeLimitSec": 600,
    "passMark": 0.6,
    "topics": [
     {
      "id": "speaking",
      "label": {
       "th": "การพูด",
       "en": "Speaking"
      }
     }
    ],
    "questions": [
     {
      "id": "engb11-ps-1",
      "type": "speaking",
      "skill": "speaking",
      "prompt": {
       "th": "Introduce Yourself to a New Classmate (แนะนำตัวเองกับเพื่อนร่วมชั้นคนใหม่)",
       "en": "Introduce Yourself to a New Classmate (แนะนำตัวเองกับเพื่อนร่วมชั้นคนใหม่)"
      },
      "instruction": {
       "th": "Imagine you are in a new English class. Your teacher asks you to introduce yourself to the person sitting next to you. Speak for about 30-45 seconds. (คำสั่ง: ลองจินตนาการว่าคุณอยู่ในชั้นเรียนภาษาอังกฤษใหม่ ครูขอให้คุณแนะนำตัวเองกับคนที่นั่งข้าง ๆ พูดประมาณ 30-45 วินาที)",
       "en": "Imagine you are in a new English class. Your teacher asks you to introduce yourself to the person sitting next to you. Speak for about 30-45 seconds. (คำสั่ง: ลองจินตนาการว่าคุณอยู่ในชั้นเรียนภาษาอังกฤษใหม่ ครูขอให้คุณแนะนำตัวเองกับคนที่นั่งข้าง ๆ พูดประมาณ 30-45 วินาที)"
      },
      "guidelines": [
       {
        "th": "Start with a friendly greeting. (เริ่มต้นด้วยการทักทายอย่างเป็นมิตร) (Example: \"Hi there!\")",
        "en": "Start with a friendly greeting. (เริ่มต้นด้วยการทักทายอย่างเป็นมิตร) (Example: \"Hi there!\")"
       },
       {
        "th": "Tell them your name. (บอกชื่อของคุณ) (Example: \"My name is...\")",
        "en": "Tell them your name. (บอกชื่อของคุณ) (Example: \"My name is...\")"
       },
       {
        "th": "Mention something simple about yourself (e.g., where you are from, or one hobby you enjoy). (บอกข้อมูลง่าย ๆ เกี่ยวกับตัวเอง เช่น มาจากไหน หรือ ชอบทำอะไรเป็นงานอดิเรก)",
        "en": "Mention something simple about yourself (e.g., where you are from, or one hobby you enjoy). (บอกข้อมูลง่าย ๆ เกี่ยวกับตัวเอง เช่น มาจากไหน หรือ ชอบทำอะไรเป็นงานอดิเรก)"
       },
       {
        "th": "Ask your new classmate a simple question about themselves (e.g., \"What about you?\", \"What's your name?\"). (ถามคำถามง่าย ๆ เกี่ยวกับเพื่อนร่วมชั้นคนใหม่ เช่น \"แล้วคุณล่ะ?\", \"คุณชื่ออะไร?\")",
        "en": "Ask your new classmate a simple question about themselves (e.g., \"What about you?\", \"What's your name?\"). (ถามคำถามง่าย ๆ เกี่ยวกับเพื่อนร่วมชั้นคนใหม่ เช่น \"แล้วคุณล่ะ?\", \"คุณชื่ออะไร?\")"
       }
      ],
      "starter": {
       "th": "\"Hi! My name is...\" Your spoken answer: _________________________________________________________",
       "en": "\"Hi! My name is...\" Your spoken answer: _________________________________________________________"
      },
      "sample": {
       "th": "\"Hi! My name is Suda. I'm from Bangkok. I really enjoy listening to music in my free time. It's nice to meet you. What's your name?\"",
       "en": "\"Hi! My name is Suda. I'm from Bangkok. I really enjoy listening to music in my free time. It's nice to meet you. What's your name?\""
      }
     },
     {
      "id": "engb11-ps-2",
      "type": "speaking",
      "skill": "speaking",
      "prompt": {
       "th": "Instructions: Think about what you usually do on a typical weekend. Prepare to speak for about 30-45 seconds. (คำสั่ง: คิดถึงสิ่งที่คุณมักจะทำในวันหยุดสุดสัปดาห์ตามปกติ เตรียมพูดประมาณ 30-45 วินาที)",
       "en": "Instructions: Think about what you usually do on a typical weekend. Prepare to speak for about 30-45 seconds. (คำสั่ง: คิดถึงสิ่งที่คุณมักจะทำในวันหยุดสุดสัปดาห์ตามปกติ เตรียมพูดประมาณ 30-45 วินาที)"
      },
      "instruction": {
       "th": "Think about what you usually do on a typical weekend. Prepare to speak for about 30-45 seconds. (คำสั่ง: คิดถึงสิ่งที่คุณมักจะทำในวันหยุดสุดสัปดาห์ตามปกติ เตรียมพูดประมาณ 30-45 วินาที)",
       "en": "Think about what you usually do on a typical weekend. Prepare to speak for about 30-45 seconds. (คำสั่ง: คิดถึงสิ่งที่คุณมักจะทำในวันหยุดสุดสัปดาห์ตามปกติ เตรียมพูดประมาณ 30-45 วินาที)"
      },
      "guidelines": [
       {
        "th": "Mention at least two activities you usually do on weekends. (กล่าวถึงกิจกรรมอย่างน้อยสองอย่างที่คุณมักจะทำในวันหยุดสุดสัปดาห์)",
        "en": "Mention at least two activities you usually do on weekends. (กล่าวถึงกิจกรรมอย่างน้อยสองอย่างที่คุณมักจะทำในวันหยุดสุดสัปดาห์)"
       },
       {
        "th": "Use Present Simple and adverbs of frequency (e.g., \"I usually...\", \"I often...\", \"Sometimes I...\"). (ใช้ Present Simple และคำวิเศษณ์บอกความถี่ เช่น \"ฉันมักจะ...\", \"ฉันบ่อยครั้งที่จะ...\", \"บางครั้งฉันก็...\")",
        "en": "Use Present Simple and adverbs of frequency (e.g., \"I usually...\", \"I often...\", \"Sometimes I...\"). (ใช้ Present Simple และคำวิเศษณ์บอกความถี่ เช่น \"ฉันมักจะ...\", \"ฉันบ่อยครั้งที่จะ...\", \"บางครั้งฉันก็...\")"
       },
       {
        "th": "You can include a simple opinion (e.g., \"I think weekends are great because...\"). (คุณสามารถใส่ความคิดเห็นง่าย ๆ ได้ เช่น \"ฉันคิดว่าวันหยุดสุดสัปดาห์นั้นยอดเยี่ยมเพราะ...\")",
        "en": "You can include a simple opinion (e.g., \"I think weekends are great because...\"). (คุณสามารถใส่ความคิดเห็นง่าย ๆ ได้ เช่น \"ฉันคิดว่าวันหยุดสุดสัปดาห์นั้นยอดเยี่ยมเพราะ...\")"
       }
      ],
      "starter": {
       "th": "\"On weekends, I usually...\" Your spoken answer: _________________________________________________________",
       "en": "\"On weekends, I usually...\" Your spoken answer: _________________________________________________________"
      },
      "sample": {
       "th": "\"On weekends, I usually wake up a bit later than on weekdays. I often go to the park with my family on Saturday mornings. Sometimes, I visit my grandparents on Sunday. I think weekends are great because I can relax and spend time with people I care about.\"",
       "en": "\"On weekends, I usually wake up a bit later than on weekdays. I often go to the park with my family on Saturday mornings. Sometimes, I visit my grandparents on Sunday. I think weekends are great because I can relax and spend time with people I care about.\""
      }
     }
    ]
   }
  },
  "unitQuiz": {
   "id": "ENG_B1#1-unit",
   "title": {
    "th": "แบบทดสอบท้ายบท",
    "en": "Unit quiz"
   },
   "timeLimitSec": 2160,
   "passMark": 0.6,
   "topics": [
    {
     "id": "grammar",
     "label": {
      "th": "ไวยากรณ์",
      "en": "Grammar"
     }
    },
    {
     "id": "reading",
     "label": {
      "th": "การอ่าน",
      "en": "Reading"
     }
    },
    {
     "id": "listening",
     "label": {
      "th": "การฟัง",
      "en": "Listening"
     }
    },
    {
     "id": "writing",
     "label": {
      "th": "การเขียน",
      "en": "Writing"
     }
    },
    {
     "id": "speaking",
     "label": {
      "th": "การพูด",
      "en": "Speaking"
     }
    }
   ],
   "questions": [
    {
     "id": "engb11-ul-1",
     "type": "single",
     "skill": "listening",
     "prompt": {
      "th": "Where is Lin from?",
      "en": "Where is Lin from?"
     },
     "choices": [
      {
       "id": "a",
       "text": {
        "th": "Taiwan",
        "en": "Taiwan"
       }
      },
      {
       "id": "b",
       "text": {
        "th": "Thailand",
        "en": "Thailand"
       }
      },
      {
       "id": "c",
       "text": {
        "th": "Japan",
        "en": "Japan"
       }
      },
      {
       "id": "d",
       "text": {
        "th": "Korea",
        "en": "Korea"
       }
      }
     ],
     "answerIds": [
      "a"
     ],
     "audioScript": "Hi everyone! I’m Lin, and I’m from Taiwan. This is actually my first time studying abroad. Honestly, I was a bit nervous at first, but people here are really helpful. I usually start my day around 7 AM. I have breakfast at the dorm canteen and then head to class. I’m studying environmental science, and I think it’s a very important subject these days. In the afternoons, I often go to the library or attend campus activities. Personally, I believe joining activities is the best way to make friends. On weekends, I sometimes visit museums or walk in the park. I enjoy quiet places, and I think spending time alone helps me recharge. If you’re also new here, don’t worry too much. Everything takes time. In my opinion, being open to new experiences is the key to enjoying student life!"
    },
    {
     "id": "engb11-ul-2",
     "type": "single",
     "skill": "listening",
     "prompt": {
      "th": "What subject is Lin studying?",
      "en": "What subject is Lin studying?"
     },
     "choices": [
      {
       "id": "a",
       "text": {
        "th": "Environmental science",
        "en": "Environmental science"
       }
      },
      {
       "id": "b",
       "text": {
        "th": "Computer engineering",
        "en": "Computer engineering"
       }
      },
      {
       "id": "c",
       "text": {
        "th": "Business",
        "en": "Business"
       }
      },
      {
       "id": "d",
       "text": {
        "th": "Architecture",
        "en": "Architecture"
       }
      }
     ],
     "answerIds": [
      "a"
     ],
     "audioScript": "Hi everyone! I’m Lin, and I’m from Taiwan. This is actually my first time studying abroad. Honestly, I was a bit nervous at first, but people here are really helpful. I usually start my day around 7 AM. I have breakfast at the dorm canteen and then head to class. I’m studying environmental science, and I think it’s a very important subject these days. In the afternoons, I often go to the library or attend campus activities. Personally, I believe joining activities is the best way to make friends. On weekends, I sometimes visit museums or walk in the park. I enjoy quiet places, and I think spending time alone helps me recharge. If you’re also new here, don’t worry too much. Everything takes time. In my opinion, being open to new experiences is the key to enjoying student life!"
    },
    {
     "id": "engb11-ul-3",
     "type": "single",
     "skill": "listening",
     "prompt": {
      "th": "What does Lin say is the best way to make friends?",
      "en": "What does Lin say is the best way to make friends?"
     },
     "choices": [
      {
       "id": "a",
       "text": {
        "th": "Joining activities helps make friends.",
        "en": "Joining activities helps make friends."
       }
      },
      {
       "id": "b",
       "text": {
        "th": "It’s not necessary to have friends.",
        "en": "It’s not necessary to have friends."
       }
      },
      {
       "id": "c",
       "text": {
        "th": "Friends distract from study.",
        "en": "Friends distract from study."
       }
      },
      {
       "id": "d",
       "text": {
        "th": "Only classmates can be friends.",
        "en": "Only classmates can be friends."
       }
      }
     ],
     "answerIds": [
      "a"
     ],
     "audioScript": "Hi everyone! I’m Lin, and I’m from Taiwan. This is actually my first time studying abroad. Honestly, I was a bit nervous at first, but people here are really helpful. I usually start my day around 7 AM. I have breakfast at the dorm canteen and then head to class. I’m studying environmental science, and I think it’s a very important subject these days. In the afternoons, I often go to the library or attend campus activities. Personally, I believe joining activities is the best way to make friends. On weekends, I sometimes visit museums or walk in the park. I enjoy quiet places, and I think spending time alone helps me recharge. If you’re also new here, don’t worry too much. Everything takes time. In my opinion, being open to new experiences is the key to enjoying student life!"
    },
    {
     "id": "engb11-ul-4",
     "type": "single",
     "skill": "listening",
     "prompt": {
      "th": "What kind of places does Lin enjoy on weekends?",
      "en": "What kind of places does Lin enjoy on weekends?"
     },
     "choices": [
      {
       "id": "a",
       "text": {
        "th": "Quiet places",
        "en": "Quiet places"
       }
      },
      {
       "id": "b",
       "text": {
        "th": "Busy shopping malls",
        "en": "Busy shopping malls"
       }
      },
      {
       "id": "c",
       "text": {
        "th": "Sports centers",
        "en": "Sports centers"
       }
      },
      {
       "id": "d",
       "text": {
        "th": "Crowded restaurants",
        "en": "Crowded restaurants"
       }
      }
     ],
     "answerIds": [
      "a"
     ],
     "audioScript": "Hi everyone! I’m Lin, and I’m from Taiwan. This is actually my first time studying abroad. Honestly, I was a bit nervous at first, but people here are really helpful. I usually start my day around 7 AM. I have breakfast at the dorm canteen and then head to class. I’m studying environmental science, and I think it’s a very important subject these days. In the afternoons, I often go to the library or attend campus activities. Personally, I believe joining activities is the best way to make friends. On weekends, I sometimes visit museums or walk in the park. I enjoy quiet places, and I think spending time alone helps me recharge. If you’re also new here, don’t worry too much. Everything takes time. In my opinion, being open to new experiences is the key to enjoying student life!"
    },
    {
     "id": "engb11-ul-5",
     "type": "single",
     "skill": "listening",
     "prompt": {
      "th": "What is Lin’s opinion about adapting to new environments?",
      "en": "What is Lin’s opinion about adapting to new environments?"
     },
     "choices": [
      {
       "id": "a",
       "text": {
        "th": "Being open to new experiences is the key.",
        "en": "Being open to new experiences is the key."
       }
      },
      {
       "id": "b",
       "text": {
        "th": "It is too difficult to enjoy life abroad.",
        "en": "It is too difficult to enjoy life abroad."
       }
      },
      {
       "id": "c",
       "text": {
        "th": "It’s better to just stay home.",
        "en": "It’s better to just stay home."
       }
      },
      {
       "id": "d",
       "text": {
        "th": "You must follow what others do",
        "en": "You must follow what others do"
       }
      }
     ],
     "answerIds": [
      "a"
     ],
     "audioScript": "Hi everyone! I’m Lin, and I’m from Taiwan. This is actually my first time studying abroad. Honestly, I was a bit nervous at first, but people here are really helpful. I usually start my day around 7 AM. I have breakfast at the dorm canteen and then head to class. I’m studying environmental science, and I think it’s a very important subject these days. In the afternoons, I often go to the library or attend campus activities. Personally, I believe joining activities is the best way to make friends. On weekends, I sometimes visit museums or walk in the park. I enjoy quiet places, and I think spending time alone helps me recharge. If you’re also new here, don’t worry too much. Everything takes time. In my opinion, being open to new experiences is the key to enjoying student life!"
    },
    {
     "id": "engb11-ur-1",
     "type": "single",
     "skill": "reading",
     "prompt": {
      "th": "What is the relationship between Tom and Aran?",
      "en": "What is the relationship between Tom and Aran?"
     },
     "choices": [
      {
       "id": "a",
       "text": {
        "th": "They are roommates.",
        "en": "They are roommates."
       }
      },
      {
       "id": "b",
       "text": {
        "th": "They are brothers.",
        "en": "They are brothers."
       }
      },
      {
       "id": "c",
       "text": {
        "th": "They are classmates only.",
        "en": "They are classmates only."
       }
      },
      {
       "id": "d",
       "text": {
        "th": "They are neighbors.",
        "en": "They are neighbors."
       }
      }
     ],
     "answerIds": [
      "a"
     ],
     "passage": {
      "th": "A New Roommate\nHello! My name is Tom, and I just moved into a new apartment last week. I'm sharing it with a guy named Aran. He is from Thailand, and this is his second year studying engineering here in London.\nAt first, I was a bit nervous because I had never lived with someone from another country. But Aran is friendly and respectful. We usually have dinner together in the evenings. He often cooks Thai food, and I think it's delicious! Personally, I enjoy learning about different cultures, so I find this experience very exciting.\nOn weekdays, we both wake up early because our classes start around 9 AM. After breakfast, we walk to the university together. We don’t always have the same schedule, but we often meet again in the evening. On weekends, we sometimes go to the local market or explore parts of the city. Aran always says, “Trying new things helps you grow.” I really agree with that.",
      "en": "A New Roommate\nHello! My name is Tom, and I just moved into a new apartment last week. I'm sharing it with a guy named Aran. He is from Thailand, and this is his second year studying engineering here in London.\nAt first, I was a bit nervous because I had never lived with someone from another country. But Aran is friendly and respectful. We usually have dinner together in the evenings. He often cooks Thai food, and I think it's delicious! Personally, I enjoy learning about different cultures, so I find this experience very exciting.\nOn weekdays, we both wake up early because our classes start around 9 AM. After breakfast, we walk to the university together. We don’t always have the same schedule, but we often meet again in the evening. On weekends, we sometimes go to the local market or explore parts of the city. Aran always says, “Trying new things helps you grow.” I really agree with that."
     }
    },
    {
     "id": "engb11-ur-2",
     "type": "single",
     "skill": "reading",
     "prompt": {
      "th": "How does Tom feel about living with someone from another country now?",
      "en": "How does Tom feel about living with someone from another country now?"
     },
     "choices": [
      {
       "id": "a",
       "text": {
        "th": "He finds it exciting and enjoyable.",
        "en": "He finds it exciting and enjoyable."
       }
      },
      {
       "id": "b",
       "text": {
        "th": "He finds it boring.",
        "en": "He finds it boring."
       }
      },
      {
       "id": "c",
       "text": {
        "th": "He wants to live alone.",
        "en": "He wants to live alone."
       }
      },
      {
       "id": "d",
       "text": {
        "th": "He is still very uncomfortable.",
        "en": "He is still very uncomfortable."
       }
      }
     ],
     "answerIds": [
      "a"
     ],
     "passage": {
      "th": "A New Roommate\nHello! My name is Tom, and I just moved into a new apartment last week. I'm sharing it with a guy named Aran. He is from Thailand, and this is his second year studying engineering here in London.\nAt first, I was a bit nervous because I had never lived with someone from another country. But Aran is friendly and respectful. We usually have dinner together in the evenings. He often cooks Thai food, and I think it's delicious! Personally, I enjoy learning about different cultures, so I find this experience very exciting.\nOn weekdays, we both wake up early because our classes start around 9 AM. After breakfast, we walk to the university together. We don’t always have the same schedule, but we often meet again in the evening. On weekends, we sometimes go to the local market or explore parts of the city. Aran always says, “Trying new things helps you grow.” I really agree with that.",
      "en": "A New Roommate\nHello! My name is Tom, and I just moved into a new apartment last week. I'm sharing it with a guy named Aran. He is from Thailand, and this is his second year studying engineering here in London.\nAt first, I was a bit nervous because I had never lived with someone from another country. But Aran is friendly and respectful. We usually have dinner together in the evenings. He often cooks Thai food, and I think it's delicious! Personally, I enjoy learning about different cultures, so I find this experience very exciting.\nOn weekdays, we both wake up early because our classes start around 9 AM. After breakfast, we walk to the university together. We don’t always have the same schedule, but we often meet again in the evening. On weekends, we sometimes go to the local market or explore parts of the city. Aran always says, “Trying new things helps you grow.” I really agree with that."
     }
    },
    {
     "id": "engb11-ur-3",
     "type": "single",
     "skill": "reading",
     "prompt": {
      "th": "What do Tom and Aran usually do in the evenings on weekdays?",
      "en": "What do Tom and Aran usually do in the evenings on weekdays?"
     },
     "choices": [
      {
       "id": "a",
       "text": {
        "th": "They have dinner together.",
        "en": "They have dinner together."
       }
      },
      {
       "id": "b",
       "text": {
        "th": "They go jogging.",
        "en": "They go jogging."
       }
      },
      {
       "id": "c",
       "text": {
        "th": "They study at different places.",
        "en": "They study at different places."
       }
      },
      {
       "id": "d",
       "text": {
        "th": "They attend concerts.",
        "en": "They attend concerts."
       }
      }
     ],
     "answerIds": [
      "a"
     ],
     "passage": {
      "th": "A New Roommate\nHello! My name is Tom, and I just moved into a new apartment last week. I'm sharing it with a guy named Aran. He is from Thailand, and this is his second year studying engineering here in London.\nAt first, I was a bit nervous because I had never lived with someone from another country. But Aran is friendly and respectful. We usually have dinner together in the evenings. He often cooks Thai food, and I think it's delicious! Personally, I enjoy learning about different cultures, so I find this experience very exciting.\nOn weekdays, we both wake up early because our classes start around 9 AM. After breakfast, we walk to the university together. We don’t always have the same schedule, but we often meet again in the evening. On weekends, we sometimes go to the local market or explore parts of the city. Aran always says, “Trying new things helps you grow.” I really agree with that.",
      "en": "A New Roommate\nHello! My name is Tom, and I just moved into a new apartment last week. I'm sharing it with a guy named Aran. He is from Thailand, and this is his second year studying engineering here in London.\nAt first, I was a bit nervous because I had never lived with someone from another country. But Aran is friendly and respectful. We usually have dinner together in the evenings. He often cooks Thai food, and I think it's delicious! Personally, I enjoy learning about different cultures, so I find this experience very exciting.\nOn weekdays, we both wake up early because our classes start around 9 AM. After breakfast, we walk to the university together. We don’t always have the same schedule, but we often meet again in the evening. On weekends, we sometimes go to the local market or explore parts of the city. Aran always says, “Trying new things helps you grow.” I really agree with that."
     }
    },
    {
     "id": "engb11-ur-4",
     "type": "single",
     "skill": "reading",
     "prompt": {
      "th": "What is Aran’s opinion about trying new things?",
      "en": "What is Aran’s opinion about trying new things?"
     },
     "choices": [
      {
       "id": "a",
       "text": {
        "th": "He believes it's good for personal growth.",
        "en": "He believes it's good for personal growth."
       }
      },
      {
       "id": "b",
       "text": {
        "th": "He thinks it’s too risky.",
        "en": "He thinks it’s too risky."
       }
      },
      {
       "id": "c",
       "text": {
        "th": "He prefers doing the same things.",
        "en": "He prefers doing the same things."
       }
      },
      {
       "id": "d",
       "text": {
        "th": "He avoids anything unfamiliar.",
        "en": "He avoids anything unfamiliar."
       }
      }
     ],
     "answerIds": [
      "a"
     ],
     "passage": {
      "th": "A New Roommate\nHello! My name is Tom, and I just moved into a new apartment last week. I'm sharing it with a guy named Aran. He is from Thailand, and this is his second year studying engineering here in London.\nAt first, I was a bit nervous because I had never lived with someone from another country. But Aran is friendly and respectful. We usually have dinner together in the evenings. He often cooks Thai food, and I think it's delicious! Personally, I enjoy learning about different cultures, so I find this experience very exciting.\nOn weekdays, we both wake up early because our classes start around 9 AM. After breakfast, we walk to the university together. We don’t always have the same schedule, but we often meet again in the evening. On weekends, we sometimes go to the local market or explore parts of the city. Aran always says, “Trying new things helps you grow.” I really agree with that.",
      "en": "A New Roommate\nHello! My name is Tom, and I just moved into a new apartment last week. I'm sharing it with a guy named Aran. He is from Thailand, and this is his second year studying engineering here in London.\nAt first, I was a bit nervous because I had never lived with someone from another country. But Aran is friendly and respectful. We usually have dinner together in the evenings. He often cooks Thai food, and I think it's delicious! Personally, I enjoy learning about different cultures, so I find this experience very exciting.\nOn weekdays, we both wake up early because our classes start around 9 AM. After breakfast, we walk to the university together. We don’t always have the same schedule, but we often meet again in the evening. On weekends, we sometimes go to the local market or explore parts of the city. Aran always says, “Trying new things helps you grow.” I really agree with that."
     }
    },
    {
     "id": "engb11-ur-5",
     "type": "single",
     "skill": "reading",
     "prompt": {
      "th": "What time do their classes usually begin?",
      "en": "What time do their classes usually begin?"
     },
     "choices": [
      {
       "id": "a",
       "text": {
        "th": "Around 9 AM",
        "en": "Around 9 AM"
       }
      },
      {
       "id": "b",
       "text": {
        "th": "Around 7 AM",
        "en": "Around 7 AM"
       }
      },
      {
       "id": "c",
       "text": {
        "th": "After lunch",
        "en": "After lunch"
       }
      },
      {
       "id": "d",
       "text": {
        "th": "At 10:30 AM",
        "en": "At 10:30 AM"
       }
      }
     ],
     "answerIds": [
      "a"
     ],
     "passage": {
      "th": "A New Roommate\nHello! My name is Tom, and I just moved into a new apartment last week. I'm sharing it with a guy named Aran. He is from Thailand, and this is his second year studying engineering here in London.\nAt first, I was a bit nervous because I had never lived with someone from another country. But Aran is friendly and respectful. We usually have dinner together in the evenings. He often cooks Thai food, and I think it's delicious! Personally, I enjoy learning about different cultures, so I find this experience very exciting.\nOn weekdays, we both wake up early because our classes start around 9 AM. After breakfast, we walk to the university together. We don’t always have the same schedule, but we often meet again in the evening. On weekends, we sometimes go to the local market or explore parts of the city. Aran always says, “Trying new things helps you grow.” I really agree with that.",
      "en": "A New Roommate\nHello! My name is Tom, and I just moved into a new apartment last week. I'm sharing it with a guy named Aran. He is from Thailand, and this is his second year studying engineering here in London.\nAt first, I was a bit nervous because I had never lived with someone from another country. But Aran is friendly and respectful. We usually have dinner together in the evenings. He often cooks Thai food, and I think it's delicious! Personally, I enjoy learning about different cultures, so I find this experience very exciting.\nOn weekdays, we both wake up early because our classes start around 9 AM. After breakfast, we walk to the university together. We don’t always have the same schedule, but we often meet again in the evening. On weekends, we sometimes go to the local market or explore parts of the city. Aran always says, “Trying new things helps you grow.” I really agree with that."
     }
    },
    {
     "id": "engb11-us-1",
     "type": "speaking",
     "skill": "speaking",
     "prompt": {
      "th": "Talk about Your Weekend Routine (พูดเกี่ยวกับกิจวัตรวันหยุดสุดสัปดาห์ของคุณ)",
      "en": "Talk about Your Weekend Routine (พูดเกี่ยวกับกิจวัตรวันหยุดสุดสัปดาห์ของคุณ)"
     },
     "instruction": {
      "th": "Prepare to speak for about 30-45 seconds about your typical weekend routine. (คำสั่ง: เตรียมพูดประมาณ 30-45 วินาทีเกี่ยวกับกิจวัตรวันหยุดสุดสัปดาห์ตามปกติของคุณ)",
      "en": "Prepare to speak for about 30-45 seconds about your typical weekend routine. (คำสั่ง: เตรียมพูดประมาณ 30-45 วินาทีเกี่ยวกับกิจวัตรวันหยุดสุดสัปดาห์ตามปกติของคุณ)"
     },
     "guidelines": [
      {
       "th": "Mention at least two activities you usually do on weekends. (กล่าวถึงกิจกรรมอย่างน้อยสองอย่างที่คุณมักจะทำในวันหยุดสุดสัปดาห์)",
       "en": "Mention at least two activities you usually do on weekends. (กล่าวถึงกิจกรรมอย่างน้อยสองอย่างที่คุณมักจะทำในวันหยุดสุดสัปดาห์)"
      },
      {
       "th": "Use Present Simple and adverbs of frequency. (ใช้ Present Simple และคำวิเศษณ์บอกความถี่)",
       "en": "Use Present Simple and adverbs of frequency. (ใช้ Present Simple และคำวิเศษณ์บอกความถี่)"
      },
      {
       "th": "Express an opinion about why you enjoy your weekend activities or what makes a good weekend for you. (แสดงความคิดเห็นว่าทำไมคุณถึงสนุกกับกิจกรรมวันหยุดสุดสัปดาห์ของคุณ หรืออะไรที่ทำให้วันหยุดสุดสัปดาห์ของคุณเป็นวันที่ดี)",
       "en": "Express an opinion about why you enjoy your weekend activities or what makes a good weekend for you. (แสดงความคิดเห็นว่าทำไมคุณถึงสนุกกับกิจกรรมวันหยุดสุดสัปดาห์ของคุณ หรืออะไรที่ทำให้วันหยุดสุดสัปดาห์ของคุณเป็นวันที่ดี)"
      }
     ],
     "starter": {
      "th": "\"On weekends, I usually...\" Your spoken answer: _________________________________________________________",
      "en": "\"On weekends, I usually...\" Your spoken answer: _________________________________________________________"
     },
     "sample": {
      "th": "\"On weekends, I usually wake up a bit later, around 9 AM. I always have a big breakfast. Then, I often go to the park for a walk or sometimes meet friends for coffee. In the evenings, I sometimes watch a movie at home. In my opinion, a good weekend is when I can relax and do things I enjoy without any stress.\"",
      "en": "\"On weekends, I usually wake up a bit later, around 9 AM. I always have a big breakfast. Then, I often go to the park for a walk or sometimes meet friends for coffee. In the evenings, I sometimes watch a movie at home. In my opinion, a good weekend is when I can relax and do things I enjoy without any stress.\""
     }
    },
    {
     "id": "engb11-us-2",
     "type": "speaking",
     "skill": "speaking",
     "prompt": {
      "th": "Giving Advice to a Newcomer about Your Neighborhood (การให้คำแนะนำแก่ผู้มาใหม่เกี่ยวกับย่านที่คุณอาศัยอยู่)",
      "en": "Giving Advice to a Newcomer about Your Neighborhood (การให้คำแนะนำแก่ผู้มาใหม่เกี่ยวกับย่านที่คุณอาศัยอยู่)"
     },
     "instruction": {
      "th": "Imagine a new person has just moved into your neighborhood and asks you for some information and your opinions about living there. Prepare to speak for about 45-60 seconds. (คำสั่ง: ลองจินตนาการว่ามีคนเพิ่งย้ายเข้ามาอยู่ในย่านของคุณและขอข้อมูลและความคิดเห็นจากคุณเกี่ยวกับการอาศัยอยู่ที่นั่น เตรียมพูดประมาณ 45-60 วินาที)",
      "en": "Imagine a new person has just moved into your neighborhood and asks you for some information and your opinions about living there. Prepare to speak for about 45-60 seconds. (คำสั่ง: ลองจินตนาการว่ามีคนเพิ่งย้ายเข้ามาอยู่ในย่านของคุณและขอข้อมูลและความคิดเห็นจากคุณเกี่ยวกับการอาศัยอยู่ที่นั่น เตรียมพูดประมาณ 45-60 วินาที)"
     },
     "guidelines": [
      {
       "th": "Mention one or two positive aspects of your neighborhood (e.g., \"It's usually very quiet,\" \"There are often good local markets\"). (กล่าวถึงข้อดีของย่านที่คุณอยู่อย่างน้อยหนึ่งหรือสองอย่าง เช่น \"ปกติแล้วที่นี่เงียบสงบมาก\" \"ตลาดสดแถวนี้ค่อนข้างดี\")",
       "en": "Mention one or two positive aspects of your neighborhood (e.g., \"It's usually very quiet,\" \"There are often good local markets\"). (กล่าวถึงข้อดีของย่านที่คุณอยู่อย่างน้อยหนึ่งหรือสองอย่าง เช่น \"ปกติแล้วที่นี่เงียบสงบมาก\" \"ตลาดสดแถวนี้ค่อนข้างดี\")"
      },
      {
       "th": "Suggest one activity or place they might enjoy visiting or doing in the area (e.g., \"You can visit the park,\" \"People often go to the community center\"). (แนะนำกิจกรรมหรือสถานที่หนึ่งอย่างที่พวกเขาอาจจะชอบไปหรือทำในย่านนั้น เช่น \"คุณสามารถไปเที่ยวสวนสาธารณะได้\" \"คนแถวนี้มักจะไปที่ลานชุมชนกัน\")",
       "en": "Suggest one activity or place they might enjoy visiting or doing in the area (e.g., \"You can visit the park,\" \"People often go to the community center\"). (แนะนำกิจกรรมหรือสถานที่หนึ่งอย่างที่พวกเขาอาจจะชอบไปหรือทำในย่านนั้น เช่น \"คุณสามารถไปเที่ยวสวนสาธารณะได้\" \"คนแถวนี้มักจะไปที่ลานชุมชนกัน\")"
      },
      {
       "th": "Use Present Simple and adverbs of frequency when describing general situations or common activities. (ใช้ Present Simple และคำวิเศษณ์บอกความถี่เมื่ออธิบายสถานการณ์ทั่วไปหรือกิจกรรมที่ทำกันเป็นปกติ)",
       "en": "Use Present Simple and adverbs of frequency when describing general situations or common activities. (ใช้ Present Simple และคำวิเศษณ์บอกความถี่เมื่ออธิบายสถานการณ์ทั่วไปหรือกิจกรรมที่ทำกันเป็นปกติ)"
      },
      {
       "th": "Express at least one personal opinion or belief about living in the neighborhood (e.g., \"I think it's a great place for families,\" \"Personally, I believe it's very convenient.\"). (แสดงความคิดเห็นส่วนตัวหรือความเชื่ออย่างน้อยหนึ่งอย่างเกี่ยวกับการอาศัยอยู่ในย่านนั้น เช่น \"ฉันคิดว่าที่นี่เป็นสถานที่ที่ดีสำหรับครอบครัว\" \"ส่วนตัวแล้ว รู้สึกว่าอยู่ที่นี่แล้วสะดวกสบายมาก\")",
       "en": "Express at least one personal opinion or belief about living in the neighborhood (e.g., \"I think it's a great place for families,\" \"Personally, I believe it's very convenient.\"). (แสดงความคิดเห็นส่วนตัวหรือความเชื่ออย่างน้อยหนึ่งอย่างเกี่ยวกับการอาศัยอยู่ในย่านนั้น เช่น \"ฉันคิดว่าที่นี่เป็นสถานที่ที่ดีสำหรับครอบครัว\" \"ส่วนตัวแล้ว รู้สึกว่าอยู่ที่นี่แล้วสะดวกสบายมาก\")"
      }
     ],
     "starter": {
      "th": "\"Welcome to the neighborhood! Living here is generally...\" Your spoken answer: _________________________________________________________",
      "en": "\"Welcome to the neighborhood! Living here is generally...\" Your spoken answer: _________________________________________________________"
     },
     "sample": {
      "th": "\"Welcome to the neighborhood! Living here is generally quite pleasant. It's usually very quiet, especially in the evenings, which I really appreciate. There are often good local markets on Saturdays where you can find fresh produce. For something to do, you can visit the community park near the river; many people often go there to relax or exercise. Personally, I think it's a very family-friendly area, and I believe you'll find people here are quite welcoming.\"",
      "en": "\"Welcome to the neighborhood! Living here is generally quite pleasant. It's usually very quiet, especially in the evenings, which I really appreciate. There are often good local markets on Saturdays where you can find fresh produce. For something to do, you can visit the community park near the river; many people often go there to relax or exercise. Personally, I think it's a very family-friendly area, and I believe you'll find people here are quite welcoming.\""
     }
    },
    {
     "id": "engb11-uw-1",
     "type": "typing",
     "skill": "writing",
     "prompt": {
      "th": "Describing a Friend's Daily Routine and Your Opinion (อธิบายกิจวัตรประจำวันของเพื่อนและความคิดเห็นของคุณ)",
      "en": "Describing a Friend's Daily Routine and Your Opinion (อธิบายกิจวัตรประจำวันของเพื่อนและความคิดเห็นของคุณ)"
     },
     "instruction": {
      "th": "Think about a friend or family member. Write a short paragraph (about 5-7 sentences) describing their typical daily routine on a weekday. Then, add one sentence expressing your opinion about their routine. (คำสั่ง: ลองนึกถึงเพื่อนหรือสมาชิกในครอบครัวของคุณ เขียนย่อหน้าสั้น ๆ (ประมาณ 5-7 ประโยค) อธิบายกิจวัตรประจำวันตามปกติของพวกเขาในวันธรรมดา จากนั้นเพิ่มหนึ่งประโยคที่แสดงความคิดเห็นของคุณเกี่ยวกับกิจวัตรของพวกเขา)",
      "en": "Think about a friend or family member. Write a short paragraph (about 5-7 sentences) describing their typical daily routine on a weekday. Then, add one sentence expressing your opinion about their routine. (คำสั่ง: ลองนึกถึงเพื่อนหรือสมาชิกในครอบครัวของคุณ เขียนย่อหน้าสั้น ๆ (ประมาณ 5-7 ประโยค) อธิบายกิจวัตรประจำวันตามปกติของพวกเขาในวันธรรมดา จากนั้นเพิ่มหนึ่งประโยคที่แสดงความคิดเห็นของคุณเกี่ยวกับกิจวัตรของพวกเขา)"
     },
     "guidelines": [
      {
       "th": "Start by introducing your friend/family member (e.g., \"My friend, [Name], usually...\"). (เริ่มต้นด้วยการแนะนำเพื่อน/สมาชิกในครอบครัวของคุณ เช่น \"เพื่อนของฉัน [ชื่อ] มักจะ...\")",
       "en": "Start by introducing your friend/family member (e.g., \"My friend, [Name], usually...\"). (เริ่มต้นด้วยการแนะนำเพื่อน/สมาชิกในครอบครัวของคุณ เช่น \"เพื่อนของฉัน [ชื่อ] มักจะ...\")"
      },
      {
       "th": "Describe at least 2-3 activities they typically do in sequence. (อธิบายกิจกรรมอย่างน้อย 2-3 อย่างที่พวกเขามักจะทำตามลำดับ)",
       "en": "Describe at least 2-3 activities they typically do in sequence. (อธิบายกิจกรรมอย่างน้อย 2-3 อย่างที่พวกเขามักจะทำตามลำดับ)"
      },
      {
       "th": "Use Present Simple tense (remembering the -s/-es for third person singular). (ใช้ Present Simple tense (อย่าลืมเติม -s/-es สำหรับประธานเอกพจน์บุรุษที่สาม))",
       "en": "Use Present Simple tense (remembering the -s/-es for third person singular). (ใช้ Present Simple tense (อย่าลืมเติม -s/-es สำหรับประธานเอกพจน์บุรุษที่สาม))"
      },
      {
       "th": "Include at least one adverb of frequency. (ใส่คำวิเศษณ์บอกความถี่อย่างน้อยหนึ่งคำ)",
       "en": "Include at least one adverb of frequency. (ใส่คำวิเศษณ์บอกความถี่อย่างน้อยหนึ่งคำ)"
      },
      {
       "th": "End with one sentence expressing your personal opinion about their routine (e.g., \"I think their routine is very organized,\" \"In my opinion, they work too hard,\" \"I believe they have a good balance.\"). (ปิดท้ายด้วยหนึ่งประโยคที่แสดงความคิดเห็นส่วนตัวของคุณเกี่ยวกับกิจวัตรของพวกเขา เช่น \"ฉันคิดว่ากิจวัตรของพวกเขามีระเบียบมาก\" \"ในความคิดของฉัน พวกเขาทำงานหนักเกินไป\" \"ฉันเชื่อว่าพวกเขามีความสมดุลที่ดี\")",
       "en": "End with one sentence expressing your personal opinion about their routine (e.g., \"I think their routine is very organized,\" \"In my opinion, they work too hard,\" \"I believe they have a good balance.\"). (ปิดท้ายด้วยหนึ่งประโยคที่แสดงความคิดเห็นส่วนตัวของคุณเกี่ยวกับกิจวัตรของพวกเขา เช่น \"ฉันคิดว่ากิจวัตรของพวกเขามีระเบียบมาก\" \"ในความคิดของฉัน พวกเขาทำงานหนักเกินไป\" \"ฉันเชื่อว่าพวกเขามีความสมดุลที่ดี\")"
      }
     ],
     "starter": {
      "th": "My friend/My [family member], [Name], has an interesting daily routine. (เพื่อนของฉัน/ [สมาชิกในครอบครัว] ของฉัน, [ชื่อ], มีกิจวัตรประจำวันที่น่าสนใจ)",
      "en": "My friend/My [family member], [Name], has an interesting daily routine. (เพื่อนของฉัน/ [สมาชิกในครอบครัว] ของฉัน, [ชื่อ], มีกิจวัตรประจำวันที่น่าสนใจ)"
     },
     "sample": {
      "th": "My friend, Anna, has an interesting daily routine. She usually wakes up very early, around 5 AM, to go for a run. After that, she prepares breakfast for her family and then goes to work. She often works late into the evening. In my opinion, her routine is very demanding, but she seems to manage it well.",
      "en": "My friend, Anna, has an interesting daily routine. She usually wakes up very early, around 5 AM, to go for a run. After that, she prepares breakfast for her family and then goes to work. She often works late into the evening. In my opinion, her routine is very demanding, but she seems to manage it well."
     }
    },
    {
     "id": "engb11-uw-2",
     "type": "typing",
     "skill": "writing",
     "prompt": {
      "th": "Guided Short Writing Task (งานเขียนสั้น ๆ แบบมีแนวทาง)",
      "en": "Guided Short Writing Task (งานเขียนสั้น ๆ แบบมีแนวทาง)"
     },
     "instruction": {
      "th": "You are starting a new job. Write a short paragraph (5–7 sentences) to introduce yourself to your new colleagues in an informal email or message. (คำสั่ง: คุณกำลังจะเริ่มงานใหม่ เขียนย่อหน้าสั้น ๆ (5-7 ประโยค) เพื่อแนะนำตัวเองกับเพื่อนร่วมงานใหม่ของคุณในอีเมลหรือข้อความที่ไม่เป็นทางการ)",
      "en": "You are starting a new job. Write a short paragraph (5–7 sentences) to introduce yourself to your new colleagues in an informal email or message. (คำสั่ง: คุณกำลังจะเริ่มงานใหม่ เขียนย่อหน้าสั้น ๆ (5-7 ประโยค) เพื่อแนะนำตัวเองกับเพื่อนร่วมงานใหม่ของคุณในอีเมลหรือข้อความที่ไม่เป็นทางการ)"
     },
     "guidelines": [
      {
       "th": "Start with a friendly greeting and your name. (เริ่มต้นด้วยการทักทายอย่างเป็นมิตรและบอกชื่อของคุณ)",
       "en": "Start with a friendly greeting and your name. (เริ่มต้นด้วยการทักทายอย่างเป็นมิตรและบอกชื่อของคุณ)"
      },
      {
       "th": "Mention where you are from (optional, if relevant). (บอกว่าคุณมาจากไหน (ถ้าต้องการ หรือถ้าเกี่ยวข้อง))",
       "en": "Mention where you are from (optional, if relevant). (บอกว่าคุณมาจากไหน (ถ้าต้องการ หรือถ้าเกี่ยวข้อง))"
      },
      {
       "th": "Briefly state your new role or what you do. (บอกบทบาทใหม่ของคุณหรือสิ่งที่คุณทำสั้น ๆ )",
       "en": "Briefly state your new role or what you do. (บอกบทบาทใหม่ของคุณหรือสิ่งที่คุณทำสั้น ๆ )"
      },
      {
       "th": "Share one thing you usually do in your free time or a hobby. (แบ่งปันสิ่งหนึ่งที่คุณมักจะทำในเวลาว่างหรืองานอดิเรก)",
       "en": "Share one thing you usually do in your free time or a hobby. (แบ่งปันสิ่งหนึ่งที่คุณมักจะทำในเวลาว่างหรืองานอดิเรก)"
      },
      {
       "th": "Express one positive thought or opinion about starting this new job (e.g., \"I think it will be...\", \"I believe I can...\", \"In my opinion, this is a great opportunity...\"). (แสดงความคิดหรือความคิดเห็นเชิงบวกหนึ่งอย่างเกี่ยวกับการเริ่มงานใหม่นี้ เช่น \"ฉันคิดว่ามันจะเป็น...\", \"ฉันเชื่อว่าฉันสามารถ...\", \"ในความคิดของฉัน นี่เป็นโอกาสที่ดี...\")",
       "en": "Express one positive thought or opinion about starting this new job (e.g., \"I think it will be...\", \"I believe I can...\", \"In my opinion, this is a great opportunity...\"). (แสดงความคิดหรือความคิดเห็นเชิงบวกหนึ่งอย่างเกี่ยวกับการเริ่มงานใหม่นี้ เช่น \"ฉันคิดว่ามันจะเป็น...\", \"ฉันเชื่อว่าฉันสามารถ...\", \"ในความคิดของฉัน นี่เป็นโอกาสที่ดี...\")"
      },
      {
       "th": "Keep the tone friendly and approachable. (รักษาน้ำเสียงให้เป็นมิตรและเข้าถึงง่าย)",
       "en": "Keep the tone friendly and approachable. (รักษาน้ำเสียงให้เป็นมิตรและเข้าถึงง่าย)"
      }
     ],
     "starter": {
      "th": "Start your paragraph with something like: \"Hi everyone, My name is...\" or \"Hello team, I'm...\" (เริ่มต้นย่อหน้าของคุณด้วยประโยคประมาณว่า: \"สวัสดีค่ะทุกคน ฉันชื่อ...\" หรือ \"สวัสดีทีม ฉันคือ...\")",
      "en": "Start your paragraph with something like: \"Hi everyone, My name is...\" or \"Hello team, I'm...\" (เริ่มต้นย่อหน้าของคุณด้วยประโยคประมาณว่า: \"สวัสดีค่ะทุกคน ฉันชื่อ...\" หรือ \"สวัสดีทีม ฉันคือ...\")"
     },
     "sample": {
      "th": "Hi everyone, My name is Marco, and I'm excited to join the team as the new Marketing Assistant. I'm originally from Italy but have been living here for a few years. In my free time, I usually enjoy hiking and photography. I sometimes go to art exhibitions on weekends. I believe this new role will be a fantastic learning experience, and I'm looking forward to collaborating with all of you. In my opinion, teamwork is key to success!",
      "en": "Hi everyone, My name is Marco, and I'm excited to join the team as the new Marketing Assistant. I'm originally from Italy but have been living here for a few years. In my free time, I usually enjoy hiking and photography. I sometimes go to art exhibitions on weekends. I believe this new role will be a fantastic learning experience, and I'm looking forward to collaborating with all of you. In my opinion, teamwork is key to success!"
     }
    },
    {
     "id": "engb11-ug-1",
     "type": "single",
     "skill": "grammar",
     "prompt": {
      "th": "When meeting someone for the first time, it is polite to say:",
      "en": "When meeting someone for the first time, it is polite to say:"
     },
     "choices": [
      {
       "id": "a",
       "text": {
        "th": "Nice to meet you. My name is Anna.",
        "en": "Nice to meet you. My name is Anna."
       }
      },
      {
       "id": "b",
       "text": {
        "th": "Hello you. I calling Anna.",
        "en": "Hello you. I calling Anna."
       }
      },
      {
       "id": "c",
       "text": {
        "th": "You nice meeting. I name is Anna.",
        "en": "You nice meeting. I name is Anna."
       }
      },
      {
       "id": "d",
       "text": {
        "th": "To meet you is nice, I Anna.",
        "en": "To meet you is nice, I Anna."
       }
      }
     ],
     "answerIds": [
      "a"
     ]
    },
    {
     "id": "engb11-ug-2",
     "type": "single",
     "skill": "grammar",
     "prompt": {
      "th": "Pim: “What _______ about living in a big city?” Somchai: “_______ it’s exciting but sometimes too noisy.”",
      "en": "Pim: “What _______ about living in a big city?” Somchai: “_______ it’s exciting but sometimes too noisy.”"
     },
     "choices": [
      {
       "id": "a",
       "text": {
        "th": "do you think / I think",
        "en": "do you think / I think"
       }
      },
      {
       "id": "b",
       "text": {
        "th": "is your think / I am feel",
        "en": "is your think / I am feel"
       }
      },
      {
       "id": "c",
       "text": {
        "th": "you do thinking / My opinion that",
        "en": "you do thinking / My opinion that"
       }
      },
      {
       "id": "d",
       "text": {
        "th": "are your opinion / I belief",
        "en": "are your opinion / I belief"
       }
      }
     ],
     "answerIds": [
      "a"
     ]
    },
    {
     "id": "engb11-ug-3",
     "type": "single",
     "skill": "grammar",
     "prompt": {
      "th": "I _______ go to the library after class because I like the quiet environment.",
      "en": "I _______ go to the library after class because I like the quiet environment."
     },
     "choices": [
      {
       "id": "a",
       "text": {
        "th": "Often",
        "en": "Often"
       }
      },
      {
       "id": "b",
       "text": {
        "th": "Neverly",
        "en": "Neverly"
       }
      },
      {
       "id": "c",
       "text": {
        "th": "Few",
        "en": "Few"
       }
      },
      {
       "id": "d",
       "text": {
        "th": "much",
        "en": "much"
       }
      }
     ],
     "answerIds": [
      "a"
     ]
    },
    {
     "id": "engb11-ug-4",
     "type": "single",
     "skill": "grammar",
     "prompt": {
      "th": "Tom: “_______ do you usually eat lunch?” Nick: “I eat at the canteen with friends at 12:30 PM.”",
      "en": "Tom: “_______ do you usually eat lunch?” Nick: “I eat at the canteen with friends at 12:30 PM.”"
     },
     "choices": [
      {
       "id": "a",
       "text": {
        "th": "What time",
        "en": "What time"
       }
      },
      {
       "id": "b",
       "text": {
        "th": "What food",
        "en": "What food"
       }
      },
      {
       "id": "c",
       "text": {
        "th": "Which menu",
        "en": "Which menu"
       }
      },
      {
       "id": "d",
       "text": {
        "th": "Why not",
        "en": "Why not"
       }
      }
     ],
     "answerIds": [
      "a"
     ]
    },
    {
     "id": "engb11-ug-5",
     "type": "single",
     "skill": "grammar",
     "prompt": {
      "th": "Mali: “Could you introduce yourself to the group?” Pim: “Sure. _______ from Thailand and I’m studying English here.”",
      "en": "Mali: “Could you introduce yourself to the group?” Pim: “Sure. _______ from Thailand and I’m studying English here.”"
     },
     "choices": [
      {
       "id": "a",
       "text": {
        "th": "I’m Pim",
        "en": "I’m Pim"
       }
      },
      {
       "id": "b",
       "text": {
        "th": "Me Pim",
        "en": "Me Pim"
       }
      },
      {
       "id": "c",
       "text": {
        "th": "I be Pim",
        "en": "I be Pim"
       }
      },
      {
       "id": "d",
       "text": {
        "th": "Pim is I",
        "en": "Pim is I"
       }
      }
     ],
     "answerIds": [
      "a"
     ]
    },
    {
     "id": "engb11-ug-6",
     "type": "single",
     "skill": "grammar",
     "prompt": {
      "th": "Somchai: “_______, I think studying in groups helps me understand better.”",
      "en": "Somchai: “_______, I think studying in groups helps me understand better.”"
     },
     "choices": [
      {
       "id": "a",
       "text": {
        "th": "Personally",
        "en": "Personally"
       }
      },
      {
       "id": "b",
       "text": {
        "th": "To I feel",
        "en": "To I feel"
       }
      },
      {
       "id": "c",
       "text": {
        "th": "By my thought",
        "en": "By my thought"
       }
      },
      {
       "id": "d",
       "text": {
        "th": "Feeling me that",
        "en": "Feeling me that"
       }
      }
     ],
     "answerIds": [
      "a"
     ]
    }
   ]
  }
 }
};
