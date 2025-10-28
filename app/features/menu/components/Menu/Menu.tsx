import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { type RootState } from "~/store";
import { useActiveMenu } from "../../hooks";
import { closeMany } from "../../redux";
import { MenuHanlder } from "../../typings";
import { logout } from "~/features/auth/redux";
import { authService } from "~/features/auth/service";
import styles from "../index.module.css";
import MenuItem from "../MenuItem/MenuItem";
export default function Menu() {
  useActiveMenu(MenuHanlder.getMenu()); //Gerencia o estado do Menu baseado na rota
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const openMap = useSelector((s: RootState) => s.menu.open);
  // calcula apenas as chaves abertas
  const openKeys = useMemo(
    () =>
      Object.entries(openMap)
        .filter(([, v]) => v)
        .map(([k]) => k),
    [openMap]
  );

  const handleMouseLeave = useCallback(() => {
    if (openKeys.length) dispatch(closeMany(openKeys));
  }, [dispatch, openKeys]);
  const handleLogout = async () => {
    try {
      console.log("🔄 Iniciando logout...");
      
      // Chama o serviço de logout
      await authService.logout();
      
      // Atualiza o Redux
      dispatch(logout());
      
      // Redireciona para login
      navigate("/login", { replace: true });
      
      console.log("✅ Logout realizado com sucesso");
    } catch (error) {
      console.error("❌ Erro no logout:", error);
      
      // Mesmo com erro, faz logout local
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  };
  const menu = useMemo(() => {
    return MenuHanlder.getMenu();
  }, []);
  return (
    <div onMouseLeave={handleMouseLeave} className={styles.hierarchyMenu}>
      <div className={styles.menuHeader + " " + styles.menuPadding}>
        <div className={styles.arrow}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
        <div className={styles.dots}>
          <div
            style={{ backgroundColor: "#00d9ff" }}
            className={styles.dot}
          ></div>
          <div
            style={{
              backgroundColor: "#8b5cf6",
              transform: "translateY(-3px)",
            }}
            className={styles.dot}
          ></div>
          <div
            style={{ backgroundColor: "#06b6d4" }}
            className={styles.dot}
          ></div>
        </div>
      </div>
      <ul className={styles.menuItems + " " + styles.menuPadding}>
        {/* {Object.values(MenuHanlder.getMenu()).map((item: IMenuItem) => (
          <MenuItem
            key={item.label}
            item={item}
            fatherOpen={menuOpen}
            activeState={activeState}
          />
        ))} */}
        {Object.entries(menu).map(([key, item]) => (
          <MenuItem key={key} item={item} itemKey={key} parentKey="" />
        ))}
      </ul>
      <div style={{ marginTop: "auto" }} className={styles.logoutBtn}>
        <button onClick={handleLogout}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
            />
          </svg>
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}
