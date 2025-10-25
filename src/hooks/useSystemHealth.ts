import { useState, useEffect } from 'react';
import api from '@/libs/api';

export interface SystemHealth {
  status: string;
  application: string;
  version: string;
  environment: string;
  server: string;
  timestamp: string;
  uptime: string;
  memoryUsage: string;
  database: string;
}

export interface FrontendHealth {
  status: string;
  application: string;
  version: string;
  environment: string;
  timestamp: string;
  memoryUsage: string;
  online: boolean;
}

export function useSystemHealth() {
  const [backend, setBackend] = useState<SystemHealth | null>(null);
  const [frontend, setFrontend] = useState<FrontendHealth | null>(null);
  const [connectionHealth, setConnectionHealth] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchBackend = async () => {
    const startTime = performance.now();
    
    try {
      const response = await api.get('/v1/System/Health');
      const endTime = performance.now();
      
      // Calcula saúde da conexão baseado no tempo de resposta (0-100%)
      const responseTime = endTime - startTime;
      const health = Math.max(0, 100 - (responseTime / 10)); // 100ms = 90%, 500ms = 50%
      setConnectionHealth(Math.min(100, health));
      
      setBackend(response.data);
      console.log('✅ Backend health atualizado:', response.data.status);
    } catch (err) {
      setConnectionHealth(0);
      setBackend({
        status: 'Unhealthy',
        application: 'COMJ API',
        version: 'N/A',
        environment: 'Unknown',
        server: 'N/A',
        timestamp: new Date().toISOString(),
        uptime: '00:00:00',
        memoryUsage: '0 MB',
        database: 'Disconnected'
      });
      console.log('❌ Erro ao buscar backend health');
    }
  };

  const getFrontend = (): FrontendHealth => {
    // @ts-ignore - performance.memory é do Chrome
    const memory = performance.memory;
    const memoryUsage = memory ? `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB` : 'N/A';

    return {
      status: 'Healthy',
      application: 'COMJ Frontend',
      version: '1.0.0',
      environment: import.meta.env.MODE || 'development',
      timestamp: new Date().toISOString(),
      memoryUsage,
      online: navigator.onLine
    };
  };

  const loadData = async () => {
    console.log('🔄 Atualizando dados do sistema...');
    await fetchBackend();
    setFrontend(getFrontend());
    
    // Só seta loading como false na primeira carga
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    // ⚡ Atualiza automaticamente - REMOVI a verificação de loading
    const interval = setInterval(loadData, 8000); // 8 segundos
    
    console.log('🚀 Sistema monitoramento iniciado (8s)');
    
    return () => {
      clearInterval(interval);
      console.log('🛑 Sistema monitoramento parado');
    };
  }, []);

  return { 
    backend, 
    frontend, 
    connectionHealth, 
    loading, 
    refetch: loadData
  };
}