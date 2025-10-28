import type { Route } from ".react-router/types/app/routes/inicio/+types/route";
import DashboardPage from "./page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Senate Tracker | Dashboard Legislativo" },
    { name: "description", content: "Dashboard com análise de impacto dos senadores e projetos legislativos" },
  ];
}

export default function Inicio() {
  return <DashboardPage />;
}
