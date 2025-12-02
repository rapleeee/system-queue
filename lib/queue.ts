export type Student = {
  id: string;
  name: string;
  order: number;
  observer1Name?: string;
  observer2Name?: string;
};

export type QueueId =
  | "x-rpl"
  | "xi-rpl"
  | "x-tkj"
  | "xi-tkj"
  | "x-dkv"
  | "xi-dkv";

export type QueueState = {
  students: Student[];
  currentIndex: number;
  updatedAt: number;
};

export const DEFAULT_QUEUE_ID: QueueId = "x-rpl";

export const QUEUE_LABELS: Record<QueueId, string> = {
  "x-rpl": "X RPL",
  "xi-rpl": "XI RPL",
  "x-tkj": "X TKJ",
  "xi-tkj": "XI TKJ",
  "x-dkv": "X DKV",
  "xi-dkv": "XI DKV",
};

export const ALL_QUEUE_IDS: QueueId[] = [
  "x-rpl",
  "xi-rpl",
  "x-tkj",
  "xi-tkj",
  "x-dkv",
  "xi-dkv",
];

const buildStudents = (prefix: string): Student[] =>
  Array.from({ length: 10 }).map((_, index) => {
    const order = index + 1;
    return {
      id: `${prefix.toLowerCase().replace(/\s+/g, "-")}-${order}`,
      name: `${prefix} - Siswa ${order}`,
      order,
    };
  });

