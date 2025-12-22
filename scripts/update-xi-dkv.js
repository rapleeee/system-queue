const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const xiDkvStudents = [
  { id: "242510003", name: "AHMAD SATTAR FATHULLOH", order: 1 },
  { id: "242510046", name: "NAISYA SALMA HANIFA", order: 2 },
  { id: "242510025", name: "GISAN NASHIRA NUGRAHA", order: 3 },
  { id: "242510004", name: "AHMAD YUSUF AR-RAFI", order: 4 },
  { id: "242510059", name: "RUMARAS BUDI PROBOSIWI", order: 5 },
  { id: "242510049", name: "RAFA RIZKITULLAH FAUZAN", order: 6 },
  { id: "242510014", name: "DEVANO BAGASKARA", order: 7 },
  { id: "242510054", name: "RAIHAN ALFARIZI NASUTION", order: 8 },
  { id: "242510020", name: "FATHAN QORIBA", order: 9 },
  { id: "242510050", name: "RAFASYAH MAYVERN RAINAYA", order: 10 },
  { id: "242510030", name: "JASMINE AULIA PUTRI PRASETIYO", order: 11 },
  { id: "242510041", name: "MUHAMMAD RADITYA RIZKI PRATAMA", order: 12 },
  { id: "242510031", name: "JUNIOR FERNANDO", order: 13 },
  { id: "242510028", name: "HANIF IMAM MUTTAQIN", order: 14 },
  { id: "242510013", name: "DENIZ RIZKI ATTILA", order: 15 },
  { id: "242510010", name: "BIMASENA WIRYAATMAJA YUSUF", order: 16 },
  { id: "242510067", name: "VEER SADZWAN AL AMUDI", order: 17 },
  { id: "242510056", name: "RANGGA AZKA SUTRISNA", order: 18 },
  { id: "242510037", name: "MUHAMAD FAJAR AL HADI", order: 19 },
  { id: "242510052", name: "RAFIF HAZEL RAMIRO A.P.", order: 20 },
  { id: "242510011", name: "DAFFA ATHIYYAH KAMILA", order: 21 },
  { id: "242510027", name: "HADI FAWWAZ SUDEWO", order: 22 },
];

async function updateXiDkv() {
  try {
    const ref = doc(db, "queues", "xi-dkv");
    await setDoc(
      ref,
      {
        students: xiDkvStudents,
        updatedAt: Date.now(),
      },
      { merge: true }
    );
    console.log("✅ Data XI DKV berhasil diupdate di Firebase!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating XI DKV:", error);
    process.exit(1);
  }
}

updateXiDkv();
