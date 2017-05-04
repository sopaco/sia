export async function findOne(target, option) {
    let em = resolveEntityManager(target);
    return em.findOne({
        paranoid: true,
        where: option.where,
    })
}

export async function findAll(target, option) {
    let em = resolveEntityManager(target);
    return await em.findAll({
        paranoid: true,
        where: option && option.where,
        order: option && option.order,
    });
}

export async function find(target, option = {pageSize: 20, offset: 0}) {
    let em = resolveEntityManager(target);
    return await em.findAll({
        paranoid: true,
        where: {
            ...option.where,
        },
        offset: Number(option.offset),
        limit: Number(option.pageSize),
        order: option.order,
    });   
}

export async function insertOne(target, option) {
    let em = resolveEntityManager(target);
    return await em.create(option.entity);
}

export async function update(target, option) {
    let em = resolveEntityManager(target);
    return await em.update(
        option.setter, 
        {
            where: option.where
        }
    );
}

export async function deleteEntities(target, option) {
    let em = resolveEntityManager(target);
    return await em.destroy({
        where: option.where
    });   
}

export async function querySchema(target) {
    let entityModel = resolveEntityManager(target);
    return await entityModel.describe();
}

export async function count(target) {
    return resolveEntityManager(target).count();
}

function resolveEntityManager(target) {
    let {
        module,
        entityName
    } = target;
    return require(`../../../${module}/model/${entityName}`)();
}