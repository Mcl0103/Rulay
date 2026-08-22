import { Sidebar } from "../components/Sidebar"
import { TopBar } from "../components/TopBar"
import { PromptCard } from "../components/PromptCard"
import { StatCards } from "../components/StatCards"
import { RecentPages } from "../components/RecentPages"
import { ConnectShopifyBanner } from "../components/ConnectShopifyBanner"
import { useTheme } from "../lib/theme"
import { useLanguage } from "../lib/i18n"

export function Dashboard() {
  const { theme } = useTheme()
  const { t } = useLanguage()
  return (
    <div className="flex h-screen bg-(--color-base)">
      <Sidebar />
      <main data-theme={theme} className="flex-1 overflow-y-auto bg-(--color-panel)/40 p-4 pb-24 md:p-6">
        <TopBar label={t("sidebar.dashboard")} />
        <div className="mx-auto mt-10 max-w-2xl">
          <ConnectShopifyBanner />
          <PromptCard />
          <StatCards />
          <RecentPages />
        </div>
      </main>
    </div>
  )
}
