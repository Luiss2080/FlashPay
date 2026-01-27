import { Request, Response } from "express";

export const getPromos = async (req: Request, res: Response) => {
  // Mock data for promotions
  const promos = [
    {
      id_promo: 1,
      titulo: "Descuento en Cine",
      descripcion: "2x1 en entradas todos los martes y jueves.",
      descuento: "50%",
      imagen_url:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60",
    },
    {
      id_promo: 2,
      titulo: "Comida Rápida",
      descripcion: "20% de descuento en combos familiares.",
      descuento: "20%",
      imagen_url:
        "https://images.unsplash.com/photo-1561758033-d8f48f8e4f0f?w=500&auto=format&fit=crop&q=60",
    },
    {
      id_promo: 3,
      titulo: "Tienda de Ropa",
      descripcion: "Envío gratis en compras mayores a S/ 100.",
      descuento: "Envío Gratis",
      imagen_url:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&auto=format&fit=crop&q=60",
    },
  ];

  res.json({ status: "success", data: promos });
};
