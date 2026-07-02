package in.bushansirgur.foodiesapi.controller;

import com.razorpay.RazorpayException;
import in.bushansirgur.foodiesapi.io.OrderRequest;
import in.bushansirgur.foodiesapi.io.OrderResponse;
import in.bushansirgur.foodiesapi.repository.OrderRepository;
import in.bushansirgur.foodiesapi.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderController {

    private final OrderService orderService;

//    @PostMapping("/create")
//    @ResponseStatus(HttpStatus.CREATED)
//    public OrderResponse createOrderWithPayment(@RequestBody OrderRequest orderRequest) throws RazorpayException {
//        OrderResponse response = orderService.createOrderWithPayment(orderRequest);
//        return response;
//    }
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrderWithPayment(
            @RequestBody OrderRequest orderRequest)
            throws RazorpayException {

        return orderService.createOrderWithPayment(orderRequest);
    }
//    @PostMapping("/verify")
//    public void verifyPayment(@RequestBody Map<String, String> paymentData) {
//        orderService.verifyPayment(paymentData, "paid");
//
//    }
    @PostMapping("/verify")
    public String verifyPayment(@RequestBody Map<String, String> paymentData) {

        orderService.verifyPayment(paymentData, "paid");

        return "Payment Verified Successfully";
    }
    @GetMapping
    public List<OrderResponse> getOrders() {
        return orderService.getUserOrders();
    }

    @DeleteMapping("/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable String orderId) {
        orderService.removeOrder(orderId);

    }
    //admin panel
    @GetMapping("/all")
    public List<OrderResponse> getOrdersOfAllUsers() {
        return orderService.getOrdersOfAllUsers();
    }
    //admin panel
//    @PatchMapping("/status/{orderId}")
//    @PatchMapping("/status/{orderId}")
//    public void updateOrderStatus(@PathVariable String orderId, @RequestParam String status) {
//        orderService.updateOrderStatus(orderId, status);
//    }
    @PatchMapping("/status/{orderId}")
    public void updateOrderStatus(
            @PathVariable String orderId,
            @RequestParam String status) {

        System.out.println("PATCH API HIT");
        System.out.println(orderId);
        System.out.println(status);

        orderService.updateOrderStatus(orderId, status);
    }

}
