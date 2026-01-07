'use client';

import Image from 'next/image';
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
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { useState, useEffect } from 'react';
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


export const initialInventoryItems = [
    {
    id: 'inv-007',
    name: 'Oro (por gramo)',
    category: 'Material',
    type: 'Lingote',
    stock: 1000,
    price: 280000,
    image: PlaceHolderImages.find(p => p.id === 'gold-ingot-1')!,
    karats: undefined,
    grams: 1,
  },
  {
    id: 'inv-008',
    name: 'Plata (por gramo)',
    category: 'Material',
    type: 'Lingote',
    stock: 5000,
    price: 3500,
    image: PlaceHolderImages.find(p => p.id === 'silver-ingot-1')!,
    karats: undefined,
    grams: 1,
  },
  {
    id: 'inv-001',
    name: 'Anillo de Boda de Platino',
    category: 'Joyería',
    type: 'Anillo',
    stock: 20,
    price: 4500000,
    karats: undefined,
    grams: 5,
    image: PlaceHolderImages.find(p => p.id === 'platinum-band-1')!,
  },
  {
    id: 'inv-002',
    name: 'Reloj de Lujo (Cronógrafo)',
    category: 'Relojería',
    type: 'Reloj',
    stock: 10,
    price: 45000000,
    image: PlaceHolderImages.find(p => p.id === 'luxury-watch-1')!,
    karats: undefined,
    grams: 150,
  },
    {
    id: 'inv-005',
    name: 'Aretes de Perla',
    category: 'Joyería',
    type: 'Aretes',
    stock: 50,
    price: 940000,
    karats: undefined,
    grams: 3,
    image: PlaceHolderImages.find(p => p.id === 'pearl-earrings-1')!,
  },
];

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  type: string;
  stock: number;
  price: number;
  karats?: number;
  grams?: number;
  image: ImagePlaceholder;
}

const getInitialItems = (): InventoryItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const storedItems = localStorage.getItem('inventoryItems');
  if (storedItems) {
    try {
      const parsedItems = JSON.parse(storedItems);
      // A quick check to see if parsed data is an array
      if (Array.isArray(parsedItems)) {
        return parsedItems;
      }
    } catch (e) {
      console.error("Error parsing inventory items from localStorage", e);
    }
  }
  // If nothing in localStorage, set it with initial items
  localStorage.setItem('inventoryItems', JSON.stringify(initialInventoryItems));
  return initialInventoryItems;
};

const formSchema = z.object({
  name: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
  category: z.string().min(2, { message: 'La categoría es requerida.' }),
  type: z.string().min(2, { message: 'El tipo es requerido.' }),
  stock: z.coerce.number().int().min(0, { message: 'Las existencias no pueden ser negativas.' }),
  price: z.coerce.number().min(1, { message: 'El precio debe ser mayor a 0.' }),
  karats: z.coerce.number().optional(),
  grams: z.coerce.number().optional(),
  imageUrl: z.string().url({ message: 'Por favor, introduce una URL de imagen válida.' }).optional().or(z.literal('')),
});

type InventoryFormValues = z.infer<typeof formSchema>;


