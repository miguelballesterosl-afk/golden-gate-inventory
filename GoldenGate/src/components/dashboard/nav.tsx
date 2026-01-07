'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent
} from '@/components/ui/sidebar';
import { Gem, LayoutDashboard, Boxes, HandCoins, FileDown, Settings, LifeBuoy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';


const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Panel de Control', adminOnly: false },
  { href: '/dashboard/inventory', icon: Boxes, label: 'Inventario', adminOnly: false },
  { href: '/dashboard/financing', icon: HandCoins, label: 'Financiamiento', adminOnly: false },
  { href: '/dashboard/reports', icon: FileDown, label: 'Reportes', adminOnly: true },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const availableNavItems = navItems.filter(item => !item.adminOnly || user?.role === 'admin');


  return (
    <>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <Gem className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold tracking-tight text-foreground">
            Golden Gate
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {availableNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Configuración">
                    <Link href="#">
                        <Settings />
                        <span>Configuración</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Soporte">
                    <Link href="#">
                        <LifeBuoy />
                        <span>Soporte</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
