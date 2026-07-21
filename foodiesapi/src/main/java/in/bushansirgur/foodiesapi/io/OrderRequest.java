package in.bushansirgur.foodiesapi.io;

import lombok.Builder;
import lombok.Data;

import java.util.List;
@Data
@Builder

public class OrderRequest {

    private String userId;
    private List<OrderItem> orderedItems;
    private String userAddress;
    private double amount;
    private String email;
    private String phoneNumber;
    private String orderStatus;
    

}
