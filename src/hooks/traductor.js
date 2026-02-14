import { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const KEY = import.meta.env.VITE_AZURE_KEY;
const ENDPOINT = import.meta.env.VITE_AZURE_ENDPOINT;
const REGION = import.meta.env.VITE_REGION;

// Caché mejorado: clave compuesta por idioma + texto
const cacheTraducciones = {};

export function useTraduccion(textoOriginal, idioma = 'es') {
  const [resultado, setResultado] = useState(textoOriginal);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!textoOriginal || textoOriginal === 'N/A') {
      setResultado(textoOriginal);
      return;
    }

    // Generamos una clave única para este idioma y texto
    const cacheKey = `${idioma}-${textoOriginal}`;

    if (cacheTraducciones[cacheKey]) {
      setResultado(cacheTraducciones[cacheKey]);
      return;
    }

    // Si no está en caché, reseteamos el resultado al original mientras carga
    setResultado(textoOriginal);

    const traducir = async () => {
      if (!KEY) {
        console.warn("Azure API Key no encontrada.");
        return;
      }

      setCargando(true);
      try {
        const response = await axios({
          baseURL: ENDPOINT,
          url: '/translate',
          method: 'post',
          headers: {
            'Ocp-Apim-Subscription-Key': KEY,
            'Ocp-Apim-Subscription-Region': REGION,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4()
          },
          params: {
            'api-version': '3.0',
            'from': 'en',
            'to': idioma
          },
          data: [{ text: textoOriginal }]
        });

        const textoTraducido = response.data[0].translations[0].text;
        
        // Guardar en el caché con la clave compuesta
        cacheTraducciones[cacheKey] = textoTraducido;
        setResultado(textoTraducido);
      } catch (error) {
        console.error("Error Azure:", error.response?.data || error.message);
        setResultado(textoOriginal); 
      } finally {
        setCargando(false);
      }
    };

    // Pequeño delay (debounce) para evitar peticiones accidentales si el texto cambia rápido
    const timeoutId = setTimeout(traducir, 150);
    return () => clearTimeout(timeoutId);

  }, [textoOriginal, idioma]);

  return { resultado, cargando };
}