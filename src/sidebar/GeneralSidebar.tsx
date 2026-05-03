import { useEffect, useRef, type ReactNode } from 'react'

import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar'

type GeneralSidebarProps = {
  children: ReactNode
}

export function GeneralSidebar({ children }: GeneralSidebarProps) {
  const { isMobile, openMobile, state } = useSidebar()
  const isSidebarOpen = isMobile ? openMobile : state === 'expanded'
  const sidebarRef = useRef<HTMLElement>(null)
  const animationRef = useRef<Animation | null>(null)
  const previousOpenRef = useRef<boolean | null>(null)

  useEffect(() => {
    const sidebar = sidebarRef.current

    if (!sidebar) {
      return
    }

    const targetTransform = isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
    const previousOpen = previousOpenRef.current

    if (previousOpen === null) {
      sidebar.style.transform = targetTransform
      previousOpenRef.current = isSidebarOpen
      return
    }

    if (previousOpen === isSidebarOpen) {
      return
    }

    const sourceTransform = previousOpen ? 'translateX(0)' : 'translateX(-100%)'

    animationRef.current?.cancel()
    sidebar.style.transform = sourceTransform
    animationRef.current = sidebar.animate(
      [
        { transform: sourceTransform },
        { transform: targetTransform },
      ],
      {
        duration: 200,
        easing: 'linear',
        fill: 'forwards',
      },
    )

    animationRef.current.onfinish = () => {
      sidebar.style.transform = targetTransform
      animationRef.current = null
    }

    previousOpenRef.current = isSidebarOpen
  }, [isSidebarOpen])

  return (
    <aside
      ref={sidebarRef}
      data-state={isSidebarOpen ? 'expanded' : 'collapsed'}
      className="general-sidebar-shell"
    >
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
    </aside>
  )
}
