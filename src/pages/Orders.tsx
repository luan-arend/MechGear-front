
import { useState, useEffect } from "react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Plus } from "lucide-react";
import api from "@/services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Erro ao carregar pedidos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCreateOrder = () => {
    // This will be implemented in a future update
    toast.info("Funcionalidade em desenvolvimento");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
          <Button 
            className="bg-workshop-900 hover:bg-workshop-800"
            onClick={handleCreateOrder}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Pedido
          </Button>
        </div>
        
        {/* Placeholder content */}
        <div className="flex flex-col items-center justify-center h-96 border rounded-lg bg-white dark:bg-gray-800 p-6">
          <FileSpreadsheet className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold text-muted-foreground">
            Gestão de Pedidos
          </h2>
          <p className="text-center text-muted-foreground mt-2 max-w-md">
            {isLoading ? "Carregando..." : "Aqui você poderá criar e gerenciar pedidos de serviços e vendas. Esta funcionalidade será implementada em breve."}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Orders;