function ItemForm({
  onSave,
  onCancel,
  item
}: {
  onSave: (values: InventoryFormValues, id?: string) => void;
  onCancel: () => void;
  item?: InventoryItem;
}) {
  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: item ? {
        ...item,
        karats: item.karats ?? undefined,
        grams: item.grams ?? undefined,
        imageUrl: item.image?.imageUrl || '',
    } : {
      name: '',
      category: '',
      type: '',
      stock: 0,
      price: 0,
      karats: undefined,
      grams: undefined,
      imageUrl: '',
    },
  });

  const onSubmit = (values: InventoryFormValues) => {
    onSave(values, item?.id);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Anillo de Diamante" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de la Imagen</FormLabel>
              <FormControl>
                <Input placeholder="https://ejemplo.com/imagen.jpg" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <FormControl>
                <Input placeholder="Joyería" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <FormControl>
                <Input placeholder="Anillo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Existencias</FormLabel>
                <FormControl>
                    <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Precio</FormLabel>
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
            name="karats"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kilates (opcional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="18" 
                    {...field} 
                    value={field.value ?? ''}
                    onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="grams"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gramos (opcional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="5" 
                    {...field} 
                    value={field.value ?? ''}
                    onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
          <Button type="submit">Guardar Artículo</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}


export default function InventoryPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    setItems(getInitialItems());
  }, []);

  useEffect(() => {
     if (typeof window !== 'undefined' && hasMounted) {
        localStorage.setItem('inventoryItems', JSON.stringify(items));
    }
  }, [items, hasMounted]);

  if (!hasMounted) {
    return null;
  }

  const handleSaveItem = (values: InventoryFormValues, id?: string) => {
    const { imageUrl, ...restValues } = values;

    const getImage = (): ImagePlaceholder => {
      if (imageUrl) {
        return {
          id: `custom-${Date.now()}`,
          imageUrl: imageUrl,
          description: values.name,
          imageHint: values.type.toLowerCase(),
        };
      }
      if (id && editingItem) {
        return editingItem.image;
      }
      // Find a suitable placeholder, or fallback to a default one
      const placeholder = PlaceHolderImages.find(p => p.imageHint.includes(values.type.toLowerCase())) 
                          || PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];
      return placeholder;
    }

    if (id) {
        setItems(items.map(item => item.id === id ? {
            ...item, 
            ...restValues, 
            image: getImage(),
        } : item));
    } else {
        const newItem: InventoryItem = {
            id: `inv-${Date.now()}`,
            ...restValues,
            image: getImage(),
        };
        setItems([newItem, ...items]);
    }
    setIsFormOpen(false);
  };
  
  const handleEditClick = (item: InventoryItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  }

  const handleAddNewClick = () => {
    setEditingItem(undefined);
    setIsFormOpen(true);
  }

  const handleDialogChange = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setEditingItem(undefined);
    }
  }

  const handleDeleteClick = (id: string) => {
    if (id === 'inv-007' || id === 'inv-008') {
        return;
    }
    setItemToDelete(id);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setItems(items.filter(item => item.id !== itemToDelete));
      setItemToDelete(null);
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
                  <CardTitle className="font-headline text-2xl">Inventario Golden Gate</CardTitle>
                  <CardDescription>
                  Administra tus productos y mira su rendimiento en ventas.
                  </CardDescription>
              </div>
              <Button onClick={handleAddNewClick}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Artículo
              </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Imagen</span>
                </TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="hidden md:table-cell">Kilates</TableHead>
                <TableHead className="hidden md:table-cell">Gramos</TableHead>
                <TableHead className="hidden md:table-cell">Existencias</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={item.name}
                      className="aspect-square rounded-md object-cover"
                      data-ai-hint={item.image.imageHint}
                      height="64"
                      src={item.image.imageUrl}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{item.type}</TableCell>
                   <TableCell className="hidden md:table-cell">{item.karats || 'N/A'}</TableCell>
                   <TableCell className="hidden md:table-cell">{item.grams ? `${item.grams} g` : 'N/A'}</TableCell>
                  <TableCell className="hidden md:table-cell">{item.category === 'Material' ? `${item.stock} g` : item.stock}</TableCell>
                  <TableCell>${new Intl.NumberFormat('es-CO').format(item.price)} {item.category === 'Material' ? '/ g' : ''}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEditClick(item)}>Editar</DropdownMenuItem>
                        {user?.role === 'admin' && (item.id !== 'inv-007' && item.id !== 'inv-008') && (
                          <DropdownMenuItem onClick={() => handleDeleteClick(item.id)} className="text-destructive">
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
      <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editar Artículo' : 'Añadir Nuevo Artículo'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Actualiza los detalles de tu artículo.' : 'Rellena los detalles de tu nuevo artículo de inventario.'}
            </DialogDescription>
          </DialogHeader>
          <ItemForm onSave={handleSaveItem} item={editingItem} onCancel={() => handleDialogChange(false)} />
      </DialogContent>
    </Dialog>
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el artículo de tu inventario.
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
