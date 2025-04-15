import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, MoreHorizontal, Edit, Trash, Eye, Cog } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const customerSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  documento: z.string().min(11, "Documento inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  email: z.string().email("Email inválido"),
  logradouro: z.string().min(3, "Endereço inválido"),
  numero: z.string(),
  bairro: z.string(),
  cidade: z.string(),
  estado: z.string().length(2, "Use a sigla do estado (2 caracteres)"),
  cep: z.string(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface Customer {
  id: number;
  name: string;
  cpfCnpj: string;
  phone: string;
  email: string;
  address: {
    street: string;
    number: string | null;
    complement: string | null;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

const Customers = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />; // Redireciona para login se o usuário não estiver autenticado
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [createEditSheetOpen, setCreateEditSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      nome: "",
      documento: "",
      telefone: "",
      email: "",
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    },
  });
  
  useEffect(() => {
    fetchCustomers();
  }, []);
  
  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/customers');
      setCustomers(response.data.content);
    } catch (error: any) {
      if (error.response?.data) {
        const errorData = error.response.data;
        toast.error(`Erro ao carregar clientes: ${errorData.error || "Ocorreu um erro ao carregar os clientes."}`);
      } else {
        toast.error("Erro ao carregar clientes: Ocorreu um erro inesperado ao carregar os clientes.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredCustomers = Array.isArray(customers)
    ? customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.cpfCnpj.includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  
  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setViewModalOpen(true);
  };
  
  const handleCreateCustomer = () => {
    setIsEditing(false);
    form.reset({
      nome: "",
      documento: "",
      telefone: "",
      email: "",
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    });
    setCreateEditSheetOpen(true);
  };
  
  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditing(true);
    
    // Use setTimeout to ensure state is updated before form reset
    setTimeout(() => {
      form.reset({
        nome: customer.name,
        documento: customer.cpfCnpj,
        telefone: customer.phone,
        email: customer.email,
        logradouro: customer.address.street,
        numero: customer.address.number || "",
        bairro: customer.address.neighborhood,
        cidade: customer.address.city,
        estado: customer.address.state,
        cep: customer.address.zipCode,
      });
    }, 0);
    
    setCreateEditSheetOpen(true);
  };
  
  const handleDeleteCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteDialogOpen(true);
  };
  
  const onSubmit = async (data: CustomerFormValues) => {
    try {
      const customerData = {
        id: selectedCustomer?.id,
        name: data.nome,
        cpfCnpj: data.documento,
        phone: data.telefone,
        email: data.email,
        address: {
          street: data.logradouro,
          number: data.numero || null,
          complement: null,
          neighborhood: data.bairro,
          city: data.cidade,
          state: data.estado,
          zipCode: data.cep,
        },
      };

      if (isEditing) {
        await api.put(`/customers`, customerData);
        toast.success(`O cliente ${data.nome} foi atualizado com sucesso.`);
      } else {
        await api.post(`/customers`, customerData);
        toast.success(`O cliente ${data.nome} foi criado com sucesso.`);
      }

      fetchCustomers();
      setCreateEditSheetOpen(false);
    } catch (error: any) {
      if (error.response?.data) {
        const errorData = error.response.data;
        toast.error(errorData.error || "Ocorreu um erro ao salvar o cliente.");
      } else {
        toast.error("Ocorreu um erro inesperado ao salvar o cliente.");
      }
    }
  };
  
  const confirmDelete = async () => {
    try {
      if (selectedCustomer) {
        await api.delete(`/customers/${selectedCustomer.id}`);
        toast.success(`O cliente ${selectedCustomer.name} foi excluído com sucesso.`);
        fetchCustomers();
      }
      setDeleteDialogOpen(false);
    } catch (error: any) {
      if (error.response?.data) {
        const errorData = error.response.data;
        toast.error(errorData.error || "Ocorreu um erro ao excluir o cliente.");
      } else {
        toast.error("Ocorreu um erro inesperado ao excluir o cliente.");
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Cog className="h-8 w-8 text-accent-600 animate-pulse" />
            <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          </div>
          <Button 
            className="bg-accent-600 hover:bg-accent-700 text-white" 
            onClick={handleCreateCustomer}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        {/* Search and filter */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, documento ou email..."
              className="pl-9 border-accent-200 focus-visible:ring-accent-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Customers table */}
        <div className="border rounded-md shadow-sm dark:border-gray-700">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 dark:bg-gray-800">
                <TableHead>Nome</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-accent-50 dark:hover:bg-gray-700/50">
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.cpfCnpj}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => handleViewCustomer(customer)}
                          >
                            <Eye className="h-4 w-4 mr-2 text-blue-500" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => handleEditCustomer(customer)}
                          >
                            <Edit className="h-4 w-4 mr-2 text-amber-500" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer text-destructive"
                            onClick={() => handleDeleteCustomer(customer)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-32">
                    Nenhum cliente encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* View Customer Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-md bg-card dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl text-accent-800 dark:text-accent-300">Detalhes do Cliente</DialogTitle>
            <DialogDescription>
              Informações completas do cliente selecionado.
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-accent-50 p-3 rounded-lg dark:bg-gray-700/50">
                  <h3 className="font-medium text-sm text-accent-700 dark:text-accent-300">Nome:</h3>
                  <p>{selectedCustomer.name}</p>
                </div>
                <div className="bg-accent-50 p-3 rounded-lg dark:bg-gray-700/50">
                  <h3 className="font-medium text-sm text-accent-700 dark:text-accent-300">Documento:</h3>
                  <p>{selectedCustomer.cpfCnpj}</p>
                </div>
                <div className="bg-accent-50 p-3 rounded-lg dark:bg-gray-700/50">
                  <h3 className="font-medium text-sm text-accent-700 dark:text-accent-300">Telefone:</h3>
                  <p>{selectedCustomer.phone}</p>
                </div>
                <div className="bg-accent-50 p-3 rounded-lg dark:bg-gray-700/50">
                  <h3 className="font-medium text-sm text-accent-700 dark:text-accent-300">Email:</h3>
                  <p>{selectedCustomer.email}</p>
                </div>
              </div>
              
              <div className="bg-accent-50 p-3 rounded-lg dark:bg-gray-700/50">
                <h3 className="font-medium text-sm text-accent-700 dark:text-accent-300">Endereço:</h3>
                <p>
                  {selectedCustomer.address.street}, {selectedCustomer.address.number} <br />
                  {selectedCustomer.address.neighborhood} <br />
                  {selectedCustomer.address.city} - {selectedCustomer.address.state} <br />
                  CEP: {selectedCustomer.address.zipCode}
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create/Edit Customer Sheet */}
      <Sheet open={createEditSheetOpen} onOpenChange={setCreateEditSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto dark:bg-gray-800">
          <SheetHeader>
            <SheetTitle className="text-xl text-accent-800 dark:text-accent-300">{isEditing ? "Editar Cliente" : "Novo Cliente"}</SheetTitle>
            <SheetDescription>
              {isEditing 
                ? "Altere os dados do cliente conforme necessário." 
                : "Preencha os dados para cadastrar um novo cliente."}
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" {...field} className="border-accent-200 focus-visible:ring-accent-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="documento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF/CNPJ</FormLabel>
                        <FormControl>
                          <Input placeholder="000.000.000-00" {...field} className="border-accent-200 focus-visible:ring-accent-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(00) 00000-0000" {...field} className="border-accent-200 focus-visible:ring-accent-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="exemplo@email.com" {...field} className="border-accent-200 focus-visible:ring-accent-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="border-t pt-4 dark:border-gray-700">
                  <h3 className="font-medium mb-2">Endereço</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cep"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEP</FormLabel>
                          <FormControl>
                            <Input placeholder="00000-000" {...field} className="border-accent-200 focus-visible:ring-accent-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="logradouro"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logradouro</FormLabel>
                          <FormControl>
                            <Input placeholder="Rua, Avenida, etc" {...field} className="border-accent-200 focus-visible:ring-accent-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="numero"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número</FormLabel>
                          <FormControl>
                            <Input placeholder="123" {...field} className="border-accent-200 focus-visible:ring-accent-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bairro"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bairro</FormLabel>
                          <FormControl>
                            <Input placeholder="Bairro" {...field} className="border-accent-200 focus-visible:ring-accent-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade</FormLabel>
                          <FormControl>
                            <Input placeholder="Cidade" {...field} className="border-accent-200 focus-visible:ring-accent-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="estado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado</FormLabel>
                          <FormControl>
                            <Input placeholder="UF" {...field} maxLength={2} className="border-accent-200 focus-visible:ring-accent-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                  </div>
                </div>
                
                <SheetFooter className="pt-4">
                  <Button type="submit" className="bg-accent-600 hover:bg-accent-700 text-white">
                    {isEditing ? "Salvar Alterações" : "Cadastrar Cliente"}
                  </Button>
                </SheetFooter>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Delete Customer Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Excluir Cliente</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {selectedCustomer && (
            <div className="py-3 bg-destructive/10 p-3 rounded-md">
              <p><strong>Nome:</strong> {selectedCustomer.name}</p>
              <p><strong>Documento:</strong> {selectedCustomer.cpfCnpj}</p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Customers;
