package in.bushansirgur.foodiesapi.io;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItem {

    private String orderId;
    private int quantity;
    private double price;
    private String imageUrl;
    private String discription;
    private String name;
}
