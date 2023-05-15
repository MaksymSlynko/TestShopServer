export const deleteBasketProductRelation = `
    DELETE 
    FROM basket_product_relations
    WHERE basketId = :basketId AND productId = :productId
`;

export const updateBasketProductRelation = `
    UPDATE basket_product_relations
    SET count = :count
    WHERE basketId = :basketId AND productId = :productId
`;

export const getBasketProductRelation = `
    SELECT 
        b.basketId as basketId,
        b.productId as productId,
        b.count as count
    FROM basket_product_relations as b
    WHERE basketId = :basketId AND productId = :productId
`;

export const getBasketWithProducts = `
    SELECT 
        p.id as productId,
        p.name as productName,
        basket_product_relations.count as count,
        p.price as productPrice
    FROM basket as b
    INNER JOIN basket_product_relations
    ON basket_product_relations.basketId = b.id
    INNER JOIN products as p
    ON basket_product_relations.productId = p.id
    WHERE userId = :userId
`;
