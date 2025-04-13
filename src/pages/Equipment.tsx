
import { useState, useEffect } from "react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Wrench, Plus } from "lucide-react";
import api from "@/services/api";

const Equipment = () => {
  const [equipments, setEquipments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/equipments');
        setEquipments(response.data);
      } catch (error) {
        console.error("Error fetching equipments:", error);
        toast.error("Erro ao carregar equipamentos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEquipments();
  }, []);

  const handleCreateEquipment = () => {
    // This will be implemented in a future update
    toast.info("Funcionalidade em desenvolvimento");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Equipamentos</h1>
          <Button 
            className="bg-workshop-900 hover:bg-workshop-800"
            onClick={handleCreateEquipment}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Equipamento
          </Button>
        </div>
        
        {/* Placeholder content */}
        <div className="flex flex-col items-center justify-center h-96 border rounded-lg bg-white dark:bg-gray-800 p-6">
          <Wrench className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold text-muted-foreground">
            Gestão de Equipamentos
          </h2>
          <p className="text-center text-muted-foreground mt-2 max-w-md">
            {isLoading ? "Carregando..." : "Aqui você poderá gerenciar todos os equipamentos registrados para manutenção. Esta funcionalidade será implementada em breve."}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Equipment;
