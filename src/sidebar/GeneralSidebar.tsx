import { type ReactNode } from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

type GeneralSidebarProps = {
  children: ReactNode
}

export function GeneralSidebar({ children }: GeneralSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="general-sidebar-header">
        <div className="general-sidebar-brand">
          <div className="general-sidebar-brand-mark">AD</div>
          <div className="general-sidebar-brand-copy">
            <div className="general-sidebar-title">Arch Draw</div>
            <div className="general-sidebar-subtitle">Architecture workspace</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {children}
      </SidebarContent>
      <SidebarFooter className="general-sidebar-footer">
        <div className="general-sidebar-footer-label">Current panel</div>
        <div className="general-sidebar-footer-value">Shape Library</div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
