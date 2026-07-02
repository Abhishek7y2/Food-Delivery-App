package in.bushansirgur.foodiesapi.entity;
import in.bushansirgur.foodiesapi.io.OrderItem;
import lombok.Builder;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "orders")
@Data
@Builder
public class OrderEntity {
    @Id
    private String Id;
    private String userId;
    private String userAddress;
    private String phoneNumber;
    private String email;
    private List<OrderItem> orderedItems;
    private double amount;
    private String paymentStatus;
    private String razorpaySignature;
    private String orderStatus;
    private String razorpayPaymentId;
    private String razorpayOrderId;



}
