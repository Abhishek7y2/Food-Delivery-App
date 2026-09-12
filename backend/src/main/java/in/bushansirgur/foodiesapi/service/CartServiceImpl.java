package in.bushansirgur.foodiesapi.service;

import in.bushansirgur.foodiesapi.entity.CartEntity;
import in.bushansirgur.foodiesapi.io.CartRequest;
import in.bushansirgur.foodiesapi.io.CartResponse;
import in.bushansirgur.foodiesapi.repository.CartRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserService userService;

    @Override
    public CartResponse addToCart(CartRequest request) {

        String loggedInUserId = userService.findByUserId();

        CartEntity entity = cartRepository.findByUserId(loggedInUserId)
                .orElse(new CartEntity(loggedInUserId, new HashMap<>()));

        Map<String, Integer> cartItems = entity.getItems();

        cartItems.put(
                request.getFoodId(),
                cartItems.getOrDefault(request.getFoodId(), 0) + 1
        );

        entity.setItems(cartItems);

        entity = cartRepository.save(entity);

        return convertToCartResponse(entity);
    }

//    @Override
//    public CartResponse addToCart(CartRequest request) {
//
//        String loggedInUserId = userService.findByUserId();
//        Optional<CartEntity> cartOptional = cartRepository.findById(loggedInUserId);
//        CartEntity cart = cartOptional.orElseGet(() -> new CartEntity(loggedInUserId, new HashMap<>()));
//
//        CartEntity entity = cartRepository.findByUserId(loggedInUserId)
//                .orElse(new CartEntity(loggedInUserId, new HashMap<>()));
//
//        Map<String, Integer> cartItems = cart.getItems();
////        cartItems.put(foodId, cartItems.getItems())
//
//        if (cartItems.containsKey(request.getFoodId())) {
//
//            int currentQty = cartItems.get(request.getFoodId());
//            cartItems.put(request.getFoodId(), currentQty + 1);
//
//        } else {
//
//            cartItems.put(request.getFoodId(), 1);
//
//        }
//
//        entity.setItems(cartItems);
//
//        entity = cartRepository.save(entity);
//
//        return convertToCartResponse(entity);
//    }


//    @Override
//    public CartResponse removeFromCart(CartRequest request) {
//
//        String loggedInUserId = userService.findByUserId();
//
//        CartEntity entity = cartRepository.findByUserId(loggedInUserId)
//                .orElseThrow(() -> new RuntimeException("Cart is not found"));
//
//        Map<String, Integer> cartItems = entity.getItems();
//
//        if (cartItems.containsKey(request.getFoodId())) {
//
//            int currentQty = cartItems.get(request.getFoodId());
//
//            if (currentQty > 0) {
//                cartItems.remove(request.getFoodId());
//            } else {
//                cartItems.put(request.getFoodId(), currentQty - 1);
//            }
//
//            entity.setItems(cartItems);
//
//            entity = cartRepository.save(entity);
//        }
//
//        return convertToCartResponse(entity);
//    }
    @Override
    public CartResponse removeFromCart(CartRequest request) {

        String loggedInUserId = userService.findByUserId();

        CartEntity entity = cartRepository.findByUserId(loggedInUserId)
                .orElseThrow(() -> new RuntimeException("Cart is not found"));

        Map<String, Integer> cartItems = entity.getItems();

        if (cartItems.containsKey(request.getFoodId())) {

            int currentQty = cartItems.get(request.getFoodId());

            if (currentQty <= 1) {
                cartItems.remove(request.getFoodId());
            } else {
                cartItems.put(request.getFoodId(), currentQty - 1);
            }

            entity.setItems(cartItems);

            entity = cartRepository.save(entity);
        }

        return convertToCartResponse(entity);
    }


    @Override
    public CartResponse getCart() {

        String loggedInUserId = userService.findByUserId();

        CartEntity entity = cartRepository.findByUserId(loggedInUserId)
                .orElse(new CartEntity(null, loggedInUserId, new HashMap<>()));
        return convertToCartResponse(entity);
    }

    @Override
    public void clearCart() {

        String loggedInUserId = userService.findByUserId();

        cartRepository.deleteByUserId(loggedInUserId);
    }
//    @Override
//    public CartResponse removeFromCart(CartRequest cartRequest) {
//        String loggedInUserId = userService.findByUserId();
//        CartEntity entity  = cartRepository.findByUserId(loggedInUserId)
//                .orElseThrow(() -> new RuntimeException("Cart is not found"));
//        Map<String, Integer> cartItems = entity.getItems();
//        if (cartItems.containsKey(cartRequest.getFoodId())) {
//            int currentQnty = cartItems.get(cartRequest.getFoodId());
//            if(currentQnty > 0) {
//                cartItems.put(cartRequest.getFoodId(), currentQnty - 1);
//            }else {
//                cartItems.remove(cartRequest.getFoodId());
//            }
//            entity = cartRepository.save(entity);
//        }
//        return convertToCartResponse(entity);
//    }

    private CartResponse convertToCartResponse(CartEntity cartEntity) {
        return CartResponse.builder()
                .id(cartEntity.getId())
                .userId(cartEntity.getUserId())
                .items(cartEntity.getItems())
                .build();
    }

}

















