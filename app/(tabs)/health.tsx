import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";

import { Button, Card, Eyebrow, Loading } from "@/components/rt-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { calories, macros, routinesFor, today, type Checkin } from "@/lib/ruang-tumbuh-data";
import { useRuangTumbuh } from "@/lib/ruang-tumbuh-store";

const blank: Checkin = { sleep: "", energy: "", mood: "", water: "", movement: "", note: "" };

export default function Health() {
  const c = useColors();
  const { data, ready, checkin, routine, addRoutine, addFood, removeFood, target } = useRuangTumbuh();
  const date = today();
  const [form, setForm] = useState<Checkin>(data.health.checkins[date] ?? blank);
  const [routineLabel, setRoutineLabel] = useState("");
  const [foodName, setFoodName] = useState("");
  const [kcal, setKcal] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  if (!ready) return <Loading />;

  const routines = routinesFor(data);
  const routineState = data.health.routineLogs[date] ?? {};
  const foods = data.health.foods[date] ?? [];
  const total = macros(foods);
  const field = (name: keyof Checkin, label: string, multi = false) => <View style={s.field}><Text style={[s.label, { color: c.muted }]}>{label}</Text><TextInput value={form[name]} onChangeText={(value) => setForm((now) => ({ ...now, [name]: value }))} placeholder="—" placeholderTextColor={c.muted} multiline={multi} keyboardType={name === "sleep" ? "decimal-pad" : "default"} style={[s.input, multi && s.multi, { color: c.foreground, borderColor: c.border }]} /></View>;
  const addMeal = () => { if (!foodName.trim()) return; addFood(date, { name: foodName.trim(), calories: kcal, protein, carbs, fat }); setFoodName(""); setKcal(""); setProtein(""); setCarbs(""); setFat(""); };

  return <ScreenContainer className="px-5"><ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
    <Eyebrow>KESEHATAN</Eyebrow><Text style={[s.title, { color: c.foreground }]}>Rawat tubuh sebagai bagian dari pertumbuhanmu.</Text><Text style={{ color: c.muted, fontSize: 12, lineHeight: 18 }}>Pelacak ini membantu pengamatan pribadi, bukan pengganti nasihat tenaga kesehatan.</Text>
    <Card><Eyebrow>CHECK-IN TUBUH</Eyebrow><Text style={[s.cardTitle, { color: c.foreground }]}>Bagaimana keadaanmu?</Text><View style={s.grid}>{field("sleep", "Tidur (jam)")}{field("energy", "Energi (1–5)")}{field("water", "Air (gelas)")}{field("movement", "Gerak (menit)")}</View>{field("mood", "Suasana hati (opsional)")}{field("note", "Catatan tubuh hari ini", true)}<Button label="Simpan check-in" onPress={() => { checkin(date, form); Alert.alert("Check-in tersimpan", "Catatan tubuhmu tersimpan lokal di perangkat ini."); }} icon="check" /></Card>
    <Card><Eyebrow>RUTINITAS HARI INI</Eyebrow><Text style={[s.cardTitle, { color: c.foreground }]}>{routines.filter((item) => routineState[item.id]).length}/{routines.length} langkah selesai</Text>{routines.map((item) => <View key={item.id} style={[s.row, { borderTopColor: c.border }]}><View style={{ flex: 1 }}><Text style={{ color: c.foreground, fontWeight: "700", fontSize: 14 }}>{item.label}</Text><Text style={{ color: c.muted, fontSize: 12, marginTop: 3 }}>{item.area}</Text></View><Switch value={Boolean(routineState[item.id])} onValueChange={(value) => routine(date, item.id, value)} trackColor={{ false: c.border, true: c.primary }} /></View>)}<View style={s.add}><TextInput value={routineLabel} onChangeText={setRoutineLabel} placeholder="Tambah rutinitas pribadi" placeholderTextColor={c.muted} style={[s.input, { flex: 1, color: c.foreground, borderColor: c.border }]} /><Button label="+" onPress={() => { if (routineLabel.trim()) { addRoutine(routineLabel.trim()); setRoutineLabel(""); } }} icon="add" quiet /></View></Card>
    <Card><Eyebrow>CATATAN MAKAN</Eyebrow><Text style={[s.cardTitle, { color: c.foreground }]}>{calories(foods).toLocaleString("id-ID")} kcal dicatat</Text><View style={s.macroGrid}><Macro label="Protein" value={total.protein} color="#C94B32" /><Macro label="Karbohidrat" value={total.carbs} color="#B66B17" /><Macro label="Lemak" value={total.fat} color="#4F7A5B" /></View><TextInput value={data.health.calorieTarget} onChangeText={target} placeholder="Target pribadi kcal (opsional)" placeholderTextColor={c.muted} keyboardType="number-pad" style={[s.input, { color: c.foreground, borderColor: c.border }]} />
      {foods.map((item) => <View key={item.id} style={[s.row, { borderTopColor: c.border }]}><View style={{ flex: 1 }}><Text style={{ color: c.foreground, fontWeight: "700" }}>{item.name}</Text><Text style={{ color: c.muted, fontSize: 12 }}>{item.calories ? `${item.calories} kcal` : "Tanpa angka kalori"} · P {item.protein || "0"}g · K {item.carbs || "0"}g · L {item.fat || "0"}g</Text></View><Text onPress={() => removeFood(date, item.id)} style={{ color: c.error, fontWeight: "800", fontSize: 12 }}>Hapus</Text></View>)}
      <TextInput value={foodName} onChangeText={setFoodName} placeholder="Makanan/minuman" placeholderTextColor={c.muted} style={[s.input, { color: c.foreground, borderColor: c.border }]} /><View style={s.nutritionInputs}><NutritionInput label="kcal" value={kcal} onChange={setKcal} colors={c} /><NutritionInput label="Protein g" value={protein} onChange={setProtein} colors={c} /><NutritionInput label="Karbo g" value={carbs} onChange={setCarbs} colors={c} /><NutritionInput label="Lemak g" value={fat} onChange={setFat} colors={c} /></View><Button label="Tambahkan catatan makan" onPress={addMeal} icon="add" quiet />
    </Card>
  </ScrollView></ScreenContainer>;
}

