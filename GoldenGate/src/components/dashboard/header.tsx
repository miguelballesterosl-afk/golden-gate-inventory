'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Gem, User, Settings, LogOut } from 'lucide-react';
import { SidebarTrigger } from '../ui/sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';


function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const { user } = useAuth();

  const segmentTranslations: { [key: string]: string } = {
    dashboard: 'Panel de Control',
    inventory: 'Inventario',
    financing: 'Financiamiento',
    reports: 'Reportes',
  };

  let filteredSegments = segments;
  if (user?.role !== 'admin') {
    filteredSegments = segments.filter(segment => segment !== 'reports');
  }


  return (
    <nav aria-label="Breadcrumb" className="hidden md:flex items-center">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        <li>
          <Link href="/dashboard" className="flex items-center gap-2 hover:text-foreground">
            <Gem className="h-5 w-5 text-primary" />
            <span className="font-headline text-lg">Golden Gate</span>
          </Link>
        </li>
        {filteredSegments.slice(1).map((segment, index) => {
          const isLast = index === filteredSegments.length - 2;
          const href = '/'.concat(...filteredSegments.slice(0, index + 2));
          return (
            <li key={segment} className="flex items-center gap-2">
              <span>/</span>
              <Link
                href={href}
                className={`capitalize ${isLast ? 'text-foreground' : 'hover:text-foreground'}`}
                aria-current={isLast ? 'page' : undefined}
              >
                {segmentTranslations[segment] || segment}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function DashboardHeader() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex-1">
        <Breadcrumbs />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://picsum.photos/seed/user/100/100" alt="@user" />
              <AvatarFallback>{user?.email.substring(0,2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.role === 'admin' ? 'Administrador' : 'Cajero'}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar Sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
