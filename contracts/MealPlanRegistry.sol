// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MealPlanRegistry {
    struct MealPlan {
        address owner;
        string planHash; // IPFS hash or JSON string
        uint256 timestamp;
    }

    MealPlan[] public plans;
    mapping(address => uint256[]) public userPlans;

    event PlanPublished(
        address indexed owner,
        uint256 indexed planId,
        string planHash
    );

    function publishPlan(string memory _planHash) public {
        uint256 planId = plans.length;
        plans.push(
            MealPlan({
                owner: msg.sender,
                planHash: _planHash,
                timestamp: block.timestamp
            })
        );
        userPlans[msg.sender].push(planId);
        emit PlanPublished(msg.sender, planId, _planHash);
    }

    function getUserPlans(
        address _user
    ) public view returns (uint256[] memory) {
        return userPlans[_user];
    }

    function getPlan(
        uint256 _planId
    ) public view returns (address, string memory, uint256) {
        require(_planId < plans.length, "Plan does not exist");
        MealPlan memory plan = plans[_planId];
        return (plan.owner, plan.planHash, plan.timestamp);
    }
}
