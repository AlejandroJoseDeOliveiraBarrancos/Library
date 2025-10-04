# Performance Lab - React Optimization

Este proyecto contiene una aplicación React con problemas de rendimiento intencionales para practicar optimización.

## Problemas de Rendimiento Incluidos:

### 1. Re-renderizados Innecesarios:
- **Header**: Realiza cálculos costosos en cada render
- **SearchBar**: Se re-renderiza cuando cambia el theme (no lo usa)
- **CategoryFilter**: Se re-renderiza cuando cambia el theme (no lo usa)
- **ProductCard**: Realiza cálculos complejos en cada render
- **CartItem**: Recibe props que no usa (user, theme)
- **UserProfile**: Calcula estadísticas costosas en cada render

### 2. Prop Drilling:
- Todas las props se pasan desde App hacia abajo
- No hay gestión de estado global
- Los componentes reciben props innecesarias

### 3. Cálculos Costosos:
- Operaciones matemáticas innecesarias en loops
- Filtrado de productos sin memoización
- Cálculos de totales repetitivos

## Instrucciones del Lab:

### Parte 1: Perfilado y Optimización
1. Instala React DevTools
2. Usa el Profiler para identificar componentes que se re-renderizan innecesariamente
3. Aplica `memo`, `useMemo`, o `useCallback` según corresponda
4. Documenta con capturas "antes y después"

### Parte 2: Gestión de Estado Global

**(Zustand):**
- Implementa Zustand
- Crea slices para productos, carrito, usuario
- Conecta componentes con el hook useStore y selectores optimizados

## Instalación:

```bash
npm install
npm start
```

## Componentes a Optimizar:

1. **Header** - Cálculos costosos
2. **ProductList** - Filtrado sin memoización  
3. **ProductCard** - Operaciones innecesarias
4. **Cart** - Cálculo de total costoso
5. **UserProfile** - Estadísticas complejas
6. **SearchBar/CategoryFilter** - Re-renders innecesarios

¡Buena suerte optimizando!
