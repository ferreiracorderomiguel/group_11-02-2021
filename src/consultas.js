db.ventas.aggregate([
        {
            $match: { 
                FechaCompra: {$gt: new Date(2015,12,31)}
            }
        },
        {
            $group:
            {
                _id: { 
                    año: {$year: "$FechaCompra" },
                    Artículo: "$Artículo",
                    PrecioUnidad: "$PrecioUnidad"
                },
                Total_Venta: { $sum: { $multiply: ["$PrecioUnidad", "$NumUnidades"] } },
            }
        },
        {
            $project: {
                Año: "$_id.Año",
                Artículo: "$_id.Artículo",
                PrecioUnidad: "$_id.PrecioUnidad",
                _id: 0,
                totalv: "$Total_Venta",
                totalVentasNoIVA: { $multiply: ["$Total_Venta", 1.21] },
                Beneficio: { $subtract:["$PrecioUnidad", "$PrecioFabrica"] },
            }
        },
        {
            $match: {  
                $expr:{
                    PrecioUnidad: { $and: [ { $gt: [ "$PrecioUnidad", 4.30 ] }, { $lt: [ "$PrecioUnidad", 2.00 ] } ] }
                }
                
            }
        },
        {
            $sort: {
                Artículo: 1, PrecioUnidad: 1
            }
        },
])

/*
{ "Artículo" : "Aceite de oliva virgen extra 5L", "PrecioUnidad" : 6, "totalv" : 864, "totalVentasNoIVA" : 1045.44, "Beneficio" : 0.85 }
{ "Artículo" : "Coca-cola pack 6 latas", "PrecioUnidad" : 4, "totalv" : 1952, "totalVentasNoIVA" : 2361.92, "Beneficio" : 0.75 }
{ "Artículo" : "Huevos (docena)", "PrecioUnidad" : 2, "totalv" : 532, "totalVentasNoIVA" : 643.72, "Beneficio" : 0.6 }
{ "Artículo" : "Mayonesa", "PrecioUnidad" : 3, "totalv" : 2475, "totalVentasNoIVA" : 2994.75, "Beneficio" : 1 }
{ "Artículo" : "Pack 6 Botellas de agua 1,5L", "PrecioUnidad" : 3.14, "totalv" : 4559.28, "totalVentasNoIVA" : 5516.7288, "Beneficio" : 1.64 }
{ "Artículo" : "Pizza jamón y queso", "PrecioUnidad" : 2.75, "totalv" : 1562, "totalVentasNoIVA" : 1890.02, "Beneficio" : 0.9 }
{ "Artículo" : "Vinagre 0.5L", "PrecioUnidad" : 5.6, "totalv" : 151.2, "totalVentasNoIVA" : 182.95199999999997, "Beneficio" : 0.6ex }
 */