export type Student = {
  id: string;
  name: string;
  order: number;
  observer1Name?: string;
  observer2Name?: string;
};

export type PresentationStatus = "belum" | "sudah" | "tidak_hadir";

export type StudentStatus = {
  studentId: string;
  status: PresentationStatus;
};

export type HistoryEntry = {
  studentId: string;
  status: PresentationStatus;
  timestamp: number;
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
  statuses?: StudentStatus[];
  history?: HistoryEntry[];
  locked?: boolean;
};

export const DEFAULT_QUEUE_ID: QueueId = "x-rpl";

export const QUEUE_LABELS: Record<QueueId, string> = {
  "x-rpl": "X1",
  "xi-rpl": "XI 1",
  "x-tkj": "X2",
  "xi-tkj": "XI 2",
  "x-dkv": "X 3",
  "xi-dkv": "XI 3",
};

export type QueueTheme = {
  bg: string;
  accent: string;
};

export const QUEUE_THEMES: Record<QueueId, QueueTheme> = {
  "x-rpl": {
    bg: "from-sky-50 to-sky-100",
    accent: "bg-sky-600 text-white",
  },
  "xi-rpl": {
    bg: "from-sky-50 to-sky-100",
    accent: "bg-sky-600 text-white",
  },
  "x-tkj": {
    bg: "from-emerald-50 to-emerald-100",
    accent: "bg-emerald-600 text-white",
  },
  "xi-tkj": {
    bg: "from-emerald-50 to-emerald-100",
    accent: "bg-emerald-600 text-white",
  },
  "x-dkv": {
    bg: "from-amber-50 to-amber-100",
    accent: "bg-amber-500 text-white",
  },
  "xi-dkv": {
    bg: "from-amber-50 to-amber-100",
    accent: "bg-amber-500 text-white",
  },
};

