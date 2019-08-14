pragma solidity >=0.4.22 <0.6.0;
contract Demo {
    uint256 orderAmount;
    uint256 receiveAmount;
    uint256 penaltyAmount;
    uint256 public deliveryDate;
    address payable private seller;
    address payable private customer;
    bool customerViolate;
    bool sellerViolate;
    bytes32 state;
    constructor(uint256 _amount,uint256 date) public payable{
        seller = msg.sender;
        deliveryDate = date;
        orderAmount = _amount;
        penaltyAmount = msg.value;
        customerViolate = false;
        sellerViolate = false;
        state = "Created";
    }
    event Activate(
        bool check,
        address customer
    );
    event Cancel(
        bool check,
        address per
    );
    event Complete(
        bool check
        );
    event Report(
        bool check
        );
    event Delivery(
        bool check
        );
    modifier onlyCustomer()
    {
        require(customer == msg.sender,"Sender not customer");
        _;
    }
    modifier onlySeller()
    {
        require(seller == msg.sender,"Sender not seller");
        _;
    }
    function () external payable {
        require(state != "Activate","Contract have already activated.");
        require(orderAmount==msg.value,"Sender not send enough money");
        customer = msg.sender;
        receiveAmount = msg.value;
        state = "Activate";
        emit Activate(true,customer);
    }
    function getInstructor() public view returns(address, address, uint256,uint256, bytes32,bool,bool){
        return (seller,customer,orderAmount,penaltyAmount,state,customerViolate,sellerViolate);
    }
    function cancelContract() public
    {
        require(state!="Delivery","Order in delivery period");
        if(msg.sender == customer) customerViolate = true;
        if(msg.sender == seller) sellerViolate = true;
        state = "Cancel";
        emit Cancel(true,msg.sender);
    }
    function deliveryContract() public onlySeller
    {
        require(state=="Activate","Contract have not activated yet.");
        state = "Delivery";
        emit Delivery(true);
    }
    function reportContract(uint256 todate) public onlyCustomer
    {
        require(todate > deliveryDate,"Order not reach the delivery date");
        require(state!="Delivery","Order is delivered");
        sellerViolate = true;
        state = "Report";
        emit Report(true);
    }
    function complete() public payable{
        require(state != "Created" && state != "Activate", "Can not cancel contract in that periods.");
        if(sellerViolate == true)
        {
            customer.transfer(receiveAmount+penaltyAmount);
        }
        else if(customerViolate == true)
        {
            customer.transfer(receiveAmount-penaltyAmount);
            seller.transfer(2*penaltyAmount);
        }
        else
        {
            seller.transfer(receiveAmount+penaltyAmount);
        }
        receiveAmount = 0;
        penaltyAmount = 0;
        orderAmount = 0;
        state = "Complete";
        emit Complete(true);
    }
}