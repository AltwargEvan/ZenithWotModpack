import { useMods } from "@/api";
import { useParams } from "@tanstack/react-router";
import "./style.css";
import { ModPageInner } from "./ModPageInner";

export default function ModPage() {
  const mods = useMods();
  const { id } = useParams();
  const mod = mods.find((mod) => mod.data?.internal.id == id)?.data;
  if (mod) return <ModPageInner mod={mod} />;
  else return <div>Failed to find mod data.</div>;
}
