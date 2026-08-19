import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button, Card, Eyebrow, Loading } from "@/components/rt-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { insights } from "@/lib/ruang-tumbuh-data";
import { useRuangTumbuh } from "@/lib/ruang-tumbuh-store";

export default function Review() {
  const c = useColors();
  const { data, ready } = useRuangTumbuh();
  if (!ready) return <Loading />;
  const x = insights(data);
  const prompt = x.attempted === 0
    ? "Pilih satu kejadian yang ingin kamu pahami minggu ini. Mulailah dari fakta: apa yang terjadi, dan apa bagianmu?"
    : x.successful < x.attempted
      ? "Hasil yang belum sesuai bukan kegagalan diri. Tanyakan: apakah pemicunya jelas, langkahnya terlalu besar, atau sistem pendukungnya perlu diubah?"
      : "Ada bukti perubahan di sini. Pertahankan langkah yang berhasil, lalu perhatikan kapan situasi menjadi lebih menantang.";
  const sleep = x.sleep ? `${x.sleep.toFixed(1).replace(".", ",")} jam` : "—";
  return <ScreenContainer className="px-5"><ScrollView contentContainerStyle={s.content}>
    <View style={s.header}><View style={{ flex: 1 }}><Eyebrow>TINJAUAN 7 HARI</Eyebrow><Text style={[s.title, { color: c.foreground }]}>Apa yang sedang kamu pelajari?</Text></View><Pressable onPress={() => router.push("/settings" as never)}><MaterialIcons name="settings" size={25} color={c.muted} /></Pressable></View>
    <Text style={{ color: c.muted, fontSize: 14, lineHeight: 20 }}>Tinjau pola dengan rasa ingin tahu. Sesuaikan sistemnya bila eksperimen belum berjalan.</Text>
    <View style={s.grid}><Metric value={`${x.reflections}`} label="kejadian dicatat" /><Metric value={x.category} label="pola paling sering" /><Metric value={x.attempted ? `${x.successful}/${x.attempted}` : "—"} label="latihan berhasil" /><Metric value={sleep} label="rata-rata tidur" /></View>
    <Card style={{ backgroundColor: "#FCE8E1", borderColor: "#F3C7BA" }}><Eyebrow>PERTANYAAN MINGGU INI</Eyebrow><Text style={[s.cardTitle, { color: c.foreground }]}>Apa yang ingin diperbaiki dari sistemmu?</Text><Text style={{ color: c.foreground, fontSize: 14, lineHeight: 21 }}>{prompt}</Text></Card>
    <Card><Eyebrow>DATA MILIKMU</Eyebrow><Text style={[s.cardTitle, { color: c.foreground }]}>Tersimpan di perangkat ini.</Text><Text style={{ color: c.muted, fontSize: 13, lineHeight: 19 }}>Gunakan cadangan teks bila ingin memindahkan data. Fungsi inti aplikasi tidak memerlukan akun atau koneksi internet.</Text><Button label="Kelola data lokal" onPress={() => router.push("/settings" as never)} icon="settings" quiet /></Card>
  </ScrollView></ScreenContainer>;
}

function Metric({ value, label }: { value: string; label: string }) { const c = useColors(); return <View style={[s.metric, { backgroundColor: c.surface, borderColor: c.border }]}><Text style={{ color: c.foreground, fontSize: 20, lineHeight: 24, fontWeight: "800" }} numberOfLines={2}>{value}</Text><Text style={{ color: c.muted, fontSize: 11, fontWeight: "700" }}>{label}</Text></View>; }
const s = StyleSheet.create({ content: { paddingTop: 14, paddingBottom: 28, gap: 14 }, header: { flexDirection: "row", alignItems: "flex-start" }, title: { fontSize: 27, lineHeight: 33, fontWeight: "800", letterSpacing: -0.5, marginTop: 3 }, grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 }, metric: { width: "48%", minHeight: 108, borderWidth: 1, borderRadius: 19, padding: 14, justifyContent: "space-between" }, cardTitle: { fontSize: 18, lineHeight: 24, fontWeight: "800" } });