export const QUEUE_ROOMS: Record<QueueId, string> = {
  "x-rpl": "Ruang X1",
  "xi-rpl": "Aula 1",
  "x-tkj": "XII TKJ",
  "xi-tkj": "Aula 2",
  "x-dkv": "RUANG X 2",
  "xi-dkv": "Magnavox",
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
      id: "252610074",
      name: "AMMAR ZAHID ASKARULLAH",
      order: 1,
    },
    {
      id: "252610027",
      name: "GHANI NUGROHO",
      order: 2,
    },
    {
      id: "252610036",
      name: "MOHAMMAD DWIE CAESAR",
      order: 3,
    },
    {
      id: "252610049",
      name: "MUHAMMAD RAIHAN ALTHAF YULIANTORO",
      order: 4,
    },
    {
      id: "252610002",
      name: "ABYAKTA DIMAS MAHARDIKA",
      order: 5,
    },
    {
      id: "252610015",
      name: "ARKANA GHANI NARESHWARA",
      order: 6,
    },
    {
      id: "252610051",
      name: "MUHAMMAD RAYI ABDALFATTAH",
      order: 7,
    },
    {
      id: "252610022",
      name: "BENSHA PRAYATA HERDIANSYAH",
      order: 8,
    },
    {
      id: "252610041",
      name: "MUHAMMAD ALIEF ALVIANSYAH",
      order: 9,
    },
    {
      id: "252610032",
      name: "KAYLA ARTALITA",
      order: 10,
    },
    {
      id: "252610014",
      name: "ARIQ GATHAN MAULANA",
      order: 11,
    },
    {
      id: "252610048",
      name: "MUHAMMAD KHAIRUL AZZAM",
      order: 12,
    },
    {
      id: "252610070",
      name: "WILDAN ZAGHLUL IZAZ",
      order: 13,
    },
    {
      id: "252610031",
      name: "KAORI REVISHA PUTRI RIANTO",
      order: 14,
    },
    {
      id: "252610005",
      name: "ALMEER SYAIRAZI BADHOWI",
      order: 15,
    },
    {
      id: "252610056",
      name: "RAFAEL NAJWAN MAHARDHIKA",
      order: 16,
    },
    {
      id: "252610025",
      name: "FABIAN FAUZI NUR RAHMAN",
      order: 17,
    },
    {
      id: "252610064",
      name: "RIZKI ABDILLAH ALFATAH",
      order: 18,
    },
    {
      id: "252610072",
      name: "ZENTRISTAN VITADI",
      order: 19,
    },
    {
      id: "252610038",
      name: "MUHAMAD RAFIE TAUFIK",
      order: 20,
    },
    {
      id: "252610034",
      name: "M.ALFATH FACHRIZY EL HAKIM",
      order: 21,
    },
    {
      id: "252610023",
      name: "CARISSA NABILA AZKA",
      order: 22,
    },
    {
      id: "252610059",
      name: "RAIS HAMIZAN HAKIM",
      order: 23,
    },
    {
      id: "252610063",
      name: "RINDRA RASYID ABIYASA",
      order: 24,
    },
    {
      id: "252610071",
      name: "WYANET IN NAKEISHA",
      order: 25,
    },
    {
      id: "252610011",
      name: "AQILA NADYA SHAFWAH CHAIR",
      order: 26,
    },
  ],
  "xi-rpl": [
    {
      id: "242510065",
      name: "THORIQ AZHAR RADITYA",
      order: 1,
    },
    {
      id: "242510032",
      name: "KAFKA HAFIZH GAUTAMA",
      order: 2,
    },
    {
      id: "242510006",
      name: "ALVIN RICHARD HIDAYAT ARAS",
      order: 3,
    },
    {
      id: "242510033",
      name: "KEVAN DEWO ADJIE PUTERA TRIYANTO",
      order: 4,
    },
    {
      id: "242510044",
      name: "MUHAMMAD ZULFRAN RAYHAN LESMANA",
      order: 5,
    },
    {
      id: "242510019",
      name: "FAQIH ABDUL KARIM",
      order: 6,
    },
    {
      id: "242510047",
      name: "QURROTA A'YUN EL-FAMA",
      order: 7,
    },
    {
      id: "242510017",
      name: "FADJAR ZAAHIR AL MUBAROK",
      order: 8,
    },
    {
      id: "242510051",
      name: "RAFAY ARVINO SETIAWAN",
      order: 9,
    },
    {
      id: "242510070",
      name: "ZIA KIRANA AGUSTIN",
      order: 10,
    },
    {
      id: "242510022",
      name: "FIRDA RIANA RIZQIA",
      order: 11,
    },
    {
      id: "242510061",
      name: "SALWA HAFSHAH MARDIYYAH",
      order: 12,
    },
    {
      id: "242510005",
      name: "AKSAJRENO FATHUKHOTIR HAYU",
      order: 13,
    },
    {
      id: "242510071",
      name: "AODDI RESKEH PECHOKOV",
      order: 14,
    },
    {
      id: "242510009",
      name: "BIAGIE GYBRAN RAMADHAN YAHYA",
      order: 15,
    },
    {
      id: "242510042",
      name: "MUHAMMAD RAFKHA FATHUSSOLEH",
      order: 16,
    },
    {
      id: "242510057",
      name: "RANGGA PUTRA PRAYOGA",
      order: 17,
    },
    {
      id: "242510058",
      name: "RASYA ADITYA MACHMUD",
      order: 18,
    },
    {
      id: "242510040",
      name: "MUHAMMAD FATHAN SYAHPUTRA WALI",
      order: 19,
    },
    {
      id: "242510048",
      name: "RADITHYA SYAHINDRA",
      order: 20,
    },
    {
      id: "242510035",
      name: "MIKAELA AVIER",
      order: 21,
    },
    {
      id: "242510024",
      name: "GHIFARI RANGGA RAMADHAN",
      order: 22,
    },
    {
      id: "242510066",
      name: "TRISTANARA DENNISE AULIANANDA",
      order: 23,
    },
  ],
  "x-tkj": [
    {
      id: "252610008",
      name: "ALWI HUSEIN SHAHAB",
      order: 1,
    },
    {
      id: "252610012",
      name: "AR RAYYAN BANJARJAYA JATI",
      order: 2,
    },
    {
      id: "252610073",
      name: "ZHOFIR RAFIF MACHIKO",
      order: 3,
    },
    {
      id: "252610042",
      name: "MUHAMMAD ALVINO HASRI",
      order: 4,
    },
    {
      id: "252610021",
      name: "BELVA ALKEANNO WIBOWO",
      order: 5,
    },
    {
      id: "252610062",
      name: "REVA MARATUS SHOLIHAH",
      order: 6,
    },
    {
      id: "252610067",
      name: "SHAFIRA MULYANA",
      order: 7,
    },
    {
      id: "252610030",
      name: "HILMI AIMAN NURHIKMAT",
      order: 8,
    },
    {
      id: "252610055",
      name: "RAFA RADITHYA HAFIZ",
      order: 9,
    },
    {
      id: "252610007",
      name: "ALVIN NADHIF MAULANA",
      order: 10,
    },
    {
      id: "252610035",
      name: "MILKA FALIZA RAYSYA",
      order: 11,
    },
    {
      id: "252610052",
      name: "MOHAMMAD SYAFIQ ALFARISI",
      order: 12,
    },
    {
      id: "252610047",
      name: "MUHAMMAD IMRAN PUTRA SYA'BAN",
      order: 13,
    },
    {
      id: "252610046",
      name: "MUHAMMAD DZIKRA FAWWAZ MITHWA",
      order: 14,
    },
    {
      id: "252610010",
      name: "AMANDA MUSTIKA PRANARHADI",
      order: 15,
    },
    {
      id: "252610068",
      name: "SHAHJAHAN AFZAAL SAIFUDIN",
      order: 16,
    },
    {
      id: "252610026",
      name: "FALISHA SHEZAN AZKAYRA",
      order: 17,
    },
    {
      id: "252610018",
      name: "AZKA AQILA",
      order: 18,
    },
    {
      id: "252610044",
      name: "MUHAMMAD DEVANO ALKHAIDAFY",
      order: 19,
    },
    {
      id: "252610061",
      name: "RASYA ARFAN NUGRAHA",
      order: 20,
    },
    {
      id: "252610065",
      name: "ROMEO RAMADHAN",
      order: 21,
    },
    {
      id: "252610029",
      name: "HIDAYAT NUR RIZKI",
      order: 22,
    },
    {
      id: "252610013",
      name: "ARGHAD FAWWAZ ANANDA",
      order: 23,
    },
    {
      id: "252610006",
      name: "ALVARO RAFKA SAPUTRA",
      order: 24,
    },
  ],
  "xi-tkj": [
    {
      id: "242510039",
      name: "MUHAMMAD FATHAN GHANI HIDAYAT",
      order: 1,
    },
    {
      id: "242510016",
      name: "FADILLAH PUTRA SETIAWAN",
      order: 2,
    },
    {
      id: "242510036",
      name: "MUHAMAD FAISAL",
      order: 3,
    },
    {
      id: "242510045",
      name: "NABIL AHMAD FIRDAUS",
      order: 4,
    },
    {
      id: "242510008",
      name: "ATHALLAH RAFIF ABINAYA DARMAWAN",
      order: 5,
    },
    {
      id: "242510053",
      name: "RAFKA NOOR PUTRA",
      order: 6,
    },
    {
      id: "242510038",
      name: "MUHAMAD RADITYA MAHENDAR",
      order: 7,
    },
    {
      id: "242510015",
      name: "DIWA ALIMAR DJAUHAR",
      order: 8,
    },
    {
      id: "242510064",
      name: "SYAZWAN MUHAMMAD DHIYAULHAQ",
      order: 9,
    },
    {
      id: "242510026",
      name: "GLENN MARCEL",
      order: 10,
    },
    {
      id: "242510062",
      name: "SHABIRA SYAHLA ALVALIZA",
      order: 11,
    },
    {
      id: "242510068",
      name: "YUNITA ALFITRIYANI",
      order: 12,
    },
    {
      id: "242510023",
      name: "GHAZAM AL ALIY RAVANDY",
      order: 13,
    },
    {
      id: "242510012",
      name: "DEANDRA OMAR PRATAMA",
      order: 14,
    },
    {
      id: "242510060",
      name: "SABRIA FAYZA",
      order: 15,
    },
    {
      id: "242510043",
      name: "MUHAMMAD RASYA NUGRAHA",
      order: 16,
    },
    {
      id: "242510034",
      name: "KEYZA MAULIDYA PUTRI SANDRA",
      order: 17,
    },
    {
      id: "242510002",
      name: "AHMAD DEVAN DEWANGGA",
      order: 18,
    },
    {
      id: "242510055",
      name: "RAIS BIMA PRAYATA",
      order: 19,
    },
    {
      id: "242510001",
      name: "AHMAD AZZAM MOZARIST",
      order: 20,
    },
    {
      id: "242510063",
      name: "SRIBAGUS HANGESTI MULYA",
      order: 21,
    },
    {
      id: "242510018",
      name: "FAIZ NABIL AKRAM",
      order: 22,
    },
    {
      id: "242510029",
      name: "IBNU GHALI AULIA",
      order: 23,
    },
    {
      id: "242510021",
      name: "FATIHA MALIQ AL HABSHY",
      order: 24,
    },
  ],
  "x-dkv": [
    {
      id: "252610017",
      name: "ATHALA KHALYLA ISWARI",
      order: 1,
    },
    {
      id: "252610045",
      name: "MUHAMMAD DZAKWAN AL MAULIDIN",
      order: 2,
    },
    {
      id: "252610043",
      name: "MUHAMMAD ANUGRAH ASHRI",
      order: 3,
    },
    {
      id: "252610057",
      name: "RAFKA NAVIZ",
      order: 4,
    },
    {
      id: "252610050",
      name: "MUHAMMAD RAKA ABDARRAZZAQ",
      order: 5,
    },
    {
      id: "252610001",
      name: "ABBAD NAILUN NABHAN",
      order: 6,
    },
    {
      id: "252610058",
      name: "RAIHANA AZARINE YULIANTORO",
      order: 7,
    },
    {
      id: "252610033",
      name: "KEANU AZZRIEL NOUVALDY",
      order: 8,
    },
    {
      id: "252610028",
      name: "HANIF EL HAKIM",
      order: 9,
    },
    {
      id: "252610060",
      name: "RASYA ADHITIA PRATAMA",
      order: 10,
    },
    {
      id: "252610003",
      name: "ADITYA PRATAMA BEWAJOENI",
      order: 11,
    },
    {
      id: "252610053",
      name: "NAUVAL NURFADHLULLAH",
      order: 12,
    },
    {
      id: "252610016",
      name: "ARRPEGIANO RIANTO PUTRA",
      order: 13,
    },
    {
      id: "252610054",
      name: "QONITA AZKIYA",
      order: 14,
    },
    {
      id: "252610039",
      name: "MUHAMAD RIZKI RADITIA RAMADHAN",
      order: 15,
    },
    {
      id: "252610004",
      name: "ADITYA SALMAN SUNTANA",
      order: 16,
    },
    {
      id: "252610040",
      name: "MUHAMMAD AIDIEL KAMIL",
      order: 17,
    },
    {
      id: "252610069",
      name: "SYABHIL FADILLAH MULKHI WARMAN",
      order: 18,
    },
    {
      id: "252610066",
      name: "SALEH NASAR MUNIF",
      order: 19,
    },
    {
      id: "252610037",
      name: "MUH. AMMAR SIDIQ PUTRA MUAMAR",
      order: 20,
    },
    {
      id: "252610020",
      name: "BAGAS RAFFAEL SETIYAWAN",
      order: 21,
    },
    {
      id: "252610019",
      name: "AZKA AZKIA KAMILAH",
      order: 22,
    },
    {
      id: "252610024",
      name: "DIARSA MUHAMMAD",
      order: 23,
    },
    {
      id: "252610009",
      name: "ALYSA NOVA MAULIDA",
      order: 24,
    },
  ],
  "xi-dkv": [
    {
      id: "242510003",
      name: "AHMAD SATTAR FATHULLOH",
      order: 1,
    },
    {
      id: "242510046",
      name: "NAISYA SALMA HANIFA",
      order: 2,
    },
    {
      id: "242510025",
      name: "GISAN NASHIRA NUGRAHA",
      order: 3,
    },
    {
      id: "242510004",
      name: "AHMAD YUSUF AR-RAFI",
      order: 4,
    },
    {
      id: "242510059",
      name: "RUMARAS BUDI PROBOSIWI",
      order: 5,
    },
    {
      id: "242510049",
      name: "RAFA RIZKITULLAH FAUZAN",
      order: 6,
    },
    {
      id: "242510014",
      name: "DEVANO BAGASKARA",
      order: 7,
    },
    {
      id: "242510054",
      name: "RAIHAN ALFARIZI NASUTION",
      order: 8,
    },
    {
      id: "242510020",
      name: "FATHAN QORIBA",
      order: 9,
    },
    {
      id: "242510050",
      name: "RAFASYAH MAYVERN RAINAYA",
      order: 10,
    },
    {
      id: "242510030",
      name: "JASMINE AULIA PUTRI PRASETIYO",
      order: 11,
    },
    {
      id: "242510041",
      name: "MUHAMMAD RADITYA RIZKI PRATAMA",
      order: 12,
    },
    {
      id: "242510031",
      name: "JUNIOR FERNANDO",
      order: 13,
    },
    {
      id: "242510028",
      name: "HANIF IMAM MUTTAQIN",
      order: 14,
    },
    {
      id: "242510013",
      name: "DENIZ RIZKI ATTILA",
      order: 15,
    },
    {
      id: "242510010",
      name: "BIMASENA WIRYAATMAJA YUSUF",
      order: 16,
    },
    {
      id: "242510067",
      name: "VEER SADZWAN AL AMUDI",
      order: 17,
    },
    {
      id: "242510056",
      name: "RANGGA AZKA SUTRISNA",
      order: 18,
    },
    {
      id: "242510037",
      name: "MUHAMAD FAJAR AL HADI",
      order: 19,
    },
    {
      id: "242510052",
      name: "RAFIF HAZEL RAMIRO A.P.",
      order: 20,
    },
    {
      id: "242510011",
      name: "DAFFA ATHIYYAH KAMILA",
      order: 21,
    },
    {
      id: "242510027",
      name: "HADI FAWWAZ SUDEWO",
      order: 22,
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
  if (currentIndex === -1) return null; // Blank state, no presenter
  const index = ((currentIndex % studentsLength) + studentsLength) % studentsLength;
  return index;
}

export function getObserverIndexes(
  currentIndex: number,
  studentsLength: number,
): number[] {
  if (studentsLength === 0) return [];
  if (studentsLength === 1) return [];
  if (currentIndex === -1) return []; // Blank state, no observers
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
