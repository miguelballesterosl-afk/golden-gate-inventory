'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, Users, CreditCard, ShoppingBag } from 'lucide-react';
import { Overview } from '@/components/dashboard/overview';
import { initialFinancingRecords, type FinancingRecord } from './financing/page';
import { initialInventoryItems, type InventoryItem } from './inventory/page';

export default function DashboardPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [financingRecords, setFinancingRecords] = useState<FinancingRecord[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);

    const getItems = () => {
      if (typeof window !== 'undefined') {
        const storedItems = localStorage.getItem('inventoryItems');
        if (storedItems) {
          try {
            return JSON.parse(storedItems);
          } catch (e) {
            console.error("Error parsing inventory items from localStorage", e);
          }
        }
      }
      return initialInventoryItems;
    };
    setInventoryItems(getItems());

    const getRecords = () => {
        if (typeof window !== 'undefined') {
          const storedRecords = localStorage.getItem('financingRecords');
          if (storedRecords) {
            try {
              return JSON.parse(storedRecords);
            } catch (e) {
              console.error("Error parsing financing records from localStorage", e);
            }
          }
        }
        return initialFinancingRecords;
      };
    setFinancingRecords(getRecords());


    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'inventoryItems') {
            setInventoryItems(getItems());
        }
        if (e.key === 'financingRecords') {
            setFinancingRecords(getRecords());
        }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };

  }, []);

  if (!hasMounted) {
    return null;
  }

  const totalInventoryValue = inventoryItems.reduce((acc, item) => acc + (item.price * item.stock), 0);
  const activeFinancing = financingRecords.filter(f => f.status === 'Activo').length;
  const totalDebt = financingRecords.reduce((acc, record) => acc + (record.totalPrice - record.paid), 0);
  
  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Panel de Control
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valor Total del Inventario
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${new Intl.NumberFormat('es-CO').format(totalInventoryValue)}</div>
            <p className="text-xs text-muted-foreground">
              Basado en existencias actuales
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Financiamientos Activos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeFinancing}</div>
            <p className="text-xs text-muted-foreground">
              Cuentas actualmente en pago
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deuda Total</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${new Intl.NumberFormat('es-CO').format(totalDebt)}</div>
            <p className="text-xs text-muted-foreground">
              Total restante en financiamientos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Artículos en Inventario
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Tipos de producto únicos
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">Ventas Recientes</CardTitle>
          <CardDescription>Un resumen de la actividad de ventas en los últimos 6 meses.</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <Overview />
        </CardContent>
      </Card>
    </div>
  );
}
