import { Sidebar } from "../components/Sidebar"
import { TopBar } from "../components/TopBar"
import { PromptCard } from "../components/PromptCard"
import { StatCards } from "../components/StatCards"
import { RecentPages } from "../components/RecentPages"
import { ConnectShopifyBanner } from "../components/ConnectShopifyBanner"

export function Dashboard() {
  return (
    <div className="flex h-screen bg-(--color-base)">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-(--color-panel)/40 p-6">
        <TopBar label="Dashboard" />
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
