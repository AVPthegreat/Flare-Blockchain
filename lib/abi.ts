export const MEAL_PLAN_REGISTRY_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_planHash",
        "type": "string"
      }
    ],
    "name": "publishPlan",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "planId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "planHash",
        "type": "string"
      }
    ],
    "name": "PlanPublished",
    "type": "event"
  }
] as const;

export const MEAL_PLAN_REGISTRY_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace with deployed address
