pragma solidity >=0.4.22 <0.6.0;
contract Demo {
    uint256 orderAmount;
    uint256 receiveAmount;
    uint256 penaltyAmount;
    address payable private seller;
    bool customerViolate;
    bool sellerViolate;
    address payable private customer;
    address payable private deployer;
    bytes32 state;
    constructor(address payable _seller,uint256 _amount,uint256 per) public payable{
        deployer = msg.sender;
        seller = _seller;
        orderAmount = _amount;
        penaltyAmount = orderAmount * per / 100;
        customerViolate = false;
        sellerViolate = false;
        state = "Created";
    }
    event payed(
        bool check,
        uint256 receiveAmount,
        address customer
    );
    event contractState(
        bytes32 state
    );
    modifier onlyDeployer()
    {
        require(deployer == msg.sender,"Sender not deployer.");
        _;
    }
    modifier onlyCustomer()
    {
        require(customer == msg.sender,"Sender not customer");
        _;
    }

    function () external payable {
        require(orderAmount==msg.value,"Sender not send enough money");
        customer = msg.sender;
        receiveAmount = msg.value;
        emit payed(true,receiveAmount,customer);
        }
    function getInstructor() public view returns(address,address, address, uint256,uint256, bytes32,bool,bool){
        return (deployer, seller,customer,orderAmount,penaltyAmount,state,customerViolate,sellerViolate);
    }
    function cancelContract() public
    {
        if(msg.sender == customer) customerViolate = true;
        if(msg.sender == seller) sellerViolate = true;
        state = "Cancel";
        emit contractState(state);
    }
    function reportContract() public onlyCustomer
    {
        sellerViolate = true;
        state = "Company violate";
        emit contractState(state);
    }
    function complete() public payable onlyDeployer{
        if(sellerViolate == true)
        {
            customer.transfer(receiveAmount);
        }
        else if(customerViolate == true)
        {
            customer.transfer(receiveAmount-penaltyAmount);
            seller.transfer(penaltyAmount);
        }
        else
        {
            seller.transfer(orderAmount);
        }
        receiveAmount = 0;
        state = "Complete";
        emit contractState(state);
    }
}