export const INITIAL_STUDENTS_BY_QUEUE: Record<QueueId, Student[]> = {
  "x-rpl": [
    {
      id: "252610001",
      name: "ABBAD NAILUN NABHAN",
      order: 1,
      observer1Name: "HANIF EL HAKIM",
      observer2Name: "KAYLA ARTALITA",
    },
    {
      id: "252610004",
      name: "ADITYA SALMAN SUNTANA",
      order: 2,
      observer1Name: "KAYLA ARTALITA",
      observer2Name: "M.ALFATH FACHRIZY EL HAKIM",
    },
    {
      id: "252610008",
      name: "ALWI HUSEIN SHAHAB",
      order: 3,
      observer1Name: "M.ALFATH FACHRIZY EL HAKIM",
      observer2Name: "MOHAMMAD SYAFIQ ALFARISI",
    },
    {
      id: "252610074",
      name: "AMMAR ZAHID ASKARULLAH",
      order: 4,
      observer1Name: "MOHAMMAD SYAFIQ ALFARISI",
      observer2Name: "MUH. AMMAR SIDIQ PUTRA MUAMAR",
    },
    {
      id: "252610013",
      name: "ARGHAD FAWWAZ ANANDA",
      order: 5,
      observer1Name: "MUH. AMMAR SIDIQ PUTRA MUAMAR",
      observer2Name: "MUHAMAD RAFIE TAUFIK",
    },
    {
      id: "252610021",
      name: "BELVA ALKEANNO WIBOWO",
      order: 6,
      observer1Name: "MUHAMAD RAFIE TAUFIK",
      observer2Name: "ABBAD NAILUN NABHAN",
    },
    {
      id: "252610028",
      name: "HANIF EL HAKIM",
      order: 7,
      observer1Name: "ABBAD NAILUN NABHAN",
      observer2Name: "ADITYA SALMAN SUNTANA",
    },
    {
      id: "252610032",
      name: "KAYLA ARTALITA",
      order: 8,
      observer1Name: "ADITYA SALMAN SUNTANA",
      observer2Name: "ALWI HUSEIN SHAHAB",
    },
    {
      id: "252610034",
      name: "M.ALFATH FACHRIZY EL HAKIM",
      order: 9,
      observer1Name: "ALWI HUSEIN SHAHAB",
      observer2Name: "AMMAR ZAHID ASKARULLAH",
    },
    {
      id: "252610052",
      name: "MOHAMMAD SYAFIQ ALFARISI",
      order: 10,
      observer1Name: "AMMAR ZAHID ASKARULLAH",
      observer2Name: "ARGHAD FAWWAZ ANANDA",
    },
    {
      id: "252610037",
      name: "MUH. AMMAR SIDIQ PUTRA MUAMAR",
      order: 11,
      observer1Name: "ARGHAD FAWWAZ ANANDA",
      observer2Name: "BELVA ALKEANNO WIBOWO",
    },
    {
      id: "252610038",
      name: "MUHAMAD RAFIE TAUFIK",
      order: 12,
      observer1Name: "BELVA ALKEANNO WIBOWO",
      observer2Name: "HANIF EL HAKIM",
    },
    {
      id: "252610040",
      name: "MUHAMMAD AIDIEL KAMIL",
      order: 13,
      observer1Name: "RAIHANA AZARINE YULIANTORO",
      observer2Name: "SHAFIRA MULYANA",
    },
    {
      id: "252610041",
      name: "MUHAMMAD ALIEF ALVIANSYAH",
      order: 14,
      observer1Name: "SHAFIRA MULYANA",
      observer2Name: "SHAHJAHAN AFZAAL SAIFUDIN",
    },
    {
      id: "252610043",
      name: "MUHAMMAD ANUGRAH ASHRI",
      order: 15,
      observer1Name: "SHAHJAHAN AFZAAL SAIFUDIN",
      observer2Name: "WYANET IN NAKEISHA",
    },
    {
      id: "252610045",
      name: "MUHAMMAD DZAKWAN AL MAULIDIN",
      order: 16,
      observer1Name: "WYANET IN NAKEISHA",
      observer2Name: "ZENTRISTAN VITADI",
    },
    {
      id: "252610048",
      name: "MUHAMMAD KHAIRUL AZZAM",
      order: 17,
      observer1Name: "ZENTRISTAN VITADI",
      observer2Name: "ZHOFIR RAFIF MACHIKO",
    },
    {
      id: "252610058",
      name: "RAIHANA AZARINE YULIANTORO",
      order: 18,
      observer1Name: "ZHOFIR RAFIF MACHIKO",
      observer2Name: "MUHAMMAD AIDIEL KAMIL",
    },
    {
      id: "252610067",
      name: "SHAFIRA MULYANA",
      order: 19,
      observer1Name: "MUHAMMAD AIDIEL KAMIL",
      observer2Name: "MUHAMMAD ALIEF ALVIANSYAH",
    },
    {
      id: "252610068",
      name: "SHAHJAHAN AFZAAL SAIFUDIN",
      order: 20,
      observer1Name: "MUHAMMAD ALIEF ALVIANSYAH",
      observer2Name: "MUHAMMAD ANUGRAH ASHRI",
    },
    {
      id: "252610071",
      name: "WYANET IN NAKEISHA",
      order: 21,
      observer1Name: "MUHAMMAD ANUGRAH ASHRI",
      observer2Name: "MUHAMMAD DZAKWAN AL MAULIDIN",
    },
    {
      id: "252610072",
      name: "ZENTRISTAN VITADI",
      order: 22,
      observer1Name: "MUHAMMAD DZAKWAN AL MAULIDIN",
      observer2Name: "MUHAMMAD KHAIRUL AZZAM",
    },
    {
      id: "252610073",
      name: "ZHOFIR RAFIF MACHIKO",
      order: 23,
      observer1Name: "MUHAMMAD KHAIRUL AZZAM",
      observer2Name: "RAIHANA AZARINE YULIANTORO",
    },
  ],
  "xi-rpl": [
    {
      id: "242510001",
      name: "AHMAD AZZAM MOZARIST",
      order: 1,
      observer1Name: "GLENN MARCEL",
      observer2Name: "HADI FAWWAZ SUDEWO",
    },
    {
      id: "242510003",
      name: "AHMAD SATTAR FATHULLOH",
      order: 2,
      observer1Name: "HADI FAWWAZ SUDEWO",
      observer2Name: "KEYZA MAULIDYA PUTRI SANDRA",
    },
    {
      id: "242510004",
      name: "AHMAD YUSUF AR-RAFI",
      order: 3,
      observer1Name: "KEYZA MAULIDYA PUTRI SANDRA",
      observer2Name: "MUHAMAD FAISAL",
    },
    {
      id: "242510005",
      name: "AKSAJRENO FATHUKHOTIR HAYU",
      order: 4,
      observer1Name: "MUHAMAD FAISAL",
      observer2Name: "MUHAMAD RADITYA MAHENDAR",
    },
    {
      id: "242510010",
      name: "BIMASENA WIRYAATMAJA YUSUF",
      order: 5,
      observer1Name: "MUHAMAD RADITYA MAHENDAR",
      observer2Name: "MUHAMMAD FATHAN GHANI HIDAYAT",
    },
    {
      id: "242510013",
      name: "DENIZ RIZKI ATTILA",
      order: 6,
      observer1Name: "MUHAMMAD FATHAN GHANI HIDAYAT",
      observer2Name: "MUHAMMAD RADITYA RIZKI PRATAMA",
    },
    {
      id: "242510018",
      name: "FAIZ NABIL AKRAM",
      order: 7,
      observer1Name: "MUHAMMAD RADITYA RIZKI PRATAMA",
      observer2Name: "AHMAD AZZAM MOZARIST",
    },
    {
      id: "242510023",
      name: "GHAZAM AL ALIY RAVANDY",
      order: 8,
      observer1Name: "AHMAD AZZAM MOZARIST",
      observer2Name: "AHMAD SATTAR FATHULLOH",
    },
    {
      id: "242510026",
      name: "GLENN MARCEL",
      order: 9,
      observer1Name: "AHMAD SATTAR FATHULLOH",
      observer2Name: "AHMAD YUSUF AR-RAFI",
    },
    {
      id: "242510027",
      name: "HADI FAWWAZ SUDEWO",
      order: 10,
      observer1Name: "AHMAD YUSUF AR-RAFI",
      observer2Name: "AKSAJRENO FATHUKHOTIR HAYU",
    },
    {
      id: "242510034",
      name: "KEYZA MAULIDYA PUTRI SANDRA",
      order: 11,
      observer1Name: "AKSAJRENO FATHUKHOTIR HAYU",
      observer2Name: "BIMASENA WIRYAATMAJA YUSUF",
    },
    {
      id: "242510036",
      name: "MUHAMAD FAISAL",
      order: 12,
      observer1Name: "BIMASENA WIRYAATMAJA YUSUF",
      observer2Name: "DENIZ RIZKI ATTILA",
    },
    {
      id: "242510038",
      name: "MUHAMAD RADITYA MAHENDAR",
      order: 13,
      observer1Name: "DENIZ RIZKI ATTILA",
      observer2Name: "FAIZ NABIL AKRAM",
    },
    {
      id: "242510039",
      name: "MUHAMMAD FATHAN GHANI HIDAYAT",
      order: 14,
      observer1Name: "FAIZ NABIL AKRAM",
      observer2Name: "GHAZAM AL ALIY RAVANDY",
    },
    {
      id: "242510041",
      name: "MUHAMMAD RADITYA RIZKI PRATAMA",
      order: 15,
      observer1Name: "GHAZAM AL ALIY RAVANDY",
      observer2Name: "GLENN MARCEL",
    },
    {
      id: "242510047",
      name: "QURROTA A'YUN EL-FAMA",
      order: 16,
      observer1Name: "RANGGA AZKA SUTRISNA",
      observer2Name: "SHABIRA SYAHLA ALVALIZA",
    },
    {
      id: "242510049",
      name: "RAFA RIZKITULLAH FAUZAN",
      order: 17,
      observer1Name: "SHABIRA SYAHLA ALVALIZA",
      observer2Name: "THORIQ AZHAR RADITYA",
    },
    {
      id: "242510050",
      name: "RAFASYAH MAYVERN RAINAYA",
      order: 18,
      observer1Name: "THORIQ AZHAR RADITYA",
      observer2Name: "TRISTANARA DENNISE AULIANANDA",
    },
    {
      id: "242510051",
      name: "RAFAY ARVINO SETIAWAN",
      order: 19,
      observer1Name: "TRISTANARA DENNISE AULIANANDA",
      observer2Name: "VEER SADZWAN AL AMUDI",
    },
    {
      id: "242510052",
      name: "RAFIF HAZEL RAMIRO A.P.",
      order: 20,
      observer1Name: "VEER SADZWAN AL AMUDI",
      observer2Name: "YUNITA ALFITRIYANI",
    },
    {
      id: "242510053",
      name: "RAFKA NOOR PUTRA",
      order: 21,
      observer1Name: "YUNITA ALFITRIYANI",
      observer2Name: "ZIA KIRANA AGUSTIN",
    },
    {
      id: "242510055",
      name: "RAIS BIMA PRAYATA",
      order: 22,
      observer1Name: "ZIA KIRANA AGUSTIN",
      observer2Name: "AODDI RESKEH PECHOKOV",
    },
    {
      id: "242510056",
      name: "RANGGA AZKA SUTRISNA",
      order: 23,
      observer1Name: "AODDI RESKEH PECHOKOV",
      observer2Name: "QURROTA A'YUN EL-FAMA",
    },
    {
      id: "242510062",
      name: "SHABIRA SYAHLA ALVALIZA",
      order: 24,
      observer1Name: "QURROTA A'YUN EL-FAMA",
      observer2Name: "RAFA RIZKITULLAH FAUZAN",
    },
    {
      id: "242510065",
      name: "THORIQ AZHAR RADITYA",
      order: 25,
      observer1Name: "RAFA RIZKITULLAH FAUZAN",
      observer2Name: "RAFASYAH MAYVERN RAINAYA",
    },
    {
      id: "242510066",
      name: "TRISTANARA DENNISE AULIANANDA",
      order: 26,
      observer1Name: "RAFASYAH MAYVERN RAINAYA",
      observer2Name: "RAFAY ARVINO SETIAWAN",
    },
    {
      id: "242510067",
      name: "VEER SADZWAN AL AMUDI",
      order: 27,
      observer1Name: "RAFAY ARVINO SETIAWAN",
      observer2Name: "RAFIF HAZEL RAMIRO A.P.",
    },
    {
      id: "242510068",
      name: "YUNITA ALFITRIYANI",
      order: 28,
      observer1Name: "RAFIF HAZEL RAMIRO A.P.",
      observer2Name: "RAFKA NOOR PUTRA",
    },
    {
      id: "242510070",
      name: "ZIA KIRANA AGUSTIN",
      order: 29,
      observer1Name: "RAFKA NOOR PUTRA",
      observer2Name: "RAIS BIMA PRAYATA",
    },
    {
      id: "242510071",
      name: "AODDI RESKEH PECHOKOV",
      order: 30,
      observer1Name: "RAIS BIMA PRAYATA",
      observer2Name: "RANGGA AZKA SUTRISNA",
    },
  ],
  "x-tkj": [
    {
      id: "252610003",
      name: "ADITYA PRATAMA BEWAJOENI",
      order: 1,
      observer1Name: "MUHAMMAD RAKA ABDARRAZZAQ",
      observer2Name: "MUHAMMAD RAYI ABDALFATTAH",
    },
    {
      id: "252610005",
      name: "ALMEER SYAIRAZI BADHOWI",
      order: 2,
      observer1Name: "MUHAMMAD RAYI ABDALFATTAH",
      observer2Name: "NAUVAL NURFADHLULLAH",
    },
    {
      id: "252610007",
      name: "ALVIN NADHIF MAULANA",
      order: 3,
      observer1Name: "NAUVAL NURFADHLULLAH",
      observer2Name: "QONITA AZKIYA",
    },
    {
      id: "252610010",
      name: "AMANDA MUSTIKA PRANARHADI",
      order: 4,
      observer1Name: "QONITA AZKIYA",
      observer2Name: "RAFAEL NAJWAN MAHARDHIKA",
    },
    {
      id: "252610016",
      name: "ARRPEGIANO RIANTO PUTRA",
      order: 5,
      observer1Name: "RAFAEL NAJWAN MAHARDHIKA",
      observer2Name: "RASYA ARFAN NUGRAHA",
    },
    {
      id: "252610020",
      name: "BAGAS RAFFAEL SETIYAWAN",
      order: 6,
      observer1Name: "RASYA ARFAN NUGRAHA",
      observer2Name: "RIZKI ABDILLAH ALFATAH",
    },
    {
      id: "252610036",
      name: "MOHAMMAD DWIE CAESAR",
      order: 7,
      observer1Name: "RIZKI ABDILLAH ALFATAH",
      observer2Name: "ROMEO RAMADHAN",
    },
    {
      id: "252610047",
      name: "MUHAMMAD IMRAN PUTRA SYA'BAN",
      order: 8,
      observer1Name: "ROMEO RAMADHAN",
      observer2Name: "SYABHIL FADILLAH MULKHI WARMAN",
    },
    {
      id: "252610049",
      name: "MUHAMMAD RAIHAN ALTHAF YULIANTORO",
      order: 9,
      observer1Name: "SYABHIL FADILLAH MULKHI WARMAN",
      observer2Name: "ADITYA PRATAMA BEWAJOENI",
    },
    {
      id: "252610050",
      name: "MUHAMMAD RAKA ABDARRAZZAQ",
      order: 10,
      observer1Name: "ADITYA PRATAMA BEWAJOENI",
      observer2Name: "ALMEER SYAIRAZI BADHOWI",
    },
    {
      id: "252610051",
      name: "MUHAMMAD RAYI ABDALFATTAH",
      order: 11,
      observer1Name: "ALMEER SYAIRAZI BADHOWI",
      observer2Name: "ALVIN NADHIF MAULANA",
    },
    {
      id: "252610053",
      name: "NAUVAL NURFADHLULLAH",
      order: 12,
      observer1Name: "ALVIN NADHIF MAULANA",
      observer2Name: "AMANDA MUSTIKA PRANARHADI",
    },
    {
      id: "252610054",
      name: "QONITA AZKIYA",
      order: 13,
      observer1Name: "AMANDA MUSTIKA PRANARHADI",
      observer2Name: "ARRPEGIANO RIANTO PUTRA",
    },
    {
      id: "252610056",
      name: "RAFAEL NAJWAN MAHARDHIKA",
      order: 14,
      observer1Name: "ARRPEGIANO RIANTO PUTRA",
      observer2Name: "BAGAS RAFFAEL SETIYAWAN",
    },
    {
      id: "252610061",
      name: "RASYA ARFAN NUGRAHA",
      order: 15,
      observer1Name: "BAGAS RAFFAEL SETIYAWAN",
      observer2Name: "MOHAMMAD DWIE CAESAR",
    },
    {
      id: "252610064",
      name: "RIZKI ABDILLAH ALFATAH",
      order: 16,
      observer1Name: "MOHAMMAD DWIE CAESAR",
      observer2Name: "MUHAMMAD IMRAN PUTRA SYA'BAN",
    },
    {
      id: "252610065",
      name: "ROMEO RAMADHAN",
      order: 17,
      observer1Name: "MUHAMMAD IMRAN PUTRA SYA'BAN",
      observer2Name: "MUHAMMAD RAIHAN ALTHAF YULIANTORO",
    },
    {
      id: "252610069",
      name: "SYABHIL FADILLAH MULKHI WARMAN",
      order: 18,
      observer1Name: "MUHAMMAD RAIHAN ALTHAF YULIANTORO",
      observer2Name: "MUHAMMAD RAKA ABDARRAZZAQ",
    },
  ],
  "xi-tkj": [
    {
      id: "242510006",
      name: "ALVIN RICHARD HIDAYAT ARAS",
      order: 1,
      observer1Name: "MUHAMMAD RAFKHA FATHUSSOLEH",
      observer2Name: "NABIL AHMAD FIRDAUS",
    },
    {
      id: "242510008",
      name: "ATHALLAH RAFIF ABINAYA DARMAWAN",
      order: 2,
      observer1Name: "NABIL AHMAD FIRDAUS",
      observer2Name: "RADITHYA SYAHINDRA",
    },
    {
      id: "242510020",
      name: "FATHAN QORIBA",
      order: 3,
      observer1Name: "RADITHYA SYAHINDRA",
      observer2Name: "RANGGA PUTRA PRAYOGA",
    },
    {
      id: "242510021",
      name: "FATIHA MALIQ AL HABSHY",
      order: 4,
      observer1Name: "RANGGA PUTRA PRAYOGA",
      observer2Name: "RASYA ADITYA MACHMUD",
    },
    {
      id: "242510031",
      name: "JUNIOR FERNANDO",
      order: 5,
      observer1Name: "RASYA ADITYA MACHMUD",
      observer2Name: "SYAZWAN MUHAMMAD DHIYAULHAQ",
    },
    {
      id: "242510037",
      name: "MUHAMAD FAJAR AL HADI",
      order: 6,
      observer1Name: "SYAZWAN MUHAMMAD DHIYAULHAQ",
      observer2Name: "ALVIN RICHARD HIDAYAT ARAS",
    },
    {
      id: "242510042",
      name: "MUHAMMAD RAFKHA FATHUSSOLEH",
      order: 7,
      observer1Name: "ALVIN RICHARD HIDAYAT ARAS",
      observer2Name: "ATHALLAH RAFIF ABINAYA DARMAWAN",
    },
    {
      id: "242510045",
      name: "NABIL AHMAD FIRDAUS",
      order: 8,
      observer1Name: "ATHALLAH RAFIF ABINAYA DARMAWAN",
      observer2Name: "FATHAN QORIBA",
    },
    {
      id: "242510048",
      name: "RADITHYA SYAHINDRA",
      order: 9,
      observer1Name: "FATHAN QORIBA",
      observer2Name: "FATIHA MALIQ AL HABSHY",
    },
    {
      id: "242510057",
      name: "RANGGA PUTRA PRAYOGA",
      order: 10,
      observer1Name: "FATIHA MALIQ AL HABSHY",
      observer2Name: "JUNIOR FERNANDO",
    },
    {
      id: "242510058",
      name: "RASYA ADITYA MACHMUD",
      order: 11,
      observer1Name: "JUNIOR FERNANDO",
      observer2Name: "MUHAMAD FAJAR AL HADI",
    },
    {
      id: "242510064",
      name: "SYAZWAN MUHAMMAD DHIYAULHAQ",
      order: 12,
      observer1Name: "MUHAMAD FAJAR AL HADI",
      observer2Name: "MUHAMMAD RAFKHA FATHUSSOLEH",
    },
  ],
  "x-dkv": [
    {
      id: "252610002",
      name: "ABYAKTA DIMAS MAHARDIKA",
      order: 1,
      observer1Name: "AZKA AQILA",
      observer2Name: "AZKA AZKIA KAMILAH",
    },
    {
      id: "252610006",
      name: "ALVARO RAFKA SAPUTRA",
      order: 2,
      observer1Name: "AZKA AZKIA KAMILAH",
      observer2Name: "BENSHA PRAYATA HERDIANSYAH",
    },
    {
      id: "252610009",
      name: "ALYSA NOVA MAULIDA",
      order: 3,
      observer1Name: "BENSHA PRAYATA HERDIANSYAH",
      observer2Name: "CARISSA NABILA AZKA",
    },
    {
      id: "252610011",
      name: "AQILA NADYA SHAFWAH CHAIR",
      order: 4,
      observer1Name: "CARISSA NABILA AZKA",
      observer2Name: "DIARSA MUHAMMAD",
    },
    {
      id: "252610012",
      name: "AR RAYYAN BANJARJAYA JATI",
      order: 5,
      observer1Name: "DIARSA MUHAMMAD",
      observer2Name: "FABIAN FAUZI NUR RAHMAN",
    },
    {
      id: "252610014",
      name: "ARIQ GATHAN MAULANA",
      order: 6,
      observer1Name: "FABIAN FAUZI NUR RAHMAN",
      observer2Name: "FALISHA SHEZAN AZKAYRA",
    },
    {
      id: "252610015",
      name: "ARKANA GHANI NARESHWARA",
      order: 7,
      observer1Name: "FALISHA SHEZAN AZKAYRA",
      observer2Name: "GHANI NUGROHO",
    },
    {
      id: "252610017",
      name: "ATHALA KHALYLA ISWARI",
      order: 8,
      observer1Name: "GHANI NUGROHO",
      observer2Name: "HIDAYAT NUR RIZKI",
    },
    {
      id: "252610018",
      name: "AZKA AQILA",
      order: 9,
      observer1Name: "HIDAYAT NUR RIZKI",
      observer2Name: "ABYAKTA DIMAS MAHARDIKA",
    },
    {
      id: "252610019",
      name: "AZKA AZKIA KAMILAH",
      order: 10,
      observer1Name: "ABYAKTA DIMAS MAHARDIKA",
      observer2Name: "ALVARO RAFKA SAPUTRA",
    },
    {
      id: "252610022",
      name: "BENSHA PRAYATA HERDIANSYAH",
      order: 11,
      observer1Name: "ALVARO RAFKA SAPUTRA",
      observer2Name: "ALYSA NOVA MAULIDA",
    },
    {
      id: "252610023",
      name: "CARISSA NABILA AZKA",
      order: 12,
      observer1Name: "ALYSA NOVA MAULIDA",
      observer2Name: "AQILA NADYA SHAFWAH CHAIR",
    },
    {
      id: "252610024",
      name: "DIARSA MUHAMMAD",
      order: 13,
      observer1Name: "AQILA NADYA SHAFWAH CHAIR",
      observer2Name: "AR RAYYAN BANJARJAYA JATI",
    },
    {
      id: "252610025",
      name: "FABIAN FAUZI NUR RAHMAN",
      order: 14,
      observer1Name: "AR RAYYAN BANJARJAYA JATI",
      observer2Name: "ARIQ GATHAN MAULANA",
    },
    {
      id: "252610026",
      name: "FALISHA SHEZAN AZKAYRA",
      order: 15,
      observer1Name: "ARIQ GATHAN MAULANA",
      observer2Name: "ARKANA GHANI NARESHWARA",
    },
    {
      id: "252610027",
      name: "GHANI NUGROHO",
      order: 16,
      observer1Name: "ARKANA GHANI NARESHWARA",
      observer2Name: "ATHALA KHALYLA ISWARI",
    },
    {
      id: "252610029",
      name: "HIDAYAT NUR RIZKI",
      order: 17,
      observer1Name: "ATHALA KHALYLA ISWARI",
      observer2Name: "AZKA AQILA",
    },
    {
      id: "252610030",
      name: "HILMI AIMAN NURHIKMAT",
      order: 18,
      observer1Name: "RAFA RADITHYA HAFIZ",
      observer2Name: "RAFKA NAVIZ",
    },
    {
      id: "252610031",
      name: "KAORI REVISHA PUTRI RIANTO",
      order: 19,
      observer1Name: "RAFKA NAVIZ",
      observer2Name: "RAIS HAMIZAN HAKIM",
    },
    {
      id: "252610033",
      name: "KEANU AZZRIEL NOUVALDY",
      order: 20,
      observer1Name: "RAIS HAMIZAN HAKIM",
      observer2Name: "RASYA ADHITIA PRATAMA",
    },
    {
      id: "252610035",
      name: "MILKA FALIZA RAYSYA",
      order: 21,
      observer1Name: "RASYA ADHITIA PRATAMA",
      observer2Name: "REVA MARATUS SHOLIHAH",
    },
    {
      id: "252610039",
      name: "MUHAMAD RIZKI RADITIA RAMADHAN",
      order: 22,
      observer1Name: "REVA MARATUS SHOLIHAH",
      observer2Name: "RINDRA RASYID ABIYASA",
    },
    {
      id: "252610042",
      name: "MUHAMMAD ALVINO HASRI",
      order: 23,
      observer1Name: "RINDRA RASYID ABIYASA",
      observer2Name: "SALEH NASAR MUNIF",
    },
    {
      id: "252610044",
      name: "MUHAMMAD DEVANO AL KHAIDAFY",
      order: 24,
      observer1Name: "SALEH NASAR MUNIF",
      observer2Name: "WILDAN ZAGHLUL IZAZ",
    },
    {
      id: "252610046",
      name: "MUHAMMAD DZIKRA FAWWAZ MITHWA",
      order: 25,
      observer1Name: "WILDAN ZAGHLUL IZAZ",
      observer2Name: "HILMI AIMAN NURHIKMAT",
    },
    {
      id: "252610055",
      name: "RAFA RADITHYA HAFIZ",
      order: 26,
      observer1Name: "HILMI AIMAN NURHIKMAT",
      observer2Name: "KAORI REVISHA PUTRI RIANTO",
    },
    {
      id: "252610057",
      name: "RAFKA NAVIZ",
      order: 27,
      observer1Name: "KAORI REVISHA PUTRI RIANTO",
      observer2Name: "KEANU AZZRIEL NOUVALDY",
    },
    {
      id: "252610059",
      name: "RAIS HAMIZAN HAKIM",
      order: 28,
      observer1Name: "KEANU AZZRIEL NOUVALDY",
      observer2Name: "MILKA FALIZA RAYSYA",
    },
    {
      id: "252610060",
      name: "RASYA ADHITIA PRATAMA",
      order: 29,
      observer1Name: "MILKA FALIZA RAYSYA",
      observer2Name: "MUHAMAD RIZKI RADITIA RAMADHAN",
    },
    {
      id: "252610062",
      name: "REVA MARATUS SHOLIHAH",
      order: 30,
      observer1Name: "MUHAMAD RIZKI RADITIA RAMADHAN",
      observer2Name: "MUHAMMAD ALVINO HASRI",
    },
    {
      id: "252610063",
      name: "RINDRA RASYID ABIYASA",
      order: 31,
      observer1Name: "MUHAMMAD ALVINO HASRI",
      observer2Name: "MUHAMMAD DEVANO AL KHAIDAFY",
    },
    {
      id: "252610066",
      name: "SALEH NASAR MUNIF",
      order: 32,
      observer1Name: "MUHAMMAD DEVANO AL KHAIDAFY",
      observer2Name: "MUHAMMAD DZIKRA FAWWAZ MITHWA",
    },
    {
      id: "252610070",
      name: "WILDAN ZAGHLUL IZAZ",
      order: 33,
      observer1Name: "MUHAMMAD DZIKRA FAWWAZ MITHWA",
      observer2Name: "RAFA RADITHYA HAFIZ",
    },
  ],
  "xi-dkv": [
    {
      id: "242510002",
      name: "AHMAD DEVAN DEWANGGA",
      order: 1,
      observer1Name: "FADJAR ZAAHIR AL MUBAROK",
      observer2Name: "FAQIH ABDUL KARIM",
    },
    {
      id: "242510009",
      name: "BIAGIE GYBRAN RAMADHAN YAHYA",
      order: 2,
      observer1Name: "FAQIH ABDUL KARIM",
      observer2Name: "FIRDA RIANA RIZQIA",
    },
    {
      id: "242510011",
      name: "DAFFA ATHIYYAH KAMILA",
      order: 3,
      observer1Name: "FIRDA RIANA RIZQIA",
      observer2Name: "GHIFARI RANGGA RAMADHAN",
    },
    {
      id: "242510012",
      name: "DEANDRA OMAR PRATAMA",
      order: 4,
      observer1Name: "GHIFARI RANGGA RAMADHAN",
      observer2Name: "GISAN NASHIRA NUGRAHA",
    },
    {
      id: "242510014",
      name: "DEVANO BAGASKARA",
      order: 5,
      observer1Name: "GISAN NASHIRA NUGRAHA",
      observer2Name: "HANIF IMAM MUTTAQIN",
    },
    {
      id: "242510015",
      name: "DIWA ALIMAR DJAUHAR",
      order: 6,
      observer1Name: "HANIF IMAM MUTTAQIN",
      observer2Name: "IBNU GHALI AULIA",
    },
    {
      id: "242510016",
      name: "FADILLAH PUTRA SETIAWAN",
      order: 7,
      observer1Name: "IBNU GHALI AULIA",
      observer2Name: "AHMAD DEVAN DEWANGGA",
    },
    {
      id: "242510017",
      name: "FADJAR ZAAHIR AL MUBAROK",
      order: 8,
      observer1Name: "AHMAD DEVAN DEWANGGA",
      observer2Name: "BIAGIE GYBRAN RAMADHAN YAHYA",
    },
    {
      id: "242510019",
      name: "FAQIH ABDUL KARIM",
      order: 9,
      observer1Name: "BIAGIE GYBRAN RAMADHAN YAHYA",
      observer2Name: "DAFFA ATHIYYAH KAMILA",
    },
    {
      id: "242510022",
      name: "FIRDA RIANA RIZQIA",
      order: 10,
      observer1Name: "DAFFA ATHIYYAH KAMILA",
      observer2Name: "DEANDRA OMAR PRATAMA",
    },
    {
      id: "242510024",
      name: "GHIFARI RANGGA RAMADHAN",
      order: 11,
      observer1Name: "DEANDRA OMAR PRATAMA",
      observer2Name: "DEVANO BAGASKARA",
    },
    {
      id: "242510025",
      name: "GISAN NASHIRA NUGRAHA",
      order: 12,
      observer1Name: "DEVANO BAGASKARA",
      observer2Name: "DIWA ALIMAR DJAUHAR",
    },
    {
      id: "242510028",
      name: "HANIF IMAM MUTTAQIN",
      order: 13,
      observer1Name: "DIWA ALIMAR DJAUHAR",
      observer2Name: "FADILLAH PUTRA SETIAWAN",
    },
    {
      id: "242510029",
      name: "IBNU GHALI AULIA",
      order: 14,
      observer1Name: "FADILLAH PUTRA SETIAWAN",
      observer2Name: "FADJAR ZAAHIR AL MUBAROK",
    },
    {
      id: "242510030",
      name: "JASMINE AULIA PUTRI PRASETIYO",
      order: 15,
      observer1Name: "MUHAMMAD ZULFRAN RAYHAN LESMANA",
      observer2Name: "NAISYA SALMA HANIFA",
    },
    {
      id: "242510032",
      name: "KAFKA HAFIZH GAUTAMA",
      order: 16,
      observer1Name: "NAISYA SALMA HANIFA",
      observer2Name: "RAIHAN ALFARIZI NASUTION",
    },
    {
      id: "242510033",
      name: "KEVAN DEWO ADJIE PUTERA TRIYANTO",
      order: 17,
      observer1Name: "RAIHAN ALFARIZI NASUTION",
      observer2Name: "RUMARAS BUDI PROBOSIWI",
    },
    {
      id: "242510035",
      name: "MIKAELA AVIER",
      order: 18,
      observer1Name: "RUMARAS BUDI PROBOSIWI",
      observer2Name: "SABRIA FAYZA",
    },
    {
      id: "242510040",
      name: "MUHAMMAD FATHAN SYAHPUTRA WALI",
      order: 19,
      observer1Name: "SABRIA FAYZA",
      observer2Name: "SALWA HAFSHAH MARDIYYAH",
    },
    {
      id: "242510043",
      name: "MUHAMMAD RASYA NUGRAHA",
      order: 20,
      observer1Name: "SALWA HAFSHAH MARDIYYAH",
      observer2Name: "SRIBAGUS HANGESTI MULYA",
    },
    {
      id: "242510044",
      name: "MUHAMMAD ZULFRAN RAYHAN LESMANA",
      order: 21,
      observer1Name: "SRIBAGUS HANGESTI MULYA",
      observer2Name: "JASMINE AULIA PUTRI PRASETIYO",
    },
    {
      id: "242510046",
      name: "NAISYA SALMA HANIFA",
      order: 22,
      observer1Name: "JASMINE AULIA PUTRI PRASETIYO",
      observer2Name: "KAFKA HAFIZH GAUTAMA",
    },
    {
      id: "242510054",
      name: "RAIHAN ALFARIZI NASUTION",
      order: 23,
      observer1Name: "KAFKA HAFIZH GAUTAMA",
      observer2Name: "KEVAN DEWO ADJIE PUTERA TRIYANTO",
    },
    {
      id: "242510059",
      name: "RUMARAS BUDI PROBOSIWI",
      order: 24,
      observer1Name: "KEVAN DEWO ADJIE PUTERA TRIYANTO",
      observer2Name: "MIKAELA AVIER",
    },
    {
      id: "242510060",
      name: "SABRIA FAYZA",
      order: 25,
      observer1Name: "MIKAELA AVIER",
      observer2Name: "MUHAMMAD FATHAN SYAHPUTRA WALI",
    },
    {
      id: "242510061",
      name: "SALWA HAFSHAH MARDIYYAH",
      order: 26,
      observer1Name: "MUHAMMAD FATHAN SYAHPUTRA WALI",
      observer2Name: "MUHAMMAD RASYA NUGRAHA",
    },
    {
      id: "242510063",
      name: "SRIBAGUS HANGESTI MULYA",
      order: 27,
      observer1Name: "MUHAMMAD RASYA NUGRAHA",
      observer2Name: "MUHAMMAD ZULFRAN RAYHAN LESMANA",
    },
  ],
};

