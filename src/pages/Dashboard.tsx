
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  AlertCircle,
  Calendar,
  Clock,
  Users,
  Wrench,
  FileSpreadsheet,
  ShoppingBag,
} from "lucide-react";

// Mock data for charts
const last7DaysData = [
  { name: "Segunda", pedidos: 12, valor: 3400 },
  { name: "Terça", pedidos: 19, valor: 4200 },
  { name: "Quarta", pedidos: 15, valor: 3700 },
  { name: "Quinta", pedidos: 17, valor: 4100 },
  { name: "Sexta", pedidos: 21, valor: 5200 },
  { name: "Sábado", pedidos: 16, valor: 4800 },
  { name: "Hoje", pedidos: 10, valor: 2900 },
];

const last30DaysData = [
  { name: "Semana 1", pedidos: 82, valor: 23400 },
  { name: "Semana 2", pedidos: 75, valor: 19800 },
  { name: "Semana 3", pedidos: 93, valor: 25700 },
  { name: "Semana 4", pedidos: 85, valor: 22300 },
];

// Mock data for analytics cards
const analyticsData = {
  pendingOrders: 8,
  activeClients: 47,
  criticalStock: 5,
  totalEquipment: 124,
};

const Dashboard = () => {
  const [chartPeriod, setChartPeriod] = useState("7d");

  const chartData = chartPeriod === "7d" ? last7DaysData : last30DaysData;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="card-dashboard">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pedidos Pendentes</p>
                <h3 className="text-2xl font-bold mt-2">{analyticsData.pendingOrders}</h3>
              </div>
              <div className="p-2 bg-orange-100 rounded-md">
                <FileSpreadsheet className="h-8 w-8 text-accent-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              2 com prazo crítico
            </div>
          </Card>

          <Card className="card-dashboard">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clientes Ativos</p>
                <h3 className="text-2xl font-bold mt-2">{analyticsData.activeClients}</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-md">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Últimos 30 dias
            </div>
          </Card>

          <Card className="card-dashboard">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estoque Crítico</p>
                <h3 className="text-2xl font-bold mt-2">{analyticsData.criticalStock}</h3>
              </div>
              <div className="p-2 bg-red-100 rounded-md">
                <ShoppingBag className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              Itens abaixo do mínimo
            </div>
          </Card>

          <Card className="card-dashboard">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Equipamentos</p>
                <h3 className="text-2xl font-bold mt-2">{analyticsData.totalEquipment}</h3>
              </div>
              <div className="p-2 bg-green-100 rounded-md">
                <Wrench className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Cadastrados no sistema
            </div>
          </Card>
        </div>

        {/* Chart Section */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Análise de Pedidos</h2>
            <Tabs value={chartPeriod} onValueChange={setChartPeriod}>
              <TabsList>
                <TabsTrigger value="7d">7 Dias</TabsTrigger>
                <TabsTrigger value="30d">30 Dias</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                <XAxis 
                  dataKey="name" 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="pedidos"
                  stackId="1"
                  stroke="#1a237e"
                  fill="#1a237e"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="valor"
                  stackId="2"
                  stroke="#dd2c00"
                  fill="#dd2c00"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity Section - Placeholder for future implementation */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Atividades Recentes</h2>
          <div className="text-center py-8 text-muted-foreground">
            <p>Histórico de atividades será implementado em breve</p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