function Macro({ label, value, color }: { label: string; value: number; color: string }) { return <View style={[s.macro, { borderColor: color }]}><Text style={[s.macroValue, { color }]}>{value.toLocaleString("id-ID")}g</Text><Text style={s.macroLabel}>{label}</Text></View>; }
function NutritionInput({ label, value, onChange, colors }: { label: string; value: string; onChange: (value: string) => void; colors: ReturnType<typeof useColors> }) { return <View style={s.nutritionInput}><Text style={[s.label, { color: colors.muted }]}>{label}</Text><TextInput value={value} onChangeText={onChange} placeholder="0" placeholderTextColor={colors.muted} keyboardType="decimal-pad" style={[s.input, { color: colors.foreground, borderColor: colors.border }]} /></View>; }
const s = StyleSheet.create({ content: { paddingTop: 14, paddingBottom: 28, gap: 14 }, title: { fontSize: 27, lineHeight: 33, fontWeight: "800", letterSpacing: -0.5 }, cardTitle: { fontSize: 17, fontWeight: "800" }, grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 }, field: { gap: 6, flex: 1, minWidth: "45%" }, label: { fontSize: 12, fontWeight: "800" }, input: { borderWidth: 1, borderRadius: 13, minHeight: 44, paddingHorizontal: 12, fontSize: 14 }, multi: { minHeight: 82, paddingTop: 10, textAlignVertical: "top" }, row: { borderTopWidth: 1, paddingTop: 11, flexDirection: "row", alignItems: "center", gap: 12 }, add: { flexDirection: "row", gap: 8, alignItems: "center" }, macroGrid: { flexDirection: "row", gap: 8 }, macro: { flex: 1, borderLeftWidth: 3, paddingLeft: 8, gap: 2 }, macroValue: { fontSize: 17, fontWeight: "800" }, macroLabel: { color: "#74645E", fontSize: 10, fontWeight: "700" }, nutritionInputs: { flexDirection: "row", gap: 7 }, nutritionInput: { flex: 1, gap: 5 } });
