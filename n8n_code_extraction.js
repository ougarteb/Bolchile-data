// 1. Extraemos el cuerpo del mensaje
// Se asume que $input.item.json.body viene como string JSON desde el webhook
const rawBody = typeof $input.item.json.body === 'string'
    ? JSON.parse($input.item.json.body)
    : $input.item.json.body;

const text = rawBody.html_full || "";

// 2. Función de extracción con "Plan B"
const extraer = (regex) => {
    const match = text.match(regex);
    return match ? match[1].trim() : "No encontrado";
};

// 3. Limpieza del valor actual (Precio del dólar)
// Busca: $862,00 *Información
let valor = extraer(/\$\s*(\d+,\d+)\s*\*Información/);
if (valor !== "No encontrado") {
    valor = valor.replace(',', '.');
}

// 4. Lógica para Monto y Negocios (Resumen de hoy)
// Busca: Monto US$ 50.550.000 (seguido de salto de línea o 'Negocios')
let monto = extraer(/Monto US\$\s+([\d\.]+)/);

// Busca: Negocios 118
let neg = extraer(/(?:Negocios|Transacciones)\s+([\d\.]+)/);

// Retornamos únicamente los campos solicitados
return {
    valor_actual: valor,
    monto_usd: monto,
    negocios: neg
};
