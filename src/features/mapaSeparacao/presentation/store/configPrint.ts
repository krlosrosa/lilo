import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Dispatch, SetStateAction } from 'react';
import { PropsConfig } from '../../domain/generate-map';

const initialConfig: PropsConfig = {
  tipo: 'transport',
  transportes: [],
  segregedClients: [],
  remessas: [],
  clientes: [],
  isRange: false,
  minRange: 0,
  maxRange: 100,
  isPallet: false,
  maxPallet: 0,
  palletsFull: false,
  unidadesSeparadas: false,
  isSegregedFifo: false,
  rangeFifo: [],
  convertToPallet: false,
  isLine: false,
  maxLine: 10,
};

interface ConfigPrintStore {
  config: PropsConfig;
  setConfig: (config: PropsConfig) => void;
  setConfigCompat: Dispatch<SetStateAction<PropsConfig>>;
  updateConfig: (updates: Partial<PropsConfig>) => void;
  resetConfig: () => void;
}

export const useConfigPrintStore = create<ConfigPrintStore>()(
  persist(
    (set, get) => ({
      config: initialConfig,
      
      setConfig: (config: PropsConfig) => {
        set({ config });
      },
      
      setConfigCompat: (value: SetStateAction<PropsConfig>) => {
        set((state) => ({
          config: typeof value === 'function' ? value(state.config) : value
        }));
      },
      
      updateConfig: (updates: Partial<PropsConfig>) => {
        set((state) => ({
          config: { ...state.config, ...updates }
        }));
      },
      
      resetConfig: () => {
        set({ config: initialConfig });
      },
    }),
    {
      name: 'config-print-storage',
      partialize: (state) => ({ config: state.config }),
    }
  )
);
