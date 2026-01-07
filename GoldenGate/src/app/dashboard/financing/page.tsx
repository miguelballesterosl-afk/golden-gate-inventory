'use client';

import { useState, useEffect } from 'react';
import { MoreHorizontal, PlusCircle, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/context/AuthContext';


export const initialFinancingRecords = [
    {
        id: 'fin-001',
        customer: 'Javier Rodríguez',
        item: 'Anillo de Diamante Solitario',
        totalPrice: 7500000,
        paid: 1875000,
        dueDate: '2024-08-15',
        status: 'Activo',
    },
    {
        id: 'fin-002',
        customer: 'Sofía García',
        item: 'Reloj Cronógrafo',
        totalPrice: 1800000,
        paid: 1800000,
        dueDate: '2024-05-20',
        status: 'Pagado',
    },
    {
        id: 'fin-003',
        customer: 'Mateo Hernandez',
        item: 'Tiara Exquisita',
        totalPrice: 16800000,
        paid: 3750000,
        dueDate: '2024-09-01',
        status: 'Activo',
    },
    {
        id: 'fin-004',
        customer: 'Valentina Martinez',
        item: 'Cadena de Oro',
        totalPrice: 3375000,
        paid: 375000,
        dueDate: '2024-07-30',
        status: 'Vence Pronto',
    },
    {
        id: 'fin-005',
        customer: 'Isabella Lopez',
        item: 'Aretes de Perla',
        totalPrice: 940000,
        paid: 187500,
        dueDate: '2024-06-10',
        status: 'Vencido',
    },
];

export type FinancingRecord = typeof initialFinancingRecords[0];

const getInitialRecords = (): FinancingRecord[] => {
  if (typeof window === 'undefined') {
    return [];
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
  localStorage.setItem('financingRecords', JSON.stringify(initialFinancingRecords));
  return initialFinancingRecords;
};

const formSchema = z.object({
    customer: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
    item: z.string().min(3, { message: 'El artículo debe tener al menos 3 caracteres.' }),
    totalPrice: z.coerce.number().min(1, { message: 'El precio debe ser mayor a 0.' }),
    paid: z.coerce.number().min(0, { message: 'El pago no puede ser negativo.' }),
    dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Fecha inválida.' }),
    status: z.enum(['Activo', 'Pagado', 'Vence Pronto', 'Vencido']),
}).refine(data => data.paid <= data.totalPrice, {
    message: 'El monto pagado no puede ser mayor al precio total.',
    path: ['paid'],
});


type FinancingFormValues = z.infer<typeof formSchema>;


function RecordForm({
  onSave,
  onCancel,
  record
}: {
  onSave: (values: FinancingFormValues, id?: string) => void;
  onCancel: () => void;
  record?: FinancingRecord;
}) {
  const form = useForm<FinancingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: record ? {
      ...record,
      dueDate: record.dueDate.split('T')[0], // Format for input type="date"
    } : {
      customer: '',
      item: '',
      totalPrice: 0,
      paid: 0,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'Activo',
    },
  });

  const onSubmit = (values: FinancingFormValues) => {
    onSave(values, record?.id);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="item"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Artículo</FormLabel>
              <FormControl>
                <Input placeholder="Anillo de Diamante" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="totalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio Total</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto Pagado</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Fecha de Vencimiento</FormLabel>
                    <FormControl>
                        <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un estado" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Activo">Activo</SelectItem>
                                <SelectItem value="Pagado">Pagado</SelectItem>
                                <SelectItem value="Vence Pronto">Vence Pronto</SelectItem>
                                <SelectItem value="Vencido">Vencido</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
          <Button type="submit">Guardar Cuenta</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}


const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'Pagado':
            return 'secondary';
        case 'Vencido':
            return 'destructive';
        case 'Activo':
            return 'default';
        case 'Vence Pronto':
            return 'outline';
        default:
            return 'default';
    }
}

export default function FinancingPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<FinancingRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<FinancingRecord | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    setRecords(getInitialRecords());
  }, []);

  useEffect(() => {
     if (typeof window !== 'undefined' && hasMounted) {
        localStorage.setItem('financingRecords', JSON.stringify(records));
    }
  }, [records, hasMounted]);
  
  if (!hasMounted) {
    return null;
  }

  const handleSaveRecord = (values: FinancingFormValues, id?: string) => {
    if (id) {
        setRecords(records.map(record => record.id === id ? {...record, ...values, dueDate: new Date(values.dueDate).toISOString().split('T')[0] } : record));
    } else {
        const newRecord: FinancingRecord = {
            id: `fin-${Date.now()}`,
            ...values,
            dueDate: new Date(values.dueDate).toISOString().split('T')[0],
        };
        setRecords([newRecord, ...records]);
    }
    setIsFormOpen(false);
  };
  
  const handleEditClick = (record: FinancingRecord) => {
    setEditingRecord(record);
    setIsFormOpen(true);
  }

  const handleAddNewClick = () => {
    setEditingRecord(undefined);
    setIsFormOpen(true);
  }

  const handleDialogChange = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setEditingRecord(undefined);
    }
  }

  const handleDeleteClick = (id: string) => {
    setRecordToDelete(id);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      setRecords(records.filter(record => record.id !== recordToDelete));
      setRecordToDelete(null);
    }
    setIsAlertOpen(false);
  };

  return (
    <>
    <Dialog open={isFormOpen} onOpenChange={handleDialogChange}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
              <div>
                  <CardTitle className="font-headline text-2xl">Financiamiento</CardTitle>
                  <CardDescription>
                  Administra las cuentas de financiamiento y los registros de pago de los clientes.
                  </CardDescription>
              </div>
              <Button onClick={handleAddNewClick}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Cuenta
              </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden sm:table-cell">Artículo</TableHead>
                <TableHead className="hidden sm:table-cell">Estado</TableHead>
                <TableHead className="hidden md:table-cell">Fecha de Vencimiento</TableHead>
                <TableHead className="text-right">Restante</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                  <TableRow key={record.id}>
                      <TableCell>
                          <div className="font-medium">{record.customer}</div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                              {record.id}
                          </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{record.item}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                          <Badge className="text-xs" variant={getStatusBadgeVariant(record.status)}>
                          {record.status}
                          </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                          {new Date(record.dueDate).toLocaleDateString('es-CO', {timeZone: 'UTC'})}
                      </TableCell>
                      <TableCell className="text-right">${new Intl.NumberFormat('es-CO').format(record.totalPrice - record.paid)}</TableCell>
                      <TableCell>
                          <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Menú</span>
                              </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEditClick(record)}>Editar</DropdownMenuItem>
                              {user?.role === 'admin' && (
                                <DropdownMenuItem onClick={() => handleDeleteClick(record.id)} className="text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Eliminar
                                </DropdownMenuItem>
                              )}
                              </DropdownMenuContent>
                          </DropdownMenu>
                      </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingRecord ? 'Editar Cuenta' : 'Añadir Nueva Cuenta'}</DialogTitle>
            <DialogDescription>
              {editingRecord ? 'Actualiza los detalles de la cuenta.' : 'Rellena los detalles de la nueva cuenta de financiamiento.'}
            </DialogDescription>
          </DialogHeader>
          <RecordForm onSave={handleSaveRecord} record={editingRecord} onCancel={() => handleDialogChange(false)} />
      </DialogContent>
      </Dialog>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la cuenta de financiamiento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
