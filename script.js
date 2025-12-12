//Dictionary with RPC Endpoints
const RPC_CONFIG = {
    // EVM Chains
    "World Chain": { url: "https://worldchain-mainnet.g.alchemy.com/public", type: "EVM" },
    "XDC Network": { url: "https://erpc.xinfin.network", type: "EVM" },
    "zkSync Era": { url: "https://mainnet.era.zksync.io", type: "EVM" },
    "Oasis Network": { url: "https://emerald.oasis.dev", type: "EVM" },
    "Rootstock": { url: "https://public-node.rsk.co", type: "EVM" },
    "Scroll": { url: "https://rpc.scroll.io", type: "EVM" },
    "Sei": { url: "https://evm-rpc.sei-apis.com", type: "EVM" },
    "Sophon": { url: "https://rpc.sophon.xyz", type: "EVM" },
    "Story Network": { url: "https://mainnet.storyrpc.io", type: "EVM" },
    "Xertra": { url: "https://rpc.stratisevm.com", type: "EVM" },
    "Manta Pacific": { url: "https://pacific-rpc.manta.network/http", type: "EVM" },
    
    // BTC Forks
    "eCash": { url: "https://rpc.ankr.com/ecash", type: "BTC_RPC" },
    "Zcash": { url: "https://zcash-mainnet.public.blastapi.io", type: "BTC_RPC" },
    "Ravencoin": { url: "https://rvn-rpc-mainnet.ting.finance/rpc", type: "BTC_RPC" },

    // Generic / REST
    "Zilliqa": { url: "https://api.zilliqa.com", type: "GENERIC_RPC", method: "GetTransaction" },
    "XRP Ledger": { url: "https://s1.ripple.com:51234", type: "GENERIC_RPC", method: "tx" },
    "StarkNet": { url: "https://starknet-mainnet.public.blastapi.io", type: "GENERIC_RPC", method: "starknet_getTransactionReceipt" },
    "Steem": { url: "https://api.steemit.com", type: "GENERIC_RPC", method: "condenser_api.get_transaction" },
    "Hive": { url: "https://api.hive.blog", type: "GENERIC_RPC", method: "condenser_api.get_transaction" },
    "Stellar": { url: "https://horizon.stellar.org", type: "STELLAR" },
    "Tezos": { url: "https://api.tzkt.io/v1/transactions/", type: "REST_GET", path: "" },
    "Stacks": { url: "https://stacks-node-api.mainnet.stacks.co", type: "REST_GET", path: "/extended/v1/tx/" },
    "Solar": { url: "https://sxp.mainnet.sh/api", type: "REST_GET", path: "/transactions/" },
    
    // Cosmos SDK
    "Persistence One": { url: "https://persistence-api.polkachu.com", type: "COSMOS_RPC" },
    "THORChain": { url: "https://thornode.ninerealms.com", type: "COSMOS_RPC" },
    "Saga": { url: "https://saga-api.polkachu.com", type: "COSMOS_RPC" },
    "Secret Network": { url: "https://api.secret.express", type: "COSMOS_RPC" },
    "Terra": { url: "https://terra-api.polkachu.com", type: "COSMOS_RPC" },
    "Terra Classic": { url: "https://terra-classic-lcd.publicnode.com", type: "COSMOS_RPC" }
}

//Populate dropdown
document.addEventListener('DOMContentLoaded', () => {
    const options = document.getElementById("chain");
    const sortedKeys = Object.keys(RPC_CONFIG).sort();
    for (const key of sortedKeys) {
        let option = document.createElement("option");
        option.textContent = key;   
        option.value = key;         
        options.appendChild(option);
    }
})

