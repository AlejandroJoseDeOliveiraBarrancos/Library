'use client';
import { useState, useEffect } from 'react';

// Definimos la estructura del estado que manejará nuestro hook
interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

// Hook para realizar peticiones fetch a una URL
export function useFetch<T>(url: string): FetchState<T> {
    // Inicializamos el estado
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        loading: true,
        error: null,
    });

    // `useEffect` se ejecutará cada vez que la `url` cambie.
    useEffect(() => {
        // Si no hay URL, no hacemos nada.
        if (!url) return;

        const fetchData = async () => {
            // Reseteamos el estado a "cargando" antes de cada nueva petición
            setState({ data: null, loading: true, error: null });

            try {
                const response = await fetch(url);
                // Si la respuesta no es exitosa, lanzamos un error
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data)
                // Si todo va bien, guardamos los datos y marcamos la carga como finalizada
                setState({ data, loading: false, error: null });
            } catch (error) {
                // Si hay un error, lo guardamos en el estado
                setState({ data: null, loading: false, error: error as Error });
            }
        };

        fetchData();
    }, [url]); // El array de dependencias asegura que el efecto se re-ejecute si la URL cambia

    // Devolvemos el estado completo para que el componente pueda usarlo
    return state;
}
