import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  // Layout público (páginas abertas)
  layout("layouts/PublicLayout.tsx", [
    index("routes/public/home.tsx"),
    route("senators", "routes/senators/senadores.tsx"),
    route("senators/:codigo", "routes/senators/senadores.$codigo.tsx"),
    route("senators/:codigo/votes", "routes/senators/senadores.$codigo.votes.tsx"),
    route("projects", "routes/projects/projects.tsx"), // Back to real implementation
    route("projects/:processoCodigo", "routes/projects/projects.$processoCodigo.tsx"),
  ]),
  
  // Layout de autenticação
  layout("layouts/AuthLayout.tsx", [
    route("auth/login", "routes/auth/login.tsx"),
    route("auth/register", "routes/auth/register.tsx"),
  ]),

  layout("layouts/DashboardLayout.tsx", [
    route("dashboard", "routes/dashboard/dashboard.tsx"),
    route("dashboard/users", "routes/dashboard/users.tsx"),
    route("dashboard/profile", "routes/dashboard/profile.tsx"),
  ]),
] satisfies RouteConfig;