//package in.bushansirgur.foodiesapi.service;
//
//import in.bushansirgur.foodiesapi.entity.CartEntity;
//import in.bushansirgur.foodiesapi.io.CartRequest;
//import in.bushansirgur.foodiesapi.io.CartResponse;
//import in.bushansirgur.foodiesapi.repository.CartRepository;
//import lombok.AllArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.HashMap;
//import java.util.Map;
//import java.util.Optional;
//
//@Service
//@AllArgsConstructor
//public class CartServiceImpl implements CartService {
//
//    private final CartRepository cartRepository;
//    private final UserService userService;
//
//    @Override
//    public CartResponse removeFromCart(CartRequest cartRequest) {
//
//        String loggedInUserId = userService.findByUserId();
//
//        CartEntity entity = cartRepository.findByUserId(loggedInUserId)
//                .orElseThrow(() -> new RuntimeException("Cart is not found"));
//
//        Map<String, Integer> cartItems = entity.getItems();
//
//        if (cartItems.containsKey(cartRequest.getFoodId())) {
//
//            int currentQty = cartItems.get(cartRequest.getFoodId());
//
//            if (currentQty > 0) {
//                cartItems.put(cartRequest.getFoodId(), currentQty - 1);
//            } else {
//                cartItems.remove(cartRequest.getFoodId());
//            }
//
//            entity = cartRepository.save(entity);
//        }
//
//        return convertToResponse(entity);
//    }
////    @Override
////    public CartResponse addToCart(CartRequest request) {
////
////        String loggedInUserId = userService.findByUserId();
////
////        CartEntity entity = cartRepository.findByUserId(loggedInUserId)
////                .orElse(new CartEntity(loggedInUserId, new HashMap<>()));
////
////        Map<String, Integer> cartItems = entity.getItems();
////
////        if (cartItems.containsKey(request.getFoodId())) {
////
////            int currentQty = cartItems.get(request.getFoodId());
////            cartItems.put(request.getFoodId(), currentQty + 1);
////
////        } else {
////
////            cartItems.put(request.getFoodId(), 1);
////        }
////
////        entity.setItems(cartItems);
////
////        entity = cartRepository.save(entity);
////
////        return convertToCartResponse(entity);
////    }
////
//
//
//    @Override
//    public CartResponse getCart() {
//        String loggedInUserId = userService.findByUserId();
//        CartEntity entity = cartRepository.findByUserId(loggedInUserId)
//                .orElse(new CartEntity(loggedInUserId, new HashMap<>()));
//        return convertToCartResponse(entity);
//    }
//
////    @Override
////    public void clearCart() {
////        String loggedInUserId = userService.findByUserId();
////        cartRepository.deleteByUserId(loggedInUserId);
////    }
////    @Override
////    public CartResponse removeFromCart(CartRequest cartRequest) {
////        String loggedInUserId = userService.findByUserId();
////        CartEntity entity = cartRepository.findByUserId(loggedInUserId)
////                .orElseThrow(() -> new RuntimeException("Cart is not found"));
////        Map<String, Integer> cartItems = entity.getItems();
////        if (cartItems.containsKey(cartRequest.getFoodId())) {
////            int currentQty = cartItems.get(cartRequest.getFoodId());
////            if (currentQty <= 1) {
////                cartItems.remove(cartRequest.getFoodId());
////            } else {
////                cartItems.put(cartRequest.getFoodId(), currentQty - 1);
////            }
////        }
////        entity.setItems(cartItems);
////        entity = cartRepository.save(entity);
////        return convertToCartResponse(entity);
////    }
//
//
//    private CartResponse convertToCartResponse(CartEntity cartEntity) {
//        return CartResponse.builder()
//                .id(cartEntity.getId())
//                .userId(cartEntity.getUserId())
//                .items(cartEntity.getItems())
//                .build();
//    }
//
//}
//



//package in.bushansirgur.foodiesapi.service;
//
//import in.bushansirgur.foodiesapi.entity.CartEntity;
//import in.bushansirgur.foodiesapi.repository.CartRepository;
//import lombok.AllArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.web.servlet.tags.form.AbstractMultiCheckedElementTag;
//
//import java.util.HashMap;
//import java.util.Map;
//import java.util.Optional;
//
//@Service
//@AllArgsConstructor
//public class CartServiceImpl implements CartService {
//
//    private final CartRepository cartRepository;
//    private final UserService userService;
//
//    @Override
//    public void addToCart(String foodId) {
//
//        String loggedInUserId = userService.findByUserId();
//
//        Optional<CartEntity> cartOptional =
//                cartRepository.findByUserId((loggedInUserId);
//
//        CartEntity entity = cartOptional.orElseGet(
//                () -> new CartEntity(loggedInUserId, new HashMap<>())
//        );
//
//
//        Map<String, Integer> cartItems =  entity.getItems();
//        cartItems.put(foodId, cartItems.getOrDefault(foodId,0)+ 1);
//        cart.setItems(cartItems);
//        cartRepository.save(entity);
//    }
//}