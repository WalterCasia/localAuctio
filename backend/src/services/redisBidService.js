const { client } = require('../config/redis');

// Script Lua para validar puja de forma atómica
// KEYS[1] = auction_id
// ARGV[1] = user_id, ARGV[2] = monto_puja
const luaScript = `
    local currentBid = redis.call('HGET', KEYS[1], 'monto')
    local newBid = tonumber(ARGV[2])
    
    if not currentBid then
        currentBid = 0
    else
        currentBid = tonumber(currentBid)
    end
    
    if newBid > currentBid then
        redis.call('HSET', KEYS[1], 'monto', newBid, 'usuario', ARGV[1])
        return 1
    else
        return 0
    end
`;

let sha1 = null;

const loadScript = async () => {
    try {
        sha1 = await client.scriptLoad(luaScript);
        console.log('Lua Script de Pujas cargado en Redis');
    } catch (error) {
        console.error('Error cargando Lua script en Redis', error);
    }
};

const placeBidAtomic = async (auctionId, userId, amount) => {
    if (!sha1) {
        await loadScript();
    }
    try {
        const result = await client.evalSha(sha1, {
            keys: [`auction:${auctionId}`],
            arguments: [userId.toString(), amount.toString()]
        });
        return result === 1; // 1 éxito, 0 rechazo
    } catch (error) {
        console.error('Error al ejecutar puja en Redis:', error);
        return false;
    }
};

module.exports = { placeBidAtomic, loadScript };
