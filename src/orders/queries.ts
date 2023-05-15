export const getBasketProductRelation = `
    SELECT 
        p.id as productId,
        p.name as productName,
        basket_product_relations.count as count,
        p.price as price
    FROM basket_product_relations
    INNER JOIN products as p
    ON basket_product_relations.productId = p.id
    WHERE basketId = :basketId
`;

export const getProducts4CancelOrder = (ids) => `
    SELECT * 
    FROM products
    WHERE id IN (${ids.join(",")})
`;
