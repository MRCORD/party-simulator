/**
 * Food planning cooking tips
 */
export const foodTips = {
    // Cooking logistics tips
    logisticsTips: [
      "Tener al menos 2 personas manejando la parrilla para fiestas de más de 20 personas",
      "Preparar la carne con anticipación (marinado, sazonado)",
      "Cocinar primero los alimentos que requieren más tiempo, luego los más rápidos",
      "Considerar cocinar algunos alimentos por adelantado y solo terminarlos en la parrilla",
      "Calcular 45-60 minutos de parrilla activa por cada 20 personas"
    ],
    
    // Food selection tips
    selectionTips: [
      "Elegir alimentos que se puedan preparar con anticipación",
      "Incluir opciones vegetarianas (brochetas de verduras, maíz, etc.)",
      "Ofrecer una variedad de proteínas (pollo, res, cerdo)",
      "Preparar guarniciones simples que no requieran cocción (ensaladas, papas fritas)",
      "Considerar restricciones dietéticas entre los invitados",
      "Tener postres preparados que no requieran refrigeración"
    ]
  };
  
  /**
   * Drink planning service tips
   */
  export const drinkTips = {
    // Service tips
    serviceTips: [
      "Instala una estación de bebidas autoservicio para reducir trabajo y mejorar la experiencia",
      "Prepara cócteles por lote para ahorrar tiempo y asegurar consistencia en el sabor",
      "Usa dispensadores para mezcladores comunes como gaseosas y jugos",
      "Considera contratar un bartender si el presupuesto lo permite para una experiencia premium"
    ],
    
    // Cost saving tips
    costSavingTips: [
      "Compra licores en botellas más grandes para mejor valor por mililitro",
      "Usa marcas económicas para cócteles donde el sabor se mezcla con otros ingredientes",
      "Pide a los invitados que traigan sus licores preferidos (BYOB) para reducir costos",
      "Compra hielo el día del evento para evitar que se derrita y ahorrar en cantidad",
      "Ofrece un cóctel de la casa en lugar de un bar completo para simplificar y reducir costos"
    ]
  };
  
  /**
   * Venue planning tips
   */
  export const venueTips = {
    // Venue checklist
    venueChecklist: [
      "Confirmar capacidad del local (debe ser suficiente para todos los asistentes)",
      "Verificar si permiten servir alcohol",
      "Confirmar si se puede traer comida/bebidas o si es necesario usar su catering",
      "Preguntar sobre restricciones de ruido y hora de término",
      "Confirmar disponibilidad de estacionamiento",
      "Verificar si hay instalaciones para cocinar (para parrilla)",
      "Verificar si hay costos adicionales por limpieza"
    ],
    
    // Event day checklist
    eventDayChecklist: [
      "Llegar temprano para la instalación (al menos 2 horas antes)",
      "Traer artículos de limpieza",
      "Tener información de contacto del administrador del local",
      "Conocer las reglas para la devolución del depósito de seguridad",
      "Tener un plan para la eliminación de basura"
    ],
    
    // Common miscellaneous items
    miscItems: [
      "Sistema de música o parlantes",
      "Cables de extensión",
      "Iluminación (si el evento es de noche)",
      "Mesas y sillas (si no los proporciona el local)",
      "Hieleras y conservadores",
      "Bolsas de basura",
      "Papel toalla",
      "Botiquín de primeros auxilios",
      "Destapadores y abrelatas",
      "Utensilios para servir"
    ]
  };
  
  /**
   * Common venue types with typical costs and features
   */
  export const venueTypes = [
    { 
      name: "Terraza", 
      cost: 1500, 
      capacity: 60, 
      hours: 5, 
      features: ["Estacionamiento", "Cocina", "Patio", "Zona de bebidas"] 
    },
    { 
      name: "Salón de eventos", 
      cost: 2000, 
      capacity: 100, 
      hours: 6, 
      features: ["Aire acondicionado", "Sonido", "Estacionamiento", "Personal"] 
    },
    { 
      name: "Casa de Campo", 
      cost: 2500, 
      capacity: 80, 
      hours: 8, 
      features: ["Piscina", "Parrilla", "Jardín", "Estacionamiento"] 
    },
    { 
      name: "Espacio en Azotea", 
      cost: 1200, 
      capacity: 40, 
      hours: 5, 
      features: ["Vista", "Barra", "Iluminación", "Cobertura"] 
    }
  ];