// Fallback generic jika suatu saat dipanggil dengan queueId di luar list.
export const INITIAL_STUDENTS: Student[] = buildStudents("Umum");

export function getInitialStudentsForQueue(queueId: string): Student[] {
  const key = queueId.toLowerCase() as QueueId;
  return INITIAL_STUDENTS_BY_QUEUE[key] ?? INITIAL_STUDENTS;
}

export function getPresenterIndex(
  currentIndex: number,
  studentsLength: number,
): number | null {
  if (!studentsLength) return null;
  const index = ((currentIndex % studentsLength) + studentsLength) % studentsLength;
  return index;
}

export function getObserverIndexes(
  currentIndex: number,
  studentsLength: number,
): number[] {
  if (studentsLength === 0) return [];
  if (studentsLength === 1) return [];
  if (studentsLength === 2) return [((currentIndex + 1) % studentsLength)];

  const first = (currentIndex + 1) % studentsLength;
  const second = (currentIndex + 2) % studentsLength;
  return [first, second];
}

export function getObserversForStudent(
  students: Student[],
  presenter: Student,
): Student[] {
  const { observer1Name, observer2Name } = presenter;

  // Jika tidak ada mapping observer khusus, fallback ke pola "dua berikutnya".
  if (!observer1Name && !observer2Name) {
    const presenterIndex = students.findIndex((s) => s.id === presenter.id);
    if (presenterIndex === -1) return [];
    const indexes = getObserverIndexes(presenterIndex, students.length);
    return indexes.map((i) => students[i]).filter(Boolean);
  }

  const result: Student[] = [];

  if (observer1Name) {
    const s1 = students.find(
      (s) => s.name.toLowerCase() === observer1Name.toLowerCase(),
    );
    if (s1) {
      result.push(s1);
    }
  }

  if (observer2Name) {
    const s2 = students.find(
      (s) => s.name.toLowerCase() === observer2Name.toLowerCase(),
    );
    if (s2 && !result.some((r) => r.id === s2.id)) {
      result.push(s2);
    }
  }

  return result;
}
