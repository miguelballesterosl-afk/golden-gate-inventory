'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown } from "lucide-react";
import { initialFinancingRecords, type FinancingRecord } from '../financing/page';
import { initialInventoryItems, type InventoryItem } from '../inventory/page';
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";


export default function ReportsPage() {
    const { user, loading } = useAuth();
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
      if (!loading && user?.role !== 'admin') {
        redirect('/dashboard');
      }
    }, [user, loading]);


    if (!hasMounted || loading || user?.role !== 'admin') {
        return null;
    }


    const getInventoryItems = (): InventoryItem[] => {
      if (typeof window !== 'undefined') {
        const storedItems = localStorage.getItem('inventoryItems');
        if (storedItems) {
          try {
            return JSON.parse(storedItems);
          } catch (e) {
            console.error("Error parsing inventory items from localStorage", e);
            return initialInventoryItems;
          }
        }
      }
      return initialInventoryItems;
    }

    const getFinancingRecords = (): FinancingRecord[] => {
      if (typeof window === 'undefined') {
        return initialFinancingRecords;
      }
      const storedRecords = localStorage.getItem('financingRecords');
      if (storedRecords) {
        try {
          const parsedRecords = JSON.parse(storedRecords);
          if (Array.isArray(parsedRecords)) {
            return parsedRecords;
          }
        } catch (e) {
          console.error("Error parsing financing records from localStorage", e);
        }
      }
      return initialFinancingRecords;
    };


    const handleExport = (reportType: string) => {
        let data: any[] = [];
        let headers: string[] = [];
        let filename = '';

        if (reportType === 'Inventario') {
            data = getInventoryItems();
            headers = ['id', 'name', 'category', 'type', 'stock', 'price', 'karats', 'grams'];
            filename = 'reporte_inventario.csv';
        } else if (reportType === 'Financiamiento') {
            data = getFinancingRecords();
            headers = ['id', 'customer', 'item', 'totalPrice', 'paid', 'dueDate', 'status'];
            filename = 'reporte_financiamiento.csv';
        }

        if (data.length === 0) return;

        const csvContent = [
            headers.join(','),
            ...data.map(item => headers.map(header => {
              const val = item[header as keyof typeof item];
              // handle objects in data, like item.image
              if (typeof val === 'object' && val !== null) {
                return JSON.stringify(val);
              }
              return val;
            }).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <h1 className="font-headline text-3xl font-bold tracking-tight">
                Reportes
            </h1>
            <p className="text-muted-foreground">Exporta los datos de tu negocio para análisis y mantenimiento de registros.</p>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl">Reporte de Inventario</CardTitle>
                        <CardDescription>
                            Genera una instantánea completa de tu inventario actual, incluyendo niveles de existencias, precios y categorías.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Esta exportación contiene todos los datos de los productos.</p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => handleExport('Inventario')}>
                            <FileDown className="mr-2 h-4 w-4" />
                            Exportar como CSV
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl">Reporte de Financiamiento</CardTitle>
                        <CardDescription>
                            Exporta todas las cuentas de financiamiento, incluyendo detalles de clientes, estado de pago, deuda restante y fechas de vencimiento.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Esta exportación contiene todos los datos de financiamiento.</p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => handleExport('Financiamiento')}>
                            <FileDown className="mr-2 h-4 w-4" />
                            Exportar como CSV
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