//Validate Tx
async function validateTx(chain, txhash, expdest, amount){
    try {
    let endpoint = RPC_CONFIG[chain]
    amount = parseFloat(amount)
    switch(endpoint.type){
        case "EVM":
        case "BTC_RPC":
        case "GENERIC_RPC":
            let responselink = await fetch(endpoint.url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: endpoint.type === "EVM" ? "eth_getTransactionByHash" : endpoint.type === "BTC_RPC"? "getrawtransaction" : endpoint.method ,
                    params:  endpoint.type === "EVM"? [txhash] : endpoint.type === "BTC_RPC" ? [txhash , 1] : endpoint.method === "tx" ? [{ transaction: txhash }] : [txhash],
                    id: 1
                })
            })
            let response = await responselink.json();
            if(!response || response.error || !response.result) {
                    console.warn(`RPC ${chain} response:`, response)
                     return {dest_bool:0 , am_bool:0 , dest:null , am:null}
                }
            if (endpoint.type === "EVM"){
                const tx = response.result
                if(!tx) return {dest_bool:0 , am_bool:0 , dest:null , am:null}
                const to = tx.to.toLowerCase()
                let amount_to = 0;
                try {
                    amount_to = Number(BigInt(tx.value)) / 10**18;
                } catch (err) {
                    console.error("Erro ao calcular valor:", err);
                    amount_to = 0;
                }
                const to_bool = to === expdest.toLowerCase() ? 1 : 0
                const amount_bool = Math.abs(amount_to - amount) < 0.0001 ? 1 : 0
                return {dest_bool:to_bool , am_bool:amount_bool , dest:to , am:amount_to }
            }else if (endpoint.type === "BTC_RPC"){
                const outputs = response.result.vout
                const targetOutput = outputs.find(out => 
                    out.scriptPubKey.addresses && 
                    out.scriptPubKey.addresses.includes(expdest)
                );
                if (!targetOutput) return {dest_bool:0 , am_bool:0 , dest:null , am:null}
                const trans_amount = parseFloat(targetOutput.value)
                const bool_amount = trans_amount === parseFloat(amount) ? 1 : 0
                return {dest_bool:1 , am_bool:bool_amount , dest:expdest , am:trans_amount }
            }else if (endpoint.type === "GENERIC_RPC"){
                if(chain == "XRP Ledger"){
                    const xrp_tx =  response.result
                    if(!xrp_tx) return {dest_bool:0 , am_bool:0 , dest:null , am:null}
                    const dest = xrp_tx.Destination.toLowerCase()
                    const dest_bool = dest === expdest.toLowerCase() ? 1 : 0
                    const xrp_am = parseFloat(xrp_tx.Amount) / 1000000
                    const am_bool = amount === xrp_am ? 1 : 0
                    return {dest_bool:dest_bool , am_bool:am_bool , dest:dest , am:xrp_am}
                } else if(chain === "Zilliqa"){
                    const zil_tx =  response.result
                    if(!zil_tx) return {dest_bool:0 , am_bool:0 , dest:null , am:null}
                    const zil_dest = zil_tx.toAddr.toLowerCase()
                    const zildest_bool = zil_dest === expdest.toLowerCase() ? 1 : 0
                    const zil_am = parseFloat(zil_tx.amount) / 10**12
                    const zil_bool = amount === zil_am ? 1 : 0
                    return {dest_bool:zildest_bool , am_bool:zil_bool , dest:zil_dest , am:zil_am}
                } else if (chain === "Steem" || chain === "Hive"){
                    const tx = response.result
                    const op = tx.operations.find(o => o[1] === "transfer")
                    if (!op) return {dest_bool:0 , am_bool:0 , dest:null , am:null}
                    const data = op[0]
                    const dest = data.to
                    const destvalid = dest === expdest ? 1 : 0
                    const am =  parseFloat(data.amount.split(" ")[0])
                    const amvalid = Math.abs(am - amount) < 0.0001 ? 1 : 0
                    return {dest_bool:destvalid , am_bool:amvalid , dest:dest , am:am}
                } else if (chain === "StarkNet"){
                    const tx = response.result
                    if(tx.events){
                        for (let event of tx.events) {
                            if (event.data && event.data.length >= 4) {
                                const to = event.data[1]
                                const to_valid = to.toLowerCase() === expdest.toLowerCase() ? 1 : 0
                                const am = Number(BigInt(event.data[2])) / 10**18
                                const am_valid = Math.abs(am - amount) < 0.0001 ? 1 : 0
                                return {dest_bool:to_valid , am_bool:am_valid , dest:to , am:am}
                            }
                        }
                    }
                    return {dest_bool:0 , am_bool:0 , dest:null , am:null}
                }
            }
            break;
        case "REST_GET":
        case "STELLAR":
        case "COSMOS_RPC":
            const url = endpoint.type === "STELLAR"? endpoint.url+"/transactions/"+txhash+"/operations" : endpoint.type === "REST_GET" ? endpoint.url + endpoint.path + txhash : endpoint.type === "COSMOS_RPC" ? `${endpoint.url}/cosmos/tx/v1beta1/txs/${txhash}` : null
            let response_link = await fetch(url) 
            if(!response_link.ok) return {dest_bool:0 , am_bool:0 , dest:null , am:null}
            
            const response_bylink = await response_link.json();
            if (endpoint.type === "REST_GET"){
                if(chain === "Stacks"){
                    const tx =  response_bylink.token_transfer
                    if(!tx) return {dest_bool:0 , am_bool:0 , dest:null , am:null}
                    const dest = tx.recipient_address.toLowerCase()
                    const dest_bool = dest === expdest ? 1 : 0
                    const am = parseFloat(tx.amount) / 1000000
                    const am_bool =  Math.abs(am - amount) < 0.0001 ? 1 : 0
                    return {dest_bool:dest_bool , am_bool:am_bool , dest:dest , am:am}
                } else if (chain === "Solar"){
                    const tx = response_bylink.data
                    if(!tx) return {dest_bool:0 , am_bool:0 , dest:null , am:null}
                    const dest= tx.recipient
                    const destvalid = dest === expdest ? 1 : 0
                    const am = parseFloat(tx.amount) / 10**8
                    const am_valid= Math.abs(am - amount) < 0.0001 ? 1 : 0
                    return {dest_bool:destvalid , am_bool:am_valid , dest:dest , am:am}
                } else  if (chain === "Tezos"){
                    const tx = response_bylink.find(t => 
                        t.type === "transaction" &&
                        t.target &&
                        t.target.address === expdest
                    );
                    if (!tx) return {dest_bool:0 , am_bool:0 , dest:null , am:null}
                    const am = tx.amount / 1000000;
                    const am_valid = Math.abs(am - amount) < 0.0001 ? 1 : 0
                    return {dest_bool:1 , am_bool:am_valid , dest:expdest , am:am}
                }
            }else if (endpoint.type === "STELLAR"){
                const tx = response_bylink._embedded.records
                const op = tx.find(r => r.type === "payment" && r.to === expdest)
                if (!op) return {dest_bool:0 , am_bool:0 , dest:null , am:null} 
                const st_amount = parseFloat(op.amount)
                const valid_amount = Math.abs(amount - st_amount) < 0.0001 ? 1 : 0
                return {dest_bool:1 , am_bool:valid_amount , dest:expdest , am:st_amount}
            }else if (endpoint.type === "COSMOS_RPC"){
                const txBody = response_bylink.tx_response?.tx?.body;
                if (!txBody || !txBody.messages) return { dest_bool: 0, am_bool: 0, dest: null, am: null };
                const msg = txBody.messages.find(m => 
                    (m['@type'].includes("MsgSend")) &&
                    (m.to_address === expdest)
                );
                if(!msg) return {dest_bool:0 , am_bool:0 , dest:null , am:null}
                const rawCoin = Array.isArray(msg.amount) ? msg.amount[0] : msg.amount;
                const rawam = rawCoin.amount || rawCoin;
                const am = parseFloat(rawam) / 1000000;
                const amvalid = Math.abs(am - parseFloat(amount)) < 0.0001 ? 1 : 0
                return {dest_bool:1 , am_bool:amvalid , dest:expdest , am:am }
            }
            break;
    }} catch (e) {
        console.error(e); 
        return { dest_bool: 0, am_bool: 0, dest: null, am: null };
    }
}