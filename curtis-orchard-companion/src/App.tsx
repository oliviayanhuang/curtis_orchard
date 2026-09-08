import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { TodayPage } from './visitor/today/TodayPage'
import { MapPage } from './visitor/map/MapPage'
import { ExplorePage } from './visitor/explore/ExplorePage'
import { ApplesPage } from './visitor/explore/ApplesPage'
import { ActivitiesPage } from './visitor/explore/ActivitiesPage'
import { PlanPage } from './visitor/plan/PlanPage'
import { EventsPage } from './visitor/events/EventsPage'
import { HelpPage } from './visitor/help/HelpPage'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppShell>
        <Routes>
          <Route path="/" element={<TodayPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/explore/apples" element={<ApplesPage />} />
          <Route path="/explore/activities" element={<ActivitiesPage />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="*" element={<TodayPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}
